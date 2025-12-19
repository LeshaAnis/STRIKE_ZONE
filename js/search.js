// search.js - Обработка поиска на странице каталога

class SearchHandler {
    constructor() {
        this.init();
    }
    
    init() {
        // Проверяем, есть ли параметр поиска в URL
        this.checkUrlForSearch();
        
        // Инициализируем кнопку очистки поиска
        this.initClearSearchButton();
    }
    
    checkUrlForSearch() {
        const urlParams = new URLSearchParams(window.location.search);
        const searchQuery = urlParams.get('search');
        
        if (searchQuery) {
            console.log('Найден поисковый запрос в URL:', searchQuery);
            
            // Заполняем поле поиска если оно есть
            const searchInput = document.querySelector('.search-form__input');
            if (searchInput) {
                searchInput.value = decodeURIComponent(searchQuery);
            }
            
            // Выполняем поиск
            this.performSearch(decodeURIComponent(searchQuery));
        }
    }
    
    performSearch(query) {
        const searchTerm = query.toLowerCase();
        const productCards = document.querySelectorAll('.product-card');
        let foundCount = 0;
        
        productCards.forEach(card => {
            const title = card.querySelector('.product-card__title').textContent.toLowerCase();
            
            // Добавляем data-атрибут с описанием для улучшения поиска
            if (!card.hasAttribute('data-description')) {
                const description = this.generateDescription(card);
                card.setAttribute('data-description', description.toLowerCase());
            }
            
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
        
        // Показываем кнопку очистки поиска
        this.showClearSearchButton(query);
    }
    
    generateDescription(card) {
        // Генерируем описание на основе типа товара
        const title = card.querySelector('.product-card__title').textContent;
        let description = '';
        
        if (title.includes('AK')) description = 'автомат калашников страйкбольный';
        else if (title.includes('M4')) description = 'автомат m4 страйкбольный';
        else if (title.includes('Glock')) description = 'пистолет glock страйкбольный';
        else if (title.includes('1911')) description = 'пистолет 1911 страйкбольный';
        else if (title.includes('MP5')) description = 'пистолет-пулемёт mp5 страйкбольный';
        else if (title.includes('VSR')) description = 'снайперская винтовка vsr страйкбольная';
        else if (title.includes('P90')) description = 'пистолет-пулемёт p90 страйкбольный';
        
        return description;
    }
    
    highlightText(card, searchTerm) {
        const titleElement = card.querySelector('.product-card__title');
        const originalText = titleElement.textContent;
        const regex = new RegExp(`(${this.escapeRegExp(searchTerm)})`, 'gi');
        const highlighted = originalText.replace(regex, '<mark class="search-highlight">$1</mark>');
        titleElement.innerHTML = highlighted;
    }
    
    escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    
    updateSearchResultsCount(count, query) {
        const countElement = document.querySelector('.catalog__count');
        const titleElement = document.querySelector('.catalog__title');
        
        if (countElement && titleElement) {
            countElement.textContent = `(${count} товаров по запросу "${query}")`;
        }
    }
    
    showNoResultsMessage(query) {
        const productsGrid = document.querySelector('.products-grid');
        if (productsGrid) {
            // Проверяем, нет ли уже сообщения
            if (document.querySelector('.no-results')) return;
            
            const noResults = document.createElement('div');
            noResults.className = 'no-results';
            noResults.style.cssText = `
                grid-column: 1 / -1;
                text-align: center;
                padding: 40px 20px;
            `;
            
            noResults.innerHTML = `
                <div style="font-size: 64px; margin-bottom: 20px;">🔍</div>
                <h3 style="margin-bottom: 10px; color: #333;">По запросу "${query}" ничего не найдено</h3>
                <p style="color: #666; margin-bottom: 20px;">Попробуйте изменить поисковый запрос или сбросить фильтры</p>
                <button class="btn btn--primary" id="clearSearchBtn">Очистить поиск</button>
            `;
            
            productsGrid.parentNode.insertBefore(noResults, productsGrid.nextSibling);
        }
    }
    
    showClearSearchButton(query) {
        const catalogHeader = document.querySelector('.catalog__header');
        if (catalogHeader && !document.querySelector('#clearSearchBtn')) {
            const clearBtn = document.createElement('button');
            clearBtn.id = 'clearSearchBtn';
            clearBtn.className = 'btn btn--secondary';
            clearBtn.textContent = `Очистить поиск "${query}"`;
            clearBtn.style.marginLeft = '10px';
            
            catalogHeader.appendChild(clearBtn);
            
            clearBtn.addEventListener('click', () => {
                this.clearSearch();
            });
        }
    }
    
    initClearSearchButton() {
        document.addEventListener('click', (e) => {
            if (e.target.id === 'clearSearchBtn' || e.target.closest('#clearSearchBtn')) {
                this.clearSearch();
            }
        });
    }
    
    clearSearch() {
        // Показываем все товары
        const productCards = document.querySelectorAll('.product-card');
        productCards.forEach(card => {
            card.style.display = 'block';
            // Убираем подсветку
            const titleElement = card.querySelector('.product-card__title');
            if (titleElement.innerHTML.includes('<mark>')) {
                const temp = document.createElement('div');
                temp.innerHTML = titleElement.innerHTML;
                titleElement.textContent = temp.textContent;
            }
        });
        
        // Восстанавливаем оригинальный счетчик
        const countElement = document.querySelector('.catalog__count');
        if (countElement) {
            const totalProducts = document.querySelectorAll('.product-card').length;
            countElement.textContent = `(${totalProducts} товаров)`;
        }
        
        // Удаляем кнопку очистки поиска
        const clearBtn = document.getElementById('clearSearchBtn');
        if (clearBtn) clearBtn.remove();
        
        // Удаляем сообщение "ничего не найдено"
        const noResults = document.querySelector('.no-results');
        if (noResults) noResults.remove();
        
        // Очищаем поле поиска
        const searchInput = document.querySelector('.search-form__input');
        if (searchInput) searchInput.value = '';
        
        // Очищаем параметр поиска из URL
        const url = new URL(window.location);
        url.searchParams.delete('search');
        window.history.replaceState({}, '', url);
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('catalog.html')) {
        new SearchHandler();
    }
});