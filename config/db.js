const { Sequelize } = require('sequelize');
require('dotenv').config();  // ✅ Load environment variables

// ✅ Ensure DATABASE_URL exists before initializing Sequelize
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
    throw new Error("❌ ERROR: DATABASE_URL is not set in .env file!");
}

const sequelize = new Sequelize(databaseUrl, {
    dialect: 'postgres',
    logging: false,
});

module.exports = sequelize;
