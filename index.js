function slowScroll(id) {
    $('html, body').animate({
        scrollTop: $(id).offset().top
    }, 500);
}

$(document).on("scroll", function () {
    if ($(window).scrollTop() === 0)
        $("header").removeClass("fixed");
    else
        $("header").addClass("fixed");
});

document.getElementById('commentForm').addEventListener('submit', function(event) {
    event.preventDefault();  // Предотвращаем отправку формы по умолчанию

    const formData = new FormData(this);  // Собираем данные формы

    // Отправляем запрос на сервер с помощью fetch
    fetch('submit_comment.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.text())
    .then(data => {
        // После успешной отправки комментария обновляем список комментариев
        loadComments();
        // Очищаем форму
        this.reset();
    });
});

// Функция для загрузки комментариев с сервера
function loadComments() {
    fetch('fetch_comments.php')
    .then(response => response.text())
    .then(data => {
        document.getElementById('comments-section').innerHTML = data;  // Обновляем блок комментариев
    });
}

// Загружаем комментарии при загрузке страницы
loadComments();

function slowScroll(id) {
    if (id === 'top') {
        window.location.href = '#';
        setTimeout(() => {
            window.scrollTo(0, 0);
        }, 100);
    } else {
        document.querySelector(id).scrollIntoView({
            behavior: 'smooth'
        });
    }
}

document.addEventListener("DOMContentLoaded", function() {
    const commentForm = document.getElementById("commentForm");
    commentForm.addEventListener("submit", function(event) {
        event.preventDefault();
        const name = document.getElementById("name").value;
        const comment = document.getElementById("comment").value;
        if (name && comment) {
            const commentSection = document.getElementById("comments-section");
            const newComment = document.createElement("div");
            newComment.classList.add("comment");
            newComment.innerHTML = `<p><strong>${name}:</strong> ${comment}</p>`;
            commentSection.appendChild(newComment);
            commentForm.reset();
        }
    });
});
document.getElementById('commentForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const comment = document.getElementById('comment').value;

    fetch('/api/comments', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, comment }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert(data.error);
        } else {
            addCommentToPage(data);
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});

function addCommentToPage(comment) {
    const commentSection = document.getElementById('comments-section');
    const newComment = document.createElement('div');
    newComment.classList.add('comment');
    newComment.innerHTML = `<p><strong>${comment.name}:</strong> ${comment.comment}</p>`;
    commentSection.appendChild(newComment);
}
function addComment(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const comment = document.getElementById('comment').value;
    
    const commentSection = document.getElementById('comments-section');
    const newComment = document.createElement('div');
    newComment.classList.add('comment');
    newComment.innerHTML = `
        <p><strong>${name}:</strong> ${comment}</p>
        <button class="delete-button" onclick="deleteComment(this)">Удалить</button>
    `;
    
    commentSection.appendChild(newComment);
    console.log("Comment added:", name, comment);
    
    // Очистка формы
    document.getElementById('commentForm').reset();
}

function deleteComment(button) {
    const comment = button.parentElement;
    comment.remove();
    console.log("Comment deleted");
}
