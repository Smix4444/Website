// VOIDFORM — Shared Logic & Cart State
const App = {
    cart: JSON.parse(localStorage.getItem('void_cart')) || [],

    init() {
        this.updateCartCount();
        this.initNav();
        this.initScrollReveal();
        this.initMarquee();
        this.initParallax();
    },

    /* ── Cart ── */
    addToCart(product) {
        const existing = this.cart.find(item => item.id === product.id);
        if (existing) {
            existing.quantity += 1;
        } else {
            this.cart.push({ ...product, quantity: 1 });
        }
        this.saveCart();
        this.updateCartCount();

        // Flash cart count
        const cartEl = document.getElementById('cart-count');
        if (cartEl) {
            cartEl.style.color = '#F0EDE8';
            setTimeout(() => cartEl.style.color = '', 500);
        }
    },

    saveCart() {
        localStorage.setItem('void_cart', JSON.stringify(this.cart));
    },

    updateCartCount() {
        const count = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        const cartEl = document.getElementById('cart-count');
        if (cartEl) cartEl.innerText = `Cart (${count})`;
    },

    /* ── Nav scroll behavior ── */
    initNav() {
        const nav = document.querySelector('nav');
        if (!nav) return;
        window.addEventListener('scroll', () => {
            nav.classList.toggle('scrolled', window.scrollY > 50);
        });
    },

    /* ── Scroll reveal (Intersection Observer) ── */
    initScrollReveal() {
        const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
        if (!revealElements.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -60px 0px'
        });

        revealElements.forEach(el => observer.observe(el));
    },

    /* ── Marquee duplication ── */
    initMarquee() {
        document.querySelectorAll('.marquee-inner').forEach(inner => {
            // Duplicate content for seamless loop
            inner.innerHTML += inner.innerHTML;
        });
    },

    /* ── Parallax on scroll ── */
    initParallax() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        if (!parallaxElements.length) return;

        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            parallaxElements.forEach(el => {
                const speed = parseFloat(el.dataset.parallax) || 0.5;
                const rect = el.getBoundingClientRect();
                const offset = (rect.top + scrollY - window.innerHeight / 2) * speed;
                el.style.transform = `translateX(${offset * 0.1}px)`;
            });
        });
    },

    /* ── Sanitize for display ── */
    escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
};

document.addEventListener('DOMContentLoaded', () => App.init());
window.App = App;
