# 1. Используем официальный образ Node.js версии 18 для сборки
FROM node:18 AS build

# 2. Устанавливаем рабочую директорию
WORKDIR /app

# 3. Копируем package.json и package-lock.json
COPY package.json package-lock.json ./

# 4. Устанавливаем зависимости
RUN npm install

# 5. Копируем весь код приложения
COPY . .

# 6. Запускаем сборку проекта
RUN npm run build

# 7. Используем Nginx как веб-сервер
FROM nginx:alpine

# 8. Копируем файлы сборки из первого контейнера в папку Nginx
COPY --from=build /app/build /usr/share/nginx/html

# 9. Открываем порт 80 для доступа к клиенту
EXPOSE 80

# 10. Запускаем Nginx
CMD ["nginx", "-g", "daemon off;"]
