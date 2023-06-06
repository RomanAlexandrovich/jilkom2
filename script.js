navigator.mediaDevices.getUserMedia({ video: true })
  .then(function (stream) {
    var videoElement = document.getElementById('video'); // Элемент <video> для отображения видео
    videoElement.srcObject = stream; // Присваивание видеопотока элементу <video>
    videoElement.play(); // Воспроизведение видео

    // Обработка нажатия кнопки "Сделать снимок"
    var captureBtn = document.getElementById('captureBtn');
    captureBtn.addEventListener('click', function () {
      // Создание <canvas> для отрисовки снимка
      var canvas = document.createElement('canvas');
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
      var context = canvas.getContext('2d');
      context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

      // Преобразование снимка в данные формата base64
      var imageDataURL = canvas.toDataURL('image/jpeg');

      // Отправка данных снимка на сервер
      sendSnapshot(imageDataURL);
    });
  })
  .catch(function (error) {
    console.error('Ошибка захвата видео: ', error);
  });

// Отправка снимка на сервер
function sendSnapshot(imageData) {
  // Отправка запроса на сервер с помощью Fetch API
  fetch('/upload', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ imageData: imageData })
  })
  .then(function (response) {
    console.log('Снимок отправлен на сервер');
  })
  .catch(function (error) {
    console.error('Ошибка отправки снимка на сервер: ', error);
  });
}