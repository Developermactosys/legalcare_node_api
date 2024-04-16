const router = require('express').Router()
const {uploads} = require('../../middleware/multer');

const { addExpertService, getAllExpertService, getAllExpertServiceById, updateExpertServiceById, delExpertServiceById ,get_expertServiceBy_category_id,get_expertServiceBy_subcategory_id ,get_expertServiceBy_service_id,get_expertServiceBy_expert_id} = require('../../controller/expert_services_controller/expert_service');


router.post('/add_expert_service',uploads.none(), addExpertService)
// router.get('/get_all_expert_service', getAllExpertService)
// router.get('/get_expert_service_by_id/:id', getAllExpertServiceById)
// router.patch('/update_expert_service/:id',uploads.none(), updateExpertServiceById)
// router.delete("/delete_expert_service/:id", delExpertServiceById)

// router.get("/get_expertservices_by_category_id/:category_id",get_expertServiceBy_category_id)
// router.get("/get_expertservices_by_subcategory_id/:subcategory_id",get_expertServiceBy_subcategory_id)
// router.get("/get_expertservice_by_service_id/:service_id",get_expertServiceBy_service_id)
// router.get("/get_expertservice_by_expert_id/:expert_id",get_expertServiceBy_expert_id)
module.exports = router;