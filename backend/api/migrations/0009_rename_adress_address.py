# Generated by Django 5.0.7 on 2024-08-02 07:36

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0008_payments'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='Adress',
            new_name='Address',
        ),
    ]
