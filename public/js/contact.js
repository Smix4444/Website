document.getElementById('contact-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const status = document.getElementById('form-status');
    const btn = e.target.querySelector('button');

    const data = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value
    };

    btn.disabled = true;
    btn.innerText = 'TRANSMITTING...';

    try {
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        status.style.display = 'block';
        if (response.ok) {
            status.innerText = result.message;
            e.target.reset();
        } else {
            status.innerText = `Error: ${result.error}`;
        }
    } catch (err) {
        status.style.display = 'block';
        status.innerText = 'The void is unreachable. Try again later.';
    } finally {
        btn.disabled = false;
        btn.innerText = 'TRANSMIT';
    }
});
