# Backend

**Фреймворк:** Express.js  
**Безопасность:** CORS, HttpOnly JWT Cookie, bcrypt пароли, Rate Limit, helmet, Подготовленные запросы

## Авторизация

**POST /api/auth/register**

```json
{
  "username": "логин",
  "password": "пароль"
}
```

Ответ 200:

```json
{
  "message": "Пользователь создан"
}
```

HttpOnly Cookie

**POST /api/auth/login**

```json
{
  "username": "admin",
  "password": "123456s"
}
```

Ответ 200:

```json
{
  "message": "Успешный логин",
  "user": {
    "username": "admin",
    "role": "admin"
  }
}
```

Cookie: token (HttpOnly, 15 мин)

**POST /api/auth/logout**

```json
{}
```

Ответ 200: `json {"message": "Успешный выход"}`

## Услуги

**GET /api/services (публичный)**

Ответ 200:

```json
[
  {
    "id": 1,
    "url": "tehnika",
    "title": "Установка техники",
    "description": "Стиральные машины, посудомойки, духовые шкафы, варочные панели, телевизоры. Полная настройка и проверка.",
    "main_price": 1994
  },
  {
    "id": 2,
    "url": "remont",
    "title": "Мелкий бытовой ремонт",
    "description": "Монтаж плинтуса, укладка порожков, установка карниза, навес картин, зеркал",
    "main_price": 1994
  },
  {
    "id": 3,
    "url": "santehnika",
    "title": "Сантехника",
    "description": "Устранение засора, протечки, установка унитаза, замена подводки, смесителя. Обслуживание фильтров.",
    "main_price": 1994
  },
  {
    "id": 4,
    "url": "mebel",
    "title": "Сборка мебели",
    "description": "Шкафы, кровати, кухни, офисная мебель. Гарантия качества сборки.",
    "main_price": 1994
  },
  {
    "id": 5,
    "url": "electrica",
    "title": "Электрика",
    "description": "Замена розеток, выключателей, проводка, освещение. Безопасно и быстро.",
    "main_price": 1994
  }
]
```

**GET /api/services/electrica (публичный)**

Ответ 200:

```json
{
  "id": 5,
  "url": "electrica",
  "title": "Электрика",
  "description": "Замена розеток, выключателей, проводка, освещение. Безопасно и быстро.",
  "main_price": 1994
}
```

**POST /api/services (требуется авторизация + админ роль)**

```json
{
  "url": "tehnika",
  "title": "Установка техники",
  "description": "Стиральные машины, посудомойки, духовые шкафы, варочные панели, телевизоры. Полная настройка и проверка.",
  "main_price": "1994"
}
```

Ответ 200:

```json
{
  "message": "Услуга \"Установка техники\" успешно добавлена"
}
```

**PATCH /api/services/electrica (требуется авторизация + админ роль)**
Доступные поля для обновления: title, description, main_price

```json
{
  "main_price": 2222
}
```

Ответ 200:

```json
{
  "message": "Обновлено!"
}
```

**DELETE /api/services/electrica (требуется авторизация + админ роль)**

```json
{
  "url": "electrica"
}
```

Ответ 200:

```json
{
  "message": "Услуга удалена"
}
```

## Цены

**GET /api/prices (публичный)**
Ответ 200:

```json
[
  {
    "id": 1,
    "service_id": 2,
    "title": "Монтаж плинтуса",
    "description": "Легко и быстро!",
    "price": 1000,
    "image_url": "/public/images/plintus.jpg"
  },
  {
    "id": 2,
    "service_id": 2,
    "title": "Установка карниза",
    "description": "Легко и быстро!",
    "price": 1000,
    "image_url": "/public/images/karniz.jpg"
  }
]
```

**POST /api/prices (требуется авторизация + админ роль)**

```json
{
  "service_id": "2",
  "title": "Установка карниза",
  "description": "Легко и быстро!",
  "price": "1000",
  "image_url": "/public/images/karniz.jpg"
}
```

Ответ 200:

```json
{
  "message": "Успешно добавлен прайс, id = 2"
}
```

**PATCH /api/prices/2 (требуется авторизация + админ роль)**  
Доступные поля для обновления: service_id, title, description, price, image_url

```json
{
  "description": "Быстро!",
  "price": 7777
}
```

Ответ 200:

```json
{
  "message": "Позиция прайса обновлена"
}
```
