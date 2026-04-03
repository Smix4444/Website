let allProducts = [];

document.addEventListener('DOMContentLoaded', async () => {
    const grid = document.getElementById('all-products');
    if (!grid) return;

    try {
        const response = await fetch('/api/products');
        allProducts = await response.json();
        renderProducts(allProducts);
        initFilters();
    } catch (err) {
        console.error('Failed to load products', err);
    }
});

function renderProducts(products) {
    const grid = document.getElementById('all-products');
    grid.innerHTML = '';

    products.forEach((product, i) => {
        const card = document.createElement('div');
        card.className = 'product-card reveal';
        card.style.transitionDelay = `${i * 0.1}s`;
        card.dataset.category = product.category;
        card.innerHTML = `
            <img src="${App.escapeHtml(product.image)}" alt="${App.escapeHtml(product.name)}" loading="lazy">
            <div class="product-info">
                <div>
                    <h3>${App.escapeHtml(product.name)}</h3>
                    <p class="product-price">${(product.price / 100).toFixed(2)} EUR</p>
                </div>
                <button class="btn add-btn" style="padding: 0.5rem 1rem; font-size: 0.6rem;" data-index="${i}">ADD</button>
            </div>
            <p class="product-category">${App.escapeHtml(product.category)}</p>
        `;
        card.onclick = (e) => {
            if (e.target.classList.contains('add-btn')) return;
            window.location.href = `product.html?id=${product.id}`;
        };
        grid.appendChild(card);
    });

    // Attach add-to-cart listeners properly
    grid.querySelectorAll('.add-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const idx = parseInt(btn.dataset.index);
            App.addToCart(products[idx]);
        });
    });

    // Re-init reveals for new elements
    App.initScrollReveal();
}

function initFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;
            if (filter === 'all') {
                renderProducts(allProducts);
            } else {
                renderProducts(allProducts.filter(p => p.category === filter));
            }
        });
    });
}
