# node-pagination

База данных обновляется при каждом запуске приложения. При запуске в базу добавляется 10 сообщений.

Доступные методы:

1.  `GET localhost:3000/messages/getAll`

    Выдает все сообщения, которые есть на сервере
  
2.  `POST localhost:3000/messages/send`

    `{ message: "message text" }`

    Посылаем сообщение.

3.  `GET localhost:3000/messages/getByOffset?offest={offset}&limit={limit}`

    Выдает сообщения с заданым оффсетом и лимитом. Если не указать offset, offset=0, если не указать лимит, то limit=5


4.  `GET localhost:3000/messages/getByAnchor?anchor={message_id}&direction={toNewest|toOldest}&limit={limit}`

    Выдает сообщения с заданым якорем, направлением и лимитом. Якорь необязателен. направление указывать обязательно. limit по умолчанию = 5.
