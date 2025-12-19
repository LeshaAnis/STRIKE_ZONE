
document.addEventListener('DOMContentLoaded', function() {
    console.log('STRIKE ZONE - магазин страйкбольного оружия');
    
    initMobileMenu();
    initCartCounter();
    initTooltips();
});

function initMobileMenu() {
    const burgerBtn = document.getElementById('burgerBtn');
    if (burgerBtn) {
        burgerBtn.addEventListener('click', function() {
            document.body.classList.toggle('menu-open');
        });
    }
}

function initCartCounter() {

    const cartCount = localStorage.getItem('cartCount');
    if (cartCount) {
        const countElements = document.querySelectorAll('#cartCount');
        countElements.forEach(el => {
            el.textContent = cartCount;
        });
    }
}

function initTooltips() {
    const tooltips = document.querySelectorAll('[title]');
    tooltips.forEach(tooltip => {
        tooltip.addEventListener('mouseenter', showTooltip);
        tooltip.addEventListener('mouseleave', hideTooltip);
    });
}

function showTooltip(e) {

}

function hideTooltip(e) {

}

function formatPrice(price) {
    return new Intl.NumberFormat('ru-RU').format(price) + ' ₽';
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        formatPrice,
        initMobileMenu
    };
}