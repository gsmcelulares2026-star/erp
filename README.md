# Sistema ERP Completo em Python

Sistema de planejamento de recursos empresariais (ERP) completo desenvolvido em Python com FastAPI, SQLAlchemy e interface web moderna.

## 🚀 Funcionalidades

### Módulos Implementados

- ✅ **Dashboard**: Visão geral com KPIs e métricas em tempo real
- ✅ **Vendas**: Gestão completa de pedidos e orçamentos
- ✅ **Clientes**: Cadastro e gerenciamento de clientes (CRM)
- ✅ **Produtos**: Controle de produtos com categorias e preços
- ✅ **Estoque**: Movimentações e controle de inventário
- ✅ **Financeiro**: Contas a pagar/receber e transações
- ✅ **Compras**: Pedidos de compra e recebimentos
- ✅ **Fornecedores**: Cadastro e avaliação de fornecedores
- ✅ **RH**: Gestão de funcionários e departamentos

### Tecnologias

**Backend:**
- FastAPI (API REST moderna e rápida)
- SQLAlchemy (ORM)
- SQLite (desenvolvimento) / PostgreSQL (produção)
- JWT (autenticação)
- Pydantic (validação de dados)

**Frontend:**
- HTML5, CSS3, JavaScript (vanilla)
- Design moderno com dark mode
- Glassmorphism e gradientes vibrantes
- Animações suaves

## 📦 Instalação

### Pré-requisitos

- Python 3.8 ou superior
- pip (gerenciador de pacotes Python)

### Passo a Passo

1. **Clone ou navegue até o diretório do projeto**

```bash
cd c:\Users\Jacir\Downloads\erp
```

2. **Crie um ambiente virtual (recomendado)**

```bash
python -m venv venv
venv\Scripts\activate
```

3. **Instale as dependências**

```bash
cd backend
pip install -r requirements.txt
```

4. **Configure as variáveis de ambiente**

Copie o arquivo `.env.example` para `.env`:

```bash
copy .env.example .env
```

Edite o arquivo `.env` e configure:
- `SECRET_KEY`: Chave secreta para JWT (mude em produção)
- `DATABASE_URL`: URL do banco de dados

5. **Inicie o servidor**

```bash
uvicorn app.main:app --reload
```

O servidor estará rodando em `http://localhost:8000`

6. **Acesse a documentação da API**

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

7. **Abra a interface web**

Abra o arquivo `frontend/index.html` em seu navegador ou use um servidor HTTP local:

```bash
cd ..\frontend
python -m http.server 8080
```

Acesse: `http://localhost:8080`

## 👤 Primeiro Acesso

Para criar o primeiro usuário administrador, você pode usar a API diretamente:

**Opção 1: Via Swagger UI**
1. Acesse `http://localhost:8000/docs`
2. Vá até `/api/auth/register`
3. Clique em "Try it out"
4. Preencha os dados:
```json
{
  "username": "admin",
  "email": "admin@erp.com",
  "full_name": "Administrador",
  "password": "admin123",
  "role": "admin"
}
```
5. Execute e faça login na interface web

**Opção 2: Via Python Script**

Crie um arquivo `create_admin.py` na pasta `backend`:

```python
from app.database import SessionLocal, init_db
from app.services.auth_service import create_user

init_db()
db = SessionLocal()

try:
    user = create_user(
        db=db,
        username="admin",
        email="admin@erp.com",
        full_name="Administrador",
        password="admin123",
        role="admin"
    )
    print(f"✅ Usuário criado: {user.username}")
except Exception as e:
    print(f"❌ Erro: {e}")
finally:
    db.close()
```

Execute:
```bash
python create_admin.py
```

## 🎨 Interface

A interface web possui:

- **Design moderno** com dark mode premium
- **Glassmorphism** para efeitos de vidro
- **Gradientes vibrantes** em elementos importantes
- **Animações suaves** para melhor UX
- **Responsivo** para mobile e desktop
- **SPA (Single Page Application)** para navegação fluida

## 📚 Estrutura do Projeto

```
erp/
├── backend/
│   ├── app/
│   │   ├── api/              # Rotas da API
│   │   ├── models/           # Modelos SQLAlchemy
│   │   ├── services/         # Lógica de negócio
│   │   ├── config.py         # Configurações
│   │   ├── database.py       # Conexão com BD
│   │   ├── dependencies.py   # Dependências FastAPI
│   │   └── main.py          # Aplicação principal
│   ├── requirements.txt
│   └── .env
├── frontend/
│   ├── css/
│   │   └── style.css        # Design system
│   ├── js/
│   │   ├── app.js           # Aplicação principal
│   │   └── auth.js          # Autenticação
│   └── index.html
└── README.md
```

## 🔌 API Endpoints

### Autenticação
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Registro
- `GET /api/auth/me` - Usuário atual

### Clientes
- `GET /api/customers/` - Listar clientes
- `POST /api/customers/` - Criar cliente
- `GET /api/customers/{id}` - Obter cliente
- `PUT /api/customers/{id}` - Atualizar cliente
- `DELETE /api/customers/{id}` - Deletar cliente

### Produtos
- `GET /api/products/` - Listar produtos
- `POST /api/products/` - Criar produto
- `GET /api/products/{id}` - Obter produto
- `PUT /api/products/{id}` - Atualizar produto
- `DELETE /api/products/{id}` - Deletar produto

### Vendas
- `GET /api/sales/` - Listar vendas
- `POST /api/sales/` - Criar venda
- `GET /api/sales/{id}` - Obter venda
- `PATCH /api/sales/{id}/status` - Atualizar status

### Dashboard
- `GET /api/dashboard/` - Obter métricas do dashboard

## 🔒 Segurança

- Autenticação via JWT
- Senhas hasheadas com bcrypt
- CORS configurado
- Validação de dados com Pydantic
- Controle de acesso baseado em roles

## 🚀 Produção

Para deploy em produção:

1. **Configure PostgreSQL**

Atualize `DATABASE_URL` no `.env`:
```
DATABASE_URL=postgresql://user:password@localhost/erp_db
```

2. **Gere uma SECRET_KEY segura**

```python
import secrets
print(secrets.token_urlsafe(32))
```

3. **Desabilite DEBUG**

```
DEBUG=False
```

4. **Use um servidor ASGI em produção**

```bash
pip install gunicorn
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker
```

## 📝 Licença

Este projeto é de código aberto e está disponível para uso livre.

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

## 📧 Suporte

Para suporte e dúvidas, entre em contato através do email: suporte@erp.com
