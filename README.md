# node-pagination

База данных обновляется при каждом запуске приложения. При запуске в базу добавляется 10 сообщений.

Доступные методы:

  
1.  `POST localhost:3000/messages/create`

    ```json 
    { 
       "message": "message text" 
    }
      ```

    Посылаем сообщение.


2.  `POST localhost:3000/messages/get`
    
   
    ```json
    { 
      "sinceId": messageId,
      "tillId": messageId,
      "limit": limit,
      "offset": offset,
    }
    
    ```
    
    Все параметры являются опциональными.
