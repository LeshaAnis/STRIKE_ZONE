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
