# 🎉 Festa de Ouro

> Plataforma web de foro para publicação e descoberta de eventos locais — festas, aniversários, esportes, churrascos e muito mais.

---

## Sobre o Projeto

**Festa de Ouro** é uma aplicação web do tipo fórum onde qualquer usuário cadastrado pode publicar e visualizar eventos da comunidade. A ideia é centralizar em um só lugar todos os eventos locais, sejam eles sociais, esportivos, culturais ou gastronômicos.

### Funcionalidades principais
- Cadastro e login de usuários
- Perfil pessoal com histórico de publicações
- Criação de posts de eventos com categoria, data e descrição
- Feed principal com filtro por categoria


---

## Tecnologias

| Camada | Tecnologia |
|---|---|
| Frontend | React + Tailwind CSS |
| Backend | Django + Django REST Framework |
| Banco de dados | PostgreSQL |
| Containerização | Docker + Docker Compose |
| Controle de versão | Git + GitHub |

---

## Como rodar o projeto

### Pré-requisitos
- [Docker](https://www.docker.com/) instalado
- [Docker Compose](https://docs.docker.com/compose/) instalado
### Passos

```bash
# 1. Clonar o repositório
git clone https://github.com/SEU_USUARIO/festa-de-ouro.git
cd festa-de-ouro

# 2. Copiar as variáveis de ambiente
cp .env.example .env

# 3. Subir os containers
docker-compose up --build
```

Acesse:
- Frontend: http://localhost:3000
- Backend (API): http://localhost:8000/api
- Admin Django: http://localhost:8000/admin

---

## Estrutura do Projeto

```
festa-de-ouro/
│
├── backend/              # Django REST API
│   ├── apps/
│   │   ├── users/        # Autenticação e perfis
│   │   ├── posts/        # Publicações de eventos
│   │   └── comments/     # Comentários
│   ├── requirements.txt
│   └── Dockerfile
│
├── frontend/             # React App
│   ├── src/
│   │   ├── pages/        # Login, Home, Perfil
│   │   ├── components/   # Navbar, Cards, Formulários
│   │   └── services/     # Chamadas à API
│   ├── package.json
│   └── Dockerfile
│
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## Branches

```
main        → código estável e funcional
dev         → integração do time
feature/*   → funcionalidades em desenvolvimento
```

---

## Integrantes

| Nome | Função |
|---|---|
| Carlos Fabricio Benites Rodriguez | Backend — Autenticação e usuários |
| Gruner Antonio Sánchez Morales| Backend — Posts, categorias e API |
| Jose Esteba Andres Alfaro Sánchez | Frontend — Login, registro, navegação e feed principal e cards de eventos |

---

## Quadro Kanban

Acompanhe as tarefas e o progresso do time na aba [Projects](https://github.com/users/estebanalfsa/projects/2/views/1) do repositório.

---

## Licença

Este projeto foi desenvolvido para fins acadêmicos.
