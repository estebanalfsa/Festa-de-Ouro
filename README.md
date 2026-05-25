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
git clone https://github.com/estebanalfsa/Festa-de-Ouro
cd festa-de-ouro

# 2. Copiar as variáveis de ambiente
cp .env.example .env

# 3. Subir os containers
sudo docker compose -f docker-compose.yml up
```

Acesse:
- Frontend: http://localhost:3000
- Backend (API): http://localhost:8000/api
- Admin Django: http://localhost:8000/admin

---

```
main        → código estável e funcional
dev         → integração do time
feature/*   → funcionalidades em desenvolvimento
```

---

## Integrantes

| Nome | 
|---|
| Carlos Fabricio Benites Rodriguez |
| Gruner Antonio Sánchez Morales |
| Jose Esteba Andres Alfaro Sánchez |

---

## Quadro Kanban

Acompanhe as tarefas e o progresso do time na aba [Projects](https://github.com/users/estebanalfsa/projects/2/views/1) do repositório.

---

## Licença

Este projeto foi desenvolvido para fins acadêmicos.
