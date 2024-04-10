const express = require("express")

const router = express.Router();
const {uploads} = require('../../middleware/multer');
// const { authorize} = require("../../middleware/authorization")

const { createServices,getALlService,
    getServiceById,deleteService,getServiceBy_expertId ,getAllserviceBy_expert_id,updateService} = require("../../controller/service_controller/service.controller")

router.post('/add_service',uploads.single('service_img'), createServices) 
router.get('/get_all_services',getALlService)
router.get('/get_service_by_id', getServiceById)

router.patch('/update_service/:id', uploads.single('service_img'),updateService) 

router.delete('/del_service_by_id/:serviceId/:expert_id', deleteService)

router.get("/get_service_by_expert_id",getServiceBy_expertId);
router.get("/get_allservices_by_expert_id",getAllserviceBy_expert_id) // expert flow

module.exports = router