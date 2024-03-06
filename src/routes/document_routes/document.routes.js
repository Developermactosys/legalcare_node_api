const router = require('express').Router()
const { uploadDocument, getAllDocument } = require('../../controller/document_controller/document.controller')
const {uploads} = require('../../middleware/multer');

router.post('/upload_doc',uploads.single('document') ,uploadDocument)
router.post('/certificate_img', uploads.single('certificate_of_membership'), uploadDocument)
router.get('/get_document_list', getAllDocument )

module.exports = router;