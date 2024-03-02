const { Router } = require('express');
const router = Router();

// Import Controllers
const usersController = require('../../controller/agora_For_video/channel.controllers');
//import route
router.get('/rtc/:role/:tokentype/:uid', usersController.join_channel_for_legalcare); 

module.exports = router
  




