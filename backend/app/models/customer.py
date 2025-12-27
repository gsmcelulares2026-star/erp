from sqlalchemy import Column, Integer, String, DateTime, Text, Boolean
from sqlalchemy.sql import func
from ..database import Base


class Customer(Base):
    """Modelo de cliente"""
    __tablename__ = "customers"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False, index=True)
    document = Column(String(20), unique=True, index=True)  # CPF/CNPJ
    email = Column(String(100), index=True)
    phone = Column(String(20))
    mobile = Column(String(20))
    
    # Endereço
    address = Column(String(200))
    address_number = Column(String(20))
    complement = Column(String(100))
    neighborhood = Column(String(100))
    city = Column(String(100))
    state = Column(String(2))
    zip_code = Column(String(10))
    
    # Informações adicionais
    notes = Column(Text)
    is_active = Column(Boolean, default=True)
    customer_type = Column(String(20), default="retail")  # retail, wholesale, vip
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    def __repr__(self):
        return f"<Customer {self.name}>"
