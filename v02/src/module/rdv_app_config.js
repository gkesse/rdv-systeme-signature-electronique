import dotenv from 'dotenv';

dotenv.config();

export const appConfig = {
    appId: process.env.APP_ID || 'readysign',

    useLocal: process.env.USE_LOCAL ? process.env.USE_LOCAL : '',
    doEndpoint: process.env.DO_ENDPOINT ? process.env.DO_ENDPOINT : '',

    awsBucket: process.env.DO_SPACE ? process.env.DO_SPACE : '',
    awsBaseUrl: process.env.DO_BASEURL ? process.env.DO_BASEURL : '',
    awsRegion: process.env.DO_REGION ? process.env.DO_REGION : '',
    awsAccessKeyId: process.env.DO_ACCESS_KEY_ID ? process.env.DO_ACCESS_KEY_ID : '',
    awsSecretAccessKey: process.env.DO_SECRET_ACCESS_KEY ? process.env.DO_SECRET_ACCESS_KEY : '',

    smtpEnable: process.env.SMTP_ENABLE && process.env.SMTP_ENABLE === "true" ? true : false,
    smtpHost: process.env.SMTP_HOST ? process.env.SMTP_HOST : '',
    smtpPort: process.env.SMTP_PORT ? process.env.SMTP_PORT : 465,
    useLocal: process.env.USE_LOCAL ? process.env.USE_LOCAL : '',
    useLocal: process.env.USE_LOCAL ? process.env.USE_LOCAL : '',
    smtpSecure: process.env.SMTP_PORT && process.env.SMTP_PORT !== '465' ? false : true,
    smtpUserEmail: process.env.SMTP_USER_EMAIL ? process.env.SMTP_USER_EMAIL : '',
    smtpPass: process.env.SMTP_PASS ? process.env.SMTP_PASS : '',

    mailGunUsername: process.env.MAILGUN_USERNAME ? process.env.MAILGUN_USERNAME : '',
    mailGunApiKey: process.env.MAILGUN_API_KEY ? process.env.MAILGUN_API_KEY : '',
    mailGunDomain: process.env.MAILGUN_DOMAIN ? process.env.MAILGUN_DOMAIN : '',
    mailGunSender: process.env.MAILGUN_SENDER ? process.env.MAILGUN_SENDER : '',

    databaseURI: process.env.DATABASE_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/dev',
    masterKey: process.env.MASTER_KEY ? process.env.MASTER_KEY : '',

    publicServerURL: process.env.PUBLIC_SERVER_URL || 'http://localhost:8080/app',
    cloudServerUrl: process.env.CLOUD_SERVER_URL || 'http://localhost:8080/app',
};
