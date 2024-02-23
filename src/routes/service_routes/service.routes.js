const express = require("express")

const router = express.Router();
const {uploads} = require('../../middleware/multer');


const { createServices,getALlService,
    getServiceById,deleteService,getServiceBy_expertId ,getAllserviceBy_expert_id} = require("../../controller/service_controller/service.controller")

router.post('/add_service', uploads.single('service_img'), createServices) 
router.get('/get_all_services' ,getALlService)
router.get('/get_service_by_id', getServiceById)
router.delete('/del_service_by_id/:serviceId', deleteService)
router.get("/get_service_by_expert_id",getServiceBy_expertId);
router.get("/get_allservices_by_expert_id",getAllserviceBy_expert_id) // expert flow
module.exports = router