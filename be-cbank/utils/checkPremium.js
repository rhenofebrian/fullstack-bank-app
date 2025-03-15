const { ERR } = require("./response");

const checkPremium = (req, res, next) => {
  if (req.user.accountType !== "premium") {
    return ERR(res, 403, "only premium can transfer without fees");
  }
  next();
};

module.exports = checkPremium;
