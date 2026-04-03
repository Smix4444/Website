document.addEventListener('DOMContentLoaded', async () => {
    const featuredGrid = document.getElementById('featured-products');
    if (!featuredGrid) return;

    try {
        const response = await fetch('/api/products');
        const products = await response.json();

        // Show first 4 featured on home
        products.slice(0, 4).forEach((product, i) => {
            const card = document.createElement('div');
            card.className = 'product-card reveal';
            card.style.transitionDelay = `${i * 0.15}s`;
            card.innerHTML = `
                <img src="${App.escapeHtml(product.image)}" alt="${App.escapeHtml(product.name)}" loading="lazy">
                <div class="product-info">
                    <div>
                        <h3>${App.escapeHtml(product.name)}</h3>
                        <p class="product-price">${(product.price / 100).toFixed(2)} EUR</p>
                    </div>
                </div>
                <p class="product-category">${App.escapeHtml(product.category)}</p>
            `;
            card.onclick = () => window.location.href = `product.html?id=${product.id}`;
            featuredGrid.appendChild(card);
        });

        // Re-init scroll reveal for new elements
        App.initScrollReveal();
    } catch (err) {
        console.error('Failed to load featured products', err);
    }
});
