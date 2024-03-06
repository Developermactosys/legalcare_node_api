const router = require('express').Router()
const { uploadDocument, getAllDocument ,get_document_by_user_id} = require('../../controller/document_controller/document.controller')
const {uploads} = require('../../middleware/multer');

router.post('/upload_doc',uploads.single('document') ,uploadDocument)
router.post('/certificate_img', uploads.single('certificate_of_membership'), uploadDocument)
router.get('/get_document_list', getAllDocument )
router.get('/get_document_by_user_id',get_document_by_user_id);
module.exports = router;