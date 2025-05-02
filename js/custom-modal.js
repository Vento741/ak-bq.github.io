/**
 * Custom Project Order Modal
 * JavaScript для необычного модального окна заказа проекта
 */

document.addEventListener('DOMContentLoaded', function() {
    // Сначала создаем модальное окно
    createOrderModal();

    // DOM элементы
    const orderButtons = document.querySelectorAll('.order-project-btn');
    const modalOverlay = document.querySelector('.modal-project-overlay');
    const modalClose = document.querySelector('.modal-close-btn');
    const modalStepBtns = document.querySelectorAll('.modal-step-btn');
    const modalBackBtn = document.querySelectorAll('.modal-back-btn');
    const modalBackFromSuccessBtn = document.querySelector('.modal-back-from-success-btn');
    const modalForm = document.querySelector('.modal-project-form');
    const modalSteps = document.querySelectorAll('.modal-step');
    const modalFormSteps = document.querySelectorAll('.modal-form-step');
    const modalSuccessBtn = document.querySelector('.modal-success-btn');
    const modalSuccess = document.querySelector('.modal-success');
    const modalFormContent = document.querySelector('.modal-form-content');

    // Текущий шаг формы
    let currentStep = 0;

    // Проверяем наличие кнопок заказа проекта
    // console.log('Найдено кнопок заказа проекта:', orderButtons.length);

    // Открытие модального окна при клике на кнопки заказа проекта
    orderButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            console.log('Клик по кнопке заказа проекта');
            e.preventDefault();
            openModal();
        });
    });

    // Специфичный обработчик для кнопки "Заказать проект" на главной странице в hero секции
    const mainOrderButton = document.querySelector('.hero-buttons .order-project-btn');
    if (mainOrderButton) {
        // console.log('Найдена главная кнопка заказа на главном экране');
        mainOrderButton.addEventListener('click', function(e) {
            // console.log('Клик по главной кнопке заказа');
            e.preventDefault();
            openModal();
        });
    }

    // Закрытие модального окна
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    // Закрытие по клику на оверлей
    if (modalOverlay) {
        modalOverlay.addEventListener('click', function(e) {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });
    }

    // Закрытие по Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
            closeModal();
        }
    });

    // Переход к следующему шагу
    if (modalStepBtns) {
        modalStepBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();

                // Валидация текущего шага
                const currentFormStep = modalFormSteps[currentStep];
                const inputs = currentFormStep.querySelectorAll('.floating-input');
                let isValid = true;

                inputs.forEach(input => {
                    if (input.hasAttribute('required') && !input.value.trim()) {
                        isValid = false;
                        const group = input.closest('.floating-group');
                        group.classList.add('error');

                        // Показать сообщение об ошибке
                        let errorMsg = group.querySelector('.error-message');
                        if (!errorMsg) {
                            errorMsg = document.createElement('div');
                            errorMsg.className = 'error-message';
                            errorMsg.textContent = 'Это поле обязательно для заполнения';
                            group.appendChild(errorMsg);
                        }
                    }
                });

                if (!isValid) return;

                // Если всё валидно, перейти к следующему шагу
                nextStep();
            });
        });
    }

    // Возврат к предыдущему шагу
    if (modalBackBtn && modalBackBtn.length) {
        modalBackBtn.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('Нажата кнопка "Назад", текущий шаг:', currentStep);
                prevStep();
            });
        });
    }

    // Сброс ошибки при вводе
    document.addEventListener('input', function(e) {
        if (e.target.classList.contains('floating-input')) {
            const group = e.target.closest('.floating-group');
            if (group) {
                group.classList.remove('error');
            }
        }
    });

    // Обработка отправки формы
    if (modalForm) {
        modalForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Получаем данные формы
            const formData = new FormData(this);
            const orderData = {
                name: formData.get('name'),
                phone: formData.get('phone'),
                email: formData.get('email') || 'Не указан',
                style: formData.get('style'),
                message: formData.get('message'),
                budget: formData.get('budget'),
                address: formData.get('address') || 'Не указан'
            };

            // Симуляция отправки
            const submitBtn = this.querySelector('[type="submit"]');
            const originalText = submitBtn.textContent;

            submitBtn.textContent = 'Отправляем...';
            submitBtn.disabled = true;

            // Отправка данных через AJAX на сервер
            fetch('includes/send-email.php', {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .catch(error => {
                    console.error('Ошибка при отправке формы:', error);
                    // В случае ошибки подключения, продолжаем показывать успех,
                    // т.к. данные все равно будут доступны в WhatsApp
                })
                .finally(() => {
                    // Сохраняем заказ через менеджер WhatsApp, если он доступен
                    if (window.whatsAppManager) {
                        // Используем текстовый формат без эмодзи и без специальных символов
                        const plainText =
                            "НОВАЯ ЗАЯВКА С САЙТА\n\n" +
                            "Имя: " + orderData.name + "\n" +
                            "Телефон: " + orderData.phone + "\n" +
                            "Email: " + orderData.email + "\n" +
                            "Адрес: " + orderData.address + "\n\n" +
                            "Стиль кухни: " + orderData.style + "\n" +
                            "Бюджет: " + orderData.budget + "\n\n" +
                            "Пожелания: " + orderData.message + "\n\n" +
                            "Заявка отправлена с сайта Бутик Авторской Кухни";

                        // Переопределяем текст для менеджера
                        orderData.whatsappText = plainText;

                        window.whatsAppManager.saveOrder(orderData);
                    } else {
                        // Запасной вариант, если менеджер не доступен
                        // Форматируем текст сообщения для WhatsApp без эмодзи и спецсимволов
                        const whatsappText =
                            "НОВАЯ ЗАЯВКА С САЙТА\n\n" +
                            "Имя: " + orderData.name + "\n" +
                            "Телефон: " + orderData.phone + "\n" +
                            "Email: " + orderData.email + "\n" +
                            "Адрес: " + orderData.address + "\n\n" +
                            "Стиль кухни: " + orderData.style + "\n" +
                            "Бюджет: " + orderData.budget + "\n\n" +
                            "Пожелания: " + orderData.message + "\n\n" +
                            "Заявка отправлена с сайта Бутик Авторской Кухни";

                        // Сохраняем данные
                        localStorage.setItem('lastOrderData', JSON.stringify({
                            ...orderData,
                            date: new Date().toLocaleString(),
                            whatsappText
                        }));

                        // Получаем все заявки из хранилища или создаем новый массив
                        let allOrders = JSON.parse(localStorage.getItem('allOrders') || '[]');
                        allOrders.push(orderData);
                        localStorage.setItem('allOrders', JSON.stringify(allOrders));
                    }

                    setTimeout(() => {
                        submitBtn.textContent = originalText;
                        submitBtn.disabled = false;

                        // Показать сообщение об успехе
                        if (modalSuccess && modalFormContent) {
                            modalFormContent.style.display = 'none';
                            modalSuccess.style.display = 'block';

                            // Обновляем текст в сообщении об успехе
                            const successMessage = modalSuccess.querySelector('.modal-success-message');
                            if (successMessage) {
                                successMessage.innerHTML = 'Ваша заявка успешно отправлена! Для более оперативной связи рекомендуем также отправить заявку в WhatsApp нашему менеджеру.';
                            }

                            // Добавляем кнопку WhatsApp
                            if (window.whatsAppManager) {
                                // Используем менеджер WhatsApp
                                const successBlock = document.querySelector('.modal-success');
                                if (successBlock && !successBlock.querySelector('.whatsapp-btn')) {
                                    const closeBtn = successBlock.querySelector('.modal-success-btn');

                                    // Создаем кнопку WhatsApp
                                    const whatsappBtn = window.whatsAppManager.createWhatsAppButton(orderData);

                                    // Добавляем кнопку перед кнопкой закрытия
                                    if (closeBtn) {
                                        closeBtn.style.marginTop = '15px';
                                        successBlock.insertBefore(whatsappBtn, closeBtn);
                                    } else {
                                        successBlock.appendChild(whatsappBtn);
                                    }

                                    // Добавляем QR-код для WhatsApp (опционально)
                                    const qrContainer = window.whatsAppManager.createWhatsAppQR(orderData);
                                    successBlock.insertBefore(qrContainer, closeBtn);
                                }
                            } else {
                                // Используем упрощенный вариант
                                createWhatsAppButton(
                                    "НОВАЯ ЗАЯВКА С САЙТА\n\n" +
                                    "Имя: " + orderData.name + "\n" +
                                    "Телефон: " + orderData.phone + "\n" +
                                    "Email: " + orderData.email + "\n" +
                                    "Адрес: " + orderData.address + "\n\n" +
                                    "Стиль кухни: " + orderData.style + "\n" +
                                    "Бюджет: " + orderData.budget + "\n\n" +
                                    "Пожелания: " + orderData.message + "\n\n" +
                                    "Заявка отправлена с сайта Бутик Авторской Кухни"
                                );
                            }
                        }
                    }, 1500);
                });
        });
    }

    // Закрытие после успешной отправки
    if (modalSuccessBtn) {
        modalSuccessBtn.addEventListener('click', function() {
            closeModal();
            // Сброс формы после закрытия
            setTimeout(() => {
                if (modalForm) modalForm.reset();
                if (modalFormContent) modalFormContent.style.display = 'block';
                if (modalSuccess) modalSuccess.style.display = 'none';
                resetSteps();
            }, 300);
        });
    }

    // Добавляем обработчик для кнопки "Назад" из экрана успеха
    if (modalBackFromSuccessBtn) {
        modalBackFromSuccessBtn.addEventListener('click', function() {
            // Скрываем сообщение об успехе и показываем форму
            if (modalSuccess && modalFormContent) {
                modalSuccess.style.display = 'none';
                modalFormContent.style.display = 'block';

                // Возвращаемся к последнему шагу
                showLastStep();
            }
        });
    }

    // Функция открытия модального окна
    function openModal() {
        if (modalOverlay) {
            document.body.style.overflow = 'hidden';
            modalOverlay.classList.add('active');

            // Анимация входа элементов
            animateElements();
        }
    }

    // Функция закрытия модального окна
    function closeModal() {
        if (modalOverlay) {
            document.body.style.overflow = '';
            modalOverlay.classList.remove('active');
        }
    }

    // Функция перехода к следующему шагу
    function nextStep() {
        if (currentStep < modalFormSteps.length - 1) {
            // Скрыть текущий шаг
            modalFormSteps[currentStep].classList.remove('active');
            // Обновить прогресс
            modalSteps[currentStep].classList.add('completed');
            // Увеличить счетчик
            currentStep++;
            // Показать новый шаг
            modalFormSteps[currentStep].classList.add('active');
            modalSteps[currentStep].classList.add('active');
            // Показать кнопку "Назад", если это не первый шаг
            if (modalBackBtn && modalBackBtn.length) {
                modalBackBtn.forEach(btn => {
                    btn.style.display = 'block';
                });
            }
            console.log('Переход на шаг:', currentStep);
        }
    }

    // Функция возврата к предыдущему шагу
    function prevStep() {
        if (currentStep > 0) {
            console.log('Возврат с шага', currentStep, 'на шаг', currentStep - 1);
            // Скрыть текущий шаг
            modalFormSteps[currentStep].classList.remove('active');
            modalSteps[currentStep].classList.remove('active');
            // Если был на третьем шаге (индекс 2), снимаем класс completed со второго шага (индекс 1)
            if (currentStep === 2) {
                modalSteps[1].classList.remove('completed');
            }
            // Уменьшить счетчик
            currentStep--;
            // Показать предыдущий шаг
            modalFormSteps[currentStep].classList.add('active');
            modalSteps[currentStep].classList.add('active');
            // Скрыть кнопку "Назад", если это первый шаг
            if (modalBackBtn && modalBackBtn.length && currentStep === 0) {
                modalBackBtn.forEach(btn => {
                    btn.style.display = 'none';
                });
            }
        }
    }

    // Сброс шагов формы
    function resetSteps() {
        currentStep = 0;
        modalSteps.forEach(step => {
            step.classList.remove('active', 'completed');
        });
        modalFormSteps.forEach(step => {
            step.classList.remove('active');
        });

        // Активировать первый шаг
        if (modalSteps.length) modalSteps[0].classList.add('active');
        if (modalFormSteps.length) modalFormSteps[0].classList.add('active');

        // Скрыть кнопку "Назад"
        if (modalBackBtn && modalBackBtn.length) {
            modalBackBtn.forEach(btn => {
                btn.style.display = 'none';
            });
        }
    }

    // Анимация входа элементов
    function animateElements() {
        const decorElements = document.querySelectorAll('.modal-project-decoration, .modal-step');
        decorElements.forEach((el, index) => {
            el.style.transitionDelay = (0.1 * index) + 's';
            el.classList.add('animated');
        });
    }

    // Функция для создания кнопки WhatsApp
    function createWhatsAppButton(text) {
        // Телефон для WhatsApp (без +)
        const whatsappPhone = '+79921110999'; // Замените на свой номер

        // Кодируем текст для URL
        const encodedText = encodeURIComponent(text);

        // Создаем ссылку для WhatsApp
        const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodedText}`;

        // Ищем блок с сообщением об успехе
        const successBlock = document.querySelector('.modal-success');

        // Проверяем, существует ли уже кнопка
        if (successBlock && !successBlock.querySelector('.whatsapp-btn')) {
            // Создаем кнопку
            const whatsappBtn = document.createElement('a');
            whatsappBtn.className = 'whatsapp-btn';
            whatsappBtn.href = whatsappUrl;
            whatsappBtn.target = '_blank';
            whatsappBtn.textContent = 'Отправить в WhatsApp';

            // Добавляем кнопку перед основной кнопкой закрытия
            const closeBtn = successBlock.querySelector('.modal-success-btn');
            if (closeBtn) {
                // Добавляем отступ перед кнопкой закрытия
                closeBtn.style.marginTop = '15px';
                // Вставляем кнопку WhatsApp перед кнопкой закрытия
                successBlock.insertBefore(whatsappBtn, closeBtn);
            } else {
                successBlock.appendChild(whatsappBtn);
            }
        }
    }

    // Функция для показа последнего шага формы
    function showLastStep() {
        if (modalFormSteps && modalFormSteps.length > 0) {
            // Скрываем все шаги
            modalFormSteps.forEach(step => {
                step.classList.remove('active');
            });

            // Показываем последний шаг
            const lastStepIndex = modalFormSteps.length - 1;
            modalFormSteps[lastStepIndex].classList.add('active');

            // Обновляем прогресс-бар
            if (modalSteps) {
                modalSteps.forEach((step, index) => {
                    if (index < lastStepIndex) {
                        step.classList.add('completed');
                        step.classList.remove('active');
                    } else if (index === lastStepIndex) {
                        step.classList.add('active');
                    } else {
                        step.classList.remove('active', 'completed');
                    }
                });
            }

            // Показываем кнопку "Назад" для последнего шага
            if (modalBackBtn && modalBackBtn.length) {
                modalBackBtn.forEach(btn => {
                    btn.style.display = 'block';
                });
            }

            // Обновляем текущий шаг
            currentStep = lastStepIndex;
            console.log('Показан последний шаг:', currentStep);
        }
    }

    // Инициализация
    resetSteps();
});

// Функция для создания модального окна в DOM (вызывается один раз)
function createOrderModal() {
    // Проверяем, существует ли уже модальное окно
    if (document.querySelector('.modal-project-overlay')) return;

    // Создаем структуру модального окна
    const modalHTML = `
        <div class="modal-project-overlay">
            <div class="modal-project">
                <div class="modal-project-decoration"></div>
                <button class="modal-close-btn" aria-label="Закрыть"></button>
                
                <div class="modal-project-image">
                    <div class="modal-project-image-inner" style="background-image: url('images/portfolio-1.jpg');"></div>
                </div>
                
                <div class="modal-project-content">
                    <div class="modal-form-content">
                        <h2 class="modal-project-title">Заказать проект кухни</h2>
                        <p class="modal-project-subtitle">Заполните форму, и мы свяжемся с вами для обсуждения деталей</p>
                        
                        <div class="modal-project-steps">
                            <div class="modal-step active">
                                <div class="modal-step-number">1</div>
                                <div class="modal-step-label">Контактные данные</div>
                            </div>
                            <div class="modal-step">
                                <div class="modal-step-number">2</div>
                                <div class="modal-step-label">Детали проекта</div>
                            </div>
                            <div class="modal-step">
                                <div class="modal-step-number">3</div>
                                <div class="modal-step-label">Готово</div>
                            </div>
                        </div>
                        
                        <form class="modal-project-form" action="includes/send-email.php" method="POST">
                            <div class="modal-form-step active">
                                <div class="floating-group">
                                    <input type="text" class="floating-input" id="modal-name" name="name" placeholder=" " required>
                                    <label for="modal-name" class="floating-label">Ваше имя</label>
                                </div>
                                
                                <div class="floating-group">
                                    <input type="tel" class="floating-input" id="modal-phone" name="phone" placeholder=" " required>
                                    <label for="modal-phone" class="floating-label">Ваш телефон</label>
                                </div>
                                
                                <div class="floating-group">
                                    <input type="email" class="floating-input" id="modal-email" name="email" placeholder=" ">
                                    <label for="modal-email" class="floating-label">Ваш email (необязательно)</label>
                                </div>
                                
                                <div class="modal-project-footer">
                                    <button type="button" class="modal-step-btn modal-submit-btn">Следующий шаг</button>
                                </div>
                            </div>
                            
                            <div class="modal-form-step">
                                <div class="floating-group">
                                    <select class="floating-input" id="modal-style" name="style" required>
                                        <option value=""></option>
                                        <option value="Современный">Современный</option>
                                        <option value="Классический">Классический</option>
                                        <option value="Неоклассика">Неоклассика</option>
                                        <option value="Лофт">Лофт</option>
                                        <option value="Минимализм">Минимализм</option>
                                        <option value="Другой">Другой</option>
                                    </select>
                                    <label for="modal-style" class="floating-label">Стиль кухни</label>
                                </div>
                                
                                <div class="floating-group">
                                    <textarea class="floating-input floating-textarea" id="modal-message" name="message" placeholder=" " required></textarea>
                                    <label for="modal-message" class="floating-label">Пожелания к проекту</label>
                                </div>
                                
                                <div class="modal-project-footer">
                                    <button type="button" class="modal-back-btn">Назад</button>
                                    <button type="button" class="modal-step-btn modal-submit-btn">Следующий шаг</button>
                                </div>
                            </div>
                            
                            <div class="modal-form-step">
                                <div class="floating-group">
                                    <select class="floating-input" id="modal-budget" name="budget" required>
                                        <option value=""></option>
                                        <option value="до 500 000 ₽">до 500 000 ₽</option>
                                        <option value="500 000 - 1 000 000 ₽">500 000 - 1 000 000 ₽</option>
                                        <option value="1 000 000 - 2 000 000 ₽">1 000 000 - 2 000 000 ₽</option>
                                        <option value="от 2 000 000 ₽">от 2 000 000 ₽</option>
                                    </select>
                                    <label for="modal-budget" class="floating-label">Примерный бюджет</label>
                                </div>
                                
                                <div class="floating-group">
                                    <input type="text" class="floating-input" id="modal-address" name="address" placeholder=" ">
                                    <label for="modal-address" class="floating-label">Адрес (необязательно)</label>
                                </div>
                                
                                <div class="modal-privacy">
                                    <input type="checkbox" id="modal-privacy" name="privacy" class="modal-privacy-checkbox" required>
                                    <label for="modal-privacy" class="modal-privacy-text">
                                        Я согласен с <a href="pages/privacy.html" target="_blank">политикой конфиденциальности</a>
                                    </label>
                                </div>
                                
                                <div class="modal-project-footer">
                                    <button type="button" class="modal-back-btn">Назад</button>
                                    <button type="submit" class="modal-submit-btn">Отправить заявку</button>
                                </div>
                            </div>
                        </form>
                    </div>
                    
                    <div class="modal-success">
                        <div class="modal-success-icon">✓</div>
                        <h3 class="modal-success-title">Ваша заявка готова!</h3>
                        <p class="modal-success-message">Ваша заявка успешно отправлена! Для более оперативной связи рекомендуем также отправить заявку в WhatsApp нашему менеджеру.</p>
                        <button class="modal-success-btn">Закрыть</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Добавляем модальное окно в конец body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}