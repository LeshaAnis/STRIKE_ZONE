class Tabs {
    constructor(selector) {
        this.container = document.querySelector(selector);
        if (!this.container) return;
        
        this.buttons = this.container.querySelectorAll('.tabs__btn');
        this.panes = this.container.querySelectorAll('.tabs__pane');
        
        this.init();
    }
    
    init() {
        this.buttons.forEach(button => {
            button.addEventListener('click', () => {
                const tabName = button.dataset.tab;
                this.switchTab(tabName);
            });
        });
    }
    
    switchTab(tabName) {
        this.buttons.forEach(btn => {
            btn.classList.remove('tabs__btn--active');
            if (btn.dataset.tab === tabName) {
                btn.classList.add('tabs__btn--active');
            }
        });
        
        this.panes.forEach(pane => {
            pane.classList.remove('tabs__pane--active');
            if (pane.dataset.pane === tabName) {
                pane.classList.add('tabs__pane--active');
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const productTabs = new Tabs('#productTabs');
    const productDetailsTabs = new Tabs('#productDetailsTabs');
    const authTabs = new Tabs('#authTabs');
});
