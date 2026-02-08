const express = require("express");
const router = express.Router();
const { loginAdmin, registerAdmin } = require("../controllers/adminControllers");
// POST /api/admins/register
router.post("/register", registerAdmin); 
// POST /api/admins/login
router.post("/login", loginAdmin);

module.exports = router;
