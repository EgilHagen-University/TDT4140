# Generated by Django 4.0.2 on 2022-03-23 13:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('post', '0009_post_hidden'),
    ]

    operations = [
        migrations.AlterField(
            model_name='post',
            name='price',
            field=models.IntegerField(),
        ),
    ]