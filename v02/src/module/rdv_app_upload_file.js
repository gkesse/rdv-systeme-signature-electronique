import { appConfig } from "./rdv_app_config.js";
import multer from 'multer';
import aws from 'aws-sdk';
import multerS3 from 'multer-s3';

function sanitizeFileName(fileName) {
    return fileName.replace(/[^a-zA-Z0-9._-]/g, '');
}

async function uploadFile(req, res) {
    try {
        // 100 Mo
        const size = 100 * 1024 * 1024;

        const accepted_extensions = [
            'jpg',
            'png',
            'gif',
            'mp4',
            'mp3',
            'pdf',
            'jpeg',
            'dwg',
            'dxf',
            'zip',
            'rar',
            'txt',
            'doc',
            'docx',
            'pptx',
            'ppt',
            'xlsx',
            'xlsm',
            'xlsb',
            'xltx',
            'xml',
            'xls',
            'xla',
            'xlx',
        ];

        if (appConfig.useLocal === 'true') {
            fileStorage = multer.diskStorage({
                destination: function (req, file, cb) {
                    cb(null, 'files/files');
                },
                metadata: function (req, file, cb) {
                    cb(null, { fieldName: 'READYSIGN_METADATA' });
                },
                filename: function (req, file, cb) {
                    let filename = file.originalname;
                    let newFileName = filename.split('.')[0];
                    let extension = filename.split('.')[1];
                    newFileName = sanitizeFileName(
                        newFileName + '_' + new Date().toISOString() + '.' + extension
                    );
                    console.log(newFileName);
                    cb(null, newFileName);
                },
            });
        } else {
            try {
                const spacesEndpoint = new aws.Endpoint(appConfig.awsEndpoint);
                const s3 = new aws.S3({
                    endpoint: spacesEndpoint,
                    accessKeyId: appConfig.awsAccessKeyId,
                    secretAccessKey: appConfig.awsSecretAccessKey,
                    signatureVersion: 'v4',
                    region: appConfig.awsRegion,
                });
                fileStorage = multerS3({
                    acl: 'public-read',
                    s3,
                    bucket: appConfig.awsBucket,
                    metadata: function (req, file, cb) {
                        cb(null, { fieldName: 'READYSIGN_METADATA' });
                    },
                    key: function (req, file, cb) {
                        let filename = file.originalname;
                        let newFileName = filename.split('.')[0];
                        let extension = filename.split('.')[1];
                        newFileName = sanitizeFileName(
                          newFileName + '_' + new Date().toISOString() + '.' + extension
                        );
                        console.log(newFileName);
                        cb(null, newFileName);
                    }
                });
            } catch (error) {
                fileStorage = multer.diskStorage({
                    destination: function (req, file, cb) {
                        cb(null, 'files/files');
                    },
                    metadata: function (req, file, cb) {
                        cb(null, { fieldName: 'READYSIGN_METADATA' });
                    },
                    filename: function (req, file, cb) {
                        let filename = file.originalname;
                        let newFileName = filename.split('.')[0];
                        let extension = filename.split('.')[1];
                        newFileName = sanitizeFileName(
                          newFileName + '_' + new Date().toISOString() + '.' + extension
                        );
                        console.log(newFileName);
                        cb(null, newFileName);
                    }
                });
            }
        }

        const upload = multer({
            fileFilter: function (req, file, cb) {
                if (accepted_extensions.some(ext => file.originalname.toLowerCase().endsWith('.' + ext))) {
                    return cb(null, true);
                }
                return cb('Only ' + accepted_extensions.join(', ') + ' files are allowed!');
            },
            storage: fileStorage,
            limits: { fileSize: size },
        }).single('file');

        upload(req, res, function (err, some) {
            if (err) {
                console.log("Veuillez fournir une configuration valide pour le téléchargement des fichiers.|error=" + err);
                const status = 'Error';
                const message = err;
                const returnCode = 1029;
                return res.send({ status, returnCode, message });
            }

            const status = 'Success';

            if (appConfig.useLocal === 'true') {
                console.log(req.file);
                var fileUrl = `${parseBaseUrl}/files/${parseAppId}/${req.file.filename}`;
            } else {
                var fileUrl = req.file.location;
            }
            return res.json({ status, imageUrl: fileUrl });
        });
    } catch (error) {
        console.log('Veuillez fournir une requête valide pour le téléchargement.|error=' + err.stack);
        const status = 'Error';
        const returnCode = 1021;
        const message = 'Un problème a été rencontré.';
        return res.send({ status, returnCode, message });
    }
}

export default uploadFile;
