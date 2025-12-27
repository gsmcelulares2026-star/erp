from sqlalchemy import Column, Integer, String, Float, DateTime, Text, ForeignKey, Date
from sqlalchemy.sql import func
from ..database import Base


class AccountsReceivable(Base):
    """Modelo de contas a receber"""
    __tablename__ = "accounts_receivable"
    
    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=False)
    sale_id = Column(Integer, ForeignKey("sales.id"))
    
    description = Column(String(200), nullable=False)
    amount = Column(Float, nullable=False)
    due_date = Column(Date, nullable=False)
    payment_date = Column(Date)
    
    status = Column(String(20), default="pending")  # pending, paid, overdue, cancelled
    category = Column(String(50))
    notes = Column(Text)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    def __repr__(self):
        return f"<AccountsReceivable {self.id} - {self.amount}>"


class AccountsPayable(Base):
    """Modelo de contas a pagar"""
    __tablename__ = "accounts_payable"
    
    id = Column(Integer, primary_key=True, index=True)
    supplier_id = Column(Integer, ForeignKey("suppliers.id"))
    purchase_id = Column(Integer, ForeignKey("purchases.id"))
    
    description = Column(String(200), nullable=False)
    amount = Column(Float, nullable=False)
    due_date = Column(Date, nullable=False)
    payment_date = Column(Date)
    
    status = Column(String(20), default="pending")  # pending, paid, overdue, cancelled
    category = Column(String(50))
    notes = Column(Text)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    def __repr__(self):
        return f"<AccountsPayable {self.id} - {self.amount}>"


class Transaction(Base):
    """Modelo de transação financeira"""
    __tablename__ = "transactions"
    
    id = Column(Integer, primary_key=True, index=True)
    
    transaction_type = Column(String(20), nullable=False)  # income, expense
    category = Column(String(50), nullable=False)
    description = Column(String(200), nullable=False)
    amount = Column(Float, nullable=False)
    transaction_date = Column(Date, nullable=False)
    
    payment_method = Column(String(50))
    reference = Column(String(100))  # Número de referência/documento
    notes = Column(Text)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    def __repr__(self):
        return f"<Transaction {self.transaction_type} - {self.amount}>"
