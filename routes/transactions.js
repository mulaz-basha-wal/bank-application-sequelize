var express = require("express");
var router = express.Router();
const { sequelize } = require("../models");
const transactionModel = require("../models").Transaction;
const balanceModel = require("../models").Balance;

router.get("/", function (req, res, next) {
  transactionModel.findAll().then(
    function (transactions) {
      res.status(200).json(transactions);
    },
    function (error) {
      res.status(500).json(error);
    }
  );
});

router.post("/", async (req, res) => {
  const { from, to, transaction_amount } = req.body;
  let transaction;
  try {
    transaction = await sequelize.transaction();
    const fromUser = await balanceModel.findOne({ where: { userId: from } });
    const toUser = await balanceModel.findOne({ where: { userId: to } });
    // updating payee amount in balance table
    await balanceModel.update(
      { balance: fromUser.balance - parseFloat(transaction_amount) },
      {
        where: {
          userId: from,
        },
      },
      { transaction }
    );
    // updating reciepent amount in balance table
    await balanceModel.update(
      { balance: toUser.balance + parseFloat(transaction_amount) },
      {
        where: {
          userId: to,
        },
      },
      { transaction }
    );
    // adding transcation in transaction table
    transactionModel.create({
      transaction_date: new Date().toISOString(),
      transaction_amount,
    });
    // commiting transaction
    await transaction.commit();
    res.json({ status: 1, msg: "transaction is success" });
  } catch (error) {
    if (transaction) {
      // rollback on error
      await transaction.rollback();
    }
    res.json({ status: 0, error });
  }
});
module.exports = router;
