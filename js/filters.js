class Filters {
    constructor() {
        this.init();
    }
    
    init() {
        console.log('🎯 Filters initialized');
        this.initAccordions();
        this.initFilterButtons();
        this.initPriceFilter();
        this.initSorting();
        this.setupProductData(); // Добавляем данные к товарам
    }
    
    initAccordions() {
        const headers = document.querySelectorAll('.filter__group-header');
        
        headers.forEach(header => {
            header.addEventListener('click', () => {
                const content = header.nextElementSibling;
                
                if (content && content.classList.contains('filter__group-content')) {
                    const isActive = content.classList.contains('filter__group-content--active');
                    
                    // Закрываем все остальные аккордеоны
                    document.querySelectorAll('.filter__group-content--active').forEach(active => {
                        if (active !== content) {
                            active.classList.remove('filter__group-content--active');
                            const prevHeader = active.previousElementSibling;
                            if (prevHeader) prevHeader.setAttribute('aria-expanded', 'false');
                        }
                    });
                    
                    // Переключаем текущий
                    content.classList.toggle('filter__group-content--active');
                    header.setAttribute('aria-expanded', !isActive);
                }
            });
        });
    }
    
    initPriceFilter() {
        const rangeInput = document.querySelector('.filter__range');
        const priceInputs = document.querySelectorAll('.filter__price-input');
        
        if (rangeInput && priceInputs.length === 2) {
            // Устанавливаем начальное значение
            priceInputs[1].value = rangeInput.value;
            
            rangeInput.addEventListener('input', (e) => {
                priceInputs[1].value = e.target.value;
            });
            
            priceInputs.forEach((input, index) => {
                input.addEventListener('change', (e) => {
                    const value = parseInt(e.target.value) || 0;
                    if (index === 1) {
                        rangeInput.value = Math.min(100000, Math.max(0, value));
                    }
                });
            });
        }
    }
    
    initFilterButtons() {
        const applyBtn = document.getElementById('applyFilters');
        const resetBtn = document.getElementById('resetFilters');
        
        if (applyBtn) {
            applyBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('✅ Apply filters clicked');
                this.applyFilters();
            });
        }
        
        if (resetBtn) {
            resetBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('🔄 Reset filters clicked');
                this.resetFilters();
            });
        }
    }
    
    // ДОБАВЛЯЕМ ДАННЫЕ К ТОВАРАМ (если их нет в HTML)
    setupProductData() {
        const productCards = document.querySelectorAll('.product-card');
        
        // Карта соответствия названий товаров и их типов/брендов
        const productMapping = {
            'AK-74M': { type: 'rifle', brand: 'lct', category: 'Автоматы' },
            'M4A1 RIS': { type: 'rifle', brand: 'gg', category: 'Автоматы' },
            'Glock 17': { type: 'pistol', brand: 'tm', category: 'Пистолеты' },
            'MP5A5': { type: 'smg', brand: 'cyma', category: 'Пистолеты-пулемёты' },
            'AK-12': { type: 'rifle', brand: 'lct', category: 'Автоматы' },
            'SIG MCX': { type: 'rifle', brand: 'vfc', category: 'Автоматы' },
            'G36C': { type: 'rifle', brand: 'cyma', category: 'Автоматы' },
            'VSR-10': { type: 'sniper', brand: 'cyma', category: 'Снайперские' },
            'P90': { type: 'smg', brand: 'cyma', category: 'Пистолеты-пулемёты' },
            'M1911A1': { type: 'pistol', brand: 'tm', category: 'Пистолеты' },
            'HK416 A5': { type: 'rifle', brand: 'vfc', category: 'Автоматы' },
            'Action Army AAP-01': { type: 'pistol', brand: 'aa', category: 'Пистолеты' }
        };
        
        productCards.forEach(card => {
            const titleElement = card.querySelector('.product-card__title');
            if (!titleElement) return;
            
            const title = titleElement.textContent.trim();
            const productData = productMapping[title] || { type: 'other', brand: 'other', category: 'Другие' };
            
            // Добавляем data-атрибуты если их нет
            if (!card.hasAttribute('data-type')) {
                card.setAttribute('data-type', productData.type);
            }
            if (!card.hasAttribute('data-brand')) {
                card.setAttribute('data-brand', productData.brand);
            }
            if (!card.hasAttribute('data-category')) {
                card.setAttribute('data-category', productData.category);
            }
            
            // Добавляем цену как data-атрибут
            const priceElement = card.querySelector('.product-card__current');
            if (priceElement && !card.hasAttribute('data-price')) {
                const priceText = priceElement.textContent;
                const price = parseInt(priceText.replace(/[^\d]/g, '')) || 0;
                card.setAttribute('data-price', price);
            }
        });
    }
    
    applyFilters() {
        console.log('🔍 Applying filters...');
        
        const filters = this.getSelectedFilters();
        console.log('📋 Selected filters:', filters);
        
        // Показываем уведомление
        this.showNotification('Применяем фильтры...', 'info');
        
        // Фильтруем товары
        setTimeout(() => {
            this.filterProducts(filters);
        }, 100);
    }
    
    getSelectedFilters() {
        const filters = {
            types: [],        // rifle, pistol, sniper, smg
            brands: [],       // tm, gg, vfc, lct, cyma, aa
            priceMin: 0,
            priceMax: 100000,
            categories: []    // Автоматы, Пистолеты, etc
        };
        
        // 1. Получаем ценовой диапазон
        const priceInputs = document.querySelectorAll('.filter__price-input');
        if (priceInputs.length === 2) {
            filters.priceMin = parseInt(priceInputs[0].value) || 0;
            filters.priceMax = parseInt(priceInputs[1].value) || 100000;
        }
        
        // 2. Получаем выбранные типы (из чекбоксов)
        const typeCheckboxes = document.querySelectorAll('.filter__group-content[data-filter-content="type"] input[type="checkbox"]:checked');
        typeCheckboxes.forEach(cb => {
            const label = cb.closest('label');
            if (label) {
                const text = label.textContent.trim();
                
                // Преобразуем русские названия в коды типов
                const typeMapping = {
                    'Автоматы': { types: ['rifle'], categories: ['Автоматы'] },
                    'Пистолеты': { types: ['pistol'], categories: ['Пистолеты'] },
                    'Снайперские': { types: ['sniper'], categories: ['Снайперские'] },
                    'Пистолеты-пулемёты': { types: ['smg'], categories: ['Пистолеты-пулемёты'] }
                };
                
                if (typeMapping[text]) {
                    filters.types.push(...typeMapping[text].types);
                    filters.categories.push(...typeMapping[text].categories);
                }
            }
        });
        
        // 3. Получаем выбранные бренды
        const brandCheckboxes = document.querySelectorAll('.filter__group-content[data-filter-content="brand"] input[type="checkbox"]:checked');
        brandCheckboxes.forEach(cb => {
            const label = cb.closest('label');
            if (label) {
                const text = label.textContent.trim();
                
                // Преобразуем русские названия брендов в коды
                const brandMapping = {
                    'Tokyo Marui': 'tm',
                    'G&G Armament': 'gg',
                    'VFC': 'vfc',
                    'LCT': 'lct',
                    'Cyma': 'cyma'
                };
                
                if (brandMapping[text]) {
                    filters.brands.push(brandMapping[text]);
                }
            }
        });
        
        return filters;
    }
    
    filterProducts(filters) {
        console.log('🎯 Filtering products with:', filters);
        
        const productCards = document.querySelectorAll('.product-card');
        let visibleCount = 0;
        
        productCards.forEach(card => {
            // Получаем данные товара
            const price = parseInt(card.getAttribute('data-price')) || this.extractPrice(card);
            const type = card.getAttribute('data-type') || '';
            const brand = card.getAttribute('data-brand') || '';
            const category = card.getAttribute('data-category') || '';
            
            let shouldShow = true;
            
            // 1. Фильтр по цене (ОБЯЗАТЕЛЬНЫЙ)
            if (price < filters.priceMin || price > filters.priceMax) {
                console.log(`❌ ${card.querySelector('.product-card__title')?.textContent} - цена ${price} вне диапазона ${filters.priceMin}-${filters.priceMax}`);
                shouldShow = false;
            }
            
            // 2. Фильтр по типам (если выбраны)
            if (shouldShow && filters.types.length > 0) {
                const hasMatchingType = filters.types.some(filterType => type === filterType);
                if (!hasMatchingType) {
                    console.log(`❌ ${card.querySelector('.product-card__title')?.textContent} - тип ${type} не совпадает с выбранными: ${filters.types.join(', ')}`);
                    shouldShow = false;
                }
            }
            
            // 3. Фильтр по брендам (если выбраны)
            if (shouldShow && filters.brands.length > 0) {
                const hasMatchingBrand = filters.brands.some(filterBrand => brand === filterBrand);
                if (!hasMatchingBrand) {
                    console.log(`❌ ${card.querySelector('.product-card__title')?.textContent} - бренд ${brand} не совпадает с выбранными: ${filters.brands.join(', ')}`);
                    shouldShow = false;
                }
            }
            
            // 4. Фильтр по категориям (если выбраны)
            if (shouldShow && filters.categories.length > 0) {
                const hasMatchingCategory = filters.categories.some(filterCategory => 
                    category.includes(filterCategory)
                );
                if (!hasMatchingCategory) {
                    console.log(`❌ ${card.querySelector('.product-card__title')?.textContent} - категория ${category} не совпадает с выбранными: ${filters.categories.join(', ')}`);
                    shouldShow = false;
                }
            }
            
            // Применяем отображение
            if (shouldShow) {
                card.style.display = 'block';
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
                visibleCount++;
                console.log(`✅ ${card.querySelector('.product-card__title')?.textContent} - ПРОШЕЛ все фильтры`);
            } else {
                card.style.display = 'none';
                card.style.opacity = '0';
                card.style.transform = 'scale(0.95)';
            }
        });
        
        console.log(`📊 Всего отображено: ${visibleCount} из ${productCards.length} товаров`);
        
        // Обновляем счетчик
        this.updateProductCount(visibleCount);
        
        // Показываем результат
        if (visibleCount === 0) {
            this.showNoResultsMessage(filters);
            this.showNotification('По вашим фильтрам ничего не найдено', 'warning');
        } else {
            this.showNotification(`Найдено ${visibleCount} товаров`, 'success');
            this.hideNoResultsMessage();
        }
    }
    
    extractPrice(card) {
        const priceElement = card.querySelector('.product-card__current');
        if (!priceElement) return 0;
        
        const priceText = priceElement.textContent;
        return parseInt(priceText.replace(/[^\d]/g, '')) || 0;
    }
    
    updateProductCount(count) {
        const countElement = document.querySelector('.catalog__count');
        if (countElement) {
            countElement.textContent = `(${count} товаров)`;
        }
    }
    
    showNoResultsMessage(filters) {
        this.hideNoResultsMessage(); // Сначала удаляем старое сообщение
        
        const productsGrid = document.querySelector('.products-grid');
        if (!productsGrid) return;
        
        const noResults = document.createElement('div');
        noResults.className = 'no-results-message';
        noResults.style.cssText = `
            grid-column: 1 / -1;
            text-align: center;
            padding: 40px 20px;
            background: #f8f9fa;
            border-radius: 12px;
            border: 2px dashed #dee2e6;
            margin: 20px 0;
        `;
        
        let filterText = 'Примененные фильтры: ';
        const parts = [];
        
        if (filters.priceMin > 0 || filters.priceMax < 100000) {
            parts.push(`Цена: ${filters.priceMin} - ${filters.priceMax} ₽`);
        }
        if (filters.types.length > 0) {
            const typeNames = {
                'rifle': 'Автоматы',
                'pistol': 'Пистолеты',
                'sniper': 'Снайперские',
                'smg': 'Пистолеты-пулемёты'
            };
            const russianTypes = filters.types.map(t => typeNames[t] || t);
            parts.push(`Типы: ${russianTypes.join(', ')}`);
        }
        if (filters.brands.length > 0) {
            const brandNames = {
                'tm': 'Tokyo Marui',
                'gg': 'G&G Armament',
                'vfc': 'VFC',
                'lct': 'LCT',
                'cyma': 'Cyma'
            };
            const russianBrands = filters.brands.map(b => brandNames[b] || b);
            parts.push(`Бренды: ${russianBrands.join(', ')}`);
        }
        
        filterText += parts.join('; ') || 'все фильтры сброшены';
        
        noResults.innerHTML = `
            <div style="font-size: 48px; margin-bottom: 20px;">😕</div>
            <h3 style="margin-bottom: 10px; color: #333;">По вашим фильтрам ничего не найдено</h3>
            <p style="color: #666; margin-bottom: 20px;">${filterText}</p>
            <button class="btn btn--primary" id="resetFiltersFromMessage">Сбросить фильтры и показать все товары</button>
        `;
        
        productsGrid.parentNode.insertBefore(noResults, productsGrid.nextSibling);
        
        // Обработчик кнопки сброса
        document.getElementById('resetFiltersFromMessage').addEventListener('click', () => {
            this.resetFilters();
            noResults.remove();
        });
    }
    
    hideNoResultsMessage() {
        const existingMessage = document.querySelector('.no-results-message');
        if (existingMessage) {
            existingMessage.remove();
        }
    }
    
    resetFilters() {
        console.log('🔄 Resetting all filters');
        
        // 1. Сбрасываем чекбоксы
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(cb => {
            cb.checked = false;
        });
        
        // 2. Сбрасываем ценовые поля
        const priceInputs = document.querySelectorAll('.filter__price-input');
        if (priceInputs.length === 2) {
            priceInputs[0].value = 0;
            priceInputs[1].value = 50000;
        }
        
        // 3. Сбрасываем range
        const rangeInput = document.querySelector('.filter__range');
        if (rangeInput) {
            rangeInput.value = 50000;
        }
        
        // 4. Показываем все товары
        const productCards = document.querySelectorAll('.product-card');
        productCards.forEach(card => {
            card.style.display = 'block';
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
        });
        
        // 5. Обновляем счетчик
        this.updateProductCount(productCards.length);
        
        // 6. Убираем сообщение "ничего не найдено"
        this.hideNoResultsMessage();
        
        // 7. Уведомление
        this.showNotification('Все фильтры сброшены', 'info');
    }
    
    initSorting() {
        const sortSelect = document.getElementById('sortSelect');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.sortProducts(e.target.value);
            });
        }
    }
    
    sortProducts(sortType) {
        console.log(`🔀 Sorting by: ${sortType}`);
        
        const productsGrid = document.querySelector('.products-grid');
        if (!productsGrid) return;
        
        const productCards = Array.from(document.querySelectorAll('.product-card'));
        if (productCards.length === 0) return;
        
        // Сортируем массив карточек
        productCards.sort((a, b) => {
            const priceA = parseInt(a.getAttribute('data-price')) || this.extractPrice(a);
            const priceB = parseInt(b.getAttribute('data-price')) || this.extractPrice(b);
            const titleA = a.querySelector('.product-card__title')?.textContent.toLowerCase() || '';
            const titleB = b.querySelector('.product-card__title')?.textContent.toLowerCase() || '';
            const isNewA = a.querySelector('.product-card__badge--new') !== null;
            const isNewB = b.querySelector('.product-card__badge--new') !== null;
            const isHitA = a.querySelector('.product-card__badge')?.textContent.includes('ХИТ') || false;
            const isHitB = b.querySelector('.product-card__badge')?.textContent.includes('ХИТ') || false;
            
            switch (sortType) {
                case 'price-asc':
                    return priceA - priceB;
                    
                case 'price-desc':
                    return priceB - priceA;
                    
                case 'new':
                    // Сначала новые, потом по цене
                    if (isNewA && !isNewB) return -1;
                    if (!isNewA && isNewB) return 1;
                    return priceA - priceB;
                    
                case 'popular':
                default:
                    // Сначала хиты, потом новые, потом остальные
                    if (isHitA && !isHitB) return -1;
                    if (!isHitA && isHitB) return 1;
                    if (isNewA && !isNewB) return -1;
                    if (!isNewA && isNewB) return 1;
                    return priceA - priceB;
            }
        });
        
        // Очищаем сетку и добавляем отсортированные карточки
        productsGrid.innerHTML = '';
        productCards.forEach(card => {
            productsGrid.appendChild(card);
        });
        
        // Показываем уведомление
        const sortNames = {
            'popular': 'популярности',
            'price-asc': 'цене (сначала дешевле)',
            'price-desc': 'цене (сначала дороже)',
            'new': 'новизне'
        };
        
        this.showNotification(`Товары отсортированы по ${sortNames[sortType]}`, 'info');
    }
    
    showNotification(message, type = 'info') {
        // Удаляем старое уведомление
        const oldNotification = document.querySelector('.filter-notification');
        if (oldNotification) {
            oldNotification.remove();
        }
        
        const notification = document.createElement('div');
        notification.className = `filter-notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${this.getNotificationColor(type)};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
            max-width: 400px;
            display: flex;
            align-items: center;
            gap: 10px;
        `;
        
        notification.innerHTML = `
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        // Автоматическое скрытие
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    getNotificationColor(type) {
        const colors = {
            'success': '#28a745',
            'error': '#dc3545',
            'warning': '#ffc107',
            'info': '#17a2b8'
        };
        return colors[type] || '#6c757d';
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    console.log('📦 Initializing filters system...');
    try {
        const filters = new Filters();
        window.filters = filters; // Делаем доступным для отладки
        console.log('✅ Filters system initialized successfully');
    } catch (error) {
        console.error('❌ Error initializing filters:', error);
    }
});