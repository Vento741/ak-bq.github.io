<?php
// Настройки для отправки писем
$admin_email = "web-dusha@yandex.ru"; // Основной email для получения заявок
$backup_email = "vento741@mail.ru";   // Резервный email (опционально)

// Настройка заголовков для CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Content-Type: application/json');

// Создаем или проверяем наличие папки для логов
$log_dir = dirname(__FILE__) . '/logs';
if (!file_exists($log_dir)) {
    mkdir($log_dir, 0755, true);
}

// Определяем файлы логов и заказов
$log_file = $log_dir . '/mail_log.txt';
$orders_file = $log_dir . '/orders.txt';

// Пробуем создать файлы, если их нет
if (!file_exists($log_file)) {
    touch($log_file);
    chmod($log_file, 0666);
}

if (!file_exists($orders_file)) {
    touch($orders_file);
    chmod($orders_file, 0666);
}

// Записываем информацию о запросе для отладки
file_put_contents($log_file, date('Y-m-d H:i:s') . " | Новый запрос | " . $_SERVER['REMOTE_ADDR'] . "\n", FILE_APPEND);

// Проверяем метод запроса
if ($_SERVER["REQUEST_METHOD"] != "POST") {
    file_put_contents($log_file, date('Y-m-d H:i:s') . " | Неверный метод запроса: " . $_SERVER["REQUEST_METHOD"] . "\n", FILE_APPEND);
    echo json_encode([
        'success' => false,
        'message' => 'Метод запроса должен быть POST'
    ]);
    exit;
}

// Получаем данные из формы
$name = isset($_POST['name']) ? trim(htmlspecialchars($_POST['name'])) : '';
$email = isset($_POST['email']) ? trim(htmlspecialchars($_POST['email'])) : 'no-reply@bak-msk.ru';
$phone = isset($_POST['phone']) ? trim(htmlspecialchars($_POST['phone'])) : '';
$message = isset($_POST['message']) ? trim(htmlspecialchars($_POST['message'])) : '';

// Дополнительные поля из модальной формы заказа проекта
$style = isset($_POST['style']) ? trim(htmlspecialchars($_POST['style'])) : '';
$budget = isset($_POST['budget']) ? trim(htmlspecialchars($_POST['budget'])) : '';
$address = isset($_POST['address']) ? trim(htmlspecialchars($_POST['address'])) : '';

// Определяем тип формы
$form_type = !empty($style) || !empty($budget) ? 'Заказ проекта кухни' : 'Обратная связь';

// Записываем полученные данные в лог
file_put_contents($log_file, date('Y-m-d H:i:s') . " | Данные формы: Тип=$form_type, Имя=$name, Телефон=$phone\n", FILE_APPEND);

// Валидация данных
$errors = [];

if (empty($name)) {
    $errors[] = 'Имя обязательно для заполнения';
}

if (empty($phone)) {
    $errors[] = 'Телефон обязателен для заполнения';
}

// Если есть ошибки, возвращаем их
if (!empty($errors)) {
    file_put_contents($log_file, date('Y-m-d H:i:s') . " | Ошибки валидации: " . implode(', ', $errors) . "\n", FILE_APPEND);
    echo json_encode([
        'success' => false,
        'message' => implode('. ', $errors)
    ]);
    exit;
}

// Обязательно сохраняем заявку в файл
$order_data = "==========\n";
$order_data .= "Дата: " . date('Y-m-d H:i:s') . "\n";
$order_data .= "Тип формы: $form_type\n";
$order_data .= "Имя: $name\n";
$order_data .= "Телефон: $phone\n";
if ($email != 'no-reply@bak-msk.ru') {
    $order_data .= "Email: $email\n";
}
if (!empty($message)) {
    $order_data .= "Сообщение: $message\n";
}
// Добавляем поля для заказа проекта кухни
if (!empty($style)) {
    $order_data .= "Стиль кухни: $style\n";
}
if (!empty($budget)) {
    $order_data .= "Бюджет: $budget\n";
}
if (!empty($address)) {
    $order_data .= "Адрес: $address\n";
}
$order_data .= "IP: " . $_SERVER['REMOTE_ADDR'] . "\n";
$order_data .= "==========\n\n";

file_put_contents($orders_file, $order_data, FILE_APPEND);
file_put_contents($log_file, date('Y-m-d H:i:s') . " | Заявка сохранена в файл\n", FILE_APPEND);

// Формируем текст письма
$email_body = "Новое сообщение с сайта BAK-MSK.RU\n\n";
$email_body .= "Тип формы: $form_type\n";
$email_body .= "Имя: $name\n";
$email_body .= "Телефон: $phone\n";
if ($email != 'no-reply@bak-msk.ru') {
    $email_body .= "Email: $email\n";
}
// Добавляем поля для заказа проекта кухни
if (!empty($style)) {
    $email_body .= "Стиль кухни: $style\n";
}
if (!empty($budget)) {
    $email_body .= "Бюджет: $budget\n";
}
if (!empty($address)) {
    $email_body .= "Адрес: $address\n";
}
if (!empty($message)) {
    $email_body .= "\nСообщение:\n$message\n";
}
$email_body .= "\nДата и время: " . date('d.m.Y H:i:s') . "\n";
$email_body .= "IP адрес: " . $_SERVER['REMOTE_ADDR'] . "\n";

// Настройки для почты Джино
$subject = "Новая заявка ($form_type) с сайта BAK-MSK.RU";
$from_email = "info@bak-msk.ru"; // Ваш email на Джино
$from_name = "BAK-MSK.RU"; // Имя отправителя

// Формируем заголовки для письма
$headers = "From: $from_name <$from_email>\r\n";
$headers .= "Reply-To: $name <$phone>\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";

// Отправляем на основной email
$mail_sent = mail($admin_email, $subject, $email_body, $headers);
file_put_contents($log_file, date('Y-m-d H:i:s') . " | Отправка на $admin_email: " . ($mail_sent ? "Успешно" : "Ошибка") . "\n", FILE_APPEND);

// Отправляем копию на резервный email, если он отличается от основного
if ($backup_email !== $admin_email) {
    $backup_sent = mail($backup_email, $subject, $email_body, $headers);
    file_put_contents($log_file, date('Y-m-d H:i:s') . " | Отправка на $backup_email: " . ($backup_sent ? "Успешно" : "Ошибка") . "\n", FILE_APPEND);
} else {
    $backup_sent = $mail_sent;
}

// Возвращаем результат
// Если хотя бы один метод отправки успешен, считаем успехом
// Но самое главное - данные сохранены в файл
if ($mail_sent || $backup_sent) {
    echo json_encode([
        'success' => true,
        'message' => 'Спасибо за ваше сообщение! Мы свяжемся с вами в ближайшее время.'
    ]);
    file_put_contents($log_file, date('Y-m-d H:i:s') . " | Запрос обработан успешно\n", FILE_APPEND);
} else {
    echo json_encode([
        'success' => true, // Всегда возвращаем успех, т.к. заявка уже сохранена в файл
        'message' => 'Спасибо за ваше сообщение! В ближайшее время наш менеджер свяжется с вами.'
    ]);
    file_put_contents($log_file, date('Y-m-d H:i:s') . " | Заявка сохранена, но отправка не удалась\n", FILE_APPEND);
}
?>
