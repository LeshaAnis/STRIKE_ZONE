// product.js

// Смена изображений при клике на миниатюры
const mainImage = document.getElementById('mainImage');
const thumbnails = document.querySelectorAll('.product__thumbnail');

if (thumbnails.length > 0) {
    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', function() {
            // Удаляем активный класс у всех миниатюр
            thumbnails.forEach(t => t.classList.remove('product__thumbnail--active'));
            
            // Добавляем активный класс текущей миниатюре
            this.classList.add('product__thumbnail--active');
            
            // Меняем главное изображение
            const imgSrc = this.querySelector('img').src;
            mainImage.src = imgSrc;
            mainImage.alt = this.querySelector('img').alt;
        });
    });
}

// Табы переключения описания/характеристик/отзывов
const tabButtons = document.querySelectorAll('.tabs__btn');
const tabPanes = document.querySelectorAll('.tabs__pane');

if (tabButtons.length > 0) {
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Убираем активные классы у всех кнопок и панелей
            tabButtons.forEach(btn => btn.classList.remove('tabs__btn--active'));
            tabPanes.forEach(pane => pane.classList.remove('tabs__pane--active'));
            
            // Добавляем активные классы
            this.classList.add('tabs__btn--active');
            document.querySelector(`.tabs__pane[data-pane="${tabId}"]`).classList.add('tabs__pane--active');
        });
    });
}

// Счетчик количества товара
const quantityInput = document.getElementById('productQty');
const minusBtn = document.querySelector('.quantity-selector__btn:first-child');
const plusBtn = document.querySelector('.quantity-selector__btn:last-child');

if (quantityInput && minusBtn && plusBtn) {
    minusBtn.addEventListener('click', function() {
        let value = parseInt(quantityInput.value);
        if (value > parseInt(quantityInput.min)) {
            quantityInput.value = value - 1;
        }
    });
    
    plusBtn.addEventListener('click', function() {
        let value = parseInt(quantityInput.value);
        if (value < parseInt(quantityInput.max)) {
            quantityInput.value = value + 1;
        }
    });
    
    quantityInput.addEventListener('change', function() {
        let value = parseInt(this.value);
        if (value < parseInt(this.min)) this.value = this.min;
        if (value > parseInt(this.max)) this.value = this.max;
    });
}

// Добавление в корзину
const addToCartBtn = document.getElementById('addToCart');
if (addToCartBtn) {
    addToCartBtn.addEventListener('click', function() {
        const productName = document.querySelector('.product__title').textContent;
        const productPrice = document.querySelector('.product__price').textContent;
        const quantity = parseInt(quantityInput.value);
        const productId = 'AK74M-001'; // В реальном проекте это должно браться из data-атрибутов
        
        // Здесь будет вызов функции добавления в корзину из cart.js
        console.log(`Добавлено в корзину: ${productName} (${quantity} шт.)`);
        
        // Показываем уведомление
        alert(`Товар "${productName}" добавлен в корзину!`);
        
        // Обновляем счетчик корзины (в реальном проекте через localStorage/API)
        updateCartCount(quantity);
    });
}

function updateCartCount(addedQuantity) {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        let currentCount = parseInt(cartCount.textContent) || 0;
        cartCount.textContent = currentCount + addedQuantity;
        cartCount.style.display = 'block';
    }
}