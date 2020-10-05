'use strict';
module.exports = (sequelize, DataTypes) => {
  const transactions = sequelize.define('transactions', {
    transaction_id: DataTypes.STRING,
    users_id: DataTypes.INTEGER,
    product_name : DataTypes.STRING,
    product_total_count : DataTypes.INTEGER,
    product_price : DataTypes.INTEGER,
    product_total_price : DataTypes.INTEGER,
    transaction_point: DataTypes.INTEGER
  }, {});
  transactions.associate = function(models) {
    transactions.belongsTo(models.users , { foreignKey : 'users_id' , targetKey : 'id' })
  };
  return transactions;
};