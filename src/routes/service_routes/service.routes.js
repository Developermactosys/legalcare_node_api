const express = require("express")

const router = express.Router();
const {uploads} = require('../../middleware/multer');


const { createServices,getALlService,
    getServiceById,deleteService} = require("../../controller/service_controller/service.controller")

router.post('/add_service', uploads.single('service_img'), createServices) 
router.get('/get_all_services' ,getALlService)
router.get('/get_service_by_id/:serviceId', getServiceById)
router.delete('/del_service_by_id/:serviceId', deleteService )

module.exports = router