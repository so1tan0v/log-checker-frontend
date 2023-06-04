## Установка окружения
`npm install`

## Запуск приложения
`npm run start`

## Сборка приложения
`npm run build`

## Настрока конфига Apache
```
Listen 8145
<VirtualHost *:8145>
  DocumentRoot /var/www/html/log-checker/frontend
  ProxyPass /api http://localhost:3333/api
</VirtualHost>
```