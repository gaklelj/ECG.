<?php
// Проверяем подключение к базе данных
if ($conn->connect_error) {
    die("Ошибка соединения: " . $conn->connect_error);
}

// SQL-запрос для получения всех комментариев, отсортированных по дате (сначала новые)
$sql = "SELECT username, comment, timestamp FROM comments ORDER BY timestamp DESC";
$result = $conn->query($sql);

// Проверяем, если есть комментарии
if ($result->num_rows > 0) {
    // Выводим каждый комментарий
    while($row = $result->fetch_assoc()) {
        echo "<div class='comment'>";
        echo "<strong>" . htmlspecialchars($row["username"]) . ":</strong><br>";
        echo "<p>" . htmlspecialchars($row["comment"]) . "</p>";
        echo "<small>Дата: " . $row["timestamp"] . "</small>";
        echo "</div><br>";
    }
} else {
    echo "Нет комментариев.";
}

// Закрываем соединение с базой данных
$conn->close();
?>

