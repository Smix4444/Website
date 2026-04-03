document.addEventListener('DOMContentLoaded', () => {
    const itemsContainer = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');
    const summaryEl = document.getElementById('cart-summary');

    const renderCart = () => {
        const cart = App.cart;
        if (cart.length === 0) {
            itemsContainer.innerHTML = '<div class="cart-empty">THE VOID IS EMPTY.</div>';
            summaryEl.style.display = 'none';
            return;
        }

        summaryEl.style.display = '';
        itemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-left">
                    <img src="${App.escapeHtml(item.image)}" alt="${App.escapeHtml(item.name)}">
                    <div>
                        <h3>${App.escapeHtml(item.name)}</h3>
                        <p class="cart-item-price">${(item.price / 100).toFixed(2)} EUR</p>
                    </div>
                </div>
                <div class="cart-controls">
                    <button onclick="updateQty('${item.id}', -1)">−</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQty('${item.id}', 1)">+</button>
                </div>
            </div>
        `).join('');

        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        totalEl.innerText = `TOTAL: ${(total / 100).toFixed(2)} EUR`;
    };

    window.updateQty = (id, delta) => {
        const item = App.cart.find(i => i.id === id);
        if (item) {
            item.quantity += delta;
            if (item.quantity <= 0) {
                App.cart = App.cart.filter(i => i.id !== id);
            }
            App.saveCart();
            App.updateCartCount();
            renderCart();
        }
    };

    checkoutBtn.onclick = async () => {
        checkoutBtn.innerText = 'ENTERING THE VOID...';
        checkoutBtn.disabled = true;

        try {
            const response = await fetch('/api/checkout/create-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items: App.cart })
            });
            const data = await response.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                throw new Error(data.error || 'Checkout failed');
            }
        } catch (err) {
            console.error(err);
            alert('The void remains closed. ' + err.message);
            checkoutBtn.innerText = 'PROCEED TO CHECKOUT';
            checkoutBtn.disabled = false;
        }
    };

    renderCart();
});
