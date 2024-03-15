from django.http import JsonResponse
from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from rest_framework import status
from django.core.management import call_command
import requests
import json
import sys, os, base64, datetime, hashlib, hmac 
from .models import Business, Hotel
from .serializers import BusinessSerializer, HotelSerializer
from openai import OpenAI
import googlemaps

def index(request):
    tag_to_monitor = 'your_tag_name'
    # conversations = fetch_conversations(tag_to_monitor)
    
    return JsonResponse({'conversations': 'test'})

@api_view(['POST'])
def login_view(request):
    #login 
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(request, username=username, password=password)
    if user is not None:
        login(request, user)
        return JsonResponse({'message': 'Login successful'})
    else:
        return JsonResponse({'message': 'Login failed'}, status=401)

@api_view(['POST'])
def logout_view(request):
    #logout
    logout(request)
    return JsonResponse({'message': 'Logout successful'})

@api_view(['GET'])
def getBusinessData(request):
    businesses = Business.objects.all()
    serializer = BusinessSerializer(businesses, many=True)
    return JsonResponse(serializer.data, safe=False)

@api_view(['POST'])
def addBusinessData(request):
    new_business_data = {
        'business_name': request.data.get('business_name'),
        'business_rating': request.data.get('business_rating'),
        'business_tags': request.data.get('business_tags').split(','),
        'business_address': request.data.get('business_address'),
        'business_barcode': request.data.get('business_barcode'),
        'm_hours_of_operation': request.data.get('m_hours_of_operation'),
        'tu_hours_of_operation': request.data.get('tu_hours_of_operation'),
        'w_hours_of_operation': request.data.get('w_hours_of_operation'),
        'th_hours_of_operation': request.data.get('th_hours_of_operation'),
        'f_hours_of_operation': request.data.get('f_hours_of_operation'),
        'sa_hours_of_operation': request.data.get('sa_hours_of_operation'),
        'su_hours_of_operation': request.data.get('su_hours_of_operation'),
    }
    hours_dict = {
        "monday": new_business_data['m_hours_of_operation'],
        "tuesday": new_business_data['tu_hours_of_operation'],
        "wednesday": new_business_data['w_hours_of_operation'],
        "thursday": new_business_data['th_hours_of_operation'],
        "friday": new_business_data['f_hours_of_operation'],
        "satuday": new_business_data['sa_hours_of_operation'],
        "sunday": new_business_data['su_hours_of_operation'],
        }
    new_business = Business(
        business_name=new_business_data['business_name'],
        business_rating=new_business_data['business_rating'],
        business_tags=new_business_data['business_tags'],
        business_address=new_business_data['business_address'],
        business_barcode=new_business_data['business_barcode'],
        business_place_id='NULL',
        drive_time=0,
        walk_time=0,
        transit_time=0,
        hours_of_operation=hours_dict,
        business_pictures=[],
    )
    
    new_business.save()
    serializer = BusinessSerializer(new_business)
    return Response(serializer.data, status=status.HTTP_201_CREATED)

@csrf_exempt
@api_view(['GET'])
def getBusinessDataGoogle(request):
    
    data = json.loads(request.body)
    selected_businesses = data.get('businesses', [])

    places_api_endpoint = 'https://maps.googleapis.com/maps/api/place/textsearch/json'
    api_key = settings.GOOGLE_API_KEY

    business_details = {}

    for business_name in selected_businesses:
        params = {
            'key': api_key,
            'query': business_name,
            'fields': 'name,rating,formatted_address,formatted_phone_number,reviews,photo',
        }

        response = requests.get(places_api_endpoint, params=params)

        if response.status_code == 200:
            results = response.json().get('results')
            if results:
                # Assuming the first result is the most relevant
                place_id = results[0]['place_id']
                # Now we fetch details for the specific place using its place_id
                details_params = {
                    'key': api_key,
                    'place_id': place_id,
                    'fields': 'name,rating,formatted_address,formatted_phone_number,reviews, photo',
                }
                details_response = requests.get('https://maps.googleapis.com/maps/api/place/details/json', params=details_params)
                
                if details_response.status_code == 200:
                    business_data = details_response.json().get('result')
                    business_details[business_name] = business_data
                else:
                    print(f"Error fetching details for {business_name}")
            else:
                print(f"No results found for {business_name}")
        else:
            print(f"Error fetching data for {business_name}")

    return JsonResponse(business_details)


@api_view(['POST'])
def OPAIEndpointCreate(request):
    client = OpenAI(organization='org-2oZsacQ1Ji3Xr0uveLpwg50m', api_key=settings.OPEN_AI_KEY)
    
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a helpful assistant. "},
            {"role": "user", "content": f"{request.data.get('query')}"}
        ]
    )
    return JsonResponse({'response-payload': response.choices[0].message.content})

@api_view(['POST'])
def querySpecifcBusinessData(request):
    businessesList = []
    api_key = settings.GOOGLE_API_KEY
    map_client = googlemaps.Client(api_key)
    location = "Winter Park, Florida United States"
    
    
    
    for business in request.data.get('business'):
        try:
            busQuery = business + 'in' + location
            response = map_client.places(query=busQuery)
            results = response.get('results')[0]
            bus_name = results['name']
            bus_address = results['formatted_address']
            bus_place_id = results['place_id']
            bus_rating = results['rating']
            bus_photos = results['photos']
            bus_lat_long = results['geometry']
            bus_photo_urls = []

            # Get photo URLs
            for photo in bus_photos:
                photo_reference = photo['photo_reference']
                photo_url = f"https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference={photo_reference}&key={api_key}"
                bus_photo_urls.append(photo_url)

            # Build the directions URL
            destination = bus_name.replace(' ', '+') + '+' + bus_address.replace(' ', '+') + '+' + 'Winter+Park%2c+Florida+United+States'
            directions_url = f"https://www.google.com/maps/dir/?api=1&destination={destination}&dir_action=navigate"

            wRequest = map_client.distance_matrix(location, bus_lat_long['location'], mode="walking", units="imperial", departure_time='now', traffic_model="optimistic")
            dRequest = map_client.distance_matrix(location, bus_lat_long['location'], mode="driving", units="imperial", departure_time='now', traffic_model="optimistic")
            tRequest = map_client.distance_matrix(location, bus_lat_long['location'], mode="transit", units="imperial", departure_time='now', traffic_model="optimistic")
            walk_time = wRequest['rows'][0]['elements'][0]['duration']['text']
            drive_time = dRequest['rows'][0]['elements'][0]['duration']['text']
            transit_time = tRequest['rows'][0]['elements'][0]['duration']['text']

            business_db_object = Business.objects.filter(business_name=business)
            business_db_object.update(business_name=bus_name, business_address=bus_address, business_place_id=bus_place_id, business_rating=bus_rating, business_pictures=bus_photo_urls, walk_time=walk_time, drive_time=drive_time, transit_time=transit_time, directions_url=directions_url)
            
        except Exception as e:
            print(e)
            return None
        # businessesList.append(Business.objects.filter(business_name=business))
        
        serializer = BusinessSerializer(Business.objects.filter(business_name=business), many=True)
        businessesList.append(serializer.data)
    return JsonResponse(businessesList, safe=False)