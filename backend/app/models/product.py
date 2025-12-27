from sqlalchemy import Column, Integer, String, Float, DateTime, Text, Boolean, ForeignKey
from sqlalchemy.sql import func
from ..database import Base


class Product(Base):
    """Modelo de produto"""
    __tablename__ = "products"
    
    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(50), unique=True, index=True, nullable=False)
    name = Column(String(200), nullable=False, index=True)
    description = Column(Text)
    
    # Categoria e unidade
    category = Column(String(50), index=True)
    unit = Column(String(10), default="UN")  # UN, KG, L, M, etc.
    
    # Preços
    cost_price = Column(Float, default=0.0)
    sale_price = Column(Float, nullable=False)
    wholesale_price = Column(Float)
    
    # Estoque
    current_stock = Column(Float, default=0.0)
    minimum_stock = Column(Float, default=0.0)
    maximum_stock = Column(Float)
    
    # Fornecedor padrão
    default_supplier_id = Column(Integer, ForeignKey("suppliers.id"))
    
    # Informações adicionais
    barcode = Column(String(50), unique=True, index=True)
    location = Column(String(50))  # Localização no estoque
    is_active = Column(Boolean, default=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    def __repr__(self):
        return f"<Product {self.code} - {self.name}>"
