const express = require("express")

const router = express.Router();
const {uploads} = require('../../middleware/multer');
// const { authorize} = require("../../middleware/authorization")

const { createServices,getALlService,
    getServiceById,deleteService,getServiceBy_expertId ,getAllserviceBy_expert_id,updateService,deleteServiceforAdmin,update_service_for_active,get_expertServiceBy_category_id} = require("../../controller/service_controller/service.controller")

router.post('/add_service',uploads.single('service_img'), createServices) 
router.get('/get_all_services',getALlService)
router.get('/get_service_by_id', getServiceById)

router.patch('/update_service/:id', uploads.single('service_img'),updateService) 

router.delete('/del_service_by_id/:serviceId/:expert_id', deleteService)

router.delete('/delete_service_by_id/:serviceId',deleteServiceforAdmin)

router.get("/get_service_by_expert_id",getServiceBy_expertId);

router.get("/get_expert_service_by_category_id",get_expertServiceBy_category_id)

router.get("/get_allservices_by_expert_id",getAllserviceBy_expert_id) // expert flow

router.patch("/update_service_status",update_service_for_active)

module.exports = router