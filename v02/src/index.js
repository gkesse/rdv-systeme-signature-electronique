import { appConfig } from './module/rdv_app_config.js';
import AWS from 'aws-sdk';
import FSFilesAdapter from '@parse/fs-files-adapter';
import S3Adapter from '@parse/s3-files-adapter';
import { createTransport } from 'nodemailer';
import Mailgun from 'mailgun.js';
import { ApiPayloadConverter } from 'parse-server-api-mail-adapter';
import { SSOAuth } from './module/rdv_auth_adapter.js';

let fsAdapter;

if (appConfig.useLocal !== 'true') {
    try {
        const spacesEndpoint = new AWS.Endpoint(process.env.DO_ENDPOINT);

        const s3Options = {
            bucket: appConfig.awsBucket,
            baseUrl: appConfig.awsBaseUrl,
            region: appConfig.awsRegion,
            directAccess: true,
            preserveFileName: true,
            presignedUrl: true,
            presignedUrlExpires: 900,
            s3overrides: {
                accessKeyId: appConfig.awsAccessKeyId,
                secretAccessKey: appConfig.awsSecretAccessKey,
                endpoint: spacesEndpoint,
            },
        };

        fsAdapter = new S3Adapter(s3Options);
    } catch (error) {
        console.log(
            'Please provide AWS credintials in env file! Defaulting to local storage.|error' + error
        );
        fsAdapter = new FSFilesAdapter({
            filesSubDirectory: 'files',
        });
    }
} else {
    fsAdapter = new FSFilesAdapter({
        filesSubDirectory: 'files',
    });
}

let transporterMail;
let mailgunClient;
let mailgunDomain;
let isMailAdapter = false;

if (appConfig.smtpEnable) {
    try {
        transporterMail = createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT || 465,
            secure: smtpsecure,
            auth: {
                user: process.env.SMTP_USER_EMAIL,
                pass: process.env.SMTP_PASS,
            },
        });

        await transporterMail.verify();
        isMailAdapter = true;
    } catch (error) {
        isMailAdapter = false;
        console.log('Please provide valid SMTP credentials|error=' + error);
    }
} else if (appConfig.mailGunApiKey) {
    try {
        const mailgun = new Mailgun(formData);

        mailgunClient = mailgun.client({
            username: appConfig.mailGunUsername,
            key: appConfig.mailGunApiKey,
        });

        mailgunDomain = appConfig.mailGunDomain;
        isMailAdapter = true;
    } catch (error) {
        isMailAdapter = false;
        console.log('Please provide valid Mailgun credentials|error=' + error);
    }
}

const mailSender = appConfig.smtpEnable ? appConfig.smtpUserEmail : appConfig.mailGunSender;

export const config = {
    databaseURI: appConfig.databaseURI,
    cloud: function () {
        import('./cloud/main.js');
    },
    appId: appConfig.appId,
    logLevel: ['error'],
    maxLimit: 500,
    maxUploadSize: '30mb',
    masterKey: appConfig.masterKey,
    masterKeyIps: ['0.0.0.0/0', '::/0'],
    serverURL: appConfig.cloudServerUrl,
    publicServerURL: appConfig.publicServerURL,
    appName: 'ReadySign',
    allowClientClassCreation: false,
    allowExpiredAuthDataToken: false,
    encodeParseObjectInCloudFunction: true,
    ...(isMailAdapter === true
        ? {
              emailAdapter: {
                  module: 'parse-server-api-mail-adapter',
                  options: {
                      sender: 'ReadySign™' + ' <' + mailSender + '>',
                      templates: {
                          passwordResetEmail: {
                              subjectPath: './data/files/password_reset_email_subject.txt',
                              textPath: './data/files/password_reset_email.txt',
                              htmlPath: './data/files/password_reset_email.html',
                          },
                          verificationEmail: {
                              subjectPath: './data/files/verification_email_subject.txt',
                              textPath: './data/files/verification_email.txt',
                              htmlPath: './data/files/verification_email.html',
                          },
                      },
                      apiCallback: async ({ payload, locale }) => {
                          if (mailgunClient) {
                              const mailgunPayload = ApiPayloadConverter.mailgun(payload);
                              await mailgunClient.messages.create(mailgunDomain, mailgunPayload);
                          } else if (transporterMail) await transporterMail.sendMail(payload);
                      },
                  },
              },
          }
        : {}),
    filesAdapter: fsAdapter,
    auth: {
        google: {
            enabled: true,
        },
        sso: SSOAuth,
    },
};
