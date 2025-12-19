class Navigation {
    constructor() {
        this.header = document.getElementById('header');
        this.burgerBtn = document.getElementById('burgerBtn');
        this.catalogBtn = document.getElementById('catalogBtn');
        this.megaMenu = document.getElementById('megaMenu');
        this.searchBtn = document.getElementById('searchBtn');
        this.searchModal = document.getElementById('searchModal');
        this.searchClose = document.getElementById('searchClose');
        
        this.init();
    }
    
    init() {
        this.initBurgerMenu();
        this.initCatalogMenu();
        this.initSearchModal();
        this.initStickyHeader();
    }
    
    initBurgerMenu() {
        if (!this.burgerBtn) return;
        
        this.burgerBtn.addEventListener('click', () => {
            this.burgerBtn.classList.toggle('burger--active');
        });
    }
    
    initCatalogMenu() {
        if (!this.catalogBtn || !this.megaMenu) return;
        
        this.catalogBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.megaMenu.classList.toggle('mega-menu--active');
        });
        
        document.addEventListener('click', (e) => {
            if (!this.megaMenu.contains(e.target) && e.target !== this.catalogBtn) {
                this.megaMenu.classList.remove('mega-menu--active');
            }
        });
    }
    
    initSearchModal() {
    if (!this.searchBtn || !this.searchModal) return;
    
    this.searchBtn.addEventListener('click', () => {
        this.searchModal.classList.add('search-modal--active');
        const input = this.searchModal.querySelector('.search-form__input');
        if (input) input.focus();
    });
    
    if (this.searchClose) {
        this.searchClose.addEventListener('click', () => {
            this.searchModal.classList.remove('search-modal--active');
        });
    }
    
    const overlay = this.searchModal.querySelector('.search-modal__overlay');
    if (overlay) {
        overlay.addEventListener('click', () => {
            this.searchModal.classList.remove('search-modal--active');
        });
    }
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.searchModal.classList.contains('search-modal--active')) {
            this.searchModal.classList.remove('search-modal--active');
        }
    });
    
    // === ДОБАВИТЬ ЭТОТ КОД ДЛЯ ПОИСКА ===
    const searchForm = this.searchModal.querySelector('.search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = searchForm.querySelector('.search-form__input');
            const query = input.value.trim();
            
            if (query) {
                console.log('Выполняем поиск по запросу:', query);
                
                // Закрываем модальное окно
                this.searchModal.classList.remove('search-modal--active');
                
                // Показываем уведомление о поиске
                this.showSearchNotification(query);
                
                // Если мы уже на странице каталога, выполняем поиск сразу
                if (window.location.pathname.includes('catalog.html')) {
                    this.performSearch(query);
                } else {
                    // Иначе перенаправляем на каталог с параметром поиска
                    setTimeout(() => {
                        window.location.href = `catalog.html?search=${encodeURIComponent(query)}`;
                    }, 500);
                }
                
                // Очищаем поле ввода
                input.value = '';
            }
        });
    }
}

performSearch(query) {
    const searchTerm = query.toLowerCase();
    const productCards = document.querySelectorAll('.product-card');
    let foundCount = 0;
    
    productCards.forEach(card => {
        const title = card.querySelector('.product-card__title').textContent.toLowerCase();
        const description = card.getAttribute('data-description') || '';
        
        if (title.includes(searchTerm) || description.includes(searchTerm)) {
            card.style.display = 'block';
            foundCount++;
            
            // Подсветка найденного текста
            this.highlightText(card, searchTerm);
        } else {
            card.style.display = 'none';
        }
    });
    
    // Обновляем счетчик
    this.updateSearchResultsCount(foundCount, query);
    
    if (foundCount === 0) {
        this.showNoResultsMessage(query);
    }
}

// Метод для подсветки текста
highlightText(card, searchTerm) {
    const titleElement = card.querySelector('.product-card__title');
    const originalText = titleElement.textContent;
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const highlighted = originalText.replace(regex, '<mark>$1</mark>');
    titleElement.innerHTML = highlighted;
}

// Обновление счетчика результатов
updateSearchResultsCount(count, query) {
    const countElement = document.querySelector('.catalog__count');
    const titleElement = document.querySelector('.catalog__title');
    
    if (countElement && titleElement) {
        countElement.textContent = `(${count} товаров по запросу "${query}")`;
    }
}

// Сообщение если ничего не найдено
showNoResultsMessage(query) {
    const productsGrid = document.querySelector('.products-grid');
    if (productsGrid) {
        const noResults = document.createElement('div');
        noResults.className = 'no-results';
        noResults.style.cssText = `
            grid-column: 1 / -1;
            text-align: center;
            padding: 40px 20px;
        `;
        
        noResults.innerHTML = `
            <div style="font-size: 64px; margin-bottom: 20px;">🔍</div>
            <h3 style="margin-bottom: 10px;">По запросу "${query}" ничего не найдено</h3>
            <p style="color: #666; margin-bottom: 20px;">Попробуйте изменить поисковый запрос</p>
            <button class="btn btn--primary" id="clearSearch">Очистить поиск</button>
        `;
        
        productsGrid.parentNode.insertBefore(noResults, productsGrid.nextSibling);
        
        // Обработчик кнопки очистки поиска
        document.getElementById('clearSearch').addEventListener('click', () => {
            this.clearSearch();
            noResults.remove();
        });
    }
}

// Очистка поиска
clearSearch() {
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.style.display = 'block';
        // Убираем подсветку
        const titleElement = card.querySelector('.product-card__title');
        if (titleElement.innerHTML.includes('<mark>')) {
            titleElement.innerHTML = titleElement.textContent;
        }
    });
    
    // Восстанавливаем оригинальный счетчик
    const countElement = document.querySelector('.catalog__count');
    if (countElement) {
        const totalProducts = document.querySelectorAll('.product-card').length;
        countElement.textContent = `(${totalProducts} товаров)`;
    }
    
    // Очищаем параметр поиска из URL
    const url = new URL(window.location);
    url.searchParams.delete('search');
    window.history.replaceState({}, '', url);
}

// === ДОБАВИТЬ ЭТОТ НОВЫЙ МЕТОД ===
showSearchNotification(query) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 8px 30px rgba(102, 126, 234, 0.3);
        z-index: 9999;
        font-size: 16px;
        display: flex;
        align-items: center;
        gap: 10px;
        animation: slideInRight 0.3s ease;
        max-width: 400px;
    `;
    
    notification.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="M21 21l-4.35-4.35"></path>
        </svg>
        <span>Ищем: <strong>${query}</strong></span>
    `;
    
    document.body.appendChild(notification);
    
    // Автоматическое скрытие через 3 секунды
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}
    
    initStickyHeader() {
        if (!this.header) return;
        
        let lastScroll = 0;
        
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 100) {
                this.header.classList.add('header--scrolled');
            } else {
                this.header.classList.remove('header--scrolled');
            }
            
            lastScroll = currentScroll;
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Navigation();
});
