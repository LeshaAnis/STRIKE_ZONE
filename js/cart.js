class Cart {
    constructor() {
        this.items = this.loadCart();
        this.init();
    }
    
    init() {
        this.updateCartCount();
        this.initAddToCartButtons();
        this.renderCartPage();
    }
    
    loadCart() {
        try {
            return JSON.parse(localStorage.getItem('cart')) || [];
        } catch {
            return [];
        }
    }
    
    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.items));
        this.updateCartCount();
    }
    
    updateCartCount() {
        const countElements = document.querySelectorAll('#cartCount');
        const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
        
        countElements.forEach(el => {
            el.textContent = totalItems;
        });
    }
    
    addItem(product) {
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += product.quantity || 1;
        } else {
            this.items.push({
                id: product.id,
                title: product.title,
                price: product.price,
                quantity: product.quantity || 1
            });
        }
        
        this.saveCart();
        this.showNotification('Товар добавлен в корзину');
    }
    
    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
        this.renderCartPage();
    }
    
    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        
        if (item) {
            item.quantity = Math.max(1, Math.min(10, quantity));
            this.saveCart();
            this.renderCartPage();
        }
    }
    
    clearCart() {
        this.items = [];
        this.saveCart();
        this.renderCartPage();
    }
    
    getTotal() {
        return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }
    
    initAddToCartButtons() {
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('[data-product-id]');
            if (!btn) return;
            
            e.preventDefault();
            
            const productCard = btn.closest('.product-card');
            if (!productCard) return;
            
            const product = {
                id: btn.dataset.productId,
                title: productCard.querySelector('.product-card__title')?.textContent || 'Товар',
                price: this.extractPrice(productCard.querySelector('.product-card__current')?.textContent || '0'),
                quantity: 1
            };
            
            this.addItem(product);
        });
        
        const addToCartBtn = document.getElementById('addToCart');
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', () => {
                const qtyInput = document.getElementById('productQty');
                const quantity = parseInt(qtyInput?.value || 1);
                
                const product = {
                    id: Date.now().toString(),
                    title: document.querySelector('.product__title')?.textContent || 'Товар',
                    price: this.extractPrice(document.querySelector('.product__price')?.textContent || '0'),
                    quantity: quantity
                };
                
                this.addItem(product);
            });
        }
    }
    
    extractPrice(priceText) {
        return parseInt(priceText.replace(/[^\d]/g, '')) || 0;
    }
    
    formatPrice(price) {
        return price.toLocaleString('ru-RU') + ' ₽';
    }
    
    renderCartPage() {
        const cartEmpty = document.getElementById('cartEmpty');
        const cartContent = document.getElementById('cartContent');
        const cartItems = document.getElementById('cartItems');
        
        if (!cartItems) return;
        
        if (this.items.length === 0) {
            if (cartEmpty) cartEmpty.style.display = 'block';
            if (cartContent) cartContent.style.display = 'none';
            return;
        }
        
        if (cartEmpty) cartEmpty.style.display = 'none';
        if (cartContent) cartContent.style.display = 'grid';
        
        cartItems.innerHTML = this.items.map(item => `
            <tr>
                <td data-label="Товар">
                    <div class="cart-item">
                        <div class="cart-item__image">
                            <div>${item.title.substring(0, 3)}</div>
                        </div>
                        <div class="cart-item__details">
                            <div class="cart-item__title">${item.title}</div>
                        </div>
                    </div>
                </td>
                <td data-label="Цена">${this.formatPrice(item.price)}</td>
                <td data-label="Количество">
                    <div class="quantity-selector">
                        <button class="quantity-selector__btn" onclick="cart.updateQuantity('${item.id}', ${item.quantity - 1})">−</button>
                        <input type="number" class="quantity-selector__input" value="${item.quantity}" min="1" max="10" readonly>
                        <button class="quantity-selector__btn" onclick="cart.updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                    </div>
                </td>
                <td data-label="Сумма">${this.formatPrice(item.price * item.quantity)}</td>
                <td>
                    <button class="cart-item__remove" onclick="cart.removeItem('${item.id}')" aria-label="Удалить">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        </svg>
                    </button>
                </td>
            </tr>
        `).join('');
        
        const subtotal = this.getTotal();
        const discount = 0;
        const total = subtotal - discount;
        
        document.getElementById('subtotal').textContent = this.formatPrice(subtotal);
        document.getElementById('discount').textContent = this.formatPrice(discount);
        document.getElementById('total').textContent = this.formatPrice(total);
    }
    
    showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background-color: #198754;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }
}

const cart = new Cart();
