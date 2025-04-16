document.addEventListener('DOMContentLoaded', () => {
    // Инициализация скрипта формы обратной связи
    initContactFormExperience();

    function initContactFormExperience() {
        const contactForm = document.getElementById('contactForm');
        if (!contactForm) return;

        // Добавляем контейнеры для сообщений валидации и загрузки
        createFormElements();

        // Добавляем эффекты при фокусе на полях ввода
        addInputEffects();

        // Добавляем обработчик отправки формы
        contactForm.addEventListener('submit', handleFormSubmit);

        // Добавляем материальный эффект волны для кнопки
        const submitButton = contactForm.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.addEventListener('click', createRippleEffect);
        }

        // Добавляем анимацию при скролле
        addScrollAnimation();
    }

    // Создаем дополнительные элементы для формы
    function createFormElements() {
        const formContent = document.querySelector('.form-content');
        if (!formContent) return;

        // Контейнер для сообщений о результате отправки
        const validationMessage = document.createElement('div');
        validationMessage.className = 'form-validation-message';
        formContent.appendChild(validationMessage);

        // Индикатор загрузки
        const loading = document.createElement('div');
        loading.className = 'form-loading';
        const spinner = document.createElement('div');
        spinner.className = 'form-loading-spinner';
        loading.appendChild(spinner);
        formContent.appendChild(loading);
    }

    // Добавляем эффекты при фокусе на полях ввода
    function addInputEffects() {
        const formControls = document.querySelectorAll('.form-control');

        formControls.forEach(input => {
            // Эффект при фокусе
            input.addEventListener('focus', function() {
                this.parentElement.classList.add('focused');
            });

            // Эффект при потере фокуса
            input.addEventListener('blur', function() {
                this.parentElement.classList.remove('focused');

                // Валидация при потере фокуса
                if (this.value.trim() !== '') {
                    validateInput(this);
                }
            });

            // Эффект при вводе
            input.addEventListener('input', function() {
                if (this.classList.contains('is-invalid')) {
                    validateInput(this);
                }
            });
        });
    }

    // Простая валидация поля
    function validateInput(input) {
        const isValid = input.checkValidity();
        if (isValid) {
            input.classList.remove('is-invalid');
            input.classList.add('is-valid');
        } else {
            input.classList.remove('is-valid');
            input.classList.add('is-invalid');
        }
        return isValid;
    }

    // Обработка отправки формы
    function handleFormSubmit(event) {
        event.preventDefault();

        const form = event.target;
        const formContent = document.querySelector('.form-content');
        const loading = document.querySelector('.form-loading');
        const validationMessage = document.querySelector('.form-validation-message');

        // Проверяем все поля на валидность
        const inputs = form.querySelectorAll('.form-control');
        let isFormValid = true;

        inputs.forEach(input => {
            if (!validateInput(input)) {
                isFormValid = false;
            }
        });

        // Если форма не валидна, останавливаем отправку
        if (!isFormValid) {
            validationMessage.textContent = 'Пожалуйста, заполните все обязательные поля корректно.';
            validationMessage.className = 'form-validation-message error';
            shakeElement(validationMessage);
            return;
        }

        // Показываем индикатор загрузки
        loading.classList.add('active');

        // Эмулируем отправку данных (в реальном проекте замените на fetch или XMLHttpRequest)
        setTimeout(() => {
            // Скрываем индикатор загрузки
            loading.classList.remove('active');

            // Показываем сообщение об успешной отправке
            validationMessage.textContent = 'Спасибо за ваше сообщение! Мы свяжемся с вами в ближайшее время.';
            validationMessage.className = 'form-validation-message success';

            // Сбрасываем форму
            form.reset();
            inputs.forEach(input => {
                input.classList.remove('is-valid');
            });

            // Добавляем эффект успешной отправки
            formContent.classList.add('success-animation');
            setTimeout(() => {
                formContent.classList.remove('success-animation');
            }, 1000);

        }, 1500); // Задержка для эмуляции отправки
    }

    // Эффект "дрожания" для элемента при ошибке
    function shakeElement(element) {
        element.classList.add('shake-animation');
        setTimeout(() => {
            element.classList.remove('shake-animation');
        }, 500);
    }

    // Материальный эффект волны для кнопки
    function createRippleEffect(event) {
        const button = event.currentTarget;

        // Создаем элемент эффекта
        const ripple = document.createElement('span');
        ripple.className = 'ripple-effect';

        // Рассчитываем позицию и размер
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        // Устанавливаем стили
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;

        // Добавляем в кнопку
        button.appendChild(ripple);

        // Удаляем после анимации
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    // Добавляем анимацию при скролле
    function addScrollAnimation() {
        const formContent = document.querySelector('.form-content');
        const contactImage = document.querySelector('.contact-image');

        if (!formContent) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        // Наблюдаем за формой в любом случае
        observer.observe(formContent);

        // Наблюдаем за изображением только если оно видимо
        if (contactImage && window.getComputedStyle(contactImage).display !== 'none') {
            observer.observe(contactImage);
        }
    }
});