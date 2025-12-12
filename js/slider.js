class Slider {
    constructor(selector, options = {}) {
        this.slider = document.querySelector(selector);
        if (!this.slider) return;
        
        this.track = this.slider.querySelector('.slider__track');
        this.slides = this.slider.querySelectorAll('.slider__slide');
        this.prevBtn = this.slider.querySelector('.slider__btn--prev');
        this.nextBtn = this.slider.querySelector('.slider__btn--next');
        this.dotsContainer = this.slider.querySelector('.slider__dots');
        
        this.currentSlide = 0;
        this.autoplayInterval = null;
        this.autoplayDelay = options.autoplayDelay || 5000;
        this.autoplay = options.autoplay !== false;
        
        this.init();
    }
    
    init() {
        this.createDots();
        this.addEventListeners();
        
        if (this.autoplay) {
            this.startAutoplay();
        }
    }
    
    createDots() {
        if (!this.dotsContainer) return;
        
        this.slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('slider__dot');
            if (index === 0) dot.classList.add('slider__dot--active');
            dot.setAttribute('aria-label', `Перейти к слайду ${index + 1}`);
            dot.addEventListener('click', () => this.goToSlide(index));
            this.dotsContainer.appendChild(dot);
        });
        
        this.dots = this.dotsContainer.querySelectorAll('.slider__dot');
    }
    
    addEventListeners() {
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prevSlide());
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextSlide());
        }
        
        this.slider.addEventListener('mouseenter', () => this.stopAutoplay());
        this.slider.addEventListener('mouseleave', () => {
            if (this.autoplay) this.startAutoplay();
        });
    }
    
    goToSlide(index) {
        this.slides[this.currentSlide].classList.remove('slider__slide--active');
        if (this.dots) {
            this.dots[this.currentSlide].classList.remove('slider__dot--active');
        }
        
        this.currentSlide = index;
        const offset = -this.currentSlide * 100;
        this.track.style.transform = `translateX(${offset}%)`;
        
        this.slides[this.currentSlide].classList.add('slider__slide--active');
        if (this.dots) {
            this.dots[this.currentSlide].classList.add('slider__dot--active');
        }
    }
    
    nextSlide() {
        const next = (this.currentSlide + 1) % this.slides.length;
        this.goToSlide(next);
    }
    
    prevSlide() {
        const prev = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.goToSlide(prev);
    }
    
    startAutoplay() {
        this.autoplayInterval = setInterval(() => this.nextSlide(), this.autoplayDelay);
    }
    
    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const heroSlider = new Slider('#heroSlider', {
        autoplay: true,
        autoplayDelay: 5000
    });
});
