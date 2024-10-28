<?php
// Подключение к базе данных
$servername = "localhost";
$username = "root";  // Имя пользователя базы данных
$password = "gay1234!";  // Пароль к базе данных
$dbname = "comments_db";  // Имя базы данных

// Создаем соединение с MySQL
$conn = new mysqli($servername, $username, $password, $dbname);

// Проверяем соединение
if ($conn->connect_error) {
    die("Ошибка соединения: " . $conn->connect_error);
}

// Получаем данные из формы (если запрос отправлен методом POST)
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $user = $conn->real_escape_string($_POST['username']);
    $comment = $conn->real_escape_string($_POST['comment']);

    // SQL-запрос для вставки данных в таблицу
    $sql = "INSERT INTO comments (username, comment) VALUES ('$user', '$comment')";

    // Выполняем запрос
    if ($conn->query($sql) === TRUE) {
        echo "Комментарий успешно добавлен!";
    } else {
        echo "Ошибка: " . $sql . "<br>" . $conn->error;
    }
}

// Закрываем соединение с базой данных
$conn->close();
?>
