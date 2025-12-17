# Авторизация

HttpOnly Cookie

POST /api/auth/login:

```body
{
    "username": "admin",
    "password": "123456s"
}
```

Ответ 200:

```
{
  "message": "Успешный логин",
  "user": {
    "username": "admin",
    "role": "admin"
  }
}
```

Cookie: token (HttpOnly, 15 мин)

POST /api/auth/logout

```body
{}
```

Ответ 200: {"message": "Успешный выход"}
