<?php
// Настройки для отправки писем
$admin_email = "vento741@mail.ru"; // Замените на свой email
$subject = "Новое сообщение с сайта AK_Boutique";

// Настройка заголовков
header('Content-Type: application/json');

// Проверяем метод запроса
if ($_SERVER["REQUEST_METHOD"] != "POST") {
    echo json_encode([
        'success' => false,
        'message' => 'Метод запроса должен быть POST'
    ]);
    exit;
}

// Получаем данные из формы
$name = isset($_POST['name']) ? trim(htmlspecialchars($_POST['name'])) : '';
$email = isset($_POST['email']) ? trim(htmlspecialchars($_POST['email'])) : '';
$phone = isset($_POST['phone']) ? trim(htmlspecialchars($_POST['phone'])) : '';
$message = isset($_POST['message']) ? trim(htmlspecialchars($_POST['message'])) : '';

// Валидация данных
$errors = [];

if (empty($name)) {
    $errors[] = 'Имя обязательно для заполнения';
}

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Пожалуйста, укажите корректный email';
}

if (empty($message)) {
    $errors[] = 'Сообщение обязательно для заполнения';
}

// Если есть ошибки, возвращаем их
if (!empty($errors)) {
    echo json_encode([
        'success' => false,
        'message' => implode('. ', $errors)
    ]);
    exit;
}

// Формируем текст письма
$email_body = "Новое сообщение от: $name\n";
$email_body .= "Email: $email\n";
if (!empty($phone)) {
    $email_body .= "Телефон: $phone\n";
}
$email_body .= "Сообщение:\n$message\n";

// Дополнительные заголовки
$headers = "From: $email\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// Отправка письма
$mail_sent = mail($admin_email, $subject, $email_body, $headers);

// Возвращаем результат
if ($mail_sent) {
    echo json_encode([
        'success' => true,
        'message' => 'Спасибо за ваше сообщение! Мы свяжемся с вами в ближайшее время.'
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Ошибка при отправке сообщения. Пожалуйста, попробуйте еще раз или свяжитесь с нами по телефону.'
    ]);
}
?>  
