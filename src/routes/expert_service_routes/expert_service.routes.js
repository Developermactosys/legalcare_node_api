const router = require('express').Router()
const {uploads} = require('../../middleware/multer');

const { addExpertService, getAllExpertService, getAllExpertServiceById, updateExpertServiceById, delExpertServiceById } = require('../../controller/expert_services_controller/expert_service');


router.post('/add_expert_service',uploads.none(), addExpertService)
router.get('/get_all_expert_service', getAllExpertService)
router.get('/get_expert_service_by_id/:id', getAllExpertServiceById)
router.patch('/update_expert_service/:id',uploads.none(), updateExpertServiceById)
router.delete("/delete_expert_service/:id", delExpertServiceById)

module.exports = router;