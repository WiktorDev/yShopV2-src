module.exports={
    //Configuration
    port: 3000,
    baseURL: 'https://yshop.pl',
    shopDomain: 'localhost',
    handlerHook: 'https://discord.com/api/webhooks/879624277601714249/jfWeUkPwAd6O3QQFCdHq9GeJ26aGMxsHclKxUOXOnLtZ3qxlazxLfZ7yZbezUntSu9Vb',
    serversRefreshTime: 60000,

    //CDN server configurati on
    cdn_port: 3009,
    cdn_baseURL: 'https://cdn.yshop.pl',
    cdn_token: 'Xw3P6yoERm',

    //Data from dotenv
    session: process.env.SESSION_SECRET,

    mail_host: process.env.MAIL_HOST,
    mail_user: process.env.MAIL_USER,
    mail_pass: process.env.MAIL_PASSWORD,

    mysql_host: process.env.MYSQL_HOST,
    mysql_db: process.env.MYSQL_DATABASE,
    mysql_pass: process.env.MYSQL_PASSWORD,
    mysql_user: process.env.MYSQL_USER,

    site_key: process.env.SITE_KEY,
    secret_key: process.env.SECRET_KEY,

    hashSecret: 'ScgscJsDepcPqA2vhTJjd4FGN3kNEKY25Mf5skDcjLkwjgD67WBjx3PpDLbgD6j7YKuMND7jxarkEzhU3jstbudQUQgMNrqbf5Np',

    nginx_path: '../../Desktop/vue-login/' //../../etc/nginx/sites-enabled/
}