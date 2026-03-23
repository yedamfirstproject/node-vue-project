// 메인페이지 관련 router
const express = require("express");
const router = express.router();

const mainService = require("../../services/main_service.js");

router.get(`/test`, async (req, res) => {
  let result = await mainService.surveySelectList();
  res.send(result);
});

module.exports = router;
