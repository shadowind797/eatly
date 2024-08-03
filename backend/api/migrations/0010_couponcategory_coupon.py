# Generated by Django 5.0.7 on 2024-08-02 07:42

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0009_rename_adress_address'),
    ]

    operations = [
        migrations.CreateModel(
            name='CouponCategory',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=120, unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='Coupon',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=120, unique=True)),
                ('valid_from', models.DateField(auto_now_add=True)),
                ('valid_to', models.DateField()),
                ('is_valid', models.BooleanField(default=True)),
                ('value', models.FloatField()),
                ('times_activated', models.IntegerField(default=0)),
                ('enabled_times', models.IntegerField()),
                ('category', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.couponcategory')),
            ],
        ),
    ]