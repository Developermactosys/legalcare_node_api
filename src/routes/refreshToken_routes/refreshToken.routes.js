const express = require("express")
const router = express.Router()
const { refresh_token } = require("../../services/refreshToken")

router.post("/refresh", refresh_token)

module.exports = router