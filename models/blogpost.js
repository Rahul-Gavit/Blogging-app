"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class BlogPost extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      BlogPost.belongsTo(models.User, { foreignKey: "userId" });
      BlogPost.hasMany(models.Comment, { foreignKey: "blogPostId" });
    }
  }
  BlogPost.init(
    {
      title: DataTypes.STRING,
      content: DataTypes.TEXT,
      userId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "BlogPost",
    }
  );
  return BlogPost;
};
