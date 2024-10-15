const express = require("express");
const {
  getFields,
  insertFieldDetails,
  getAllFields,
} = require("../controllers/fieldController");

const fieldRoutes = express.Router();
const apicache = require('apicache');
const cache = apicache.middleware;

fieldRoutes.get("/getfields", getFields);
fieldRoutes.post("/insert", insertFieldDetails);
fieldRoutes.get("/getallfields",cache('5 minutes'), getAllFields);

module.exports = fieldRoutes;
