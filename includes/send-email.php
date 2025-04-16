<?php
// Проверяем метод запроса
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Получаем данные из формы
    $name = strip_tags(trim($_POST["name"]));
    $phone = strip_tags(trim($_POST["phone"]));
    $message = strip_tags(trim($_POST["message"]));
    
    // Проверяем заполнены ли обязательные поля
    if (empty($name) || empty($phone)) {
        // Возвращаем ошибку и перенаправляем обратно
        header("Location: ../index.html?status=error&message=Пожалуйста, заполните все обязательные поля");
        exit;
    }
    
    // Проверяем формат телефона (простая проверка)
    if (!preg_match('/^(\+7|7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/', $phone)) {
        header("Location: ../index.html?status=error&message=Пожалуйста, введите корректный номер телефона");
        exit;
    }
    
    // Email получателя
    $recipient = "info@author-kitchen_msk.ru";
    
    // Тема письма
    $subject = "Новая заявка с сайта Бутик Авторской Кухни";
    
    // Содержимое письма
    $email_content = "Имя: $name\n";
    $email_content .= "Телефон: $phone\n\n";
    
    if (!empty($message)) {
        $email_content .= "Сообщение:\n$message\n";
    }
    
    // Заголовки письма
    $email_headers = "From: Бутик Авторской Кухни <noreply@author-kitchen_msk.ru>\n";
    $email_headers .= "Reply-To: $name <$phone>\n";
    $email_headers .= "Content-Type: text/plain; charset=UTF-8\n";
    
    // Отправляем письмо
    if (mail($recipient, $subject, $email_content, $email_headers)) {
        // Перенаправляем с сообщением об успехе
        header("Location: ../index.html?status=success&message=Спасибо! Ваша заявка отправлена. Мы свяжемся с вами в ближайшее время.");
    } else {
        // Перенаправляем с сообщением об ошибке
        header("Location: ../index.html?status=error&message=Что-то пошло не так. Пожалуйста, попробуйте еще раз.");
    }
} else {
    // Если это не POST запрос, перенаправляем на главную
    header("Location: ../index.html");
}
?>  
