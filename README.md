# node-pagination

База данных обновляется при каждом запуске приложения. При запуске в базу добавляется 10 сообщений.

Доступные методы:

  
1.  `POST localhost:3000/message/create`

    ```json 
    { 
       "message": "message text" 
    }
      ```

    Посылаем сообщение.


2.  `POST localhost:3000/message/get`
    
   
    ```json
    { 
      "sinceId": messageId,
      "tillId": messageId,
      "limit": limit,
      "offset": offset,
    }
    
    ```
    
    Все параметры являются опциональными.
