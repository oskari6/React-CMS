# Generated by Django 5.0.6 on 2024-08-25 16:54

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('customers', '0005_item'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='order',
            name='price_in_cents',
        ),
    ]
