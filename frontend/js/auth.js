// Configuração da API
const API_URL = 'http://localhost:8000/api';

// Gerenciamento de autenticação
class AuthManager {
    constructor() {
        this.token = localStorage.getItem('token');
        this.user = JSON.parse(localStorage.getItem('user') || 'null');
    }

    isAuthenticated() {
        return !!this.token;
    }

    async login(username, password) {
        try {
            const formData = new FormData();
            formData.append('username', username);
            formData.append('password', password);

            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const data = await response.json();
            this.token = data.access_token;
            localStorage.setItem('token', this.token);

            // Buscar dados do usuário
            await this.fetchUserData();

            return true;
        } catch (error) {
            console.error('Login error:', error);
            return false;
        }
    }

    async fetchUserData() {
        try {
            const response = await fetch(`${API_URL}/auth/me`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });

            if (response.ok) {
                this.user = await response.json();
                localStorage.setItem('user', JSON.stringify(this.user));
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    }

    logout() {
        this.token = null;
        this.user = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }

    getHeaders() {
        return {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json'
        };
    }
}

// Instância global do AuthManager
const authManager = new AuthManager();

// Login form handler
document.addEventListener('DOMContentLoaded', () => {
    const loginModal = document.getElementById('login-modal');
    const loginForm = document.getElementById('login-form');
    const logoutBtn = document.getElementById('logout-btn');

    // Mostrar modal de login se não estiver autenticado
    if (!authManager.isAuthenticated()) {
        loginModal.classList.add('active');
    }

    // Handle login
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        const success = await authManager.login(username, password);
        
        if (success) {
            loginModal.classList.remove('active');
            // Atualizar UI com dados do usuário
            updateUserUI();
            // Carregar dashboard
            if (window.loadDashboard) {
                window.loadDashboard();
            }
        } else {
            alert('Login falhou. Verifique suas credenciais.');
        }
    });

    // Handle logout
    logoutBtn.addEventListener('click', () => {
        authManager.logout();
        loginModal.classList.add('active');
        loginForm.reset();
    });

    // Atualizar UI com dados do usuário
    function updateUserUI() {
        if (authManager.user) {
            const userAvatar = document.getElementById('user-avatar');
            userAvatar.textContent = authManager.user.full_name.charAt(0).toUpperCase();
            userAvatar.title = authManager.user.full_name;
        }
    }

    // Atualizar UI se já estiver autenticado
    if (authManager.isAuthenticated()) {
        updateUserUI();
    }
});
