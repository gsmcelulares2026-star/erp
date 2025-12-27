from sqlalchemy import Column, Integer, String, DateTime, Text, Boolean, Float
from sqlalchemy.sql import func
from ..database import Base


class Supplier(Base):
    """Modelo de fornecedor"""
    __tablename__ = "suppliers"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False, index=True)
    document = Column(String(20), unique=True, index=True)  # CNPJ
    email = Column(String(100), index=True)
    phone = Column(String(20))
    
    # Endereço
    address = Column(String(200))
    city = Column(String(100))
    state = Column(String(2))
    zip_code = Column(String(10))
    
    # Informações comerciais
    contact_person = Column(String(100))
    payment_terms = Column(String(100))  # Ex: 30/60/90 dias
    rating = Column(Float, default=5.0)  # Avaliação de 0 a 5
    category = Column(String(50))  # Categoria do fornecedor
    
    # Informações adicionais
    notes = Column(Text)
    is_active = Column(Boolean, default=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    def __repr__(self):
        return f"<Supplier {self.name}>"
