# Generated by Django 5.0.2 on 2024-02-29 21:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='business',
            name='business_rating',
            field=models.DecimalField(decimal_places=2, default=0.0, max_digits=5),
        ),
        migrations.AddField(
            model_name='business',
            name='business_reviews',
            field=models.JSONField(default=dict),
        ),
    ]
