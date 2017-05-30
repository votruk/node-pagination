# node-pagination

База данных обновляется при каждом запуске приложения. При запуске в базу добавляется 10 сообщений.

Доступные методы:

  
1.  `POST localhost:3000/messages/create`

    `{ message: "message text" }`

    Посылаем сообщение.


2.  `GET localhost:3000/messages/get?sinceId={messageId}&tillId={messageId}&offest={offset}&limit={limit}`

    Все параметры являются опциональными.
