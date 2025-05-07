# Используем Node.js образ
FROM node:18

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и устанавливаем зависимости
COPY package*.json ./
RUN npm install

# Копируем код приложения
COPY . .

# Открываем порт (например, 5000)
EXPOSE 3000

# Запускаем сервер
CMD ["npm", "run", "dev"]
