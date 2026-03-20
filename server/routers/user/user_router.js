//회원 관련 router
const express = require("express");
const router = express.Router();

const userService = require("../../services/user_service.js");

router.get(`/test`, async (req, res) => {
  let result = await userService.testSelect();
  res.send(result);
});

module.exports = router;
