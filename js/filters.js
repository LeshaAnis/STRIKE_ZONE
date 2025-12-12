class Filters {
    constructor() {
        this.init();
    }
    
    init() {
        this.initAccordions();
        this.initFilterButtons();
    }
    
    initAccordions() {
        const headers = document.querySelectorAll('.filter__group-header');
        
        headers.forEach(header => {
            header.addEventListener('click', () => {
                const filterId = header.dataset.filter;
                const content = document.querySelector(`[data-filter-content="${filterId}"]`);
                
                if (content) {
                    const isActive = content.classList.contains('filter__group-content--active');
                    
                    content.classList.toggle('filter__group-content--active');
                    header.setAttribute('aria-expanded', !isActive);
                }
            });
        });
    }
    
    initFilterButtons() {
        const applyBtn = document.getElementById('applyFilters');
        const resetBtn = document.getElementById('resetFilters');
        
        if (applyBtn) {
            applyBtn.addEventListener('click', () => {
                this.applyFilters();
            });
        }
        
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.resetFilters();
            });
        }
    }
    
    applyFilters() {
        const filters = this.getSelectedFilters();
        console.log('Применить фильтры:', filters);
    }
    
    resetFilters() {
        const checkboxes = document.querySelectorAll('.filter__checkbox input[type="checkbox"]');
        checkboxes.forEach(cb => cb.checked = false);
        
        const priceInputs = document.querySelectorAll('.filter__price-input');
        if (priceInputs.length === 2) {
            priceInputs[0].value = 0;
            priceInputs[1].value = 50000;
        }
        
        console.log('Фильтры сброшены');
    }
    
    getSelectedFilters() {
        const filters = {
            brands: [],
            types: [],
            calibers: [],
            priceMin: 0,
            priceMax: 100000
        };
        
        const brandCheckboxes = document.querySelectorAll('.filter__checkbox input[name="brand"]:checked');
        filters.brands = Array.from(brandCheckboxes).map(cb => cb.value);
        
        const typeCheckboxes = document.querySelectorAll('.filter__checkbox input[name="type"]:checked');
        filters.types = Array.from(typeCheckboxes).map(cb => cb.value);
        
        const caliberCheckboxes = document.querySelectorAll('.filter__checkbox input[name="caliber"]:checked');
        filters.calibers = Array.from(caliberCheckboxes).map(cb => cb.value);
        
        const priceInputs = document.querySelectorAll('.filter__price-input');
        if (priceInputs.length === 2) {
            filters.priceMin = parseInt(priceInputs[0].value) || 0;
            filters.priceMax = parseInt(priceInputs[1].value) || 100000;
        }
        
        return filters;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Filters();
});
