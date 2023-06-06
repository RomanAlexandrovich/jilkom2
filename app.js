const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Middleware для парсинга JSON-данных из тела запроса
app.use(bodyParser.json());

app.get('/', function (req, res) {
      res.sendFile(path.join(__dirname, 'app.html'));
    });

app.get('/complete', function (req, res) {
  res.sendFile(path.join(__dirname, 'complete.html'));
});

// Обработчик POST-запроса на пути '/upload'
app.post('/upload', (req, res) => {
  // Извлечение данных из тела запроса
  const { firstName, lastName, middleName, groupNumber, phoneNumber, imageDataURL } = req.body;

  // Создание транспорта для отправки почты
  const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      service: 'SMTP',
      port: 465,
      secure: true,
      auth: {
        user: 'jilkomby@gmail.com', // Замените на свой адрес электронной почты
        pass: 'pjzpxyowqblrpskc' // Замените на свой пароль от почты
      },
      tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false,
      },
    });

  // Опции письма
  const mailOptions = {
    from: 'jilkomby@gmail.com', // Отправитель
    to: 'jilkomby@gmail.com', // Получатель, замените на нужный адрес электронной почты
    subject: 'Новая заявка',
    attachments: [
            {
              filename: `${firstName}_${middleName}_${lastName}_${groupNumber}.jpeg`, // Название вложенного файла
              content: imageDataURL.split(';base64,').pop(), // Извлечение содержимого base64 изображения
              encoding: 'base64'
            }
          ],
    html: `
      <h1>Новая заявка</h1>
      <p>Фамилия: ${firstName}</p>
      <p>Имя: ${lastName}</p>
      <p>Отчество: ${middleName}</p>
      <p>Номер группы: ${groupNumber}</p>
      <p>Номер телефона: ${phoneNumber}</p>
    `
  };

  // Отправка письма
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Ошибка отправки почты: ', error);
      res.status(500).json({ message: 'Ошибка отправки почты' });
    } else {
      console.log('Письмо отправлено: ', info.response);
      res.status(200).json({ message: 'Письмо успешно отправлено' });
    }
  });
});

// Запуск сервера
app.listen(3000, () => {
  console.log('Сервер запущен на порту 3000');
});