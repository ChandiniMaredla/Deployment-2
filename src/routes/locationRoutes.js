const express = require("express");
const {
  getLocationByPincode,
  getMandalsByDistrict,
  getVillagesByMandal,
  getAllMandals,
  getAllVillages,
} = require("../controllers/locationController");

const locationRoutes = express.Router();
const apicache = require('apicache');
let cache = apicache.middleware; 

locationRoutes.get("/getallmandals",cache('5 minutes'), getAllMandals);
locationRoutes.get("/getallvillages",cache('5 minutes'), getAllVillages);
locationRoutes.get(
  "/getlocationbypincode/:pincode/:district/:mandal",cache('5 minutes'),
  getLocationByPincode
);
locationRoutes.get("/getmandals/:district",cache('5 minutes'), getMandalsByDistrict);
locationRoutes.get("/getvillagesbymandal/:mandal",cache('5 minutes'), getVillagesByMandal);
module.exports = locationRoutes;
