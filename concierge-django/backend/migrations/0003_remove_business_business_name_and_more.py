# Generated by Django 5.0.2 on 2024-03-03 07:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0002_business_business_rating_business_business_reviews'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='business',
            name='business_name',
        ),
        migrations.AddField(
            model_name='business',
            name='business_name_and_tags',
            field=models.JSONField(default=dict, max_length=100),
            preserve_default=False,
        ),
    ]