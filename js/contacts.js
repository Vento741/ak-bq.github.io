document.addEventListener('DOMContentLoaded', function() {
    // Инициализация всех интерактивных элементов на странице контактов
    initContactsPage();

    function initContactsPage() {
        // Инициализация карты
        initMap();

        // Инициализация 3D-карточек
        initContactCards();

        // Инициализация FAQ аккордеона
        initFaqAccordion();

        // Инициализация формы обратной связи
        initContactForm();

        // Добавляем эффект материальной волны для кнопок
        addRippleEffect();

        // Анимации при скролле
        initScrollAnimations();

        // Инициализация спецификаций
        initSpecifications();
    }

    // Инициализация Google Maps
    function initMap() {
        const mapOverlay = document.querySelector('.map-overlay');
        if (!mapOverlay) return;

        mapOverlay.addEventListener('click', function() {
            this.classList.add('hidden');
        });
    }

    // Инициализация 3D-эффекта для карточек контактов
    function initContactCards() {
        const cards = document.querySelectorAll('.contact-card');
        if (cards.length === 0) return;

        cards.forEach(card => {
            card.addEventListener('mousemove', function(e) {
                // Рассчитываем положение курсора относительно карточки
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                // Преобразуем положение в проценты
                const xPercent = x / rect.width;
                const yPercent = y / rect.height;

                // Рассчитываем углы наклона (максимум 10 градусов)
                const rotateY = (xPercent - 0.5) * 10; // от -5 до 5 градусов
                const rotateX = (0.5 - yPercent) * 10; // от -5 до 5 градусов

                // Применяем трансформацию
                this.style.transform = `translateZ(20px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

                // Эффект свечения
                const intensity = 0.2;
                this.style.boxShadow = `
                    ${-rotateY * intensity}px ${-rotateX * intensity}px 20px rgba(194, 157, 89, 0.15),
                    0 20px 40px rgba(31, 34, 51, 0.15)
                `;
            });

            // Возвращаем к исходному состоянию при уходе курсора
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateZ(0) rotateX(0) rotateY(0)';
                this.style.boxShadow = 'var(--shadow)';
            });
        });
    }

    // Инициализация аккордеона FAQ
    function initFaqAccordion() {
        const faqItems = document.querySelectorAll('.faq-item');
        if (faqItems.length === 0) return;

        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');

            question.addEventListener('click', function() {
                // Если элемент уже активен, закрываем его
                if (item.classList.contains('active')) {
                    item.classList.remove('active');
                } else {
                    // Закрываем все другие элементы
                    faqItems.forEach(otherItem => {
                        otherItem.classList.remove('active');
                    });

                    // Открываем текущий элемент
                    item.classList.add('active');
                }
            });
        });
    }

    // Инициализация формы обратной связи
    function initContactForm() {
        const form = document.querySelector('.contact-form');
        if (!form) return;

        // Добавляем эффекты при фокусе на полях ввода
        const formControls = form.querySelectorAll('.form-control');
        formControls.forEach(input => {
            // Родительский элемент для анимации
            const parent = input.closest('.form-floating');
            if (!parent) return;

            // Эффект при фокусе
            input.addEventListener('focus', function() {
                parent.classList.add('focused');
            });

            // Эффект при потере фокуса
            input.addEventListener('blur', function() {
                parent.classList.remove('focused');

                // Валидация при потере фокуса
                if (this.value.trim() !== '') {
                    validateInput(this);
                }
            });

            // Валидация при вводе
            input.addEventListener('input', function() {
                if (this.classList.contains('is-invalid')) {
                    validateInput(this);
                }
            });
        });

        // Обработка отправки формы
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            // Проверяем все поля на валидность
            let isValid = true;
            formControls.forEach(input => {
                if (!validateInput(input)) {
                    isValid = false;
                }
            });

            // Если форма валидна, показываем анимацию отправки
            if (isValid) {
                const submitButton = form.querySelector('.btn-submit');
                if (submitButton) {
                    submitButton.innerHTML = '<span class="spinner-grow spinner-grow-sm me-2" role="status" aria-hidden="true"></span>Отправка...';
                    submitButton.disabled = true;
                }

                // Имитация отправки формы (в реальном проекте здесь будет AJAX-запрос)
                setTimeout(function() {
                    // Показываем уведомление об успешной отправке
                    showSuccessMessage(form);

                    // Сбрасываем форму
                    form.reset();
                    formControls.forEach(input => {
                        input.classList.remove('is-valid');
                    });

                    // Восстанавливаем кнопку
                    if (submitButton) {
                        submitButton.innerHTML = 'Отправить';
                        submitButton.disabled = false;
                    }
                }, 1500);
            }
        });
    }

    // Функция валидации поля ввода
    function validateInput(input) {
        // Если поле пустое и обязательное
        if (input.required && input.value.trim() === '') {
            input.classList.add('is-invalid');
            input.classList.remove('is-valid');
            return false;
        }

        // Если поле email и формат неверный
        if (input.type === 'email' && input.value.trim() !== '') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value.trim())) {
                input.classList.add('is-invalid');
                input.classList.remove('is-valid');
                return false;
            }
        }

        // Если поле прошло проверку
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
        return true;
    }

    // Функция для показа сообщения об успешной отправке
    function showSuccessMessage(form) {
        // Создаем элемент сообщения
        const messageContainer = document.createElement('div');
        messageContainer.className = 'alert alert-success mt-4 alert-dismissible fade show';
        messageContainer.innerHTML = `
            <strong>Спасибо!</strong> Ваше сообщение успешно отправлено. Мы свяжемся с вами в ближайшее время.
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;

        // Добавляем сообщение в форму
        form.appendChild(messageContainer);

        // Удаляем сообщение через 5 секунд
        setTimeout(() => {
            messageContainer.classList.remove('show');
            setTimeout(() => messageContainer.remove(), 300);
        }, 5000);
    }

    // Добавление эффекта материальной волны для кнопок
    function addRippleEffect() {
        const buttons = document.querySelectorAll('.btn-submit, .social-icon');

        buttons.forEach(button => {
            button.addEventListener('click', function(e) {
                // Создаем элемент волны
                const ripple = document.createElement('span');
                ripple.className = 'ripple-effect';
                this.appendChild(ripple);

                // Определяем размер волны
                const size = Math.max(this.offsetWidth, this.offsetHeight);
                ripple.style.width = ripple.style.height = `${size}px`;

                // Позиционируем волну от точки клика
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                ripple.style.left = `${x}px`;
                ripple.style.top = `${y}px`;

                // Удаляем волну после анимации
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
    }

    // Анимации при скролле
    function initScrollAnimations() {
        // Получаем все элементы, которые нужно анимировать
        const elements = document.querySelectorAll(
            '.contact-cards-container, .contact-map-container, .contact-form-container, .social-networks, .faq-section'
        );

        // Создаем IntersectionObserver
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animation-triggered');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        // Наблюдаем за элементами
        elements.forEach(element => {
            observer.observe(element);
        });
    }

    // Инициализация спецификаций сайта
    function initSpecifications() {
        const specs = document.querySelector('.specifications-effect');
        if (!specs) return;

        // Добавляем обработчик для ручки
        const handle = specs.querySelector('.spec-handle');
        if (handle) {
            handle.addEventListener('click', function() {
                specs.classList.toggle('active');
                if (specs.classList.contains('active')) {
                    specs.style.right = '0';
                } else {
                    specs.style.right = '-190px';
                }
            });
        }
    }
});