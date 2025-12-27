from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
from ..database import get_db
from ..models.sale import Sale, SaleItem
from ..models.product import Product
from ..models.inventory import InventoryMovement
from ..dependencies import get_current_active_user
from ..models.user import User

router = APIRouter(prefix="/sales", tags=["Sales"])


class SaleItemCreate(BaseModel):
    product_id: int
    quantity: float
    unit_price: float
    discount: float = 0.0


class SaleItemResponse(BaseModel):
    id: int
    product_id: int
    quantity: float
    unit_price: float
    discount: float
    total: float
    
    class Config:
        from_attributes = True


class SaleCreate(BaseModel):
    customer_id: int
    items: List[SaleItemCreate]
    discount: float = 0.0
    tax: float = 0.0
    payment_method: str
    notes: Optional[str] = None


class SaleResponse(BaseModel):
    id: int
    sale_number: str
    customer_id: int
    user_id: int
    sale_date: datetime
    subtotal: float
    discount: float
    tax: float
    total: float
    status: str
    payment_method: str
    payment_status: str
    items: List[SaleItemResponse]
    
    class Config:
        from_attributes = True


@router.get("/", response_model=List[SaleResponse])
async def list_sales(
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Listar vendas"""
    query = db.query(Sale)
    
    if status:
        query = query.filter(Sale.status == status)
    
    sales = query.order_by(Sale.sale_date.desc()).offset(skip).limit(limit).all()
    return sales


@router.post("/", response_model=SaleResponse, status_code=status.HTTP_201_CREATED)
async def create_sale(
    sale_data: SaleCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Criar nova venda"""
    # Gerar número da venda
    last_sale = db.query(Sale).order_by(Sale.id.desc()).first()
    sale_number = f"VND-{(last_sale.id + 1) if last_sale else 1:06d}"
    
    # Calcular totais
    subtotal = 0.0
    for item in sale_data.items:
        item_total = (item.quantity * item.unit_price) - item.discount
        subtotal += item_total
    
    total = subtotal - sale_data.discount + sale_data.tax
    
    # Criar venda
    sale = Sale(
        sale_number=sale_number,
        customer_id=sale_data.customer_id,
        user_id=current_user.id,
        subtotal=subtotal,
        discount=sale_data.discount,
        tax=sale_data.tax,
        total=total,
        payment_method=sale_data.payment_method,
        notes=sale_data.notes
    )
    db.add(sale)
    db.flush()
    
    # Criar itens e atualizar estoque
    for item_data in sale_data.items:
        item_total = (item_data.quantity * item_data.unit_price) - item_data.discount
        
        sale_item = SaleItem(
            sale_id=sale.id,
            product_id=item_data.product_id,
            quantity=item_data.quantity,
            unit_price=item_data.unit_price,
            discount=item_data.discount,
            total=item_total
        )
        db.add(sale_item)
        
        # Atualizar estoque do produto
        product = db.query(Product).filter(Product.id == item_data.product_id).first()
        if product:
            previous_stock = product.current_stock
            product.current_stock -= item_data.quantity
            
            # Registrar movimentação de estoque
            movement = InventoryMovement(
                product_id=product.id,
                user_id=current_user.id,
                movement_type="out",
                quantity=item_data.quantity,
                reference_type="sale",
                reference_id=sale.id,
                reason=f"Venda {sale_number}",
                previous_stock=previous_stock,
                new_stock=product.current_stock
            )
            db.add(movement)
    
    db.commit()
    db.refresh(sale)
    return sale


@router.get("/{sale_id}", response_model=SaleResponse)
async def get_sale(
    sale_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Obter venda por ID"""
    sale = db.query(Sale).filter(Sale.id == sale_id).first()
    if not sale:
        raise HTTPException(status_code=404, detail="Sale not found")
    return sale


@router.patch("/{sale_id}/status")
async def update_sale_status(
    sale_id: int,
    new_status: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Atualizar status da venda"""
    sale = db.query(Sale).filter(Sale.id == sale_id).first()
    if not sale:
        raise HTTPException(status_code=404, detail="Sale not found")
    
    sale.status = new_status
    db.commit()
    return {"message": "Status updated successfully"}
