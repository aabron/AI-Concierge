import axios from "axios";

export default async function organizeItineraryQuery(selectedActivities) {

    const response = await axios.get('https://ai-concierge-main-0b4b3d25a902.herokuapp.com/api/getBusiness/', {});

    const businessDataArray = response.data;
    // console.log(businessDataArray);

    // Construct the list of businesses with their detailed data
    let businessesList = '';
    for (let i = 0; i < businessDataArray.length; i++) {
        const business = businessDataArray[i];
        businessesList += `
            Business Name: ${business.business_name}
            Tags: ${business.business_tags.join(', ')}
            Address: ${business.business_address}
            Hours: ${business.hours_of_operation}
            Contact: ${business.business_phone_number}
            Walking Distance: ${business.walk_time} minutes
            \n`;
    }

    // Construct the prompt template
    const promptTemplate = `
        Guest Preferences: ${selectedActivities}\n
        Businesses: ${businessesList}\n
        Itinerary Request for Guests at The Alfond Inn, Winter Park, Florida
        Guest Itinerary Request
        Please create a detailed itinerary for a guest staying at The Alfond Inn in Winter Park, Florida. The itinerary should contain walking or driving times and distances in miles or fractions of miles. The itinerary must be contained within the duration of time selected by the guest and cannot exceed this time by more than 15 minutes, including activities, dining, and any special events. Only select potential matches from our database that are a maximum of 20 minutes of walking or 20 minutes by car. If a Michelin Guide-rated restaurant is included, the maximum driving time can extend to 30 minutes. Follow these steps to generate the itinerary:

        Database Check:

        First, check the Business above which come from our databse for companies and recommendations that match the guest's preferences. The website URL and necessary access credentials should be included in the request.
        If there are suitable matches in the database, use those recommendations to build the itinerary.
        Additional Resources:

        If the database does not contain sufficient recommendations or if certain preferences are not met, use external resources to complete the itinerary for example if a user asks for shopping but there is only musuems in the database do not suggest musuems instead find places to shop in Winter Park, FL and suggest those.
        Ensure the activities and dining options reflect the preferences and interests of the guest.
        Verify Distances and Times:

        Use reliable mapping services (e.g., Google Maps) to calculate precise walking distances and times between locations. Verify these distances and times by cross-referencing multiple sources.
        Check the official websites of the locations for any additional information on opening hours, tour durations, and special events.
        Detailed Itinerary with Descriptions:

        Include detailed descriptions for each stop, adding a touch of flair to make the itinerary appealing.
        Indicate the opening times of locations and ensure the itinerary aligns with these times.
        Preferred Recommendations:

        When recommending breakfast options, include The Alfond Inn's café or Hamilton's Kitchen 75% of the time when the itinerary includes breakfast.

        Example Itinerary:
        <time 1> - <item 1>:

        <Description 1>

        <Description of directions>
        <Distance to next place: Approximately x miles, about a x-minute walk.>
        <time 2> - <item 2>:

        <Description 2>

        <Description of directions>
        <Distance to next place: Approximately x miles, about a x-minute walk.>
        <time 3> - <item 3>:

        <Description 3>

        <Description of directions>
        <Distance to next place: Approximately x miles, about a x-minute walk.>
        Tips:
        <Some Tips you can provide to the guest>
        
        Please format bold text with **
        Only include the itinerary itself in your response do not include any additional text
        \n
    `;

    return promptTemplate;
}
