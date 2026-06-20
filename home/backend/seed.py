import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
os.chdir(os.path.dirname(__file__))
django.setup()

from apps.users.models import User, UserInfo
from apps.posts.models import Post

# --- Users ---
users_data = [
    {'email': 'esteban@festa.com', 'senha': '123456'},
    {'email': 'mariana@festa.com', 'senha': '123456'},
    {'email': 'rafael@festa.com', 'senha': '123456'},
    {'email': 'ana@festa.com', 'senha': '123456'},
    {'email': 'lucas@festa.com', 'senha': '123456'},
]

users = []
for data in users_data:
    user, created = User.objects.get_or_create(email=data['email'])
    if created:
        user.set_password(data['senha'])
        user.save()
    users.append(user)

# --- User_Info ---
infos = [
    {'nombre': 'Esteban', 'idade': 24, 'apellido1': 'Alfaro', 'apellido2': 'Silva', 'republica': 'Rep. Nostravamus', 'user': users[0]},
    {'nombre': 'Mariana', 'idade': 23, 'apellido1': 'Costa', 'apellido2': '', 'republica': 'Rep. Acapulco', 'user': users[1]},
    {'nombre': 'Rafael', 'idade': 25, 'apellido1': 'Oliveira', 'apellido2': '', 'republica': '', 'user': users[2]},
    {'nombre': 'Ana', 'idade': 22, 'apellido1': 'Beatriz', 'apellido2': '', 'republica': 'Rep. Katendê', 'user': users[3]},
    {'nombre': 'Lucas', 'idade': 24, 'apellido1': 'Mendes', 'apellido2': '', 'republica': 'Rep. Califórnia', 'user': users[4]},
]

for info in infos:
    UserInfo.objects.get_or_create(user=info['user'], defaults={
        'nombre': info['nombre'],
        'idade': info['idade'],
        'apellido1': info['apellido1'],
        'apellido2': info['apellido2'],
        'republica': info['republica'],
    })

# --- Posts ---
posts_data = [
    {
        'nombre': 'Churrasco de Integração',
        'data': '2025-05-20 10:00',
        'com': 'Preparando o próximo encontro da comunidade com comida, música e muita conversa.',
        'titulo': 'Churrasco de Integração no Parque',
        'photo': 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
        'assunto': 'Evento',
        'user': users[0],
    },
    {
        'nombre': 'Noite Acústica',
        'data': '2025-05-19 19:30',
        'com': 'Evento com bandas locais e lotação quase completa. Ótima resposta da comunidade.',
        'titulo': 'Noite acústica no centro histórico',
        'photo': '',
        'assunto': 'Música',
        'user': users[1],
    },
    {
        'nombre': 'Torneio de Futebol',
        'data': '2025-05-18 14:15',
        'com': 'Inscrições abertas para 8 equipes. Quem topa montar um time da república?',
        'titulo': 'Torneio de Futebol Amador',
        'photo': 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&w=800&q=80',
        'assunto': 'Esportes',
        'user': users[2],
    },
    {
        'nombre': 'Festival Gastronômico',
        'data': '2025-05-17 16:00',
        'com': 'Vai ter comidas típicas, música ao vivo e cerveja artesanal. Marquei no calendário e vocês?',
        'titulo': 'Festival Gastronômico',
        'photo': '',
        'assunto': 'Gastronomia',
        'user': users[3],
    },
    {
        'nombre': 'DJ para Formatura',
        'data': '2025-05-16 09:00',
        'com': 'Alguém sabe onde posso encontrar um bom DJ para a festa de formatura? Recomendações são bem-vindas!',
        'titulo': 'Recomendações de DJ',
        'photo': '',
        'assunto': 'Dúvida',
        'user': users[4],
    },
]

for post_data in posts_data:
    Post.objects.get_or_create(
        titulo=post_data['titulo'],
        defaults=post_data,
    )

print('Seed concluído com sucesso!')
print(f'  Users: {User.objects.count()}')
print(f'  User_Info: {UserInfo.objects.count()}')
print(f'  Posts: {Post.objects.count()}')
