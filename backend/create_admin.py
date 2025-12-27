from app.database import SessionLocal, init_db
from app.services.auth_service import create_user

# Inicializar banco de dados
print("🔧 Inicializando banco de dados...")
init_db()

# Criar sessão
db = SessionLocal()

try:
    # Criar usuário administrador
    print("👤 Criando usuário administrador...")
    user = create_user(
        db=db,
        username="admin",
        email="admin@erp.com",
        full_name="Administrador",
        password="admin123",
        role="admin"
    )
    print(f"✅ Usuário criado com sucesso!")
    print(f"   Username: {user.username}")
    print(f"   Email: {user.email}")
    print(f"   Role: {user.role}")
    print(f"\n🔐 Use estas credenciais para fazer login:")
    print(f"   Usuário: admin")
    print(f"   Senha: admin123")
    
except Exception as e:
    print(f"❌ Erro ao criar usuário: {e}")
    print(f"   O usuário 'admin' pode já existir no banco de dados.")
    
finally:
    db.close()
    print("\n✨ Processo concluído!")
