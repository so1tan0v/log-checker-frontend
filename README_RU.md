## О приложении
Это WEB-приложение служит для того, чтобы отображать состояние конфигурационных файлов и логов другого приложения, в удобном и читаемов виде, с возможностью редактирования файлов.\
**Репозиторий backend**: [log-checker-backend](https://github.com/so1tan0v/log-checker-backend)

--------------------------

## Установка окружения
```
npm install
```

## Сборка приложения
```
npm run build
```

## Запуск приложения
```
npm run start
```

## Настрока конфига Apache
```
Listen 8145
<VirtualHost *:8145>
  DocumentRoot /var/www/html/log-checker/frontend
  ProxyPass /api http://localhost:3333/api
</VirtualHost>
```