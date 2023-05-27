## Установка окружения
`npm install`

## Запуск приложения
`npm start`

## Сборка приложения
`npm build`

## Настрока конфига Apache
```
Listen 8096
<VirtualHost *:8096>
  DocumentRoot /var/www/html/log-checker/frontend
  ProxyPass /api http://localhost:3333
</VirtualHost>
```