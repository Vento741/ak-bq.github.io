<?php
// Настройки для отправки писем
$admin_email = "vento741@mail.ru"; // Основной email
$backup_email = "denlios9558@gmail.com"; // Резервный email - можно заменить на актуальный

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

// Записываем полученные данные в лог
file_put_contents($log_file, date('Y-m-d H:i:s') . " | Данные формы: Имя=$name, Телефон=$phone\n", FILE_APPEND);

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
$order_data .= "Имя: $name\n";
$order_data .= "Телефон: $phone\n";
if (!empty($message)) {
    $order_data .= "Сообщение: $message\n";
}
$order_data .= "IP: " . $_SERVER['REMOTE_ADDR'] . "\n";
$order_data .= "==========\n\n";

file_put_contents($orders_file, $order_data, FILE_APPEND);
file_put_contents($log_file, date('Y-m-d H:i:s') . " | Заявка сохранена в файл\n", FILE_APPEND);

// Формируем текст письма
$email_body = "Новое сообщение с сайта BAK-MSK.RU\n\n";
$email_body .= "Имя: $name\n";
$email_body .= "Телефон: $phone\n";
if ($email != 'no-reply@bak-msk.ru') {
    $email_body .= "Email: $email\n";
}
if (!empty($message)) {
    $email_body .= "\nСообщение:\n$message\n";
}
$email_body .= "\nДата и время: " . date('d.m.Y H:i:s') . "\n";
$email_body .= "IP адрес: " . $_SERVER['REMOTE_ADDR'] . "\n";

// Пробуем отправить через обычную функцию mail()
$subject = "Новая заявка с сайта BAK-MSK.RU";
$headers = "From: BAK-MSK.RU <no-reply@bak-msk.ru>\r\n";
$headers .= "Reply-To: $name <$phone>\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

$mail_sent = mail($admin_email, $subject, $email_body, $headers);
file_put_contents($log_file, date('Y-m-d H:i:s') . " | Отправка через mail(): " . ($mail_sent ? "Успешно" : "Ошибка") . "\n", FILE_APPEND);

// Отправляем копию на резервный email
$backup_sent = mail($backup_email, $subject, $email_body, $headers);
file_put_contents($log_file, date('Y-m-d H:i:s') . " | Отправка на резервный email: " . ($backup_sent ? "Успешно" : "Ошибка") . "\n", FILE_APPEND);

// Проверяем наличие PHPMailer
$phpmailer_path = dirname(__DIR__) . '/vendor/autoload.php';
$smtp_sent = false;

if (file_exists($phpmailer_path)) {
    file_put_contents($log_file, date('Y-m-d H:i:s') . " | PHPMailer найден, пробуем SMTP\n", FILE_APPEND);
    
    try {
        // Подключаем автозагрузчик Composer
        require $phpmailer_path;

        use PHPMailer\PHPMailer\PHPMailer;
        use PHPMailer\PHPMailer\Exception;
        
        $mail = new PHPMailer(true);
        $mail->SMTPDebug = 0; // Отключаем вывод отладки
        
        // Данные для SMTP Mail.ru
        $mail->isSMTP();
        $mail->Host = 'smtp.mail.ru';
        $mail->SMTPAuth = true;
        $mail->Username = 'vento741@mail.ru';  // Ваш email
        $mail->Password = 'eBvhapcuk4q35QMHrEBG';  // Пароль
        $mail->SMTPSecure = 'ssl';
        $mail->Port = 465;
        
        // Отправитель и получатель
        $mail->setFrom('vento741@mail.ru', 'BAK-MSK.RU');
        $mail->addAddress($admin_email);
        
        // Содержимое письма
        $mail->CharSet = 'UTF-8';
        $mail->Subject = $subject;
        $mail->Body = $email_body;
        
        // Отправляем
        $mail->send();
        $smtp_sent = true;
        file_put_contents($log_file, date('Y-m-d H:i:s') . " | SMTP отправка: Успешно\n", FILE_APPEND);
    } catch (Exception $e) {
        $smtp_error = $e->getMessage();
        file_put_contents($log_file, date('Y-m-d H:i:s') . " | SMTP ошибка: " . $smtp_error . "\n", FILE_APPEND);
    }
} else {
    file_put_contents($log_file, date('Y-m-d H:i:s') . " | PHPMailer не найден в " . $phpmailer_path . "\n", FILE_APPEND);
}

// Возвращаем результат
// Если хотя бы один метод отправки успешен, считаем успехом
// Но самое главное - данные сохранены в файл
if ($mail_sent || $smtp_sent || $backup_sent) {
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
