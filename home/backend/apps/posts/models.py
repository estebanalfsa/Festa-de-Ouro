from django.db import models


class Post(models.Model):
    nombre = models.CharField(max_length=255, blank=True)
    data = models.TextField(blank=True)
    com = models.TextField(blank=True)
    titulo = models.CharField(max_length=255)
    photo = models.TextField(blank=True)
    assunto = models.TextField(blank=True)
    user = models.ForeignKey(
        'users.User',
        on_delete=models.CASCADE,
        db_column='Id_user',
    )

    class Meta:
        db_table = 'Posts'
