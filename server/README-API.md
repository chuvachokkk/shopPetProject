Документация по API.

На бэкэнде есть две точки входа, это api и / (public). Все, что переходит по api будет проверяться на accessToken и некоторые роуты по типу админки на роль пользователя.

Примеры роутов по api:
http://localhost:3000/api/user/signin
http://localhost:3000/api/user/signup

Примеры роутов по / (public):
http://localhost:3000/items

Список готовых роутов:

=============== API =================
POST http://localhost:3000/api/user/signup
Принимает body email, password и возвращает пользователя с refresh и access токенами. (нужно доработать!)

POST http://localhost:3000/api/user/signin
Принимает body email, password и возвращает пользователя с refresh и access токенами. (нужно доработать!)

=============== PUBLIC =================

Возвращает все товары для женщин (при неправальном типе, если параметр не равен f - female, m - male, вернет 404)
GET http://localhost:3000/type/f/

Возвращает все товары для мужчин
GET http://localhost:3000/type/m/
