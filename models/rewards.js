'use strict';
module.exports = (sequelize, DataTypes) => {
  const rewards = sequelize.define('rewards', {
    users_point: DataTypes.INTEGER,
    rewards: DataTypes.STRING
  }, {});
  rewards.associate = function(models) {
    // associations can be defined here
  };
  return rewards;
};