## About the app
This WEB-application is used to display the status of configuration files and logs of another application, in a convenient and readable form. The application allows you to edit files.

-------------------

## Installation environment
`npm install`

## Build the application
`npm run build`

## Run the application
`npm run start`

## Setting up a configuration for Apache
```
Listen 8145
<VirtualHost *:8145>
  DocumentRoot /var/www/html/log-checker/frontend
  ProxyPass /api http://localhost:3333/api
</VirtualHost>
```