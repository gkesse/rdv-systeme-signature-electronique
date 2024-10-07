import DocumentAftersave from './parse/rdv_document_after_save.js';

Parse.Cloud.afterSave('contracts_Document', DocumentAftersave);
