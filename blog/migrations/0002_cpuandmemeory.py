# -*- coding: utf-8 -*-
# Generated by Django 1.9.2 on 2016-02-27 14:34
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Cpuandmemeory',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('cpuper', models.FloatField()),
                ('memory', models.FloatField()),
            ],
        ),
    ]