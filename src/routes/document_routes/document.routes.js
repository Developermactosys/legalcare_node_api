const router = require('express').Router()
const { uploadDocument, getAllDocument ,get_document_by_user_id,updateStatusForDoc,uploadMultipleDoc,getAllDocumentById} = require('../../controller/document_controller/document.controller')
const {uploads} = require('../../middleware/multer');

router.post('/upload_doc',uploads.single('document') ,uploadDocument)
router.post('/certificate_img', uploads.single('certificate_of_membership'), uploadDocument)
router.get('/get_document_list', getAllDocument )
router.get('/get_document_by_user_id',get_document_by_user_id);
router.get('/get_all_doc_by_id', getAllDocumentById)

router.post('/multiple_upload_data', uploads.fields([
    { name: 'certificate_of_membership', maxCount: 1 },
    { name: 'certificate_of_practice', maxCount: 1 },
    { name: 'pan_card_image', maxCount: 1 },
    { name: 'aadhar_card_image', maxCount: 1 },
    { name: 'passbook_image', maxCount: 1 },
    { name: 'document', maxCount: 1 },
]), uploadMultipleDoc)

router.post('/update_doc_status',uploads.none(),updateStatusForDoc)
module.exports = router;