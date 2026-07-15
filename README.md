# Festa de Ouro

Plataforma web de foro para publicação e descoberta de eventos locais — festas, aniversários, esportes, churrascos e muito mais.

---

## Sobre o Projeto

**Festa de Ouro** é uma aplicação web do tipo fórum onde qualquer usuário cadastrado pode publicar e visualizar eventos da comunidade. A ideia é centralizar em um só lugar todos os eventos locais, sejam eles sociais, esportivos, culturais ou gastronômicos. O projeto foi desenvolvido como parte de um trabalho acadêmico e tem como foco a comunidade de Ouro Preto e suas repúblicas.

### Problema que resolve

Atualmente, a divulgação de eventos em Ouro Preto é fragmentada entre grupos de WhatsApp, Instagram e outros meios. O Festa de Ouro centraliza essas informações em um único lugar, permitindo que qualquer pessoa descubra eventos próximos e se conecte com a comunidade.

### Público-alvo

- Moradores de repúblicas de Ouro Preto
- Estudantes universitários
- Organizadores de eventos locais
- Qualquer pessoa interessada em eventos na região

---

## Funcionalidades

### Autenticação e Usuários
- **Cadastro** de novos usuários com nome, sobrenome, email, telefone e república
- **Login** com JWT (access token + refresh token)
- **Recuperação de senha** via email com link seguro de redefinição
- **Modo convidado:** navegar pela plataforma sem fazer login (visualizar posts e perfis)

### Perfil
- **Perfil pessoal** com foto, banner, informações e histórico de eventos
- **Perfil público** visível para qualquer usuário (inclusive convidados)
- Estatísticas: número de eventos, seguidores, seguindo
- **Seguir/deixar de seguir** outros usuários

### Eventos (Posts)
- **Criar eventos** com título, descrição, data/hora, local, imagem e categoria
- **Editar e excluir** próprios eventos
- **Feed principal** com todos os eventos ordenados por data de criação
- **Curtir** eventos
- **Comentar** em eventos com opção de excluir próprio comentário

### Busca e Descoberta
- **Busca de usuários** por nome, sobrenome ou email (funciona para convidados também)
- Visualização de perfil público com todos os eventos do usuário
- Categorias de eventos para organização

### Segurança
- Senhas armazenadas com hash (PBKDF2 do Django)
- Validação de senha: mínimo 8 caracteres, não pode ser numérica, não pode ser comum, não pode ser similar aos dados do usuário
- Tokens JWT com expiração (access: 1h, refresh: 7 dias)
- Código de recuperação de senha de uso único (token criptográfico de 32 bytes)
- Mensagem genérica na recuperação de senha para evitar enumeração de usuários

---

## Tecnologias

### Backend
| Tecnologia | Versão | Finalidade |
|---|---|---|
| Django | 6.0.5 | Framework web principal |
| Django REST Framework | 3.17.1 | Construção da API REST |
| SimpleJWT | 5.5.1 | Autenticação via tokens JWT |
| django-cors-headers | 4.9.0 | Liberação de CORS para o frontend |
| SQLite | — | Banco de dados em desenvolvimento |
| PostgreSQL | — | Banco de dados em produção (via `DATABASE_URL`) |
| Pillow | 12.3.0 | Manipulação de imagens |
| dj-database-url | 2.1.0 | Leitura de `DATABASE_URL` |

### Frontend
| Tecnologia | Versão | Finalidade |
|---|---|---|
| React | 19.2.6 | Biblioteca de interface |
| Vite | 8.0.12 | Bundler e dev server |
| react-router-dom | 7.15.1 | Roteamento SPA |
| Axios | 1.16.1 | Cliente HTTP |
| Tailwind CSS | — | Estilização (via CDN) |
| lucide-react | 1.17.0 | Ícones |

### Infraestrutura
| Tecnologia | Finalidade |
|---|---|
| Docker | Containerização da aplicação |
| Docker Compose | Orquestração dos containers |
| Git | Controle de versão |

---

## Estrutura do Projeto

```
Festa-de-Ouro/
├── .env                          # Variáveis de ambiente (email, banco)
├── .env.example                  # Exemplo de .env
├── README.md                     # Documentação
├── home/
│   ├── docker-compose.yml        # Orquestração Docker
│   ├── backend/                  # Aplicação Django
│   │   ├── Dockerfile
│   │   ├── entrypoint.sh         # Script de inicialização
│   │   ├── requirements.txt      # Dependências Python
│   │   ├── manage.py
│   │   ├── db.sqlite3            # Banco de dados (SQLite)
│   │   ├── media/                # Uploads (fotos, banners)
│   │   ├── core/                 # Configurações do Django
│   │   │   ├── settings.py
│   │   │   ├── urls.py
│   │   │   └── wsgi.py / asgi.py
│   │   └── apps/                 # Aplicações do Django
│   │       ├── users/            # Autenticação, perfis, follows, reset de senha
│   │       ├── posts/            # Eventos, likes
│   │       ├── comments/         # Comentários
│   │       └── categories/       # Categorias de eventos
│   └── frontend/                 # Aplicação React
│       ├── Dockerfile
│       ├── package.json
│       ├── vite.config.js
│       ├── index.html
│       └── src/
│           ├── main.jsx          # Ponto de entrada React
│           ├── App.jsx           # Rotas da aplicação
│           ├── context/          # Contexto de autenticação
│           ├── components/       # Componentes reutilizáveis
│           └── pages/            # Páginas da aplicação
```

---

## API REST

Endpoints disponíveis na API (`http://localhost:8000/api`):

### Autenticação
| Método | Endpoint | Descrição | Autenticação |
|---|---|---|---|
| POST | `/api/register/` | Registrar novo usuário | — |
| POST | `/api/login/` | Login (retorna JWT) | — |
| POST | `/api/login/refresh/` | Renovar token JWT | — |

### Perfil
| Método | Endpoint | Descrição | Autenticação |
|---|---|---|---|
| GET | `/api/perfil/` | Ver próprio perfil | JWT |
| PATCH | `/api/perfil/` | Editar próprio perfil | JWT |
| GET | `/api/perfil/<id>/` | Ver perfil público | — |

### Recuperação de Senha
| Método | Endpoint | Descrição | Autenticação |
|---|---|---|---|
| POST | `/api/senha/` | Solicitar redefinição de senha (envia email) | — |
| POST | `/api/senha/confirmar/` | Confirmar redefinição com código | — |

### Posts (Eventos)
| Método | Endpoint | Descrição | Autenticação |
|---|---|---|---|
| GET | `/api/posts/` | Listar todos os eventos | — |
| POST | `/api/posts/` | Criar novo evento | JWT |
| GET | `/api/posts/<id>/` | Ver detalhes do evento | — |
| PUT/PATCH | `/api/posts/<id>/` | Atualizar evento | JWT (autor) |
| DELETE | `/api/posts/<id>/` | Excluir evento | JWT (autor) |
| POST | `/api/posts/<id>/like/` | Curtir/descurtir | JWT |

### Comentários
| Método | Endpoint | Descrição | Autenticação |
|---|---|---|---|
| GET | `/api/posts/<id>/comments/` | Listar comentários | — |
| POST | `/api/posts/<id>/comments/` | Criar comentário | JWT |
| DELETE | `/api/comments/<id>/` | Excluir comentário | JWT (autor) |

### Redes
| Método | Endpoint | Descrição | Autenticação |
|---|---|---|---|
| GET | `/api/buscar/?q=<texto>` | Buscar usuários | — |
| POST | `/api/seguir/<id>/` | Seguir/deixar de seguir | JWT |

---

## Como executar a aplicação

### Pré-requisitos

- **Docker** instalado ([instalação](https://docs.docker.com/engine/install/))
- **Docker Compose** instalado (geralmente incluso no Docker Desktop)

### Passo a passo

```bash
# 1. Clonar o repositório
git clone <url-do-repositorio>
cd Festa-de-Ouro

# 2. (Opcional) Configurar email SMTP para recuperação de senha
# Edite o arquivo .env com suas credenciais:
#
#   EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
#   EMAIL_HOST=smtp.gmail.com
#   EMAIL_PORT=587
#   EMAIL_USE_TLS=True
#   EMAIL_HOST_USER=seuemail@gmail.com
#   EMAIL_HOST_PASSWORD=sua-senha-de-app
#   DEFAULT_FROM_EMAIL=seuemail@gmail.com
#
# Para gerar uma senha de app no Gmail:
#   1. Acesse myaccount.google.com > Segurança > Verificação em duas etapas
#   2. Ative a verificação em duas etapas
#   3. Vá em myaccount.google.com/apppasswords
#   4. Gere uma senha para "Festa de Ouro" e copie o código de 16 caracteres

# 3. Subir os containers (build + start)
docker compose -f home/docker-compose.yml up -d

# 4. Acompanhar os logs
docker compose -f home/docker-compose.yml logs -f
```

### Acessar a aplicação

| Serviço | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend (API) | http://localhost:8000/api |
| Admin Django | http://localhost:8000/admin |

### Comandos úteis

```bash
# Parar os containers
docker compose -f home/docker-compose.yml down

# Reiniciar apenas o backend
docker compose -f home/docker-compose.yml restart backend

# Ver logs do backend
docker compose -f home/docker-compose.yml logs backend

# Executar comando no backend
docker compose -f home/docker-compose.yml exec backend python manage.py shell
```

### Usuários para teste

O banco já contém dados de exemplo com usuários, posts, follows e likes. Todos os usuários criados têm a senha:

```
SenhaForte123!
```

---

## Fluxos da Aplicação

### Modo Convidado
1. Usuário acessa a página inicial sem login
2. Pode visualizar todos os eventos no feed
3. Pode buscar usuários e ver perfis públicos
4. Ao tentar curtir, comentar ou seguir, é redirecionado para a página de cadastro

### Recuperação de Senha
1. Usuário clica em "Esqueceu a senha?" na tela de login
2. Informa seu email cadastrado
3. Recebe um email com link de redefinição
4. Clica no link e define uma nova senha
5. É redirecionado para o login

### Criação de Evento
1. Usuário logado clica em "Criar Evento"
2. Preenche título, descrição, data/hora, local (opcional) e imagem (opcional)
3. Evento aparece no feed principal e no perfil do usuário

---

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas alterações (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

---

## Integrantes

- Carlos Fabricio Benites Rodriguez
- Gruner Antonio Sánchez Morales
- Jose Esteba Andres Alfaro Sánchez

---

## Licença

Este projeto foi desenvolvido para fins acadêmicos.
