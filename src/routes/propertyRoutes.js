const express = require("express");
const {
  getPropertiesByLocation,
  getPropertiesByUserId,
  updatePropertyStatus,
  getAllProperties,
  getLatestProps,
  insertPropertyRatings,
  getPropertiesByType,
  getPropertyRatings,
  getPropertiesById,
  getProperty,
  maxPrice
} = require("../controllers/propertyController");

const propertyRoutes = express.Router();

const apicache = require('apicache');
let cache = apicache.middleware;

// propertyRoutes.get('/latestprops',getLatestProps);
propertyRoutes.put("/markassold/", updatePropertyStatus);
propertyRoutes.get("/getpropbyid", getPropertiesByUserId);
propertyRoutes.get("/:location",cache('5 minutes'), getPropertiesByLocation);
propertyRoutes.get("/getproprating/:propertyId",cache('5 minutes'), getPropertyRatings);
propertyRoutes.post("/insertproprating", insertPropertyRatings);
propertyRoutes.get("/getpropbyid/:propertyType/:propertyId",cache('5 minutes'), getPropertiesById);
propertyRoutes.get("/getpropbytype/:type",cache('5 minutes'), getPropertiesByType);
propertyRoutes.get("/getprop/:propertyType/:userId/:propertyId",getProperty);
propertyRoutes.get('/maxPrice/:type/:sell/:rent/:lease/:flat/:house',cache('5 minutes'),maxPrice);
module.exports = propertyRoutes;
