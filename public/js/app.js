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
    _observer: null,
    _observed: new Set(),

    initScrollReveal() {
        // Create observer once, reuse it
        if (!this._observer) {
            this._observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        this._observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.05,
                rootMargin: '0px 0px -20px 0px'
            });
        }

        // Find and observe new elements
        const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
        revealElements.forEach(el => {
            if (!this._observed.has(el)) {
                this._observed.add(el);
                this._observer.observe(el);

                // Force-reveal elements already in the viewport
                const rect = el.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    setTimeout(() => el.classList.add('visible'), 50);
                }
            }
        });
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
