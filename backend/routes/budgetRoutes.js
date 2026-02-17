const express = require("express");
const router = express.Router();
const { getBudgets, setBudget, deleteBudget } = require("../controllers/budgetController");

router.get("/", getBudgets);
router.post("/", setBudget);
router.delete("/:id", deleteBudget);

module.exports = router;
