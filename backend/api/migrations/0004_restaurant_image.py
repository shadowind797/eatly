# Generated by Django 5.0.7 on 2024-07-29 03:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_reviews'),
    ]

    operations = [
        migrations.AddField(
            model_name='restaurant',
            name='image',
            field=models.ImageField(null=True, upload_to='img/rests'),
        ),
    ]