//상담기록 관력 router
const express = require("express");
const router = express.Router();
const consultService = require("../../services/consult_service");

//전체조회
router.get("/consult", async (req, res) => {
  let result = await consultService.findAll();
  res.send(result);
});

module.exports = router;
