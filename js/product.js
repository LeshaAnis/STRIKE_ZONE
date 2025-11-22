class ProductPage {
    constructor() {
        this.init();
    }
    
    init() {
        this.initGallery();
        this.initQuantitySelector();
        this.initOptions();
    }
    
    initGallery() {
        const thumbnails = document.querySelectorAll('.product__thumbnail');
        const mainImage = document.querySelector('.product__main-image');
        
        thumbnails.forEach((thumb, index) => {
            thumb.addEventListener('click', () => {
                thumbnails.forEach(t => t.classList.remove('product__thumbnail--active'));
                thumb.classList.add('product__thumbnail--active');
            });
        });
    }
    
    initQuantitySelector() {
        const decreaseBtn = document.getElementById('decreaseQty');
        const increaseBtn = document.getElementById('increaseQty');
        const qtyInput = document.getElementById('productQty');
        
        if (decreaseBtn && qtyInput) {
            decreaseBtn.addEventListener('click', () => {
                const currentValue = parseInt(qtyInput.value);
                if (currentValue > 1) {
                    qtyInput.value = currentValue - 1;
                }
            });
        }
        
        if (increaseBtn && qtyInput) {
            increaseBtn.addEventListener('click', () => {
                const currentValue = parseInt(qtyInput.value);
                const maxValue = parseInt(qtyInput.max) || 10;
                if (currentValue < maxValue) {
                    qtyInput.value = currentValue + 1;
                }
            });
        }
    }
    
    initOptions() {
        const optionButtons = document.querySelectorAll('.product__option-btn');
        
        optionButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                if (btn.disabled) return;
                
                const optionGroup = btn.closest('.product__option');
                const buttons = optionGroup.querySelectorAll('.product__option-btn');
                
                buttons.forEach(b => b.classList.remove('product__option-btn--active'));
                btn.classList.add('product__option-btn--active');
            });
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ProductPage();
});
