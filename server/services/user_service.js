//회원 관련 service
const userMapper = require("../database/mappers/user_mapper");

const testSelect = () => {
  let list = userMapper.testSelect();
  return list;
};

module.exports = {
  testSelect,
};
