// Функционал модальных окон для проектов
document.addEventListener('DOMContentLoaded', function() {
    const projectItems = document.querySelectorAll('.project-item');

    if (projectItems.length) {
        // Создаем модальное окно и добавляем его в DOM
        const modal = document.createElement('div');
        modal.className = 'project-modal';

        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-close"></div>
                <div class="modal-image">
                    <img src="" alt="Project Image">
                </div>
                <div class="modal-details">
                    <h3 class="modal-title"></h3>
                    <span class="modal-category"></span>
                    <p class="modal-description"></p>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Обработчик для открытия модального окна
        projectItems.forEach(item => {
            item.addEventListener('click', function() {
                const projectTitle = this.querySelector('.project-title').textContent;
                const projectCategory = this.querySelector('.project-category').textContent;
                const projectImgSrc = this.querySelector('img').getAttribute('src');

                // Получаем описание проекта, если есть
                let projectDescription = '';
                if (this.dataset.description) {
                    projectDescription = this.dataset.description;
                } else {
                    projectDescription = 'Подробное описание проекта временно недоступно.';
                }

                // Заполняем модальное окно данными
                modal.querySelector('.modal-title').textContent = projectTitle;
                modal.querySelector('.modal-category').textContent = projectCategory;
                modal.querySelector('.modal-image img').setAttribute('src', projectImgSrc);
                modal.querySelector('.modal-description').textContent = projectDescription;

                // Открываем модальное окно
                modal.classList.add('active');
                document.body.style.overflow = 'hidden'; // Блокируем прокрутку страницы
            });
        });

        // Закрытие модального окна при клике на кнопку закрытия
        const closeButton = modal.querySelector('.modal-close');
        closeButton.addEventListener('click', closeModal);

        // Закрытие модального окна при клике вне его содержимого
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal();
            }
        });

        // Закрытие модального окна при нажатии клавиши Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });

        // Функция для закрытия модального окна
        function closeModal() {
            modal.classList.remove('active');
            document.body.style.overflow = ''; // Восстанавливаем прокрутку страницы
        }

        // Эффект увеличения изображения при клике
        const modalImage = modal.querySelector('.modal-image img');
        modalImage.addEventListener('click', function() {
            this.classList.toggle('zoomed');
        });
    }

    // Фильтрация проектов по категориям
    const filterButtons = document.querySelectorAll('.filter-button');
    if (filterButtons.length) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Удаляем активный класс у всех кнопок
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Добавляем активный класс текущей кнопке
                this.classList.add('active');

                const filter = this.dataset.filter;

                projectItems.forEach(item => {
                    const category = item.dataset.category;

                    if (filter === 'all' || category === filter) {
                        item.classList.remove('hidden');
                        setTimeout(() => {
                            item.style.display = 'block';
                        }, 300);
                    } else {
                        item.classList.add('hidden');
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }
});