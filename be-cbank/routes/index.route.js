const router = require("express").Router();
const controller = require("../controllers/index.controller");
const { checkToken } = require("../utils/auth");
const checkPremium = require("../utils/checkPremium");

router.post("/my-token", controller.signInToken);
router.delete("/my-token", checkToken, controller.signOutToken);
router.post("/sign-up", controller.signUpUser);

router.post("/upgrade-premium", controller.upgradeToPremium);

router.post("/transfer", checkToken, checkPremium, controller.transferUser);

module.exports = router;
