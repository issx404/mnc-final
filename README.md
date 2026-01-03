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
    "main_price": 1994,
    "image_url": "uploads/1767269157342-671881703.png"
  },
  {
    "id": 2,
    "url": "remont",
    "title": "Мелкий бытовой ремонт",
    "description": "Монтаж плинтуса, укладка порожков, установка карниза, навес картин, зеркал",
    "main_price": 1994,
    "image_url": "uploads/1767269157342-671881703.png"
  },
  {
    "id": 3,
    "url": "santehnika",
    "title": "Сантехника",
    "description": "Устранение засора, протечки, установка унитаза, замена подводки, смесителя. Обслуживание фильтров.",
    "main_price": 1994,
    "image_url": "uploads/1767269157342-671881703.png"
  },
  {
    "id": 4,
    "url": "mebel",
    "title": "Сборка мебели",
    "description": "Шкафы, кровати, кухни, офисная мебель. Гарантия качества сборки.",
    "main_price": 1994,
    "image_url": "uploads/1767269157342-671881703.png"
  },
  {
    "id": 5,
    "url": "electrica",
    "title": "Электрика",
    "description": "Замена розеток, выключателей, проводка, освещение. Безопасно и быстро.",
    "main_price": 1994,
    "image_url": "uploads/1767269157342-671881703.png"
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
  "main_price": 1994,
  "image_url": "uploads/1767269157342-671881703.png"
}
```

**POST /api/services (требуется авторизация + админ роль) ожидает multipart/form-data**

```multipart/form-data

  url: tehnika,
  title: Установка техники,
  description: Стиральные машины, посудомойки, духовые шкафы, варочные панели, телевизоры. Полная настройка и проверка.,
  main_price: 1994,
  image_url": uploads/1767269157342-671881703.png (file)

```

Ответ 200:

```json
{
  "message": "Услуга \"Установка техники\" успешно добавлена",
  "image_url": "uploads/1767269157342-671881703.png"
}
```

**PATCH /api/services/electrica (требуется авторизация + админ роль) через body -> form-data**
Доступные поля для обновления: title, description, main_price, image

```form-data
  image: Photo2.jpg (file)
```

Ответ 200:

```json
{
  "message": "Обновлено!"
}
```

**DELETE /api/services/electrica (требуется авторизация + админ роль)**
При удалении услуги удаляться все его цены (каскадное удаление)
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
  "price": "1000"
}
```

Ответ 200:

```json
{
  "message": "Успешно добавлен прайс, id = 2"
}
```

**PATCH /api/prices/2 (требуется авторизация + админ роль)**  
Доступные поля для обновления: service_id, title, description, price

```json
{
  "description": "Быстро!"
}
```

Ответ 200:

```json
{
  "message": "Позиция прайса обновлена"
}
```

**DELETE /api/prices/2 (требуется авторизация + админ роль)**
Ответ 200:

```json
{
  "message": "Позиция прайса удалена"
}
```

## Заявки

**GET /api/zayavki (требуется атворизация + админ роль)**

Ответ 200:

```json
[
  {
    "id": 3,
    "client": "Тестовый 2",
    "phone": "+79142221222",
    "address": "Дзержинского 47",
    "service_id": null,
    "commentary": "Установить устранить починить",
    "status": 0,
    "created_at": "2025-12-18 02:41:36",
    "service_title": null
  },
  {
    "id": 2,
    "client": "Тестовый 2",
    "phone": "+79142221222",
    "address": "Дзержинского 47",
    "service_id": 4,
    "commentary": "Установить устранить починить",
    "status": 0,
    "created_at": "2025-12-18 02:41:23",
    "service_title": "Сборка мебели"
  },
  {
    "id": 1,
    "client": "Тестовый",
    "phone": "+79142221222",
    "address": "Лермонтова 90/2",
    "service_id": 3,
    "commentary": "Установить устранить починить",
    "status": 0,
    "created_at": "2025-12-18 02:39:58",
    "service_title": "Сантехника"
  }
]
```

**POST /api/zayavki/ (публичный)**  
С валидацией телефона: +79991234567

```json
{
  "client": "Тестовый",
  "phone": "+79142221222",
  "address": "Лермонтова 90/2",
  "service_title": "Сантехника",
  "commentary": "Установить устранить починить"
}
```

Ответ 200:

```json
{
  "id": 1,
  "message": "Заявка создана!"
}
```

**PATCH /api/zayavki/3/status (доступ только авторизованным + админ роль)**  
По умолчанию status = 0 (новые)

```json
{
  "status": 1
}
```

Ответ: 200:

```json
{
  "message": "Статус обновлён"
}
```

**DELETE /api/zayavki/2 (только авторизованным + админ роль)**

Ответ 200:

```json
{
  "message": "Заявка удалена"
}
```

## Контакты

**GET /api/contacts (публичный)**

Ответ 200:

```json
[
  {
    "id": 1,
    "phone": "+7‒914‒230‒55-07",
    "telegram": "https://t.me/+79142305507",
    "whatsapp": "https://wa.me/79142305507",
    "address": "Гимеин м-н, 9-й бокс, Сайсарский округ, Якутск, 677010",
    "map_url": "https://2gis.ru/yakutsk/firm/70000001096894140?m=129.676543%2C62.010113%2F16"
  }
]
```

**POST /api/contacts (только авторизованным + админ роль)**

```json
{
  "phone": "+7‒914‒230‒55-07",
  "telegram": "https://t.me/+79142305507",
  "whatsapp": "https://wa.me/79142305507",
  "address": "Гимеин м-н, 9-й бокс, Сайсарский округ, Якутск, 677010",
  "map_url": "https://2gis.ru/yakutsk/firm/70000001096894140?m=129.676543%2C62.010113%2F16"
}
```

Ответ 200:

```json
{
  "message": "Контакты добавлены",
  "id": 1
}
```

**PATCH /api/contacts/1 (только авторизованным + админ роль)**  
Доступные поля для изменения: phone, telegram, whatsapp, address, map_url

```json
{
  "address": "9-й бокс Якутск"
}
```

Ответ 200:

```json
{
  "message": "Контакт обновлён"
}
```
