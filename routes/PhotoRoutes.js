const express = require("express");
const router = express.Router();

// Controller

// Middleware
const { photoInsertValidation } = require("../middlewares/photoValidation");
const authGuard = require("../middlewares/authguard");
const validate = require("../middlewares/handleValidation");

// Routes

module.exports = router;
