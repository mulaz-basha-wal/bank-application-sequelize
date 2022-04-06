var express = require("express");
var router = express.Router();
const usersModel = require("../models").User;

router.get("/", function (req, res, next) {
  usersModel.findAll().then(
    function (users) {
      res.status(200).json(users);
    },
    function (error) {
      res.status(500).json(error);
    }
  );
});

router.post("/", (req, res) => {
  usersModel.create(req.body).then(
    (employee) => {
      res.status(200).json({ status: 1, employee });
    },
    (error) => {
      res.status(500).json(error);
    }
  );
});

module.exports = router;
