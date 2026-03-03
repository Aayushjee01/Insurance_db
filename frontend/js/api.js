// ============================================================
// frontend/js/api.js  –  Shared API helper
// ============================================================
const BASE_URL = 'http://localhost:5000/api';

const api = {
    async request(method, path, body = null) {
        const opts = {
            method,
            headers: { 'Content-Type': 'application/json' },
        };
        if (body) opts.body = JSON.stringify(body);
        const res = await fetch(`${BASE_URL}${path}`, opts);
        const data = await res.json();
        if (!data.success) throw new Error(data.message || 'Request failed');
        return data;
    },
    get: (path) => api.request('GET', path),
    post: (path, body) => api.request('POST', path, body),
    put: (path, body) => api.request('PUT', path, body),
    patch: (path, body) => api.request('PATCH', path, body),
    delete: (path) => api.request('DELETE', path),
};

// ---- Toast notifications ----
function showToast(message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }
    const icons = { success: '✅', error: '❌', info: 'ℹ️' };
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<span>${icons[type]}</span> ${message}`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
}

// ---- Format helpers ----
const fmt = {
    currency: (n) => '₹ ' + Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2 }),
    date: (d) => d ? new Date(d).toLocaleDateString('en-IN') : '—',
    badge: (status) => {
        const map = {
            'Active': 'active', 'Expired': 'expired', 'Pending': 'pending',
            'Cash': 'cash', 'Online': 'online', 'Cheque': 'cheque', 'Card': 'card',
        };
        return `<span class="badge badge-${map[status] || ''}">${status}</span>`;
    },
};

// ---- Highlight active nav link ----
document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('.nav-links a');
    links.forEach(a => {
        if (a.href === window.location.href) a.classList.add('active');
    });
});
