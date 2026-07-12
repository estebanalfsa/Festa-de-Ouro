# Arquitetura do Sistema — Festa de Ouro

> **Disciplina:** Programação Web  
> **Equipe:** Carlos Fabricio Benites Rodriguez, Gruner Antonio Sánchez Morales, Jose Esteba Andres Alfaro Sánchez  
> **Versão do documento:** 1.0.0

---

## 1. Visão Geral

O **Festa de Ouro** é uma plataforma web do tipo fórum para publicação e descoberta de eventos locais. Sua arquitetura segue o modelo **cliente-servidor** com **frontend e backend desacoplados**, comunicando-se exclusivamente via **API REST**. Ambos os componentes são executados em **containers Docker** orquestrados pelo Docker Compose.

```
┌──────────────────────────────────────────────────────────────┐
│                    Navegador (Cliente)                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           React SPA (Vite + Tailwind)                │   │
│  │  ┌──────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │   │
│  │  │Login │ │ Register │ │  Home    │ │  User    │   │   │
│  │  │ Page │ │   Page   │ │  Feed    │ │ Profile  │   │   │
│  │  └──────┘ └──────────┘ └──────────┘ └──────────┘   │   │
│  │                    Axios (HTTP)                       │   │
│  └──────────────────────┬───────────────────────────────┘   │
│                         │  Requisições REST (JSON)          │
└─────────────────────────┼───────────────────────────────────┘
                          │
                          │  :8000/api/*
                          │
┌─────────────────────────┼───────────────────────────────────┐
│              Django REST Framework (Servidor)                │
│  ┌──────────────────────┴───────────────────────────────┐   │
│  │                   URL Router (urls.py)                │   │
│  │                                                       │   │
│  │  /api/auth/    /api/users/   /api/posts/  /api/...   │   │
│  │       │              │            │            │      │   │
│  │  ┌────┴────┐  ┌──────┴──────┐ ┌──┴───┐  ┌────┴───┐  │   │
│  │  │  users  │  │   users    │ │posts│  │comments│  │   │
│  │  │ (auth)  │  │  (profile) │ │      │  │        │  │   │
│  │  └────┬────┘  └──────┬──────┘ └──┬───┘  └────┬───┘  │   │
│  │       │              │            │            │      │   │
│  │  ┌────┴──────────────┴────────────┴────────────┴───┐  │   │
│  │  │           Django ORM (Models)                   │  │   │
│  │  │  User  │  Post  │  Category  │  Comment  │      │  │   │
│  │  └────────────────────┬────────────────────────────┘  │   │
│  └───────────────────────┼───────────────────────────────┘   │
│                          │                                   │
│              ┌───────────┴───────────┐                       │
│              │     PostgreSQL        │                       │
│              │    (Banco de Dados)   │                       │
│              └───────────────────────┘                       │
└──────────────────────────────────────────────────────────────┘
```

---

## 2. Componentes do Sistema

### 2.1 Frontend (React SPA)

Camada de apresentação responsável pela interface com o usuário. É uma **Single Page Application (SPA)** construída com **React 19**, renderizada no lado do cliente e estilizada com **Tailwind CSS**.

| Rota         | Componente   | Descrição                                 |
|--------------|--------------|-------------------------------------------|
| `/`          | `Login`      | Autenticação de usuários                  |
| `/register`  | `Register`   | Cadastro de novos usuários                |
| `/home`      | `Home`       | Feed principal com listagem de eventos    |
| `/user`      | `User`       | Perfil do usuário com publicações         |
| `/senha`     | `Senha`      | Recuperação de senha                      |

**Responsabilidades:**
- Renderizar interfaces responsivas e interativas
- Gerenciar estado da aplicação (contexto de autenticação, dados de formulário)
- Realizar requisições HTTP para a API via **axios**
- Gerenciar roteamento no lado do cliente via **React Router DOM**
- Armazenar e enviar tokens JWT em requisições autenticadas

### 2.2 Backend (Django REST API)

Camada de servidor responsável pela lógica de negócio, autenticação e persistência de dados. Implementa uma **API REST** com **Django 6** e **Django REST Framework 3.17**.

#### 2.2.1 Aplicações (Django Apps)

| App          | Função                                                    |
|--------------|-----------------------------------------------------------|
| `users`      | Cadastro, autenticação (JWT), perfil e gerenciamento de usuários |
| `posts`      | CRUD de eventos — título, descrição, data, local, categoria |
| `categories` | Gerenciamento de categorias de eventos (festas, esportes, churrascos, etc.) |
| `comments`   | Comentários e interações nos posts de eventos             |

**Responsabilidades:**
- Expor endpoints REST para operações CRUD
- Validar e serializar dados de entrada/saída
- Autenticar requisições via **JWT** (SimpleJWT)
- Autorizar acesso com base em permissões de usuário
- Gerenciar migrações e consultas ao banco de dados via **Django ORM**

#### 2.2.2 Modelo de Dados (Previsto)

```
┌──────────────────┐       ┌────────────────────┐
│      User        │       │      Post          │
├──────────────────┤       ├────────────────────┤
│ id (PK)          │       │ id (PK)            │
│ nome             │◄──────┤ author (FK → User) │
│ sobrenome        │       │ title              │
│ email (unique)   │       │ description        │
│ telefone         │       │ date               │
│ republica        │       │ location           │
│ password (hash)  │       │ image              │
│ avatar           │       │ category (FK → Cat)│
│ bio              │       │ created_at         │
│ created_at       │       │ updated_at         │
└──────────────────┘       └────────┬───────────┘
        │                           │
        │                           │
        │                  ┌────────┴───────────┐
        │                  │     Category        │
        │                  ├────────────────────┤
        │                  │ id (PK)            │
        │                  │ name (unique)      │
        │                  │ description        │
        │                  └────────────────────┘
        │
        │    ┌────────────────────┐
        │    │     Comment        │
        │    ├────────────────────┤
        └────┤ author (FK → User)│
             │ post (FK → Post)  │
             │ content           │
             │ created_at        │
             └────────────────────┘
```

### 2.3 Banco de Dados (PostgreSQL)

Sistema de gerenciamento de banco de dados relacional responsável pela persistência dos dados da aplicação.

**Responsabilidades:**
- Armazenar dados de usuários, posts, categorias e comentários
- Garantir integridade referencial (chaves estrangeiras, unicidade)
- Executar consultas otimizadas via índices e relacionamentos

### 2.4 Infraestrutura (Docker)

Orquestração de containers para ambiente de desenvolvimento padronizado.

| Serviço    | Imagem Base      | Porta | Comando de Inicialização              |
|------------|------------------|-------|----------------------------------------|
| `backend`  | `python:3.12`    | 8000  | `python manage.py runserver 0.0.0.0:8000` |
| `frontend` | `node:22-slim`   | 3000  | `npm run dev -- --host 0.0.0.0 --port 3000` |

---

## 3. Comunicação entre Componentes

### 3.1 Frontend ↔ Backend

A comunicação é realizada exclusivamente por **requisições HTTP** no formato **JSON**, seguindo padrões REST.

```
Cliente (React)                      Servidor (Django)
      │                                    │
      │  POST /api/auth/login/             │
      │  { email, password }               │
      │────────────────────────────────►   │
      │                                    │
      │  200 OK                            │
      │  { access, refresh } (tokens JWT)  │
      │◄───────────────────────────────────│
      │                                    │
      │  GET /api/posts/                    │
      │  Authorization: Bearer <access>    │
      │────────────────────────────────►   │
      │                                    │
      │  200 OK                            │
      │  [{ id, title, date, ... }]        │
      │◄───────────────────────────────────│
      │                                    │
```

### 3.2 Fluxo de Autenticação

1. Usuário envia credenciais (email + senha) para `/api/auth/login/`
2. Backend valida credenciais e retorna par de tokens **JWT** (access + refresh)
3. Frontend armazena tokens (localStorage/sessionStorage)
4. Requisições subsequentes incluem `Authorization: Bearer <access_token>`
5. Quando o access token expira, o frontend usa o refresh token para obter um novo par

### 3.3 Backend ↔ Banco de Dados

O Django estabelece conexão com o PostgreSQL via variável de ambiente `DATABASE_URL`, utilizando o adaptador `psycopg2-binary`. O Django ORM gerencia:

- **Conexão com o banco** (pooling via `conn_max_age`)
- **Migrações de esquema** (via `python manage.py migrate`)
- **Consultas** (query builder automatizado)
- **Health checks** (verificação periódica de conectividade)

### 3.4 CORS

O middleware `django-cors-headers` configura o backend para aceitar requisições originadas do domínio do frontend (`http://localhost:3000` em desenvolvimento).

---

## 4. Tecnologias, Linguagens e Ferramentas

### 4.1 Frontend

| Tecnologia       | Versão   | Finalidade                                    |
|------------------|----------|-----------------------------------------------|
| React            | 19.2.6   | Biblioteca para construção de interfaces SPA  |
| React Router DOM | 7.15.1   | Roteamento no lado do cliente                 |
| Axios            | 1.16.1   | Cliente HTTP para requisições à API           |
| Lucide React     | 1.17.0   | Biblioteca de ícones                          |
| Vite             | 8.12     | Bundler e servidor de desenvolvimento         |
| Tailwind CSS     | CDN      | Framework CSS utilitário                      |
| ESLint           | 10.3     | Análise estática de código JavaScript         |

### 4.2 Backend

| Tecnologia               | Versão | Finalidade                                     |
|--------------------------|--------|-------------------------------------------------|
| Python                   | 3.12   | Linguagem de programação                        |
| Django                   | 6.0.5  | Framework web Python                            |
| Django REST Framework    | 3.17.1 | Construção da API REST                         |
| SimpleJWT                | 5.5.1  | Autenticação por tokens JWT                     |
| django-cors-headers      | 4.9    | Configuração de CORS                            |
| dj-database-url          | 2.1    | Parsing de URL de banco de dados                |
| psycopg2-binary          | 2.9.12 | Adaptador PostgreSQL para Python                |
| python-dotenv            | 1.2.2  | Carregamento de variáveis de ambiente           |

### 4.3 Infraestrutura

| Ferramenta      | Versão     | Finalidade                                    |
|-----------------|------------|-----------------------------------------------|
| Docker          | —          | Containerização dos serviços                  |
| Docker Compose  | —          | Orquestração multi-container                  |
| PostgreSQL      | —          | Banco de dados relacional                     |
| Git             | —          | Controle de versão                            |
| GitHub          | —          | Hospedagem do repositório e Kanban (Projects) |

---

## 5. Fluxo de Dados (Exemplo: Criação de Evento)

```
Usuário                        Frontend                    Backend                    Banco
   │                              │                          │                          │
   │  Preenche formulário         │                          │                          │
   │  de criação de evento       │                          │                          │
   │──────────────────────────►   │                          │                          │
   │                              │                          │                          │
   │                              │  POST /api/posts/        │                          │
   │                              │  Authorization: JWT      │                          │
   │                              │  { title, desc, date,    │                          │
   │                              │    location, category }  │                          │
   │                              │────────────────────────► │                          │
   │                              │                          │                          │
   │                              │                          │  Valida dados            │
   │                              │                          │  Verifica autenticação   │
   │                              │                          │  Autoriza usuário        │
   │                              │                          │                          │
   │                              │                          │  INSERT INTO post        │
   │                              │                          │─────────────────────────► │
   │                              │                          │                          │
   │                              │                          │  Confirma inserção       │
   │                              │                          │◄───────────────────────── │
   │                              │                          │                          │
   │                              │  201 Created             │                          │
   │                              │  { id, title, ... }     │                          │
   │                              │◄─────────────────────────│                          │
   │                              │                          │                          │
   │  Confirmação visual          │                          │                          │
   │  (redireciona ao feed)       │                          │                          │
   │◄───────────────────────────  │                          │                          │
```

---

## 6. Estrutura do Repositório

```
Festa-de-Ouro/
├── docs/
│   └── arquitetura.md          ← Documentação da arquitetura (este arquivo)
├── DATA BASE - DESING/
│   └── DIAGRAMA ER.jpeg        ← Diagrama entidade-relacionamento
├── home/
│   ├── docker-compose.yml      ← Orquestração de containers
│   ├── backend/                ← Servidor Django
│   │   ├── Dockerfile
│   │   ├── requirements.txt
│   │   ├── manage.py
│   │   ├── core/               ← Configuração do projeto Django
│   │   │   ├── settings.py
│   │   │   ├── urls.py
│   │   │   ├── asgi.py
│   │   │   └── wsgi.py
│   │   └── apps/               ← Aplicações Django
│   │       ├── users/          ← Autenticação e perfis
│   │       ├── posts/          ← Eventos
│   │       ├── categories/     ← Categorias
│   │       └── comments/       ← Comentários
│   └── frontend/               ← Cliente React
│       ├── Dockerfile
│       ├── package.json
│       ├── vite.config.js
│       ├── index.html
│       └── src/
│           ├── main.jsx
│           ├── App.jsx         ← Roteamento principal
│           └── pages/          ← Páginas da aplicação
│               ├── Login.jsx
│               ├── Register.jsx
│               ├── Home.jsx
│               ├── User.jsx
│               └── Senha.jsx
└── README.md
```

---

## 7. Considerações sobre Implementações Futuras

A arquitetura atual foi projetada para evoluir com as seguintes adições planejadas:

| Funcionalidade Futura              | Impacto na Arquitetura                                           |
|------------------------------------|------------------------------------------------------------------|
| **Serializers e ViewSets**         | Implementar serializers e views baseadas em ModelViewSet em cada app Django |
| **Endpoints REST**                 | Registrar rotas REST no `urls.py` do core para cada app           |
| **Integração Frontend-Backend**    | Conectar formulários React aos endpoints via axios com envio de tokens JWT |
| **Contexto de Autenticação**       | Criar um AuthContext no React para gerenciar estado de login global |
| **Upload de Imagens**              | Adicionar campo de imagem nos modelos e configurar media files no Django |
| **Sistema de Notificações**        | Novo app `notifications` + polling ou WebSockets (Django Channels) |
| **Busca e Filtros Avançados**      | Implementar django-filter para busca por categoria, data, local   |
| **Paginação**                      | Adicionar paginação nos endpoints de listagem (DRF PageNumberPagination) |
| **Testes Automatizados**           | Testes unitários (pytest) no backend + React Testing Library no frontend |
| **Deploy em Produção**             | Adicionar nginx como reverse proxy, certificados SSL, banco gerenciado |
| **CI/CD**                          | Pipeline GitHub Actions para lint, testes e deploy automatizado   |
| **Responsividade Mobile**          | Ajustes de layout Tailwind para breakpoints mobile                |

---

## 8. Diagrama de Implantação (Deploy Futuro)

```
┌──────────────── Internet ─────────────────┐
│                                            │
│  ┌─────────────────────────────────┐      │
│  │       Navegador (Cliente)       │      │
│  │   https://festa-de-ouro.app     │      │
│  └───────────────┬─────────────────┘      │
│                  │                         │
└──────────────────┼─────────────────────────┘
                   │
                   │ HTTPS
                   │
┌──────────────────┼─────────────────────────┐
│       Reverse Proxy (nginx)                │
│                                            │
│  /api/* ───────────► Backend :8000         │
│  /*    ───────────► Frontend (build)       │
└────────────────────────────────────────────┘
```

---

## 9. Estratégia de Branches (Git Flow)

```
main ──────●────────────────────────●── (produção)
            \                      /
dev  ───────●──────────────────────●── (integração)
             \    \        \      /
feature/*     ●    ●        ●    ●  (desenvolvimento)
```

- `main` → Código estável e funcional
- `dev` → Integração do time
- `feature/*` → Funcionalidades em desenvolvimento

---

*Documento gerado em junho de 2026. Mantenha este arquivo atualizado conforme o sistema evolui.*
