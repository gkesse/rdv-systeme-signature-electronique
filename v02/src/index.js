import { appConfig } from './module/rdv_app_config.js';
import AWS from 'aws-sdk';
import FSFilesAdapter from '@parse/fs-files-adapter';
import S3Adapter from '@parse/s3-files-adapter';
import { createTransport } from 'nodemailer';
import Mailgun from 'mailgun.js';
import { ApiPayloadConverter } from 'parse-server-api-mail-adapter';
import { SSOAuth } from './module/rdv_auth_adapter.js';
import express from 'express';
import cors from 'cors';
import { ParseServer } from 'parse-server';
import path from 'path';
import { app as customRoute } from './module/rdv_custom_app.js';
import { app as v1 } from './module/rdv_custom_app_v1.js';
import http from 'http';
import { exec } from 'child_process';
import { PostHog } from 'posthog-node';

let fsAdapter;

const __dirname = path.resolve();

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
            `Veuillez fournir les informations d'identification AWS dans le fichier env ! Par défaut, le stockage est local.|error=` + error
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
            host: appConfig.smtpHost,
            port: appConfig.smtpPort,
            secure: appConfig.smtpSecure,
            auth: {
                user: appConfig.smtpUserEmail,
                pass: appConfig.smtpPass,
            },
        });

        await transporterMail.verify();
        isMailAdapter = true;
    } catch (error) {
        isMailAdapter = false;
        console.log(`Veuillez fournir des informations d'identification SMTP valides.|error=` + error);
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
        console.log(`Veuillez fournir des informations d'identification Mailgun valides.|error=` + error);
    }
}

const mailSender = appConfig.smtpEnable ? appConfig.smtpUserEmail : appConfig.mailGunSender;

export const config = {
    databaseURI: appConfig.databaseURI,
    cloud: function () {
        import('./module/rdv_cloud_main.js');
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

function getUserIP(request) {

}

export const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(function (req, res, next) {
    req.headers['x-real-ip'] = getUserIP(req);
    next();
});
app.use(function (req, res, next) {
    try {
        req.posthog = new PostHog(appConfig.phProjectApiKey);
    } catch (error) {
        console.log('Veuillez fournir une clé API valide pour PostHog.|error=' + error);
        req.posthog = '';
    }
    next();
});

app.use('/public',
    express.static(path.join(__dirname, '/public'))
);

if (!appConfig.isTesting) {
    const mountPath = appConfig.parseMount;

    try {
        const server = new ParseServer(config);
        await server.start();
        app.use(mountPath, server.app);
    } catch (error) {
        console.log('Veuillez fournir une configuration valide de parser-server.|error=' + error);
    }
}

app.use('/', customRoute);

app.use('/v1', v1);

app.get('/', function (req, res) {
    res.status(200).send(`readysign-server est en cours d'exécution !!!`);
});

if (!appConfig.isTesting) {
    const httpServer = http.createServer(app);
    httpServer.keepAliveTimeout = 100000;   // 100s
    httpServer.headersTimeout = 100000;     // 100s

    httpServer.listen(appConfig.httpPort, '0.0.0.0', function () {
        console.log('readysign-server est exécuté sur le port ' + appConfig.httpPort + '.');

        const migrate = appConfig.isWindows
        ? `set APPLICATION_ID=${appConfig.appId} && set SERVER_URL=${appConfig.cloudServerUrl} && set MASTER_KEY=${appConfig.masterKey} && npx parse-dbtool migrate`
        : `APPLICATION_ID=${appConfig.appId} SERVER_URL=${appConfig.cloudServerUrl} MASTER_KEY=${appConfig.masterKey} npx parse-dbtool migrate`;

        /*exec(migrate, (error, stdout, stderr) => {
            if (error) {
                console.error(`Veuillez fournir une configuration valide de la migration avec parser-dbtool.|error=${error.message}`);
                return;
            }

            if (stderr) {
                console.error(`Veuillez fournir un paramétrage valide de la migration avec parser-dbtool.|error=${stderr}`);
                return;
            }
            console.log(`Sortie de la commande de migration avec parse-dbtool.|command=${stdout}`);
        });*/
    });
}
