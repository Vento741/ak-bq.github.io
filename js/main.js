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
    if (contactForm && contactForm.getAttribute('action') === 'includes/send-email-phpmailer.php') {
        console.log('Инициализация валидации формы обратной связи в main.js');

        // Добавляем отличительный класс для разделения форм
        if (!contactForm.classList.contains('contact-form-main')) {
            contactForm.classList.add('contact-form-main');
        }

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
            } else {
                console.log('Форма прошла валидацию в main.js');

                // Меняем текст кнопки при отправке
                const submitBtn = contactForm.querySelector('.contact-submit-btn');
                if (submitBtn) {
                    const originalText = submitBtn.textContent;
                    submitBtn.textContent = 'Отправляем...';
                    submitBtn.disabled = true;

                    // Через 3 секунды возвращаем исходное состояние, если функция отправки не сработала
                    setTimeout(() => {
                        if (submitBtn.disabled) {
                            submitBtn.textContent = originalText;
                            submitBtn.disabled = false;
                        }
                    }, 3000);
                }
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

    // Инициализация анимаций
    window.addEventListener('load', () => {
        animateHexagons();
        setTimeout(addHexCenterFollowEffect, 1000);
        initAboutAnimation();
        setTimeout(addMosaicInteraction, 2000);
    });
});