from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta
from ..database import get_db
from ..models.sale import Sale
from ..models.product import Product
from ..models.financial import AccountsReceivable, AccountsPayable
from ..dependencies import get_current_active_user
from ..models.user import User

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/")
async def get_dashboard_data(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Obter dados do dashboard"""
    today = datetime.now().date()
    month_start = today.replace(day=1)
    
    # Vendas do mês
    monthly_sales = db.query(func.sum(Sale.total)).filter(
        Sale.sale_date >= month_start,
        Sale.status != "cancelled"
    ).scalar() or 0.0
    
    # Vendas de hoje
    daily_sales = db.query(func.sum(Sale.total)).filter(
        func.date(Sale.sale_date) == today,
        Sale.status != "cancelled"
    ).scalar() or 0.0
    
    # Total de vendas
    total_sales = db.query(func.count(Sale.id)).filter(
        Sale.status != "cancelled"
    ).scalar() or 0
    
    # Produtos com estoque baixo
    low_stock_products = db.query(func.count(Product.id)).filter(
        Product.current_stock <= Product.minimum_stock,
        Product.is_active == True
    ).scalar() or 0
    
    # Contas a receber vencidas
    overdue_receivables = db.query(func.sum(AccountsReceivable.amount)).filter(
        AccountsReceivable.due_date < today,
        AccountsReceivable.status == "pending"
    ).scalar() or 0.0
    
    # Contas a pagar vencidas
    overdue_payables = db.query(func.sum(AccountsPayable.amount)).filter(
        AccountsPayable.due_date < today,
        AccountsPayable.status == "pending"
    ).scalar() or 0.0
    
    # Vendas dos últimos 7 dias
    seven_days_ago = today - timedelta(days=7)
    recent_sales = db.query(
        func.date(Sale.sale_date).label("date"),
        func.sum(Sale.total).label("total")
    ).filter(
        Sale.sale_date >= seven_days_ago,
        Sale.status != "cancelled"
    ).group_by(func.date(Sale.sale_date)).all()
    
    sales_chart = [
        {"date": str(sale.date), "total": float(sale.total)}
        for sale in recent_sales
    ]
    
    return {
        "monthly_sales": monthly_sales,
        "daily_sales": daily_sales,
        "total_sales": total_sales,
        "low_stock_products": low_stock_products,
        "overdue_receivables": overdue_receivables,
        "overdue_payables": overdue_payables,
        "sales_chart": sales_chart
    }
