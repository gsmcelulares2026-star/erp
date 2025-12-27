from sqlalchemy import Column, Integer, String, Float, DateTime, Date, Boolean, ForeignKey, Text
from sqlalchemy.sql import func
from ..database import Base


class Department(Base):
    """Modelo de departamento"""
    __tablename__ = "departments"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, unique=True)
    description = Column(Text)
    is_active = Column(Boolean, default=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    def __repr__(self):
        return f"<Department {self.name}>"


class Employee(Base):
    """Modelo de funcionário"""
    __tablename__ = "employees"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Informações pessoais
    full_name = Column(String(200), nullable=False, index=True)
    document = Column(String(20), unique=True, index=True)  # CPF
    birth_date = Column(Date)
    email = Column(String(100), index=True)
    phone = Column(String(20))
    mobile = Column(String(20))
    
    # Endereço
    address = Column(String(200))
    city = Column(String(100))
    state = Column(String(2))
    zip_code = Column(String(10))
    
    # Informações profissionais
    department_id = Column(Integer, ForeignKey("departments.id"))
    position = Column(String(100))
    hire_date = Column(Date, nullable=False)
    termination_date = Column(Date)
    
    # Salário
    salary = Column(Float, nullable=False)
    
    # Status
    is_active = Column(Boolean, default=True)
    
    # Informações adicionais
    notes = Column(Text)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    def __repr__(self):
        return f"<Employee {self.full_name}>"
