from sqlalchemy import Column, Integer, String, Float, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base


class Purchase(Base):
    """Modelo de compra"""
    __tablename__ = "purchases"
    
    id = Column(Integer, primary_key=True, index=True)
    purchase_number = Column(String(50), unique=True, index=True, nullable=False)
    supplier_id = Column(Integer, ForeignKey("suppliers.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Datas
    purchase_date = Column(DateTime(timezone=True), server_default=func.now())
    expected_delivery = Column(DateTime(timezone=True))
    received_date = Column(DateTime(timezone=True))
    
    # Valores
    subtotal = Column(Float, default=0.0)
    discount = Column(Float, default=0.0)
    tax = Column(Float, default=0.0)
    shipping = Column(Float, default=0.0)
    total = Column(Float, nullable=False)
    
    # Status e pagamento
    status = Column(String(20), default="pending")  # pending, confirmed, received, cancelled
    payment_status = Column(String(20), default="pending")  # pending, paid, partial
    
    # Informações adicionais
    notes = Column(Text)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relacionamentos
    items = relationship("PurchaseItem", back_populates="purchase", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Purchase {self.purchase_number}>"


class PurchaseItem(Base):
    """Modelo de item de compra"""
    __tablename__ = "purchase_items"
    
    id = Column(Integer, primary_key=True, index=True)
    purchase_id = Column(Integer, ForeignKey("purchases.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    
    quantity = Column(Float, nullable=False)
    unit_price = Column(Float, nullable=False)
    discount = Column(Float, default=0.0)
    total = Column(Float, nullable=False)
    
    # Relacionamentos
    purchase = relationship("Purchase", back_populates="items")
    
    def __repr__(self):
        return f"<PurchaseItem {self.id}>"
