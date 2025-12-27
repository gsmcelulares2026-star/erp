from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
from ..database import get_db
from ..models.product import Product
from ..dependencies import get_current_active_user
from ..models.user import User

router = APIRouter(prefix="/products", tags=["Products"])


class ProductCreate(BaseModel):
    code: str
    name: str
    description: Optional[str] = None
    category: Optional[str] = None
    unit: str = "UN"
    cost_price: float = 0.0
    sale_price: float
    wholesale_price: Optional[float] = None
    minimum_stock: float = 0.0
    maximum_stock: Optional[float] = None
    default_supplier_id: Optional[int] = None
    barcode: Optional[str] = None
    location: Optional[str] = None


class ProductUpdate(BaseModel):
    code: Optional[str] = None
    name: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    unit: Optional[str] = None
    cost_price: Optional[float] = None
    sale_price: Optional[float] = None
    wholesale_price: Optional[float] = None
    current_stock: Optional[float] = None
    minimum_stock: Optional[float] = None
    maximum_stock: Optional[float] = None
    default_supplier_id: Optional[int] = None
    barcode: Optional[str] = None
    location: Optional[str] = None
    is_active: Optional[bool] = None


class ProductResponse(BaseModel):
    id: int
    code: str
    name: str
    description: Optional[str]
    category: Optional[str]
    unit: str
    sale_price: float
    current_stock: float
    minimum_stock: float
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


@router.get("/", response_model=List[ProductResponse])
async def list_products(
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = None,
    category: Optional[str] = None,
    low_stock: bool = False,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Listar produtos com filtros"""
    query = db.query(Product).filter(Product.is_active == True)
    
    if search:
        query = query.filter(
            (Product.name.contains(search)) |
            (Product.code.contains(search)) |
            (Product.barcode.contains(search))
        )
    
    if category:
        query = query.filter(Product.category == category)
    
    if low_stock:
        query = query.filter(Product.current_stock <= Product.minimum_stock)
    
    products = query.offset(skip).limit(limit).all()
    return products


@router.post("/", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
async def create_product(
    product_data: ProductCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Criar novo produto"""
    # Verificar se código já existe
    existing = db.query(Product).filter(Product.code == product_data.code).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Product with this code already exists"
        )
    
    product = Product(**product_data.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


@router.get("/{product_id}", response_model=ProductResponse)
async def get_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Obter produto por ID"""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@router.put("/{product_id}", response_model=ProductResponse)
async def update_product(
    product_id: int,
    product_data: ProductUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Atualizar produto"""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    update_data = product_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(product, field, value)
    
    db.commit()
    db.refresh(product)
    return product


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Deletar produto (soft delete)"""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    product.is_active = False
    db.commit()
    return None
