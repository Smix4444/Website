document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (!id) return window.location.href = 'products.html';

    try {
        const response = await fetch(`/api/products/${id}`);
        if (!response.ok) throw new Error('Product not found');
        const product = await response.json();

        document.title = `${product.name} | VOIDFORM`;
        document.getElementById('product-img').src = product.image;
        document.getElementById('product-img').alt = product.name;
        document.getElementById('product-name').innerText = product.name;
        document.getElementById('product-name').dataset.text = product.name;
        document.getElementById('product-desc').innerText = product.description;
        document.getElementById('product-details').innerText = product.details;
        document.getElementById('product-price').innerText = `${(product.price / 100).toFixed(2)} EUR`;
        document.getElementById('product-category').innerText = product.category;

        document.getElementById('add-to-cart-btn').onclick = () => App.addToCart(product);

        // Trigger scroll reveals after content loads
        setTimeout(() => App.initScrollReveal(), 100);
    } catch (err) {
        console.error(err);
        window.location.href = 'products.html';
    }
});
