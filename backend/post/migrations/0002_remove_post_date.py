# Generated by Django 4.0.2 on 2022-02-25 09:21

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('post', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='post',
            name='date',
        ),
    ]