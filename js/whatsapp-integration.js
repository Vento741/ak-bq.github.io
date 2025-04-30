/**
 * WhatsApp Integration for Order Processing
 * Интеграция с WhatsApp для обработки заказов
 */

class WhatsAppOrderManager {
    constructor() {
        this.whatsappPhone = '+79921110999'; // Телефон для получения заявок
        this.lastOrderKey = 'lastOrderData';
        this.allOrdersKey = 'allOrders';
        this.init();
    }

    init() {
        // Инициализация менеджера заказов
        console.log('WhatsApp Order Manager initialized');
        this.loadStoredOrders();
    }

    // Загрузка сохраненных заказов из localStorage
    loadStoredOrders() {
        try {
            const lastOrder = localStorage.getItem(this.lastOrderKey);
            const allOrders = localStorage.getItem(this.allOrdersKey);

            if (lastOrder) {
                this.lastOrder = JSON.parse(lastOrder);
                console.log('Last order loaded:', this.lastOrder);
            }

            if (allOrders) {
                this.allOrders = JSON.parse(allOrders);
                console.log(`Loaded ${this.allOrders.length} orders from storage`);
            } else {
                this.allOrders = [];
            }

            return true;
        } catch (error) {
            console.error('Error loading stored orders:', error);
            return false;
        }
    }

    // Сохранение заказа в localStorage
    saveOrder(orderData) {
        try {
            // Добавляем дату и время
            orderData.date = new Date().toLocaleString();
            orderData.id = 'ORD' + Date.now().toString().slice(-6);

            // Сохраняем последний заказ
            localStorage.setItem(this.lastOrderKey, JSON.stringify(orderData));
            this.lastOrder = orderData;

            // Обновляем список всех заказов
            if (!this.allOrders) this.allOrders = [];
            this.allOrders.push(orderData);
            localStorage.setItem(this.allOrdersKey, JSON.stringify(this.allOrders));

            console.log('Order saved successfully:', orderData);
            return true;
        } catch (error) {
            console.error('Error saving order:', error);
            return false;
        }
    }

    // Форматирование данных заказа для WhatsApp
    formatOrderForWhatsApp(orderData) {
        return `📋 *НОВАЯ ЗАЯВКА С САЙТА*\n\n` +
            `🆔 *Номер заявки:* ${orderData.id}\n` +
            `👤 *Имя:* ${orderData.name}\n` +
            `📞 *Телефон:* ${orderData.phone}\n` +
            `📧 *Email:* ${orderData.email || 'Не указан'}\n` +
            `🏠 *Адрес:* ${orderData.address || 'Не указан'}\n\n` +
            `🛋 *Стиль кухни:* ${orderData.style}\n` +
            `💰 *Бюджет:* ${orderData.budget}\n\n` +
            `✏️ *Пожелания:* ${orderData.message}\n\n` +
            `📅 *Дата заявки:* ${orderData.date}\n` +
            `🔔 Заявка отправлена с сайта Бутик Авторской Кухни`;
    }

    // Получение URL для отправки заказа в WhatsApp
    getWhatsAppUrl(orderData) {
        const formattedText = this.formatOrderForWhatsApp(orderData);
        const encodedText = encodeURIComponent(formattedText);
        return `https://wa.me/${this.whatsappPhone}?text=${encodedText}`;
    }

    // Создание кнопки для отправки заказа в WhatsApp
    createWhatsAppButton(orderData, targetElement) {
        const whatsappUrl = this.getWhatsAppUrl(orderData);

        const whatsappBtn = document.createElement('a');
        whatsappBtn.className = 'whatsapp-btn';
        whatsappBtn.href = whatsappUrl;
        whatsappBtn.target = '_blank';
        whatsappBtn.textContent = 'Отправить в WhatsApp';

        if (targetElement) {
            targetElement.appendChild(whatsappBtn);
        }

        return whatsappBtn;
    }

    // Автоматическая отправка данных заказа в WhatsApp
    autoSendToWhatsApp(orderData) {
        // Проверяем, прошло ли больше 24 часов с момента последней отправки
        const lastSentTime = localStorage.getItem('lastWhatsAppSentTime');
        const now = Date.now();

        if (lastSentTime && (now - parseInt(lastSentTime)) < 86400000) {
            console.log('Auto-send to WhatsApp skipped: too soon after last send');
            return false;
        }

        try {
            // Создаем и открываем ссылку на WhatsApp
            const whatsappUrl = this.getWhatsAppUrl(orderData);
            window.open(whatsappUrl, '_blank');

            // Сохраняем время отправки
            localStorage.setItem('lastWhatsAppSentTime', now.toString());
            console.log('Auto-sent to WhatsApp:', orderData);
            return true;
        } catch (error) {
            console.error('Error auto-sending to WhatsApp:', error);
            return false;
        }
    }

    // Создание QR-кода для WhatsApp
    createWhatsAppQR(orderData, targetElement) {
        const whatsappUrl = this.getWhatsAppUrl(orderData);

        // Определяем API для создания QR-кода (используем бесплатный сервис QR-code API)
        const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(whatsappUrl)}`;

        const qrContainer = document.createElement('div');
        qrContainer.className = 'whatsapp-qr-container';

        const qrImage = document.createElement('img');
        qrImage.className = 'whatsapp-qr-image';
        qrImage.src = qrApiUrl;
        qrImage.alt = 'Отсканируйте QR-код для связи в WhatsApp';

        const qrText = document.createElement('p');
        qrText.className = 'whatsapp-qr-text';
        qrText.textContent = 'Отсканируйте QR-код для связи';

        qrContainer.appendChild(qrImage);
        qrContainer.appendChild(qrText);

        if (targetElement) {
            targetElement.appendChild(qrContainer);
        }

        return qrContainer;
    }
}

// Инициализация менеджера заказов WhatsApp
const whatsAppManager = new WhatsAppOrderManager();

// Экспорт для использования в других скриптах
window.whatsAppManager = whatsAppManager;