const router = require("express").Router();
const { checkToken, checkAdmin } = require("../utils/auth");
const controller = require("../controllers/index.controller");

// admin section
router.get("/all-users", controller.getAllUsers);
router.delete("/all-users/:id", controller.deleteUser);
router.post("/send-balance", controller.sendBalance);

module.exports = router;
