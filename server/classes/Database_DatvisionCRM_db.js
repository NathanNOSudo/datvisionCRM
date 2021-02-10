// Import Sequelize
import Sequelize from "sequelize";
import InitSchema from "../models/schema_datvisionCRM_db";
import UserModel from "../models/DatvisionCRM_db/UserModel";

// Logging
import Logger from "./Logger";
// Properties
import properties from "../properties.js";

class Database {
  constructor() {}

  /**
   * Init database
   */
  async init() {
    await this.authenticate();
    Logger.info(
      "Database connected at: " +
        properties.datvisionCRM_db.host +
        ":" +
        properties.datvisionCRM_db.port +
        "//" +
        properties.datvisionCRM_db.user +
        "@" +
        properties.datvisionCRM_db.name
    );

    // Import schema
    InitSchema();

    await UserModel.createAdminUser();

  }

  /**
   * Start database connection
   */
  async authenticate() {
    Logger.info("Authenticating to the databases...");

    const sequelize = new Sequelize(
      properties.datvisionCRM_db.name,
      properties.datvisionCRM_db.user,
      properties.datvisionCRM_db.password,
      {
        host: properties.datvisionCRM_db.host,
        dialect: properties.datvisionCRM_db.dialect,
        port: properties.datvisionCRM_db.port,
        logging: false
      }
    );
    this.dbConnection_datvisionCRM_db = sequelize;

    try {
      await sequelize.sync();
    } catch (err) {
      // Catch error here
      Logger.error(`Failed connection to the DB`);
      Logger.error(err);
      await new Promise(resolve => setTimeout(resolve, 5000));
      await this.authenticate();
    }
  }

  /**
   * Get connection db
   */
  getConnection() {
    return this.dbConnection_datvisionCRM_db;
  }
}

export default new Database();
