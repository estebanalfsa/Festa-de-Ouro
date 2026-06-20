from django.db import models


class User(models.Model):
    email = models.EmailField(unique=True)
    senha = models.CharField(max_length=255)

    class Meta:
        db_table = 'User'


class UserInfo(models.Model):
    nombre = models.CharField(max_length=255)
    idade = models.IntegerField(null=True, blank=True)
    apellido1 = models.CharField(max_length=255, blank=True)
    apellido2 = models.CharField(max_length=255, blank=True)
    republica = models.CharField(max_length=255, blank=True)
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        primary_key=True,
        db_column='ID_user',
    )

    class Meta:
        db_table = 'User_Info'
