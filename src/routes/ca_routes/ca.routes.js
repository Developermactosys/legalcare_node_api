const express = require("express");
const {
  getAllCa,
  createCA,
  caStatusUpdate,
  updateCA,
  deleteCA,
  getByIdCa,
  getBankInfo,
  editBankInfo,
} = require("../../controller/ca_controller/ca.controller");
const router = express.Router();

router.get("/get_allCa", getAllCa);
router.post("/add_newCa", createCA);
router.patch("/ca_statusUpdate/:id", caStatusUpdate);
router.patch("/update_ca/:id", updateCA);
router.delete("/delete_ca/:id", deleteCA);
router.get("/get_ca/:id", getByIdCa);

// Bank routes

// Bank routes
router.get("/ca-bank-getInfo/:id", getBankInfo);
router.patch("/ca-bank-info/:id", editBankInfo);

module.exports = router;
