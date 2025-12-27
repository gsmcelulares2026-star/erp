// Aplicação principal
class ERPApp {
    constructor() {
        this.currentPage = 'dashboard';
        this.init();
    }

    init() {
        this.setupNavigation();
        this.loadPage('dashboard');
    }

    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();

                // Remover active de todos os links
                navLinks.forEach(l => l.classList.remove('active'));

                // Adicionar active ao link clicado
                link.classList.add('active');

                // Carregar página
                const page = link.dataset.page;
                this.loadPage(page);
            });
        });
    }

    loadPage(pageName) {
        this.currentPage = pageName;

        // Atualizar título
        const titles = {
            'dashboard': 'Dashboard',
            'sales': 'Vendas',
            'customers': 'Clientes',
            'products': 'Produtos',
            'inventory': 'Estoque',
            'financial': 'Financeiro',
            'purchases': 'Compras',
            'suppliers': 'Fornecedores',
            'employees': 'Funcionários'
        };

        document.getElementById('page-title').textContent = titles[pageName] || pageName;

        // Carregar conteúdo da página
        const pageContent = document.getElementById('page-content');

        switch (pageName) {
            case 'dashboard':
                this.loadDashboard();
                break;
            case 'customers':
                this.loadCustomers();
                break;
            case 'products':
                this.loadProducts();
                break;
            case 'sales':
                this.loadSales();
                break;
            default:
                pageContent.innerHTML = `
                    <div class="card">
                        <h2>Módulo ${titles[pageName]}</h2>
                        <p>Esta funcionalidade está em desenvolvimento.</p>
                    </div>
                `;
        }
    }

    async loadDashboard() {
        const pageContent = document.getElementById('page-content');

        pageContent.innerHTML = `
            <div class="stats-grid fade-in-up">
                <div class="stat-card">
                    <div class="stat-label">Vendas do Mês</div>
                    <div class="stat-value" id="monthly-sales">R$ 0,00</div>
                    <div class="stat-change">↗ Carregando...</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Vendas Hoje</div>
                    <div class="stat-value" id="daily-sales">R$ 0,00</div>
                    <div class="stat-change">↗ Carregando...</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Total de Vendas</div>
                    <div class="stat-value" id="total-sales">0</div>
                    <div class="stat-change">📊 Todas</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Estoque Baixo</div>
                    <div class="stat-value" id="low-stock">0</div>
                    <div class="stat-change">⚠️ Produtos</div>
                </div>
            </div>

            <div class="card fade-in-up" style="animation-delay: 100ms;">
                <h2 style="margin-bottom: 1.5rem;">Resumo Financeiro</h2>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem;">
                    <div>
                        <div style="color: var(--text-secondary); margin-bottom: 0.5rem;">Contas a Receber Vencidas</div>
                        <div style="font-size: 1.5rem; font-weight: 700; color: var(--warning);" id="overdue-receivables">R$ 0,00</div>
                    </div>
                    <div>
                        <div style="color: var(--text-secondary); margin-bottom: 0.5rem;">Contas a Pagar Vencidas</div>
                        <div style="font-size: 1.5rem; font-weight: 700; color: var(--error);" id="overdue-payables">R$ 0,00</div>
                    </div>
                </div>
            </div>

            <div class="card fade-in-up" style="animation-delay: 200ms;">
                <h2 style="margin-bottom: 1.5rem;">Ações Rápidas</h2>
                <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                    <button class="btn btn-primary" onclick="app.loadPage('sales')">
                        <span>➕</span> Nova Venda
                    </button>
                    <button class="btn btn-secondary" onclick="app.loadPage('customers')">
                        <span>👤</span> Novo Cliente
                    </button>
                    <button class="btn btn-secondary" onclick="app.loadPage('products')">
                        <span>📦</span> Novo Produto
                    </button>
                </div>
            </div>
        `;

        // Carregar dados do dashboard
        await this.fetchDashboardData();
    }

    async fetchDashboardData() {
        try {
            const response = await fetch(`${API_URL}/dashboard/`, {
                headers: authManager.getHeaders()
            });

            if (response.ok) {
                const data = await response.json();

                // Atualizar valores
                document.getElementById('monthly-sales').textContent =
                    `R$ ${data.monthly_sales.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
                document.getElementById('daily-sales').textContent =
                    `R$ ${data.daily_sales.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
                document.getElementById('total-sales').textContent = data.total_sales;
                document.getElementById('low-stock').textContent = data.low_stock_products;
                document.getElementById('overdue-receivables').textContent =
                    `R$ ${data.overdue_receivables.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
                document.getElementById('overdue-payables').textContent =
                    `R$ ${data.overdue_payables.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        }
    }

    async loadCustomers() {
        const pageContent = document.getElementById('page-content');

        pageContent.innerHTML = `
            <div class="card fade-in-up">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                    <h2>Lista de Clientes</h2>
                    <button class="btn btn-primary" onclick="app.showAddCustomerModal()">
                        <span>➕</span> Novo Cliente
                    </button>
                </div>
                
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Documento</th>
                                <th>Email</th>
                                <th>Telefone</th>
                                <th>Cidade</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody id="customers-table-body">
                            <tr>
                                <td colspan="6" style="text-align: center;">Carregando...</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        await this.fetchCustomers();
    }

    async fetchCustomers() {
        try {
            const response = await fetch(`${API_URL}/customers/`, {
                headers: authManager.getHeaders()
            });

            if (response.ok) {
                const customers = await response.json();
                const tbody = document.getElementById('customers-table-body');

                if (customers.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Nenhum cliente cadastrado</td></tr>';
                    return;
                }

                tbody.innerHTML = customers.map(customer => `
                    <tr>
                        <td>${customer.name}</td>
                        <td>${customer.document || '-'}</td>
                        <td>${customer.email || '-'}</td>
                        <td>${customer.phone || '-'}</td>
                        <td>${customer.city || '-'}</td>
                        <td><span class="badge ${customer.is_active ? 'badge-success' : 'badge-error'}">${customer.is_active ? 'Ativo' : 'Inativo'}</span></td>
                    </tr>
                `).join('');
            }
        } catch (error) {
            console.error('Error fetching customers:', error);
        }
    }

    async loadProducts() {
        const pageContent = document.getElementById('page-content');

        pageContent.innerHTML = `
            <div class="card fade-in-up">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                    <h2>Lista de Produtos</h2>
                    <button class="btn btn-primary" onclick="app.showAddProductModal()">
                        <span>➕</span> Novo Produto
                    </button>
                </div>
                
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Código</th>
                                <th>Nome</th>
                                <th>Categoria</th>
                                <th>Preço</th>
                                <th>Estoque</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody id="products-table-body">
                            <tr>
                                <td colspan="6" style="text-align: center;">Carregando...</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        await this.fetchProducts();
    }

    async fetchProducts() {
        try {
            const response = await fetch(`${API_URL}/products/`, {
                headers: authManager.getHeaders()
            });

            if (response.ok) {
                const products = await response.json();
                const tbody = document.getElementById('products-table-body');

                if (products.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Nenhum produto cadastrado</td></tr>';
                    return;
                }

                tbody.innerHTML = products.map(product => `
                    <tr>
                        <td>${product.code}</td>
                        <td>${product.name}</td>
                        <td>${product.category || '-'}</td>
                        <td>R$ ${product.sale_price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                        <td>${product.current_stock} ${product.unit}</td>
                        <td><span class="badge ${product.is_active ? 'badge-success' : 'badge-error'}">${product.is_active ? 'Ativo' : 'Inativo'}</span></td>
                    </tr>
                `).join('');
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }

    async loadSales() {
        const pageContent = document.getElementById('page-content');

        pageContent.innerHTML = `
            <div class="card fade-in-up">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                    <h2>Lista de Vendas</h2>
                    <button class="btn btn-primary" onclick="app.showAddSaleModal()">
                        <span>➕</span> Nova Venda
                    </button>
                </div>
                
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Número</th>
                                <th>Data</th>
                                <th>Cliente</th>
                                <th>Total</th>
                                <th>Status</th>
                                <th>Pagamento</th>
                            </tr>
                        </thead>
                        <tbody id="sales-table-body">
                            <tr>
                                <td colspan="6" style="text-align: center;">Carregando...</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        await this.fetchSales();
    }

    async fetchSales() {
        try {
            const response = await fetch(`${API_URL}/sales/`, {
                headers: authManager.getHeaders()
            });

            if (response.ok) {
                const sales = await response.json();
                const tbody = document.getElementById('sales-table-body');

                if (sales.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Nenhuma venda registrada</td></tr>';
                    return;
                }

                tbody.innerHTML = sales.map(sale => `
                    <tr>
                        <td>${sale.sale_number}</td>
                        <td>${new Date(sale.sale_date).toLocaleDateString('pt-BR')}</td>
                        <td>Cliente #${sale.customer_id}</td>
                        <td>R$ ${sale.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                        <td><span class="badge badge-info">${sale.status}</span></td>
                        <td><span class="badge ${sale.payment_status === 'paid' ? 'badge-success' : 'badge-warning'}">${sale.payment_status}</span></td>
                    </tr>
                `).join('');
            }
        } catch (error) {
            console.error('Error fetching sales:', error);
        }
    }

    showAddCustomerModal() {
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.id = 'add-customer-modal';

        modal.innerHTML = `
            <div class="modal-content">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                    <h2>Novo Cliente</h2>
                    <button class="btn btn-secondary" onclick="document.getElementById('add-customer-modal').remove()" style="padding: 0.5rem 1rem;">✕</button>
                </div>
                
                <form id="customer-form">
                    <div class="form-group">
                        <label class="form-label" for="customer-name">Nome *</label>
                        <input type="text" id="customer-name" class="form-input" required>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                        <div class="form-group">
                            <label class="form-label" for="customer-document">CPF/CNPJ</label>
                            <input type="text" id="customer-document" class="form-input">
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label" for="customer-email">Email</label>
                            <input type="email" id="customer-email" class="form-input">
                        </div>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                        <div class="form-group">
                            <label class="form-label" for="customer-phone">Telefone</label>
                            <input type="tel" id="customer-phone" class="form-input">
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label" for="customer-mobile">Celular</label>
                            <input type="tel" id="customer-mobile" class="form-input">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label" for="customer-address">Endereço</label>
                        <input type="text" id="customer-address" class="form-input">
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 1rem;">
                        <div class="form-group">
                            <label class="form-label" for="customer-city">Cidade</label>
                            <input type="text" id="customer-city" class="form-input">
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label" for="customer-state">Estado</label>
                            <input type="text" id="customer-state" class="form-input" maxlength="2">
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label" for="customer-zip">CEP</label>
                            <input type="text" id="customer-zip" class="form-input">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label" for="customer-type">Tipo de Cliente</label>
                        <select id="customer-type" class="form-input">
                            <option value="retail">Varejo</option>
                            <option value="wholesale">Atacado</option>
                            <option value="vip">VIP</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label" for="customer-notes">Observações</label>
                        <textarea id="customer-notes" class="form-input" rows="3"></textarea>
                    </div>
                    
                    <div style="display: flex; gap: 1rem; margin-top: 2rem;">
                        <button type="submit" class="btn btn-primary" style="flex: 1;">
                            <span>💾</span> Salvar Cliente
                        </button>
                        <button type="button" class="btn btn-secondary" onclick="document.getElementById('add-customer-modal').remove()">
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(modal);

        // Handle form submission
        document.getElementById('customer-form').addEventListener('submit', async (e) => {
            e.preventDefault();

            const customerData = {
                name: document.getElementById('customer-name').value,
                document: document.getElementById('customer-document').value || null,
                email: document.getElementById('customer-email').value || null,
                phone: document.getElementById('customer-phone').value || null,
                mobile: document.getElementById('customer-mobile').value || null,
                address: document.getElementById('customer-address').value || null,
                city: document.getElementById('customer-city').value || null,
                state: document.getElementById('customer-state').value || null,
                zip_code: document.getElementById('customer-zip').value || null,
                customer_type: document.getElementById('customer-type').value,
                notes: document.getElementById('customer-notes').value || null
            };

            try {
                const response = await fetch(`${API_URL}/customers/`, {
                    method: 'POST',
                    headers: authManager.getHeaders(),
                    body: JSON.stringify(customerData)
                });

                if (response.ok) {
                    modal.remove();
                    this.loadCustomers(); // Reload customer list
                    alert('✅ Cliente cadastrado com sucesso!');
                } else {
                    const error = await response.json();
                    alert('❌ Erro ao cadastrar cliente: ' + (error.detail || 'Erro desconhecido'));
                }
            } catch (error) {
                console.error('Error creating customer:', error);
                alert('❌ Erro ao cadastrar cliente. Verifique a conexão com o servidor.');
            }
        });
    }

    showAddProductModal() {
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.id = 'add-product-modal';

        modal.innerHTML = `
            <div class="modal-content">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                    <h2>Novo Produto</h2>
                    <button class="btn btn-secondary" onclick="document.getElementById('add-product-modal').remove()" style="padding: 0.5rem 1rem;">✕</button>
                </div>
                
                <form id="product-form">
                    <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 1rem;">
                        <div class="form-group">
                            <label class="form-label" for="product-code">Código *</label>
                            <input type="text" id="product-code" class="form-input" required>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label" for="product-name">Nome *</label>
                            <input type="text" id="product-name" class="form-input" required>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label" for="product-description">Descrição</label>
                        <textarea id="product-description" class="form-input" rows="2"></textarea>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                        <div class="form-group">
                            <label class="form-label" for="product-category">Categoria</label>
                            <input type="text" id="product-category" class="form-input">
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label" for="product-unit">Unidade</label>
                            <select id="product-unit" class="form-input">
                                <option value="UN">Unidade (UN)</option>
                                <option value="KG">Quilograma (KG)</option>
                                <option value="L">Litro (L)</option>
                                <option value="M">Metro (M)</option>
                                <option value="CX">Caixa (CX)</option>
                            </select>
                        </div>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem;">
                        <div class="form-group">
                            <label class="form-label" for="product-cost">Preço de Custo</label>
                            <input type="number" id="product-cost" class="form-input" step="0.01" min="0" value="0">
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label" for="product-price">Preço de Venda *</label>
                            <input type="number" id="product-price" class="form-input" step="0.01" min="0" required>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label" for="product-wholesale">Preço Atacado</label>
                            <input type="number" id="product-wholesale" class="form-input" step="0.01" min="0">
                        </div>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem;">
                        <div class="form-group">
                            <label class="form-label" for="product-stock">Estoque Inicial</label>
                            <input type="number" id="product-stock" class="form-input" step="0.01" min="0" value="0">
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label" for="product-min-stock">Estoque Mínimo</label>
                            <input type="number" id="product-min-stock" class="form-input" step="0.01" min="0" value="0">
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label" for="product-barcode">Código de Barras</label>
                            <input type="text" id="product-barcode" class="form-input">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label" for="product-location">Localização no Estoque</label>
                        <input type="text" id="product-location" class="form-input" placeholder="Ex: Prateleira A3">
                    </div>
                    
                    <div style="display: flex; gap: 1rem; margin-top: 2rem;">
                        <button type="submit" class="btn btn-primary" style="flex: 1;">
                            <span>💾</span> Salvar Produto
                        </button>
                        <button type="button" class="btn btn-secondary" onclick="document.getElementById('add-product-modal').remove()">
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(modal);

        // Handle form submission
        document.getElementById('product-form').addEventListener('submit', async (e) => {
            e.preventDefault();

            const productData = {
                code: document.getElementById('product-code').value,
                name: document.getElementById('product-name').value,
                description: document.getElementById('product-description').value || null,
                category: document.getElementById('product-category').value || null,
                unit: document.getElementById('product-unit').value,
                cost_price: parseFloat(document.getElementById('product-cost').value) || 0,
                sale_price: parseFloat(document.getElementById('product-price').value),
                wholesale_price: parseFloat(document.getElementById('product-wholesale').value) || null,
                current_stock: parseFloat(document.getElementById('product-stock').value) || 0,
                minimum_stock: parseFloat(document.getElementById('product-min-stock').value) || 0,
                barcode: document.getElementById('product-barcode').value || null,
                location: document.getElementById('product-location').value || null
            };

            try {
                const response = await fetch(`${API_URL}/products/`, {
                    method: 'POST',
                    headers: authManager.getHeaders(),
                    body: JSON.stringify(productData)
                });

                if (response.ok) {
                    modal.remove();
                    this.loadProducts(); // Reload product list
                    alert('✅ Produto cadastrado com sucesso!');
                } else {
                    const error = await response.json();
                    alert('❌ Erro ao cadastrar produto: ' + (error.detail || 'Erro desconhecido'));
                }
            } catch (error) {
                console.error('Error creating product:', error);
                alert('❌ Erro ao cadastrar produto. Verifique a conexão com o servidor.');
            }
        });
    }

    async showAddSaleModal() {
        // Primeiro, carregar clientes e produtos
        let customers = [];
        let products = [];

        try {
            const [customersRes, productsRes] = await Promise.all([
                fetch(`${API_URL}/customers/`, { headers: authManager.getHeaders() }),
                fetch(`${API_URL}/products/`, { headers: authManager.getHeaders() })
            ]);

            // Check for authentication errors
            if (customersRes.status === 401 || productsRes.status === 401) {
                alert('⚠️ Sua sessão expirou. Por favor, faça login novamente.');
                authManager.logout();
                document.getElementById('login-modal').classList.add('active');
                return;
            }

            if (customersRes.ok) customers = await customersRes.json();
            if (productsRes.ok) products = await productsRes.json();

            if (customers.length === 0) {
                alert('⚠️ Você precisa cadastrar pelo menos um cliente antes de fazer uma venda.');
                return;
            }

            if (products.length === 0) {
                alert('⚠️ Você precisa cadastrar pelo menos um produto antes de fazer uma venda.');
                return;
            }
        } catch (error) {
            console.error('Error loading data:', error);
            alert('❌ Erro ao carregar dados. Verifique a conexão com o servidor.');
            return;
        }

        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.id = 'add-sale-modal';

        modal.innerHTML = `
            <div class="modal-content" style="max-width: 900px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                    <h2>Nova Venda</h2>
                    <button class="btn btn-secondary" onclick="document.getElementById('add-sale-modal').remove()" style="padding: 0.5rem 1rem;">✕</button>
                </div>
                
                <form id="sale-form">
                    <div class="form-group">
                        <label class="form-label" for="sale-customer">Cliente *</label>
                        <select id="sale-customer" class="form-input" required>
                            <option value="">Selecione um cliente</option>
                            ${customers.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
                        </select>
                    </div>
                    
                    <div style="background: var(--glass-bg); padding: 1.5rem; border-radius: var(--radius-md); margin-bottom: 1rem;">
                        <h3 style="margin-bottom: 1rem;">Itens da Venda</h3>
                        
                        <div style="display: grid; grid-template-columns: 2fr 1fr 1fr 1fr auto; gap: 0.5rem; margin-bottom: 1rem;">
                            <div class="form-group" style="margin-bottom: 0;">
                                <label class="form-label">Produto</label>
                                <select id="item-product" class="form-input">
                                    <option value="">Selecione</option>
                                    ${products.map(p => `<option value="${p.id}" data-price="${p.sale_price}" data-stock="${p.current_stock}">${p.name} (R$ ${p.sale_price.toFixed(2)})</option>`).join('')}
                                </select>
                            </div>
                            
                            <div class="form-group" style="margin-bottom: 0;">
                                <label class="form-label">Quantidade</label>
                                <input type="number" id="item-quantity" class="form-input" step="0.01" min="0.01" value="1">
                            </div>
                            
                            <div class="form-group" style="margin-bottom: 0;">
                                <label class="form-label">Preço Unit.</label>
                                <input type="number" id="item-price" class="form-input" step="0.01" min="0" value="0">
                            </div>
                            
                            <div class="form-group" style="margin-bottom: 0;">
                                <label class="form-label">Desconto</label>
                                <input type="number" id="item-discount" class="form-input" step="0.01" min="0" value="0">
                            </div>
                            
                            <div style="display: flex; align-items: flex-end;">
                                <button type="button" class="btn btn-primary" id="add-item-btn" style="white-space: nowrap;">
                                    ➕ Adicionar
                                </button>
                            </div>
                        </div>
                        
                        <div id="sale-items-list" style="margin-top: 1rem;">
                            <p style="text-align: center; color: var(--text-secondary);">Nenhum item adicionado</p>
                        </div>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                        <div class="form-group">
                            <label class="form-label" for="sale-payment">Forma de Pagamento *</label>
                            <select id="sale-payment" class="form-input" required>
                                <option value="cash">Dinheiro</option>
                                <option value="credit_card">Cartão de Crédito</option>
                                <option value="debit_card">Cartão de Débito</option>
                                <option value="bank_transfer">Transferência</option>
                                <option value="pix">PIX</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label" for="sale-discount">Desconto Total</label>
                            <input type="number" id="sale-discount" class="form-input" step="0.01" min="0" value="0">
                        </div>
                    </div>
                    
                    <div style="background: var(--glass-bg); padding: 1.5rem; border-radius: var(--radius-md); margin-bottom: 1rem;">
                        <div style="display: flex; justify-content: space-between; font-size: 1.25rem; font-weight: 600;">
                            <span>Total:</span>
                            <span id="sale-total" style="color: var(--primary-light);">R$ 0,00</span>
                        </div>
                    </div>
                    
                    <div style="display: flex; gap: 1rem;">
                        <button type="submit" class="btn btn-primary" style="flex: 1;">
                            <span>💰</span> Finalizar Venda
                        </button>
                        <button type="button" class="btn btn-secondary" onclick="document.getElementById('add-sale-modal').remove()">
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(modal);

        // Sale items management
        const saleItems = [];

        // Update product price when selected
        document.getElementById('item-product').addEventListener('change', (e) => {
            const option = e.target.selectedOptions[0];
            if (option.value) {
                document.getElementById('item-price').value = option.dataset.price;
            }
        });

        // Add item to sale
        document.getElementById('add-item-btn').addEventListener('click', () => {
            const productSelect = document.getElementById('item-product');
            const productId = parseInt(productSelect.value);
            const quantity = parseFloat(document.getElementById('item-quantity').value);
            const price = parseFloat(document.getElementById('item-price').value);
            const discount = parseFloat(document.getElementById('item-discount').value) || 0;

            if (!productId || quantity <= 0 || price <= 0) {
                alert('⚠️ Preencha todos os campos do item corretamente.');
                return;
            }

            const productName = productSelect.selectedOptions[0].text;
            const total = (quantity * price) - discount;

            saleItems.push({
                product_id: productId,
                quantity,
                unit_price: price,
                discount,
                total,
                name: productName
            });

            updateSaleItemsList();
            updateSaleTotal();

            // Reset form
            productSelect.value = '';
            document.getElementById('item-quantity').value = '1';
            document.getElementById('item-price').value = '0';
            document.getElementById('item-discount').value = '0';
        });

        function updateSaleItemsList() {
            const list = document.getElementById('sale-items-list');

            if (saleItems.length === 0) {
                list.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">Nenhum item adicionado</p>';
                return;
            }

            list.innerHTML = `
                <table style="width: 100%;">
                    <thead>
                        <tr>
                            <th style="text-align: left;">Produto</th>
                            <th style="text-align: right;">Qtd</th>
                            <th style="text-align: right;">Preço</th>
                            <th style="text-align: right;">Desc.</th>
                            <th style="text-align: right;">Total</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        ${saleItems.map((item, index) => `
                            <tr>
                                <td>${item.name}</td>
                                <td style="text-align: right;">${item.quantity}</td>
                                <td style="text-align: right;">R$ ${item.unit_price.toFixed(2)}</td>
                                <td style="text-align: right;">R$ ${item.discount.toFixed(2)}</td>
                                <td style="text-align: right; font-weight: 600;">R$ ${item.total.toFixed(2)}</td>
                                <td style="text-align: right;">
                                    <button type="button" class="btn btn-secondary" onclick="this.closest('tr').remove(); app.removeSaleItem(${index})" style="padding: 0.25rem 0.5rem;">🗑️</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        }

        function updateSaleTotal() {
            const itemsTotal = saleItems.reduce((sum, item) => sum + item.total, 0);
            const discount = parseFloat(document.getElementById('sale-discount').value) || 0;
            const total = itemsTotal - discount;

            document.getElementById('sale-total').textContent = `R$ ${total.toFixed(2)}`;
        }

        // Update total when discount changes
        document.getElementById('sale-discount').addEventListener('input', updateSaleTotal);

        // Make removeSaleItem available globally
        window.app.removeSaleItem = (index) => {
            saleItems.splice(index, 1);
            updateSaleItemsList();
            updateSaleTotal();
        };

        // Handle form submission
        document.getElementById('sale-form').addEventListener('submit', async (e) => {
            e.preventDefault();

            if (saleItems.length === 0) {
                alert('⚠️ Adicione pelo menos um item à venda.');
                return;
            }

            const customerId = parseInt(document.getElementById('sale-customer').value);
            const paymentMethod = document.getElementById('sale-payment').value;
            const discount = parseFloat(document.getElementById('sale-discount').value) || 0;

            const saleData = {
                customer_id: customerId,
                items: saleItems.map(item => ({
                    product_id: item.product_id,
                    quantity: item.quantity,
                    unit_price: item.unit_price,
                    discount: item.discount
                })),
                discount,
                tax: 0,
                payment_method: paymentMethod
            };

            try {
                const response = await fetch(`${API_URL}/sales/`, {
                    method: 'POST',
                    headers: authManager.getHeaders(),
                    body: JSON.stringify(saleData)
                });

                if (response.ok) {
                    const sale = await response.json();
                    modal.remove();
                    this.loadSales(); // Reload sales list
                    alert(`✅ Venda ${sale.sale_number} cadastrada com sucesso!\nTotal: R$ ${sale.total.toFixed(2)}`);
                } else {
                    const error = await response.json();
                    alert('❌ Erro ao cadastrar venda: ' + (error.detail || 'Erro desconhecido'));
                }
            } catch (error) {
                console.error('Error creating sale:', error);
                alert('❌ Erro ao cadastrar venda. Verifique a conexão com o servidor.');
            }
        });
    }
}

// Inicializar aplicação
let app;
window.addEventListener('DOMContentLoaded', () => {
    app = new ERPApp();

    // Expor função loadDashboard globalmente
    window.loadDashboard = () => app.loadDashboard();
});
