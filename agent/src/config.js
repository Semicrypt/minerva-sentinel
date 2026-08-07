require("dotenv").config();

const API_URL =
    process.env.API_URL ||
    "http://localhost:5000/api/metrics";

const API_KEY =
    process.env.API_KEY ||
    "";

const INTERVAL =
    Number(
        process.env.INTERVAL
    ) || 10000;

module.exports = {

    API_URL,

    API_KEY,

    INTERVAL

};