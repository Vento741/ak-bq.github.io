/**
 * Элитное портфолио - скрипт для плавной анимации и интерактивности
 */
document.addEventListener('DOMContentLoaded', () => {
    // Добавляем декоративные элементы
    const portfolioSection = document.querySelector('.portfolio');
    if (portfolioSection) {
        // Добавление декоративных линий
        const decorLineTop = document.createElement('div');
        decorLineTop.className = 'portfolio-decor-line top';

        const decorLineBottom = document.createElement('div');
        decorLineBottom.className = 'portfolio-decor-line bottom';

        // Добавление декоративных кругов
        const decorCircleLeft = document.createElement('div');
        decorCircleLeft.className = 'portfolio-decor-circle left';

        const decorCircleRight = document.createElement('div');
        decorCircleRight.className = 'portfolio-decor-circle right';

        // Добавляем все декоративные элементы в DOM
        portfolioSection.appendChild(decorLineTop);
        portfolioSection.appendChild(decorLineBottom);
        portfolioSection.appendChild(decorCircleLeft);
        portfolioSection.appendChild(decorCircleRight);
    }

    // Получаем элементы для карусели и фильтрации
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const prevBtn = document.querySelector('.nav-arrow.prev');
    const nextBtn = document.querySelector('.nav-arrow.next');
    const currentSlide = document.querySelector('.current-slide');
    const totalSlides = document.querySelector('.total-slides');

    // Выводим в консоль количество найденных элементов
    console.log(`Инициализация: найдено ${portfolioItems.length} элементов портфолио`);
    portfolioItems.forEach(item => {
        console.log(`  - Элемент категории: ${item.getAttribute('data-category')}`);
    });
    console.log(`Найдено ${filterBtns.length} кнопок фильтра`);
    filterBtns.forEach(btn => {
        console.log(`  - Кнопка фильтра: ${btn.getAttribute('data-filter')} (${btn.textContent})`);
    });

    // Определяем переменные
    let current = 1;
    let displayCount = window.innerWidth > 991 ? 2 : 1; // Сколько карточек отображаем одновременно

    // Переменная для отслеживания анимации (предотвращение множественных нажатий)
    let isAnimating = false;

    // Функция инициализации карточек - устанавливает базовые стили и классы
    function initItems() {
        if (!portfolioItems.length) return;

        // Проверяем наличие активной кнопки фильтра
        const activeFilterBtn = document.querySelector('.filter-btn.active');
        const currentFilter = activeFilterBtn ? activeFilterBtn.getAttribute('data-filter') : 'all';

        // Сначала скрываем все элементы
        portfolioItems.forEach(item => {
            // Устанавливаем классы скрытия в зависимости от фильтра
            if (currentFilter === 'all' || item.getAttribute('data-category') === currentFilter) {
                item.classList.remove('hidden');
            } else {
                item.classList.add('hidden');
            }

            // Устанавливаем начальные стили
            item.style.display = 'none';
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
        });

        // Сбрасываем текущую страницу
        current = 1;
    }

    // Функция обновления счетчика страниц
    function updateCounter() {
        if (!currentSlide || !totalSlides) return;

        // Получаем все видимые (не скрытые фильтром) элементы
        const activeItems = document.querySelectorAll('.portfolio-item:not(.hidden)');
        console.log(`Найдено активных элементов: ${activeItems.length}`);

        // Рассчитываем общее количество страниц
        const newTotal = Math.ceil(activeItems.length / displayCount);
        console.log(`Рассчитано страниц: ${newTotal}`);

        // Проверка валидности текущей страницы
        if (current > newTotal) {
            current = newTotal > 0 ? newTotal : 1;
            console.log(`Корректировка текущей страницы: ${current}`);
        }

        // Обновляем числа в навигации
        totalSlides.textContent = (newTotal > 0 ? newTotal : 1).toString().padStart(2, '0');
        currentSlide.textContent = current.toString().padStart(2, '0');
        console.log(`Отображается страница ${current} из ${totalSlides.textContent}`);

        // Обновляем состояние кнопок навигации перед обновлением видимости
        if (prevBtn && nextBtn) {
            // Деактивируем кнопки, если они не нужны
            prevBtn.disabled = current === 1;
            nextBtn.disabled = current === newTotal || newTotal <= 1;

            // Визуальное отображение состояния кнопок
            prevBtn.style.opacity = prevBtn.disabled ? '0.5' : '1';
            nextBtn.style.opacity = nextBtn.disabled ? '0.5' : '1';
            prevBtn.style.pointerEvents = prevBtn.disabled ? 'none' : 'auto';
            nextBtn.style.pointerEvents = nextBtn.disabled ? 'none' : 'auto';

            console.log(`Кнопка "назад" ${prevBtn.disabled ? 'отключена' : 'включена'}, кнопка "вперед" ${nextBtn.disabled ? 'отключена' : 'включена'}`);
        }

        // Обновляем видимость элементов
        updateVisibility(activeItems);
    }

    // Функция обновления видимости элементов
    function updateVisibility(items = document.querySelectorAll('.portfolio-item:not(.hidden)')) {
        // Блокируем дополнительные анимации во время выполнения текущей
        isAnimating = true;

        // Создаем массив из NodeList для более удобной работы с элементами
        const itemsArray = Array.from(items);

        // Вычисляем индексы для текущей страницы
        const startIndex = (current - 1) * displayCount;
        const endIndex = startIndex + displayCount;

        // Сначала плавно скрываем все элементы
        itemsArray.forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
        });

        // Затем через таймаут настраиваем display и показываем нужные
        setTimeout(() => {
            // Сначала скрываем все элементы
            itemsArray.forEach(item => {
                item.style.display = 'none';
            });

            // Затем показываем только те, которые должны быть на текущей странице
            let visibleCount = 0;
            const visibleItems = itemsArray.slice(startIndex, endIndex);

            visibleItems.forEach((item, index) => {
                // Показываем элементы текущей страницы
                item.style.display = 'block';
                visibleCount++;

                // С небольшой задержкой делаем их видимыми для анимации
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, 50 * (index + 1)); // Небольшая последовательная задержка для эффекта
            });

            // Если нет видимых элементов и есть предыдущие страницы, возвращаемся на предыдущую
            if (visibleCount === 0 && current > 1) {
                current--;
                // Рекурсивно вызываем updateVisibility с новым current
                updateVisibility(items);
                return;
            }

            // Разрешаем новые анимации после завершения текущей
            setTimeout(() => {
                isAnimating = false;
            }, 500);
        }, 300);
    }

    // Настройка фильтрации элементов
    if (filterBtns.length && portfolioItems.length) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Если анимация в процессе, отменяем действие
                if (isAnimating) return;

                // Определяем текущий фильтр
                const filterValue = this.getAttribute('data-filter');

                // Выводим в консоль для отладки
                console.log(`Применяем фильтр: ${filterValue}`);

                // Удаляем класс активности со всех кнопок
                filterBtns.forEach(btn => btn.classList.remove('active'));

                // Добавляем класс активности на текущую кнопку
                this.classList.add('active');

                // Сбрасываем текущую страницу при смене фильтра
                current = 1;

                // Временно делаем все элементы видимыми, чтобы правильно подсчитать
                portfolioItems.forEach(item => {
                    item.style.display = '';
                });

                // Обрабатываем элементы согласно фильтру
                let visibleCount = 0;
                portfolioItems.forEach(item => {
                    const itemCategory = item.getAttribute('data-category');
                    console.log(`Проверяем элемент: ${itemCategory}`);

                    if (filterValue === 'all' || itemCategory === filterValue) {
                        item.classList.remove('hidden');
                        visibleCount++;
                    } else {
                        item.classList.add('hidden');
                    }
                });

                console.log(`Найдено элементов с фильтром ${filterValue}: ${visibleCount}`);

                // Обновляем счетчик и видимость
                updateCounter();
            });
        });
    }

    // Настройка кнопок навигации
    if (prevBtn && nextBtn && currentSlide && totalSlides && portfolioItems.length) {
        // Обработчик для кнопки "назад"
        prevBtn.addEventListener('click', () => {
            if (isAnimating || current <= 1) return;

            current--;

            // Анимация изменения номера страницы
            currentSlide.classList.add('page-change');
            setTimeout(() => {
                currentSlide.classList.remove('page-change');
            }, 300);

            // Обновляем отображаемый номер страницы
            currentSlide.textContent = current.toString().padStart(2, '0');

            // Обновляем состояние кнопок и видимость элементов
            updateCounter();
        });

        // Обработчик для кнопки "вперед"
        nextBtn.addEventListener('click', () => {
            const maxPage = parseInt(totalSlides.textContent);
            if (isAnimating || current >= maxPage) return;

            current++;

            // Анимация изменения номера страницы
            currentSlide.classList.add('page-change');
            setTimeout(() => {
                currentSlide.classList.remove('page-change');
            }, 300);

            // Обновляем отображаемый номер страницы
            currentSlide.textContent = current.toString().padStart(2, '0');

            // Обновляем состояние кнопок и видимость элементов
            updateCounter();
        });

        // Инициализация элементов портфолио
        console.log('Инициализация элементов портфолио');
        initItems();

        // Проверка, есть ли активная кнопка фильтра
        const activeFilterBtn = document.querySelector('.filter-btn.active');
        if (!activeFilterBtn && filterBtns.length > 0) {
            // Если нет активной кнопки, активируем "Все проекты"
            const allFilterBtn = document.querySelector('.filter-btn[data-filter="all"]');
            if (allFilterBtn) {
                allFilterBtn.classList.add('active');
                console.log('Активирована кнопка "Все проекты"');
            }
        } else if (activeFilterBtn) {
            console.log(`Активирована кнопка "${activeFilterBtn.textContent}"`);
        }

        // Обновляем счетчик и видимость элементов
        updateCounter();

        // Переинициализация при изменении размера окна
        window.addEventListener('resize', () => {
            const newDisplayCount = window.innerWidth > 991 ? 2 : 1;
            if (newDisplayCount !== displayCount) {
                displayCount = newDisplayCount;
                console.log(`Изменено количество отображаемых элементов: ${displayCount}`);
                current = 1;
                updateCounter();
            }
        });
    }

    // Эффекты наведения на карточки
    const portfolioCards = document.querySelectorAll('.portfolio-card');

    if (portfolioCards.length) {
        portfolioCards.forEach(card => {
            // Параллакс-эффект для изображения при наведении
            card.addEventListener('mousemove', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const moveX = (x - centerX) * 0.01;
                const moveY = (y - centerY) * 0.01;

                const image = this.querySelector('.portfolio-image img');
                if (image) {
                    image.style.transform = `scale(1.05) translate(${moveX}px, ${moveY}px)`;
                }
            });

            // Возвращаем изображение в исходное положение, когда курсор уходит
            card.addEventListener('mouseleave', function() {
                const image = this.querySelector('.portfolio-image img');
                if (image) {
                    image.style.transform = 'scale(1)';

                    // Плавно возвращаем нормальную трансформацию при наведении
                    setTimeout(() => {
                        image.style.transition = 'transform 1.5s ease';
                    }, 100);
                }
            });

            // Отключаем transition при движении мыши для более плавного эффекта
            card.addEventListener('mouseenter', function() {
                const image = this.querySelector('.portfolio-image img');
                if (image) {
                    image.style.transition = 'none';
                }
            });
        });
    }

    // Добавляем эффект тени при прокрутке
    function updateScrollEffects() {
        const scrollY = window.scrollY;
        const portfolioSection = document.querySelector('.portfolio');

        if (portfolioSection) {
            const portfolioRect = portfolioSection.getBoundingClientRect();
            const portfolioTop = portfolioRect.top + window.scrollY;
            const portfolioHeight = portfolioRect.height;

            // Если мы прокрутили до секции портфолио
            if (scrollY > portfolioTop - 300 && scrollY < portfolioTop + portfolioHeight) {
                // Находим видимые карточки портфолио
                const cards = portfolioSection.querySelectorAll('.portfolio-card');

                cards.forEach((card, index) => {
                    // Проверяем, что карточка видима
                    if (window.getComputedStyle(card.parentElement).display === 'none') return;

                    const cardRect = card.getBoundingClientRect();
                    const cardCenter = cardRect.top + cardRect.height / 2;

                    // Рассчитываем насколько карточка близка к центру экрана
                    const windowCenter = window.innerHeight / 2;
                    const distance = Math.abs(cardCenter - windowCenter);
                    const maxDistance = window.innerHeight / 2;

                    // Чем ближе к центру, тем сильнее эффекты
                    const intensity = 1 - Math.min(distance / maxDistance, 1);

                    // Применяем эффекты в зависимости от интенсивности
                    if (intensity > 0.2) {
                        card.style.transform = `translateY(${-10 * intensity}px) scale(${1 + 0.02 * intensity})`;
                        card.style.boxShadow = `0 ${20 + 20 * intensity}px ${40 + 20 * intensity}px rgba(0, 0, 0, ${0.3 + 0.1 * intensity}), 0 0 ${20 * intensity}px rgba(212, 175, 55, ${0.2 * intensity})`;
                    } else {
                        card.style.transform = '';
                        card.style.boxShadow = '';
                    }
                });
            }
        }
    }

    // Обработчик прокрутки для эффектов тени
    window.addEventListener('scroll', updateScrollEffects);

    // Обновляем эффекты при изменении фильтров
    if (filterBtns.length) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Обновляем эффекты через таймаут после анимации
                setTimeout(updateScrollEffects, 600);
            });
        });
    }

    // Инициализация при загрузке страницы
    setTimeout(updateScrollEffects, 1000);
});