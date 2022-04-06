var express = require("express");
var router = express.Router();
const balanceModel = require("../models").Balance;

router.get("/", function (req, res, next) {
  balanceModel.findAll().then(
    function (balances) {
      res.status(200).json(balances);
    },
    function (error) {
      res.status(500).json(error);
    }
  );
});

router.post("/", (req, res) => {
  balanceModel.create(req.body).then(
    (balance) => {
      res.status(200).json({ status: 1, balance });
    },
    (error) => {
      res.status(500).json(error);
    }
  );
});

module.exports = router;
