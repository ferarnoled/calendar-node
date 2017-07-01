/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Countries', {
    CountryCode: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    Name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'Countries',
    timestamps: false
  });
};
