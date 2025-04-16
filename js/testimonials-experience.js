document.addEventListener('DOMContentLoaded', () => {
    // Инициализация интерактивного опыта отзывов
    initTestimonialsExperience();

    function initTestimonialsExperience() {
        const testimonialsSection = document.querySelector('.testimonials');
        if (!testimonialsSection) return;

        // Создаем 3D-стену отзывов
        const testimonialWall = document.querySelector('.testimonial-wall');
        if (!testimonialWall) return;

        // Карточки отзывов
        const testimonialCards = document.querySelectorAll('.testimonial-card');

        // Начальная активная карточка
        if (testimonialCards.length > 0) {
            testimonialCards[0].classList.add('active');
        }

        // Добавляем клик по карточкам
        testimonialCards.forEach(card => {
            card.addEventListener('click', () => {
                // Удаляем активный класс со всех карточек
                testimonialCards.forEach(c => c.classList.remove('active'));

                // Добавляем активный класс на текущую карточку
                card.classList.add('active');

                // Эффект вспышки при активации
                createFlashEffect(card);
            });
        });

        // Эффект параллакса при движении мыши
        const testimonialGallery = document.querySelector('.testimonials-gallery');
        if (testimonialGallery) {
            testimonialGallery.addEventListener('mousemove', (e) => {
                // На мобильных устройствах отключаем эффект
                if (window.innerWidth <= 768) return;

                const rect = testimonialGallery.getBoundingClientRect();
                const mouseX = e.clientX - rect.left;
                const mouseY = e.clientY - rect.top;

                // Рассчитываем смещение относительно центра галереи
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const offsetX = (mouseX - centerX) / centerX;
                const offsetY = (mouseY - centerY) / centerY;

                // Применяем эффект параллакса к стене
                testimonialWall.style.transform = `translateX(${offsetX * 20}px) translateY(${offsetY * 20}px) rotateY(${offsetX * 5}deg) rotateX(${-offsetY * 5}deg)`;

                // Каждая карточка имеет свой небольшой эффект движения
                testimonialCards.forEach(card => {
                    const depthFactor = card.classList.contains('active') ? 1.5 : 1;
                    const cardRect = card.getBoundingClientRect();
                    const cardCenterX = cardRect.left + cardRect.width / 2 - rect.left;
                    const cardCenterY = cardRect.top + cardRect.height / 2 - rect.top;

                    const cardOffsetX = (mouseX - cardCenterX) / rect.width;
                    const cardOffsetY = (mouseY - cardCenterY) / rect.height;

                    // Чем дальше от карточки, тем меньше влияние
                    card.style.transform = `
                        translate(${-cardOffsetX * 10 * depthFactor}px, ${-cardOffsetY * 10 * depthFactor}px)
                        rotateY(${cardOffsetX * 10 * depthFactor}deg)
                        rotateX(${-cardOffsetY * 10 * depthFactor}deg)
                        scale(${card.classList.contains('active') ? 1 : 0.8})
                        translateZ(${card.classList.contains('active') ? 50 : 0}px)
                    `;
                });
            });

            // Возвращаем к исходному положению при уходе курсора
            testimonialGallery.addEventListener('mouseleave', () => {
                // Плавно возвращаем стену в исходное положение
                testimonialWall.style.transform = 'translateX(0) translateY(0) rotateY(0) rotateX(0)';

                // Возвращаем карточки в исходное положение
                testimonialCards.forEach(card => {
                    card.style.transform = `
                        translate(0, 0)
                        rotateY(0)
                        rotateX(0)
                        scale(${card.classList.contains('active') ? 1 : 0.8})
                        translateZ(${card.classList.contains('active') ? 50 : 0}px)
                    `;
                });
            });
        }

        // Эффект измененной перспективы при прокрутке
        window.addEventListener('scroll', () => {
            const scrollPosition = window.scrollY;
            const sectionTop = testimonialsSection.offsetTop;
            const sectionHeight = testimonialsSection.offsetHeight;

            // Если секция видна
            if (scrollPosition > sectionTop - window.innerHeight &&
                scrollPosition < sectionTop + sectionHeight) {

                // Рассчитываем относительную позицию прокрутки внутри секции
                const relativeScroll = (scrollPosition - (sectionTop - window.innerHeight)) /
                    (sectionHeight + window.innerHeight);

                // Изменяем перспективу в зависимости от прокрутки
                if (testimonialGallery) {
                    testimonialGallery.style.perspective = `${1000 + relativeScroll * 500}px`;
                }

                // Эффект вращения для стены
                if (testimonialWall && !testimonialWall.classList.contains('grid-mode')) {
                    testimonialWall.style.transform = `rotateX(${relativeScroll * 5}deg) rotateY(${relativeScroll * 5}deg)`;
                }
            }
        });

        // Кнопки для изменения режимов отображения
        const experienceButtons = document.querySelectorAll('.experience-button');
        // Определяем текущий режим просмотра
        let currentViewMode = 'perspective';

        experienceButtons.forEach(button => {
            button.addEventListener('click', () => {
                const mode = button.getAttribute('data-mode');
                currentViewMode = mode;

                // Обновляем активный класс кнопок
                experienceButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                // Применяем соответствующий режим
                applyViewMode(mode);
            });
        });

        // При изменении размера окна, обновляем текущий режим просмотра
        window.addEventListener('resize', () => {
            if (currentViewMode === 'grid') {
                applyViewMode('grid');
            }
        });

        // Случайное перемещение карточек каждые 10 секунд, если пользователь не взаимодействует
        let interactionTimeout;
        let isInteracting = false;

        // Сбрасываем таймер при взаимодействии
        testimonialGallery.addEventListener('mousemove', () => {
            isInteracting = true;
            clearTimeout(interactionTimeout);
            interactionTimeout = setTimeout(() => {
                isInteracting = false;
            }, 5000);
        });

        // Обработка касаний для мобильных устройств
        testimonialGallery.addEventListener('touchstart', () => {
            isInteracting = true;
            clearTimeout(interactionTimeout);
            interactionTimeout = setTimeout(() => {
                isInteracting = false;
            }, 5000);
        });

        // Периодическое автоматическое перемещение
        setInterval(() => {
            if (!isInteracting && currentViewMode === 'perspective') {
                const randomIndex = Math.floor(Math.random() * testimonialCards.length);
                const randomCard = testimonialCards[randomIndex];

                // Имитируем клик по случайной карточке
                randomCard.click();
            }
        }, 8000);
    }

    // Применяет различные режимы просмотра отзывов
    function applyViewMode(mode) {
        const testimonialWall = document.querySelector('.testimonial-wall');
        const testimonialCards = document.querySelectorAll('.testimonial-card');
        const testimonialGallery = document.querySelector('.testimonials-gallery');

        // Сначала сбрасываем все трансформации и классы
        testimonialWall.style.transition = 'transform 1s ease';
        testimonialWall.classList.remove('grid-mode');
        testimonialCards.forEach(card => card.classList.remove('grid-item'));
        testimonialGallery.classList.remove('grid-mode-active');

        switch (mode) {
            case 'grid':
                // Добавляем классы для режима сетки
                testimonialWall.classList.add('grid-mode');
                testimonialGallery.classList.add('grid-mode-active');
                testimonialCards.forEach(card => card.classList.add('grid-item'));

                // На мобильных устройствах уменьшаем угол наклона
                const rotationDegree = window.innerWidth <= 768 ? 5 : 20;
                testimonialWall.style.transform = `rotateX(${rotationDegree}deg) rotateY(0deg)`;
                arrangeInGrid(testimonialCards);

                // Изменяем высоту галереи в зависимости от количества карточек и их размера
                adjustGalleryHeight(testimonialGallery, testimonialCards.length);
                break;

            case 'perspective':
                // Перспектива (по умолчанию)
                testimonialWall.style.transform = 'rotateY(0deg) rotateX(0deg)';
                resetCardPositions(testimonialCards);

                // Возвращаем исходную высоту галереи для режима 3D
                resetGalleryHeight(testimonialGallery);
                break;
        }
    }

    // Вспомогательные функции для режимов отображения
    function arrangeInGrid(cards) {
        // Определяем количество колонок в зависимости от ширины экрана
        let gridCols;
        if (window.innerWidth <= 320) {
            gridCols = 1;
        } else if (window.innerWidth <= 575) {
            gridCols = 1;
        } else if (window.innerWidth <= 768) {
            gridCols = 2;
        } else {
            gridCols = 3;
        }

        // Рассчитываем ширину плитки в процентах
        const gridWidth = window.innerWidth <= 768 ? (100 / gridCols - 5) : (100 / gridCols - 10);
        // Фиксированная высота строки для разных размеров экрана
        const rowHeight = window.innerWidth <= 320 ? 220 :
            window.innerWidth <= 575 ? 240 :
            window.innerWidth <= 768 ? 260 : 300;

        cards.forEach((card, index) => {
            const row = Math.floor(index / gridCols);
            const col = index % gridCols;

            // Вычисляем позицию с учетом размера экрана
            const leftPosition = window.innerWidth <= 768 ?
                (col * (100 / gridCols) + (100 / gridCols - gridWidth) / 2) :
                (col * (100 / gridCols) + 5);

            card.style.transition = 'all 0.8s ease';
            card.style.left = `${leftPosition}%`;
            card.style.top = `${row * rowHeight}px`;

            // Меняем масштаб карточки в зависимости от размера экрана
            const scale = window.innerWidth <= 320 ? 0.95 :
                window.innerWidth <= 575 ? 0.9 :
                window.innerWidth <= 768 ? 0.85 : 0.8;

            card.style.transform = `scale(${scale}) translateZ(0px)`;
            card.style.width = `${gridWidth}%`;
            card.style.opacity = '1';
        });
    }

    function resetCardPositions(cards) {
        // Возвращаем карточки в исходное положение
        cards.forEach((card, index) => {
            card.style.transition = 'all 0.8s ease';

            // Используем предопределенные позиции из CSS
            card.style.removeProperty('left');
            card.style.removeProperty('top');
            card.style.removeProperty('width');
            card.style.transform = 'scale(0.8) translateZ(0)';
            card.style.opacity = '0.6';

            // Позже удаляем inline стили для возврата к CSS стилям
            setTimeout(() => {
                card.style.removeProperty('transform');
                card.style.removeProperty('transition');
            }, 800);
        });
    }

    // Подстраиваем высоту галереи под количество карточек в режиме сетки
    function adjustGalleryHeight(gallery, cardCount) {
        if (!gallery) return;

        // Определяем количество колонок в зависимости от ширины экрана
        let gridCols;
        if (window.innerWidth <= 575) {
            gridCols = 1;
        } else if (window.innerWidth <= 768) {
            gridCols = 2;
        } else {
            gridCols = 3;
        }

        // Рассчитываем количество строк
        const rows = Math.ceil(cardCount / gridCols);

        // Высота одной строки с учетом отступов
        const rowHeight = window.innerWidth <= 320 ? 220 :
            window.innerWidth <= 575 ? 240 :
            window.innerWidth <= 768 ? 260 : 300;

        // Добавляем отступ снизу для последней строки
        const totalHeight = rows * rowHeight + 50;

        gallery.style.minHeight = `${totalHeight}px`;
    }

    // Сбрасываем высоту галереи до исходной
    function resetGalleryHeight(gallery) {
        if (!gallery) return;

        // Исходные значения высоты из CSS для разных размеров экрана
        let defaultHeight;
        if (window.innerWidth <= 320) {
            defaultHeight = '1000px';
        } else if (window.innerWidth <= 375) {
            defaultHeight = '950px';
        } else if (window.innerWidth <= 425) {
            defaultHeight = '900px';
        } else if (window.innerWidth <= 575) {
            defaultHeight = '800px';
        } else if (window.innerWidth <= 767) {
            defaultHeight = '700px';
        } else {
            defaultHeight = '500px';
        }

        gallery.style.minHeight = defaultHeight;
    }

    // Создает эффект вспышки при активации карточки
    function createFlashEffect(element) {
        const flash = document.createElement('div');
        flash.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border-radius: 10px;
            background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%);
            opacity: 0;
            z-index: 100;
            pointer-events: none;
            animation: flash 0.5s ease-out forwards;
        `;

        // Добавляем анимацию
        const style = document.createElement('style');
        style.textContent = `
            @keyframes flash {
                0% { opacity: 0; }
                50% { opacity: 0.5; }
                100% { opacity: 0; }
            }
        `;
        document.head.appendChild(style);

        element.appendChild(flash);

        // Удаляем эффект после завершения анимации
        setTimeout(() => {
            flash.remove();
            style.remove();
        }, 500);
    }
});