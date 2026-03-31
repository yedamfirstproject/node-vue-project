//상담기록 관련 service
const consultMapper = require("../database/mappers/consult_mapper");

//전체조회
const findAll = async () => {
  let list = await consultMapper.consultList();
  return list;
};

module.exports = { findAll };
