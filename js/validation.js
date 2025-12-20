
        // Система уведомлений
        class NotificationSystem {
            constructor() {
                this.container = document.getElementById('notificationContainer');
                if (!this.container) {
                    this.container = document.createElement('div');
                    this.container.id = 'notificationContainer';
                    document.body.appendChild(this.container);
                }
            }
            
            show(message, type = 'info', duration = 5000) {
                const notification = document.createElement('div');
                notification.className = `notification ${type}`;
                notification.innerHTML = `
                    ${message}
                    <button class="notification__close">&times;</button>
                `;
                
                this.container.appendChild(notification);
                
                // Анимация появления
                setTimeout(() => notification.classList.add('show'), 10);
                
                // Закрытие по кнопке
                notification.querySelector('.notification__close').addEventListener('click', () => {
                    this.close(notification);
                });
                
                // Автозакрытие
                if (duration > 0) {
                    setTimeout(() => this.close(notification), duration);
                }
                
                return notification;
            }
            
            close(notification) {
                notification.classList.remove('show');
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }
        }
        
        // Валидация форм
        class AuthValidator {
            constructor() {
                this.notification = new NotificationSystem();
                this.init();
            }
            
            init() {
                this.initLoginForm();
                this.initRegisterForm();
                this.initForgotPassword();
                this.initPhoneMask();
            }
            
            initPhoneMask() {
                const phoneInput = document.getElementById('registerPhone');
                if (phoneInput) {
                    phoneInput.addEventListener('input', function(e) {
                        let x = e.target.value.replace(/\D/g, '').match(/(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);
                        e.target.value = !x[2] ? x[1] : '+7 (' + x[2] + (x[3] ? ') ' + x[3] : '') + (x[4] ? '-' + x[4] : '') + (x[5] ? '-' + x[5] : '');
                    });
                }
            }
            
            initLoginForm() {
                const loginForm = document.getElementById('loginForm');
                if (!loginForm) return;
                
                loginForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    if (this.validateLoginForm()) {
                        this.submitLoginForm();
                    }
                });
                
                // Валидация в реальном времени
                const emailInput = document.getElementById('loginEmail');
                const passwordInput = document.getElementById('loginPassword');
                
                emailInput?.addEventListener('blur', () => this.validateEmail(emailInput, 'loginEmailError'));
                passwordInput?.addEventListener('blur', () => this.validatePassword(passwordInput, 'loginPasswordError'));
            }
            
            initRegisterForm() {
                const registerForm = document.getElementById('registerForm');
                if (!registerForm) return;
                
                registerForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    if (this.validateRegisterForm()) {
                        this.submitRegisterForm();
                    }
                });
                
                // Валидация в реальном времени
                const inputs = [
                    { id: 'registerName', validate: 'name' },
                    { id: 'registerEmail', validate: 'email' },
                    { id: 'registerPassword', validate: 'password' },
                    { id: 'registerPasswordConfirm', validate: 'passwordConfirm' }
                ];
                
                inputs.forEach(input => {
                    const element = document.getElementById(input.id);
                    if (element) {
                        element.addEventListener('blur', () => {
                            this[`validate${input.validate.charAt(0).toUpperCase() + input.validate.slice(1)}`](
                                element, `${input.id}Error`
                            );
                        });
                    }
                });
            }
            
            initForgotPassword() {
                const forgotLink = document.getElementById('forgotPassword');
                if (forgotLink) {
                    forgotLink.addEventListener('click', (e) => {
                        e.preventDefault();
                        this.showForgotPasswordModal();
                    });
                }
            }
            
            // Валидация отдельных полей
            validateEmail(input, errorId) {
                const value = input.value.trim();
                const errorElement = document.getElementById(errorId);
                const parent = input.closest('.form-group');
                
                if (!value) {
                    this.showError(parent, errorElement, 'Введите email');
                    return false;
                }
                
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    this.showError(parent, errorElement, 'Введите корректный email');
                    return false;
                }
                
                this.clearError(parent, errorElement);
                return true;
            }
            
            validatePassword(input, errorId) {
                const value = input.value;
                const errorElement = document.getElementById(errorId);
                const parent = input.closest('.form-group');
                
                if (!value) {
                    this.showError(parent, errorElement, 'Введите пароль');
                    return false;
                }
                
                if (value.length < 6) {
                    this.showError(parent, errorElement, 'Пароль должен содержать минимум 6 символов');
                    return false;
                }
                
                this.clearError(parent, errorElement);
                return true;
            }
            
            validateName(input, errorId) {
                const value = input.value.trim();
                const errorElement = document.getElementById(errorId);
                const parent = input.closest('.form-group');
                
                if (!value) {
                    this.showError(parent, errorElement, 'Введите имя');
                    return false;
                }
                
                if (value.length < 2) {
                    this.showError(parent, errorElement, 'Имя должно содержать минимум 2 символа');
                    return false;
                }
                
                if (!/^[а-яА-ЯёЁa-zA-Z\s]+$/.test(value)) {
                    this.showError(parent, errorElement, 'Имя может содержать только буквы');
                    return false;
                }
                
                this.clearError(parent, errorElement);
                return true;
            }
            
            validatePasswordConfirm(input, errorId) {
                const value = input.value;
                const password = document.getElementById('registerPassword').value;
                const errorElement = document.getElementById(errorId);
                const parent = input.closest('.form-group');
                
                if (!value) {
                    this.showError(parent, errorElement, 'Подтвердите пароль');
                    return false;
                }
                
                if (value !== password) {
                    this.showError(parent, errorElement, 'Пароли не совпадают');
                    return false;
                }
                
                this.clearError(parent, errorElement);
                return true;
            }
            
            validatePhone(input, errorId) {
                const value = input.value.trim();
                const errorElement = document.getElementById(errorId);
                const parent = input.closest('.form-group');
                
                if (value && value.length < 18) {
                    this.showError(parent, errorElement, 'Введите корректный номер телефона');
                    return false;
                }
                
                this.clearError(parent, errorElement);
                return true;
            }
            
            // Валидация всей формы логина
            validateLoginForm() {
                const emailValid = this.validateEmail(
                    document.getElementById('loginEmail'),
                    'loginEmailError'
                );
                const passwordValid = this.validatePassword(
                    document.getElementById('loginPassword'),
                    'loginPasswordError'
                );
                
                return emailValid && passwordValid;
            }
            
            // Валидация всей формы регистрации
            validateRegisterForm() {
                const nameValid = this.validateName(
                    document.getElementById('registerName'),
                    'registerNameError'
                );
                const emailValid = this.validateEmail(
                    document.getElementById('registerEmail'),
                    'registerEmailError'
                );
                const phoneValid = this.validatePhone(
                    document.getElementById('registerPhone'),
                    'registerPhoneError'
                );
                const passwordValid = this.validatePassword(
                    document.getElementById('registerPassword'),
                    'registerPasswordError'
                );
                const passwordConfirmValid = this.validatePasswordConfirm(
                    document.getElementById('registerPasswordConfirm'),
                    'registerPasswordConfirmError'
                );
                const termsChecked = document.getElementById('termsAgreement').checked;
                
                if (!termsChecked) {
                    const termsError = document.getElementById('termsError');
                    termsError.textContent = 'Необходимо согласиться с условиями';
                    termsError.style.display = 'block';
                    return false;
                } else {
                    document.getElementById('termsError').style.display = 'none';
                }
                
                return nameValid && emailValid && phoneValid && passwordValid && passwordConfirmValid;
            }
            
            // Отправка формы логина (имитация)
            submitLoginForm() {
                const btn = document.getElementById('loginBtn');
                const originalText = btn.textContent;
                
                // Показываем индикатор загрузки
                btn.classList.add('btn--loading');
                btn.disabled = true;
                
                // Имитация запроса к серверу
                setTimeout(() => {
                    const email = document.getElementById('loginEmail').value;
                    const password = document.getElementById('loginPassword').value;
                    
                    // Здесь должна быть реальная проверка с сервером
                    // Для демонстрации используем тестовые данные
                    const testEmail = 'test@example.com';
                    const testPassword = 'password123';
                    
                    if (email === testEmail && password === testPassword) {
                        this.notification.show('Вход выполнен успешно!', 'success');
                        
                        // Перенаправление на главную страницу через 2 секунды
                        setTimeout(() => {
                            window.location.href = 'index.html';
                        }, 2000);
                    } else {
                        this.notification.show('Неверный email или пароль', 'error');
                        btn.classList.remove('btn--loading');
                        btn.disabled = false;
                        btn.textContent = originalText;
                    }
                }, 1500);
            }
            
            // Отправка формы регистрации (имитация)
            submitRegisterForm() {
                const btn = document.getElementById('registerBtn');
                const originalText = btn.textContent;
                
                // Показываем индикатор загрузки
                btn.classList.add('btn--loading');
                btn.disabled = true;
                
                // Имитация запроса к серверу
                setTimeout(() => {
                    const email = document.getElementById('registerEmail').value;
                    
                    // Проверяем, существует ли уже пользователь (имитация)
                    const existingEmails = ['existing@example.com', 'user@mail.ru'];
                    
                    if (existingEmails.includes(email)) {
                        this.notification.show('Пользователь с таким email уже существует', 'error');
                        btn.classList.remove('btn--loading');
                        btn.disabled = false;
                        btn.textContent = originalText;
                    } else {
                        this.notification.show('Регистрация прошла успешно! Теперь вы можете войти в систему.', 'success');
                        
                        // Переключаемся на вкладку входа
                        setTimeout(() => {
                            const loginTab = document.querySelector('[data-tab="login"]');
                            if (loginTab) {
                                loginTab.click();
                                document.getElementById('loginEmail').value = email;
                            }
                            btn.classList.remove('btn--loading');
                            btn.disabled = false;
                            btn.textContent = originalText;
                        }, 1500);
                    }
                }, 2000);
            }
            
            // Модальное окно восстановления пароля
            showForgotPasswordModal() {
                const modalHTML = `
                    <div class="modal-overlay" id="forgotPasswordModal" style="
                        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                        background: rgba(0,0,0,0.5); display: flex; align-items: center;
                        justify-content: center; z-index: 1000;
                    ">
                        <div class="modal-content" style="
                            background: white; padding: 30px; border-radius: 8px;
                            max-width: 400px; width: 90%; position: relative;
                        ">
                            <button class="modal-close" style="
                                position: absolute; top: 10px; right: 10px;
                                background: none; border: none; font-size: 20px;
                                cursor: pointer;
                            ">&times;</button>
                            <h3 style="margin-top: 0;">Восстановление пароля</h3>
                            <p>Введите email, указанный при регистрации</p>
                            <div class="form-group">
                                <input type="email" id="recoveryEmail" placeholder="Ваш email" style="
                                    width: 100%; padding: 10px; margin: 10px 0;
                                    border: 1px solid #ddd; border-radius: 4px;
                                ">
                                <div class="error" id="recoveryError" style="color: #e74c3c;"></div>
                            </div>
                            <button id="sendRecoveryBtn" style="
                                width: 100%; padding: 12px; background: #3498db;
                                color: white; border: none; border-radius: 4px;
                                cursor: pointer; margin-top: 10px;
                            ">Отправить инструкции</button>
                        </div>
                    </div>
                `;
                
                const modalContainer = document.createElement('div');
                modalContainer.innerHTML = modalHTML;
                document.body.appendChild(modalContainer);
                
                const modal = document.getElementById('forgotPasswordModal');
                const closeBtn = modal.querySelector('.modal-close');
                const sendBtn = document.getElementById('sendRecoveryBtn');
                const emailInput = document.getElementById('recoveryEmail');
                const errorElement = document.getElementById('recoveryError');
                
                closeBtn.addEventListener('click', () => {
                    document.body.removeChild(modalContainer);
                });
                
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) {
                        document.body.removeChild(modalContainer);
                    }
                });
                
                sendBtn.addEventListener('click', () => {
                    const email = emailInput.value.trim();
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    
                    if (!email) {
                        errorElement.textContent = 'Введите email';
                        return;
                    }
                    
                    if (!emailRegex.test(email)) {
                        errorElement.textContent = 'Введите корректный email';
                        return;
                    }
                    
                    // Имитация отправки письма
                    sendBtn.textContent = 'Отправка...';
                    sendBtn.disabled = true;
                    
                    setTimeout(() => {
                        this.notification.show('Инструкции по восстановлению пароля отправлены на ваш email', 'success');
                        document.body.removeChild(modalContainer);
                    }, 1500);
                });
            }
            
            // Вспомогательные методы
            showError(parent, errorElement, message) {
                parent.classList.add('has-error');
                errorElement.textContent = message;
                errorElement.style.display = 'block';
            }
            
            clearError(parent, errorElement) {
                parent.classList.remove('has-error');
                errorElement.style.display = 'none';
            }
        }
        
        // Инициализация при загрузке страницы
        document.addEventListener('DOMContentLoaded', () => {
            new AuthValidator();
            
            // Инициализация табов
            const tabButtons = document.querySelectorAll('#authTabs .tabs__btn');
            const tabPanes = document.querySelectorAll('#authTabs .tabs__pane');
            
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
        });
