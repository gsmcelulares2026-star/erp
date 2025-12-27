from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.sql import func
from ..database import Base


class InventoryMovement(Base):
    """Modelo de movimentação de estoque"""
    __tablename__ = "inventory_movements"
    
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    movement_type = Column(String(20), nullable=False)  # in, out, adjustment
    quantity = Column(Float, nullable=False)
    
    # Referências
    reference_type = Column(String(20))  # sale, purchase, adjustment, transfer
    reference_id = Column(Integer)  # ID da venda, compra, etc.
    
    # Informações adicionais
    reason = Column(String(200))
    notes = Column(Text)
    
    # Estoque antes e depois
    previous_stock = Column(Float)
    new_stock = Column(Float)
    
    movement_date = Column(DateTime(timezone=True), server_default=func.now())
    
    def __repr__(self):
        return f"<InventoryMovement {self.movement_type} - {self.quantity}>"
