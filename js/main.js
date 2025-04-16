document.addEventListener('DOMContentLoaded', () => {
    // Прелоадер
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 300);
        }, 1000);
    }

    // Эффект липкой шапки при прокрутке
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // Мобильное меню
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const hamburger = document.querySelector('.hamburger');

    if (menuToggle && mainNav && hamburger) {
        menuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            hamburger.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });

        // Добавляем класс active для гамбургера
        if (!hamburger.classList.contains('active-styles')) {
            const style = document.createElement('style');
            style.textContent = `
                .hamburger.active span:first-child {
                    transform: rotate(45deg);
                    top: 9px;
                    background-color: var(--color-primary) !important;
                }
                .hamburger.active span:last-child {
                    transform: rotate(-45deg);
                    bottom: 9px;
                    background-color: var(--color-primary) !important;
                }
                body.no-scroll {
                    overflow: hidden;
                }
            `;
            document.head.appendChild(style);
            hamburger.classList.add('active-styles');
        }
    }

    // Анимация элементов при скролле
    const reveal = () => {
        const reveals = document.querySelectorAll('.reveal');

        reveals.forEach(element => {
            const windowHeight = window.innerHeight;
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;

            if (elementTop < windowHeight - elementVisible) {
                element.classList.add('active');
            }
        });
    };

    // Применяем класс reveal к элементам, которые нужно анимировать
    const sections = document.querySelectorAll('section:not(.hero)');
    sections.forEach(section => {
        if (!section.classList.contains('reveal')) {
            section.classList.add('reveal');
        }
    });

    window.addEventListener('scroll', reveal);
    reveal();

    // Валидация формы
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            let isValid = true;
            const name = document.getElementById('name');
            const phone = document.getElementById('phone');

            // Проверка имени
            if (name.value.trim() === '') {
                isValid = false;
                name.classList.add('is-invalid');
                if (!name.nextElementSibling || !name.nextElementSibling.classList.contains('invalid-feedback')) {
                    const feedback = document.createElement('div');
                    feedback.classList.add('invalid-feedback');
                    feedback.textContent = 'Пожалуйста, введите ваше имя';
                    name.after(feedback);
                }
            } else {
                name.classList.remove('is-invalid');
                if (name.nextElementSibling && name.nextElementSibling.classList.contains('invalid-feedback')) {
                    name.nextElementSibling.remove();
                }
            }

            // Проверка телефона
            const phoneRegex = /^(\+7|7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
            if (phone.value.trim() === '' || !phoneRegex.test(phone.value)) {
                isValid = false;
                phone.classList.add('is-invalid');
                if (!phone.nextElementSibling || !phone.nextElementSibling.classList.contains('invalid-feedback')) {
                    const feedback = document.createElement('div');
                    feedback.classList.add('invalid-feedback');
                    feedback.textContent = 'Пожалуйста, введите корректный номер телефона';
                    phone.after(feedback);
                }
            } else {
                phone.classList.remove('is-invalid');
                if (phone.nextElementSibling && phone.nextElementSibling.classList.contains('invalid-feedback')) {
                    phone.nextElementSibling.remove();
                }
            }

            if (!isValid) {
                e.preventDefault();
            }
        });
    }

    // Плавный скролл для якорных ссылок
    const smoothScroll = (target) => {
        const element = document.querySelector(target);
        if (element) {
            window.scrollTo({
                top: element.offsetTop - 100,
                behavior: 'smooth'
            });
        }
    };

    const anchors = document.querySelectorAll('a[href^="#"]:not([href="#"])');
    anchors.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            smoothScroll(this.getAttribute('href'));
        });
    });

    // Простой слайдер для отзывов (без автопрокрутки)
    const createSimpleSlider = () => {
        const sliders = document.querySelectorAll('.testimonials-slider');
        sliders.forEach(slider => {
            // Если у слайдера больше двух элементов, добавляем навигацию
            const slides = slider.querySelectorAll('.testimonial-item');
            if (slides.length > 2) {
                // Создаем контейнер для слайдов
                const slidesContainer = document.createElement('div');
                slidesContainer.classList.add('slides-container');

                // Перемещаем слайды в контейнер
                Array.from(slides).forEach(slide => {
                    slidesContainer.appendChild(slide);
                });

                // Добавляем контейнер в слайдер
                slider.appendChild(slidesContainer);

                // Создаем навигацию
                const nav = document.createElement('div');
                nav.classList.add('slider-nav');

                const prevBtn = document.createElement('button');
                prevBtn.classList.add('nav-btn', 'prev-btn');
                prevBtn.innerHTML = '&larr;';

                const nextBtn = document.createElement('button');
                nextBtn.classList.add('nav-btn', 'next-btn');
                nextBtn.innerHTML = '&rarr;';

                nav.appendChild(prevBtn);
                nav.appendChild(nextBtn);
                slider.appendChild(nav);

                // Добавляем стили для навигации
                const style = document.createElement('style');
                style.textContent = `
                    .testimonials-slider {
                        position: relative;
                    }
                    .slides-container {
                        display: flex;
                        overflow: hidden;
                    }
                    .testimonial-item {
                        flex: 0 0 100%;
                        transition: transform 0.3s ease;
                    }
                    .slider-nav {
                        display: flex;
                        justify-content: center;
                        margin-top: 30px;
                    }
                    .nav-btn {
                        background-color: transparent;
                        border: 1px solid var(--color-primary);
                        color: var(--color-primary);
                        width: 40px;
                        height: 40px;
                        border-radius: 50%;
                        margin: 0 10px;
                        cursor: pointer;
                        transition: var(--transition);
                    }
                    .nav-btn:hover {
                        background-color: var(--color-primary);
                        color: var(--color-white);
                    }
                `;
                document.head.appendChild(style);

                // Добавляем функционал навигации
                let currentIndex = 0;

                const showSlide = (index) => {
                    slidesContainer.style.transform = `translateX(-${index * 100}%)`;
                };

                prevBtn.addEventListener('click', () => {
                    currentIndex = (currentIndex > 0) ? currentIndex - 1 : slides.length - 1;
                    showSlide(currentIndex);
                });

                nextBtn.addEventListener('click', () => {
                    currentIndex = (currentIndex < slides.length - 1) ? currentIndex + 1 : 0;
                    showSlide(currentIndex);
                });

                // Показываем первый слайд
                showSlide(currentIndex);
            }
        });
    };

    // Вызываем функцию создания слайдера
    createSimpleSlider();

    // Инициализация AOS для анимаций
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 100,
            delay: 100,
            easing: 'ease-in-out'
        });
    }

    // Анимация появления для гексагонов
    const animateHexagons = () => {
        const hexItems = document.querySelectorAll('.hex-item');

        if (hexItems.length > 0) {
            // Последовательная анимация появления
            hexItems.forEach((item, index) => {
                // Начальное состояние
                item.style.opacity = '0';
                item.style.transform = 'scale(0.5)';
                item.style.transition = 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';

                // Задержка для каждого элемента по порядку
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                }, 100 + (index * 150));
            });

            // Специальная анимация для центрального элемента
            const centerHex = document.querySelector('.hex-center');
            if (centerHex) {
                centerHex.style.opacity = '0';
                centerHex.style.transform = 'scale(0.5) rotate(180deg)';
                centerHex.style.transition = 'all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)';

                setTimeout(() => {
                    centerHex.style.opacity = '1';
                    centerHex.style.transform = 'scale(1.05) rotate(0deg)';

                    // Добавляем эффект вспышки после появления
                    setTimeout(() => {
                        const flashEffect = document.createElement('div');
                        flashEffect.className = 'hex-flash';
                        flashEffect.style.cssText = `
                            position: absolute;
                            top: 0;
                            left: 0;
                            width: 100%;
                            height: 100%;
                            background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%);
                            opacity: 0;
                            clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
                            z-index: 10;
                            animation: flash 0.5s ease-out forwards;
                        `;

                        // Добавляем анимацию вспышки
                        const style = document.createElement('style');
                        style.textContent = `
                            @keyframes flash {
                                0% { opacity: 0; }
                                50% { opacity: 1; }
                                100% { opacity: 0; }
                            }
                        `;
                        document.head.appendChild(style);
                        centerHex.appendChild(flashEffect);

                        // Удаляем эффект после анимации
                        setTimeout(() => {
                            flashEffect.remove();
                        }, 500);
                    }, 300);
                }, 600);
            }
        }
    };

    // Эффект слежения за курсором для центрального гексагона
    const addHexCenterFollowEffect = () => {
        const centerHex = document.querySelector('.hex-center');
        const centerContent = centerHex ? centerHex.querySelector('.hex-content') : null;

        if (centerHex && centerContent) {
            // Добавляем глаза в центральный гексагон
            const eyesContainer = document.createElement('div');
            eyesContainer.className = 'hex-eyes';
            eyesContainer.style.cssText = `
                position: absolute;
                top: 20px;
                left: 0;
                width: 100%;
                display: flex;
                justify-content: center;
                gap: 60px;
                z-index: 5;
                opacity: 0;
                transition: opacity 0.3s ease;
            `;

            // Создаем два глаза
            for (let i = 0; i < 2; i++) {
                const eye = document.createElement('div');
                eye.className = 'hex-eye';
                eye.style.cssText = `
                    width: 20px;
                    height: 20px;
                    background-color: white;
                    border-radius: 50%;
                    position: relative;
                    overflow: hidden;
                `;

                const pupil = document.createElement('div');
                pupil.className = 'hex-pupil';
                pupil.style.cssText = `
                    width: 8px;
                    height: 8px;
                    background-color: var(--color-dark);
                    border-radius: 50%;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    transition: all 0.1s ease;
                `;

                eye.appendChild(pupil);
                eyesContainer.appendChild(eye);
            }

            centerHex.appendChild(eyesContainer);

            // Эффект появления глаз через несколько секунд
            setTimeout(() => {
                eyesContainer.style.opacity = '1';

                // Скрываем глаза через 5 секунд
                setTimeout(() => {
                    eyesContainer.style.opacity = '0';
                }, 50000);
            }, 2000);

            // Слежение за курсором
            document.addEventListener('mousemove', (e) => {
                const pupils = centerHex.querySelectorAll('.hex-pupil');
                const rect = centerHex.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;

                const maxDistance = 5; // максимальное смещение зрачка

                pupils.forEach(pupil => {
                    // Рассчитываем смещение зрачка
                    const deltaX = Math.min(maxDistance, Math.max(-maxDistance, (e.clientX - centerX) / 20));
                    const deltaY = Math.min(maxDistance, Math.max(-maxDistance, (e.clientY - centerY) / 20));

                    pupil.style.transform = `translate(calc(-50% + ${deltaX}px), calc(-50% + ${deltaY}px))`;
                });
            });
        }
    };

    // Инициализация анимаций мозаики в разделе "О нас"
    const animateAboutSection = () => {
        const aboutSection = document.querySelector('.about-short');
        const mosaic = document.querySelector('.about-mosaic');

        if (aboutSection && mosaic) {
            // Анимация основного изображения
            const mainImage = mosaic.querySelector('.mosaic-main');
            if (mainImage) {
                mainImage.style.opacity = '0';
                mainImage.style.transform = 'translateY(50px)';
                mainImage.style.transition = 'all 0.8s ease-out';

                setTimeout(() => {
                    mainImage.style.opacity = '1';
                    mainImage.style.transform = 'translateY(0)';
                }, 300);
            }

            // Анимация карточек мозаики
            const mosaicItems = mosaic.querySelectorAll('.mosaic-item');
            if (mosaicItems.length) {
                mosaicItems.forEach((item, index) => {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';

                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 600 + (index * 150));
                });
            }

            // Анимация бейджа с опытом
            const expBadge = mosaic.querySelector('.experience-badge');
            if (expBadge) {
                expBadge.style.opacity = '0';
                expBadge.style.transform = 'scale(0.5)';
                expBadge.style.transition = 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';

                setTimeout(() => {
                    expBadge.style.opacity = '1';
                    expBadge.style.transform = 'scale(1)';

                    // Добавляем эффект счетчика для числа лет
                    const expNumber = expBadge.querySelector('.exp-number');
                    if (expNumber) {
                        const finalNumber = parseInt(expNumber.textContent);
                        let currentNumber = 0;

                        expNumber.textContent = '0';

                        const interval = setInterval(() => {
                            currentNumber++;
                            expNumber.textContent = currentNumber;

                            if (currentNumber >= finalNumber) {
                                clearInterval(interval);
                            }
                        }, 60);
                    }
                }, 1200);
            }

            // Анимация текстового контента
            const aboutContent = document.querySelector('.about-content');
            if (aboutContent) {
                const tagline = aboutContent.querySelector('.about-tagline');
                const title = aboutContent.querySelector('.section-title');
                const separator = aboutContent.querySelector('.about-separator');
                const features = aboutContent.querySelectorAll('.about-feature');
                const button = aboutContent.querySelector('.btn-about');

                // Анимируем заголовок
                if (tagline) {
                    tagline.style.opacity = '0';
                    tagline.style.transform = 'translateX(-20px)';
                    tagline.style.transition = 'all 0.5s ease-out';

                    setTimeout(() => {
                        tagline.style.opacity = '1';
                        tagline.style.transform = 'translateX(0)';
                    }, 300);
                }

                if (title) {
                    title.style.opacity = '0';
                    title.style.transform = 'translateY(20px)';
                    title.style.transition = 'all 0.5s ease-out';

                    setTimeout(() => {
                        title.style.opacity = '1';
                        title.style.transform = 'translateY(0)';
                    }, 500);
                }

                if (separator) {
                    separator.style.width = '0';
                    separator.style.transition = 'width 0.8s ease-out';

                    setTimeout(() => {
                        separator.style.width = '80px';
                    }, 700);
                }

                // Анимируем особенности
                if (features.length) {
                    features.forEach((feature, index) => {
                        feature.style.opacity = '0';
                        feature.style.transform = 'translateY(20px)';
                        feature.style.transition = 'all 0.5s ease-out';

                        setTimeout(() => {
                            feature.style.opacity = '1';
                            feature.style.transform = 'translateY(0)';

                            // Эффект вращения для иконок при появлении
                            const icon = feature.querySelector('.feature-icon');
                            if (icon) {
                                icon.style.transform = 'rotateY(180deg)';

                                setTimeout(() => {
                                    icon.style.transform = 'rotateY(0)';
                                    icon.style.transition = 'transform 0.5s ease-out';
                                }, 100);
                            }
                        }, 900 + (index * 200));
                    });
                }

                // Анимируем кнопку
                if (button) {
                    button.style.opacity = '0';
                    button.style.transform = 'translateY(20px)';
                    button.style.transition = 'all 0.5s ease-out';

                    setTimeout(() => {
                        button.style.opacity = '1';
                        button.style.transform = 'translateY(0)';
                    }, features.length ? 900 + (features.length * 200) + 200 : 1100);
                }
            }
        }
    };

    // Запускаем анимацию для раздела "О нас" при прокрутке
    const initAboutAnimation = () => {
        const aboutSection = document.querySelector('.about-short');

        if (aboutSection) {
            const aboutObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateAboutSection();
                        aboutObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.2 });

            aboutObserver.observe(aboutSection);
        }
    };

    // Добавляем интерактивные эффекты для мозаики
    const addMosaicInteraction = () => {
        const mosaic = document.querySelector('.about-mosaic');

        if (mosaic) {
            // Эффект волны в мозаике при движении мыши
            const mosaicMain = mosaic.querySelector('.mosaic-main');
            const mosaicItems = mosaic.querySelectorAll('.mosaic-item');

            if (mosaicMain) {
                mosaicMain.addEventListener('mousemove', (e) => {
                    const rect = mosaicMain.getBoundingClientRect();
                    const mouseX = e.clientX - rect.left;
                    const mouseY = e.clientY - rect.top;

                    // Рассчитываем позицию мыши в процентах
                    const percentX = mouseX / rect.width;
                    const percentY = mouseY / rect.height;

                    // Создаем эффект перемещения изображения
                    const img = mosaicMain.querySelector('.mosaic-img');
                    if (img) {
                        const moveX = (percentX - 0.5) * 20;
                        const moveY = (percentY - 0.5) * 20;
                        img.style.transform = `translate(${moveX}px, ${moveY}px)`;
                    }

                    // Эффект параллакса для мозаики
                    mosaicItems.forEach((item, index) => {
                        const moveFactorX = ((index % 2) ? -1 : 1) * (percentX - 0.5) * 10;
                        const moveFactorY = ((index < 2) ? -1 : 1) * (percentY - 0.5) * 10;
                        item.style.transform = `translate(${moveFactorX}px, ${moveFactorY}px)`;
                    });
                });

                // Возвращаем все в исходное положение при уходе мыши
                mosaicMain.addEventListener('mouseleave', () => {
                    const img = mosaicMain.querySelector('.mosaic-img');
                    if (img) {
                        img.style.transform = 'translate(0, 0)';
                    }

                    mosaicItems.forEach(item => {
                        item.style.transform = 'translate(0, 0)';
                    });
                });
            }

            // Эффект при наведении на бейдж с опытом
            const expBadge = mosaic.querySelector('.experience-badge');
            if (expBadge) {
                expBadge.addEventListener('mouseenter', () => {
                    // Добавляем эффект пульсации
                    expBadge.style.animation = 'pulse 1s ease-in-out infinite';

                    // Увеличиваем размер
                    setTimeout(() => {
                        expBadge.style.transform = 'scale(1.1)';
                    }, 100);

                    // Эффект вспышки
                    const flash = document.createElement('div');
                    flash.style.cssText = `
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        border-radius: 50%;
                        background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%);
                        opacity: 0;
                        z-index: 10;
                        animation: flash 0.5s ease-out forwards;
                    `;

                    expBadge.appendChild(flash);

                    setTimeout(() => {
                        flash.remove();
                    }, 500);
                });

                expBadge.addEventListener('mouseleave', () => {
                    // Убираем эффекты
                    expBadge.style.animation = 'float 5s infinite ease-in-out';
                    expBadge.style.transform = 'scale(1)';
                });
            }

            // Интерактивные иконки в особенностях
            const aboutFeatures = document.querySelectorAll('.about-feature');
            if (aboutFeatures.length) {
                aboutFeatures.forEach(feature => {
                    const icon = feature.querySelector('.feature-icon');

                    if (icon) {
                        feature.addEventListener('mouseenter', () => {
                            // Анимация иконки при наведении
                            icon.style.transform = 'rotateY(180deg)';
                            icon.style.backgroundColor = 'var(--color-primary)';
                            icon.style.color = 'var(--color-white)';
                        });

                        feature.addEventListener('mouseleave', () => {
                            // Возвращаем к исходному состоянию
                            icon.style.transform = 'rotateY(0)';
                            icon.style.backgroundColor = 'rgba(136, 106, 74, 0.1)';
                            icon.style.color = 'var(--color-primary)';
                        });
                    }
                });
            }
        }
    };

    // Инициализация фильтрации и слайдера для портфолио
    const initPortfolio = () => {
        const portfolioSection = document.querySelector('.portfolio');
        if (!portfolioSection) return;

        // Фильтрация проектов
        const filterButtons = portfolioSection.querySelectorAll('.filter-btn');
        const portfolioItems = portfolioSection.querySelectorAll('.portfolio-item');
        let currentFilter = 'all';
        let isAnimating = false;

        if (filterButtons.length && portfolioItems.length) {
            // Инициализация - показать все проекты при загрузке
            portfolioItems.forEach(item => {
                item.style.display = 'block';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            });

            // Функция для плавной фильтрации
            const filterPortfolio = (filter) => {
                if (isAnimating || filter === currentFilter) return;
                isAnimating = true;
                currentFilter = filter;

                // Сначала скрываем все элементы
                const itemsToHide = Array.from(portfolioItems).filter(item => {
                    const category = item.getAttribute('data-category');
                    return filter !== 'all' && category !== filter;
                });

                const itemsToShow = Array.from(portfolioItems).filter(item => {
                    const category = item.getAttribute('data-category');
                    return filter === 'all' || category === filter;
                });

                // Последовательность анимации: сначала скрываем ненужные
                const hidePromise = new Promise(resolve => {
                    if (itemsToHide.length === 0) {
                        resolve();
                        return;
                    }

                    let hiddenCount = 0;
                    itemsToHide.forEach(item => {
                        item.style.opacity = '0';
                        item.style.transform = 'translateY(20px)';
                    });

                    // Короткий таймаут для плавного скрытия
                    setTimeout(() => {
                        itemsToHide.forEach(item => {
                            item.style.display = 'none';
                        });
                        resolve();
                    }, 300);
                });

                // Затем показываем нужные
                hidePromise.then(() => {
                    // Стабилизация высоты контейнера
                    const showcase = portfolioSection.querySelector('.portfolio-showcase');
                    if (showcase) {
                        showcase.style.minHeight = `${showcase.offsetHeight}px`;
                    }

                    // Обновляем стили для элементов, которые нужно показать
                    itemsToShow.forEach((item, index) => {
                        // Вначале устанавливаем display, но сохраняем opacity 0
                        item.style.display = 'block';
                        item.style.opacity = '0';
                        item.style.transform = 'translateY(20px)';

                        // С небольшой задержкой делаем видимыми
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0)';

                            // Снимаем блокировку после окончания анимации последнего элемента
                            if (index === itemsToShow.length - 1) {
                                setTimeout(() => {
                                    isAnimating = false;
                                    if (showcase) {
                                        showcase.style.minHeight = '';
                                    }
                                }, 300);
                            }
                        }, 50 * index);
                    });

                    // Если нет элементов для показа, снимаем блокировку
                    if (itemsToShow.length === 0) {
                        setTimeout(() => {
                            isAnimating = false;
                            if (showcase) {
                                showcase.style.minHeight = '';
                            }
                        }, 300);
                    }
                });

                // Обновляем счетчик и навигацию
                updateSlide(true);
            };

            // Обработчики для кнопок фильтрации
            filterButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    // Обновляем активный класс
                    filterButtons.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');

                    // Применяем фильтрацию
                    const filter = btn.getAttribute('data-filter');
                    filterPortfolio(filter);
                });
            });
        }

        // Слайдер портфолио
        const portfolioSlider = {
            current: 0,
            total: portfolioItems.length,
            showPerPage: window.innerWidth > 991 ? 2 : 1
        };

        const updateSlide = (resetCurrent = false) => {
            if (resetCurrent) {
                portfolioSlider.current = 0;
            }

            // Определяем видимые элементы в зависимости от текущего фильтра
            const visibleItems = Array.from(portfolioItems).filter(item => {
                if (currentFilter === 'all') return true;
                return item.getAttribute('data-category') === currentFilter;
            });

            // Обновляем общее количество для текущего фильтра
            portfolioSlider.total = visibleItems.length;

            // Обновляем счетчик слайдов
            const currentSlide = portfolioSection.querySelector('.current-slide');
            if (currentSlide) {
                currentSlide.textContent = (portfolioSlider.current + 1).toString().padStart(2, '0');
            }

            // Обновляем общее количество слайдов
            const totalSlides = portfolioSection.querySelector('.total-slides');
            if (totalSlides) {
                const totalPages = Math.ceil(portfolioSlider.total / portfolioSlider.showPerPage);
                totalSlides.textContent = totalPages.toString().padStart(2, '0');
            }

            // Сначала скрываем все элементы, чтобы предотвратить кратковременное появление всех карточек
            visibleItems.forEach(item => {
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
            });

            // Небольшая задержка для гарантии, что предыдущие элементы скрылись
            setTimeout(() => {
                // Показываем только те элементы, которые соответствуют текущему фильтру и слайду
                visibleItems.forEach((item, index) => {
                    const startIndex = portfolioSlider.current * portfolioSlider.showPerPage;
                    const endIndex = startIndex + portfolioSlider.showPerPage;

                    if (index >= startIndex && index < endIndex) {
                        item.style.display = 'block';
                        // Плавное появление с задержкой
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0)';
                        }, 50 * (index - startIndex));
                    } else {
                        // Скрываем те, которые не в текущем слайде
                        item.style.display = 'none';
                    }
                });
            }, 50);
        };

        // Инициализация кнопок навигации
        const prevButton = portfolioSection.querySelector('.nav-arrow.prev');
        const nextButton = portfolioSection.querySelector('.nav-arrow.next');

        if (prevButton && nextButton) {
            prevButton.addEventListener('click', () => {
                if (portfolioSlider.current > 0 && !isAnimating) {
                    isAnimating = true;
                    portfolioSlider.current--;
                    updateSlide();
                    setTimeout(() => {
                        isAnimating = false;
                    }, 600);
                }
            });

            nextButton.addEventListener('click', () => {
                const visibleItems = Array.from(portfolioItems).filter(item => {
                    if (currentFilter === 'all') return true;
                    return item.getAttribute('data-category') === currentFilter;
                });

                const maxPages = Math.ceil(visibleItems.length / portfolioSlider.showPerPage);

                if (portfolioSlider.current < maxPages - 1 && !isAnimating) {
                    isAnimating = true;
                    portfolioSlider.current++;
                    updateSlide();
                    setTimeout(() => {
                        isAnimating = false;
                    }, 600);
                }
            });
        }

        // Установка начального состояния
        updateSlide();

        // Обработка изменения размера окна
        window.addEventListener('resize', () => {
            const oldShowPerPage = portfolioSlider.showPerPage;
            portfolioSlider.showPerPage = window.innerWidth > 991 ? 2 : 1;

            if (oldShowPerPage !== portfolioSlider.showPerPage) {
                // Сбрасываем текущий слайд при изменении количества отображаемых элементов
                portfolioSlider.current = 0;
                updateSlide();
            }
        });

        // Добавляем эффект параллакса для элементов портфолио
        const portfolioCards = portfolioSection.querySelectorAll('.portfolio-card');

        if (portfolioCards.length) {
            portfolioCards.forEach(card => {
                card.addEventListener('mousemove', (e) => {
                    // Проверяем, не мобильное ли устройство
                    if (window.innerWidth <= 768) return;

                    const rect = card.getBoundingClientRect();
                    const mouseX = e.clientX - rect.left;
                    const mouseY = e.clientY - rect.top;

                    // Рассчитываем позицию мыши в процентах от размера карточки
                    const percentX = mouseX / rect.width;
                    const percentY = mouseY / rect.height;

                    // Применяем небольшой 3D эффект
                    const moveX = (percentX - 0.5) * 10;
                    const moveY = (percentY - 0.5) * 10;

                    card.style.transform = `translateY(-10px) rotateX(${-moveY}deg) rotateY(${moveX}deg)`;
                    card.style.boxShadow = `${moveX * 0.5}px ${moveY * 0.5}px 30px rgba(0, 0, 0, 0.4)`;
                });

                card.addEventListener('mouseleave', () => {
                    card.style.transform = 'translateY(-10px) rotateX(0) rotateY(0)';
                    card.style.boxShadow = '0 30px 50px rgba(0, 0, 0, 0.4)';
                });
            });
        }
    };

    // Инициализация анимаций
    window.addEventListener('load', () => {
        animateHexagons();
        setTimeout(addHexCenterFollowEffect, 1000);
        initAboutAnimation();
        setTimeout(addMosaicInteraction, 2000);
        initPortfolio(); // Инициализация портфолио
    });
});