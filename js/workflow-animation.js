document.addEventListener('DOMContentLoaded', () => {
    // Инициализация анимации для раздела "Как мы работаем"
    initProcessAnimation();

    // Функция для анимации процесса работы
    function initProcessAnimation() {
        const processSection = document.querySelector('.process');

        if (!processSection) return;

        // Анимация карточек при скролле
        const processCards = document.querySelectorAll('.process-card');

        // Наблюдатель за появлением элементов
        const observerOptions = {
            threshold: 0.2,
            rootMargin: '0px 0px -100px 0px'
        };

        const processObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Добавляем класс с задержкой для последовательной анимации
                    setTimeout(() => {
                        entry.target.classList.add('animated');
                    }, index * 200);

                    // Обновляем прогресс-бар при появлении каждой карточки
                    updateProgressBar(index, processCards.length);

                    // Прекращаем наблюдение после появления
                    processObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Начинаем наблюдение за каждой карточкой
        processCards.forEach(card => {
            processObserver.observe(card);
        });

        // Интерактивное поведение карточек
        processCards.forEach(card => {
            // Добавляем взаимодействие при наведении только для десктопов
            if (window.innerWidth > 768) {
                card.addEventListener('mouseenter', () => {
                    // Добавляем тень и масштабирование
                    card.querySelector('.process-card-inner').style.boxShadow = '0 20px 40px rgba(227, 135, 79, 0.15)';
                });

                card.addEventListener('mouseleave', () => {
                    // Возвращаем исходный стиль
                    card.querySelector('.process-card-inner').style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.1)';
                });
            }

            // Оптимизация обработчика кликов для десктопов и тач-устройств
            card.addEventListener('click', (e) => {
                // Если мобильное устройство, то показываем обратную сторону и затем скрываем
                if (window.innerWidth <= 768) {
                    // Простое переключение класса для мобильных устройств
                    const cardInner = card.querySelector('.process-card-inner');

                    // Если карточка не перевернута, переворачиваем её
                    if (!cardInner.classList.contains('flipped')) {
                        cardInner.classList.add('flipped');
                        cardInner.style.transform = 'rotateY(180deg)';

                        // Автоматически возвращаем в исходное положение через 3 секунды
                        setTimeout(() => {
                            cardInner.classList.remove('flipped');
                            cardInner.style.transform = 'rotateY(0deg)';
                        }, 3000);
                    } else {
                        // Если карточка уже перевернута, возвращаем её в исходное положение
                        cardInner.classList.remove('flipped');
                        cardInner.style.transform = 'rotateY(0deg)';
                    }
                } else {
                    // Для десктопов продолжаем использовать цепную реакцию
                    const index = Array.from(processCards).indexOf(card);

                    // Переворачиваем последующие карточки с задержкой
                    processCards.forEach((nextCard, nextIndex) => {
                        if (nextIndex > index) {
                            setTimeout(() => {
                                nextCard.classList.add('temporarily-flipped');

                                // Возвращаем в исходное положение через 1.5 секунды
                                setTimeout(() => {
                                    nextCard.classList.remove('temporarily-flipped');
                                }, 1500);
                            }, (nextIndex - index) * 200);
                        }
                    });
                }
            });
        });

        // Добавляем CSS для временного переворота
        const style = document.createElement('style');
        style.textContent = `
            .process-card.temporarily-flipped .process-card-inner {
                transform: rotateY(180deg);
            }
            
            .process-card.temporarily-flipped .process-card-inner {
                animation: flip-and-back 1.5s forwards;
            }
            
            @keyframes flip-and-back {
                0% { transform: rotateY(0deg); }
                40% { transform: rotateY(180deg); }
                60% { transform: rotateY(180deg); }
                100% { transform: rotateY(0deg); }
            }
        `;
        document.head.appendChild(style);

        // Прокрутка до следующего элемента для мобильных устройств
        if (window.innerWidth <= 768) {
            setupMobileScrolling();
        }
    }

    // Обновление прогресс-бара
    function updateProgressBar(currentIndex, totalItems) {
        const progressBar = document.querySelector('.process-progress-bar');
        if (!progressBar) return;

        // Для мобильных устройств расчет прогресса по-другому,
        // т.к. карточки отображаются одна за другой
        const progressPercentage = ((currentIndex + 1) / totalItems) * 100;

        // Плавная анимация для прогресс-бара
        animateProgressBar(progressBar, progressPercentage);
    }

    // Функция анимации прогресс-бара для плавного перехода
    function animateProgressBar(progressBar, targetPercentage) {
        const currentWidth = parseFloat(progressBar.style.width) || 0;
        const increment = (targetPercentage - currentWidth) / 10;

        let currentProgress = currentWidth;
        const animation = setInterval(() => {
            currentProgress += increment;

            if ((increment > 0 && currentProgress >= targetPercentage) ||
                (increment < 0 && currentProgress <= targetPercentage)) {
                clearInterval(animation);
                progressBar.style.width = `${targetPercentage}%`;
            } else {
                progressBar.style.width = `${currentProgress}%`;
            }
        }, 30);
    }

    // Настройка прокрутки для мобильных устройств
    function setupMobileScrolling() {
        const processCards = document.querySelectorAll('.process-card');

        processCards.forEach((card, index) => {
            // Если не последняя карточка, добавляем индикатор прокрутки
            if (index < processCards.length - 1) {
                const scrollIndicator = document.createElement('div');
                scrollIndicator.className = 'scroll-indicator';
                scrollIndicator.innerHTML = `
                    <svg viewBox="0 0 24 24" width="15" height="15">
                        <path fill="none" stroke="currentColor" stroke-width="2" d="M7 10l5 5 5-5"/>
                    </svg>
                `;
                card.appendChild(scrollIndicator);

                // При клике на индикатор прокручиваем к следующей карточке
                scrollIndicator.addEventListener('click', (e) => {
                    e.stopPropagation(); // Предотвращаем запуск события клика на карточке
                    const nextCard = processCards[index + 1];

                    if (nextCard) {
                        nextCard.scrollIntoView({
                            behavior: 'smooth',
                            block: 'center'
                        });
                    }
                });
            }
        });

        // Добавляем стили для индикатора прокрутки
        const style = document.createElement('style');
        style.textContent = `
            .scroll-indicator {
                position: absolute;
                bottom: 5px;
                left: 50%;
                transform: translateX(-50%);
                width: 30px;
                height: 15px;
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                opacity: 0.6;
                transition: opacity 0.3s ease;
                z-index: 5;
                color: var(--color-primary);
                animation: bounce 1.5s infinite;
            }
            
            .scroll-indicator:hover {
                opacity: 1;
            }
            
            @keyframes bounce {
                0%, 20%, 50%, 80%, 100% { transform: translateY(0) translateX(-50%); }
                40% { transform: translateY(-5px) translateX(-50%); }
                60% { transform: translateY(-3px) translateX(-50%); }
            }
            
            @media (max-width: 767.98px) {
                .process-card {
                    margin-bottom: 15px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Следим за изменением размера окна для адаптивности
    window.addEventListener('resize', () => {
        // Перерисовываем линию соединения при изменении размера окна
        const processCards = document.querySelector('.process-cards');
        if (processCards && window.innerWidth > 991) {
            // Для десктопа показываем линию
            processCards.style.setProperty('--line-display', 'block');
        } else if (processCards) {
            // Для мобильных скрываем линию
            processCards.style.setProperty('--line-display', 'none');
        }

        // Перезагружаем страницу при переходе между мобильной и десктопной версией
        // чтобы корректно инициализировать все обработчики событий
        // (не рекомендуется для продакшена, но упрощает разработку)
        const wasMobile = window.innerWidth <= 768;
        const isMobile = window.innerWidth <= 768;

        if (wasMobile !== isMobile) {
            // Только если действительно изменился тип устройства,
            // можно перезагрузить, но лучше реинициализировать компонент
            // location.reload();

            // Альтернативный подход - динамическая реинициализация без перезагрузки
            const scrollIndicators = document.querySelectorAll('.scroll-indicator');
            scrollIndicators.forEach(indicator => indicator.remove());

            if (isMobile) {
                setupMobileScrolling();
            }
        }
    });
});