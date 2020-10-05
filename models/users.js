'use strict';
module.exports = (sequelize, DataTypes) => {
  const users = sequelize.define('users', {
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.TEXT,
    transactions_count : DataTypes.INTEGER,
    users_point : DataTypes.INTEGER,
    is_user_admin: DataTypes.ENUM('user' , 'admin')
  }, {});
  users.associate = function(models) {
    users.hasMany(models.transactions , { foreignKey : 'users_id' , sourceKey : 'id' })
  };
  return users;
};