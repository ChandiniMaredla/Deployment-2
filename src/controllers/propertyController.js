// // controllers/fieldController.js

// const propertyRatingModel = require("../models/propertyRatingModel");
// const residentialModel = require("../models/residentialModel");
// const commercialModel = require("../models/commercialModel");
// const fieldModel = require("../models/fieldModel");
// const layoutModel = require("../models/layoutModel");
// const {propertyRatingSchema} = require('../helpers/propertyRatingValidation');
// const {validateType, validateIdAndType, validateIdTypeStatus, validateIdUserIdType}= require('../helpers/propertyValidation');
// const {validateId} = require('../helpers/propertyValidation');
// const getPropertiesByLocation = async (req, res) => {
//   try {
//     const { location } = req.params;

//     if (!location) {
//       return res
//         .status(400)
//         .json({ message: "Location parameter is required" });
//     }

//     // Create a query object
//     let query = {};

//     // Check if the location input is a number (for pinCode)
//     if (!isNaN(location)) {
//       // Convert to a number if it is numeric
//       const pinCode = Number(location);
//       query["address.pinCode"] = pinCode;
//     } else {
//       // Otherwise, search in other fields
//       query["$or"] = [
//         { "address.village": location },
//         { "address.mandal": location },
//         { "address.district": location },
//         { "address.state": location },
//       ];
//     }

//     // Execute the query
//     const properties = await fieldModel.find(query);

//     if (properties.length === 0) {
//       return res.status(404).json({ message: "No properties found" });
//     }

//     res.status(200).json(properties);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// //getPropertyByUserId
// const getPropertiesByUserId = async (req, res) => {
//   try {
//     const userId = req.user.user.userId;
//     console.log(userId);
//     const properties = await fieldModel.find({ userId: userId });
//     if (properties.length === 0) {
//       return res.status(404).json({ message: "No properties found" });
//     }

//     res.status(200).json(properties);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// //get all properties ----- for landing page
// const getAllProperties = async (req, res) => {
//   try {
//     // Define arrays to store the different property types
//     let fields = [];
//     let residentials = [];
//     let commercials = [];
//     let layouts = [];
//     //get count of documnets
//     const fieldsCount = await fieldModel.countDocuments();
//     const commercialCount = await commercialModel.countDocuments();
//     const residentialCount = await residentialModel.countDocuments();
//     const layoutCount = await layoutModel.countDocuments();
//     let fieldProperties,
//       residentialProperties,
//       commercialProperties,
//       layoutProperties;
//     //fetch atmost 8 properties
//     if (fieldsCount > 4) {
//       fieldProperties = await fieldModel
//         .find(
//           {},
//           {
//             "landDetails.images": 1,
//             "address.district": 1,
//             "landDetails.title": 1,
//             "landDetails.size": 1,
//             "landDetails.totalPrice": 1,
//           }
//         )
//         .limit(4)
//         .exec();
//     } else {
//       // Fetch data from Field properties collection
//       fieldProperties = await fieldModel
//         .find(
//           {},
//           {
//             "landDetails.images": 1,
//             "address.district": 1,
//             "landDetails.title": 1,
//             "landDetails.size": 1,
//             "landDetails.totalPrice": 1,
//           }
//         )
//         .exec();
//     }
//     // Iterate over field properties and push to the fields array
//     fieldProperties.forEach((property) => {
//       fields.push({
//         images: property.landDetails.images,
//         price: property.landDetails.totalPrice,
//         size: property.landDetails.size,
//         title: property.landDetails.title,
//         district: property.address.district,
//       });
//     });

//     // Fetch data from Residential properties collection
//     if (residentialCount > 4) {
//       residentialProperties = await residentialModel
//         .find(
//           {},
//           {
//             propPhotos: 1,
//             "propertyDetails.apartmentName": 1,
//             "propertyDetails.flatCost": 1,
//             "propertyDetails.flatSize": 1,
//             "address.district": 1,
//           }
//         )
//         .limit(4)
//         .exec();
//     } else {
//       residentialProperties = await residentialModel
//         .find(
//           {},
//           {
//             propPhotos: 1,
//             "propertyDetails.apartmentName": 1,
//             "propertyDetails.flatCost": 1,
//             "propertyDetails.flatSize": 1,
//             "address.district": 1,
//           }
//         )
//         .exec();
//     }
//     // Iterate over residential properties and push to the residentials array
//     residentialProperties.forEach((property) => {
//       residentials.push({
//         images: property.propPhotos,
//         price: property.propertyDetails.flatCost,
//         size: property.propertyDetails.flatSize,
//         title: property.propertyDetails.apartmentName,
//         district: property.address.district,
//       });
//     });

//     // Fetch data from Commercial properties collection
//     if (commercialCount > 4) {
//       commercialProperties = await commercialModel
//         .find(
//           {},
//           {
//             "propertyDetails.landDetails": 1,
//             "propertyDetails.uploadPics": 1,
//             propertyTitle: 1,
//           }
//         )
//         .limit(4)
//         .exec();
//     } else {
//       commercialProperties = await commercialModel
//         .find(
//           {},
//           {
//             "propertyDetails.landDetails": 1,
//             "propertyDetails.uploadPics": 1,
//             propertyTitle: 1,
//           }
//         )
//         .exec();
//     }
//     // Iterate over commercial properties and extract necessary fields
//     commercialProperties.forEach((property) => {
//       let price, size;
//       const { landDetails } = property.propertyDetails;

//       // Check if land is for sale, rent, or lease
//       if (landDetails.sell?.landUsage?.length > 0) {
//         price = landDetails.sell.totalAmount;
//         size = landDetails.sell.plotSize;
//       } else if (landDetails.rent?.landUsage?.length > 0) {
//         price = landDetails.rent.totalAmount;
//         size = landDetails.rent.plotSize;
//       } else if (landDetails.lease?.landUsage?.length > 0) {
//         price = landDetails.lease.totalAmount;
//         size = landDetails.lease.plotSize;
//       }

//       commercials.push({
//         images: property.propertyDetails.uploadPics,
//         price: price,
//         size: size,
//         title: property.propertyTitle,
//         district: landDetails?.address?.district,
//       });
//     });

//     // Fetch data from Layout properties collection
//     if (layoutCount > 4) {
//       layoutProperties = await layoutModel
//         .find(
//           {},
//           {
//             uploadPics: 1,
//             "layoutDetails.layoutTitle": 1,
//             "layoutDetails.plotSize": 1,
//             "layoutDetails.totalAmount": 1,
//             "layoutDetails.address.district": 1,
//           }
//         )
//         .limit(4)
//         .exec();
//     } else {
//       layoutProperties = await layoutModel
//         .find(
//           {},
//           {
//             uploadPics: 1,
//             "layoutDetails.layoutTitle": 1,
//             "layoutDetails.plotSize": 1,
//             "layoutDetails.totalAmount": 1,
//             "layoutDetails.address.district": 1,
//           }
//         )
//         .exec();
//     }
//     // Iterate over layout properties and push to the layouts array
//     layoutProperties.forEach((property) => {
//       layouts.push({
//         images: property.uploadPics,
//         price: property.layoutDetails.totalAmount,
//         size: property.layoutDetails.plotSize,
//         title: property.layoutDetails.layoutTitle,
//         district: property.layoutDetails.address.district,
//       });
//     });

//     // Combine all properties into one array
//     const allProperties = [
//       ...fields,
//       ...residentials,
//       ...commercials,
//       ...layouts,
//     ];

//     // Check if any properties were found
//     if (allProperties.length === 0) {
//       return res.status(404).json({ message: "No properties found" });
//     }

//     // Send the combined result back to the client
//     res.status(200).json(allProperties);
//   } catch (error) {
//     // Handle any errors
//     res.status(500).json({ message: "Error fetching properties", error });
//   }
// };

// const getPropertiesByType = async (req, res) => {
//   const result = await validateType.validateAsync(req.params);
//   const { type } = result; // Get property type from path parameters

//   try {
//     let properties;

//     // Fetch data based on property type
//     switch (type.toLowerCase()) {
//       case "agricultural":
//         properties = await fieldModel.find().exec();
//         break;
//       case "residential":
//         properties = await residentialModel.find().exec();
//         break;
//       case "commercial":
//         properties = await commercialModel.find().exec();
//         break;
//       case "layout":
//         properties = await layoutModel.find().exec();
//         break;
//       default:
//         return res.status(400).json({ message: "Invalid property type" });
//     }

//     // Check if any properties were found
//     if (properties.length === 0) {
//       return res.status(404).json({ message: "No properties found" });
//     }

//     // Send the result back to the client
//     res.status(200).json(properties);
//   } catch (error) {
//     // Handle any errors
//     if (error.isJoi){
//       console.log(error);
//       return res.status(422).json({
//         status: "error",
//         message: error.details.map((detail) => detail.message).join(", "),
//       });}
//     res.status(500).json({ message: "Error fetching properties", error });
//   }
// };

// //insertPropertyRatings
// const insertPropertyRatings = async (req, res) => {
//   try {
//     const userId = req.user.user.userId;
//     const firstName = req.user.user.firstName;
//     const lastName = req.user.user.lastName;
//     const role = req.user.user.role;
//     const status = 1;
//     if (!userId) {
//       return res
//         .status(400)
//         .json({ message: "User ID is missing in request", success: false });
//     }

//     const { propertyId, propertyType, rating } = req.body;

//     // Insert the new rating into the propertyRating collection
//     const ratingsData = {
//       userId,
//       firstName,
//       lastName,
//       role,
//       status,
//       propertyId,
//       propertyType,
//       rating,
//     };
//     const result= await propertyRatingSchema.validateAsync(ratingsData);
//     console.log("result",result);
//     const newRating = new propertyRatingModel(result);
//     await newRating.save();

//     // Fetch all ratings for this propertyId to calculate the average rating
//     const ratings = await propertyRatingModel.find({propertyId:result.propertyId} );
//     const totalRatings = ratings.length;
//     const sumRatings = ratings.reduce((acc, curr) => acc + curr.rating, 0);
//     const avgRating = (sumRatings / totalRatings).toFixed(2); // Calculate the average rating

//     // Determine which property type schema to update based on the propertyType field
//     let propertyModel;
//     if (result.propertyType === "Agricultural land") {
//       propertyModel = fieldModel;
//     } else if (result.propertyType === "Commercial") {
//       propertyModel = commercialModel;
//     } else if (result.propertyType === "Residential") {
//       propertyModel = residentialModel;
//     } else if (result.propertyType === "Layout") {
//       propertyModel = layoutModel;
//     } else {
//       return res
//         .status(400)
//         .json({ message: "Invalid property type", success: false });
//     }

//     // Update the property rating in the corresponding schema
//     if (propertyModel) {
//       const updatedProperty = await propertyModel.findOneAndUpdate(
//         { _id: result.propertyId }, // Ensure propertyId is the _id
//         { rating: avgRating, ratingCount: totalRatings }, // Update the rating with the new average
//         { new: true } // Return the updated document
//       );

//       if (!updatedProperty) {
//         return res.status(404).json({
//           message: `Property not found in ${result.propertyType} schema`,
//           success: false,
//         });
//       }
//     }

//     res.status(201).json({
//       message: "Rating details added successfully, and average rating updated",
//       success: true,
//       avgRating,
//     });
//   } catch (error) {
//     if (error.isJoi){
//       console.log(error);
//       return res.status(422).json({
//         status: "error",
//         message: error.details.map((detail) => detail.message).join(", "),
//       });}
//     console.error(
//       "Error inserting rating details or updating the property rating:",
//       error
//     ); // Log the error
//     res.status(500).json({
//       message: "Error inserting rating details or updating the property rating",
//       error,
//     });
//   }
// };

// //get property ratings
// //api for displaying ratings of a property, propertyId is sent through path params
// const getPropertyRatings = async (req, res) => {
//   try {
//     const result = await validateId.validateAsync(req.params);
//     const { propertyId } = result;
//     console.log(propertyId);
//     const ratings = await propertyRatingModel.find({ propertyId: propertyId });
//     if (ratings.length === 0) {
//       return res.status(404).json({ message: "No ratings found" });
//     }

//     res.status(200).json(ratings);
//   } catch (error) {
//     if (error.isJoi){
//       console.log(error);
//       return res.status(422).json({
//         status: "error",
//         message: error.details.map((detail) => detail.message).join(", "),
//       });}
//     res.status(500).json({ message: error.message });
//   }
// };

// //get properties by id and type
// const getPropertiesById = async (req, res) => {
//   try {
//     const result = await validateIdAndType.validateAsync(req.params);
//     const { propertyType, propertyId } = result;
//     let properties;

//     if (propertyType === "Agricultural") {
//       properties = await fieldModel.findOne({ _id: propertyId });
//     } else if (propertyType === "Residential") {
//       properties = await residentialModel.findOne({ _id: propertyId });
//     } else if (propertyType === "Layout") {
//       properties = await layoutModel.findOne({ _id: propertyId });
//     } else {
//       properties = await commercialModel.findOne({ _id: propertyId });
//     }

//     if (!properties) {
//       return res.status(404).json({ message: "No properties found" });
//     }
//     console.log(properties);
//     res.status(200).json(properties);
//   } catch (error) {
//     if (error.isJoi){
//       console.log(error);
//       return res.status(422).json({
//         status: "error",
//         message: error.details.map((detail) => detail.message).join(", "),
//       });}
//     res.status(500).json({ message: error.message });
//   }
// };

// //mark a property as sold(1)
// // Controller method to update status to 1 based on propertyId and type
// const updatePropertyStatus = async (req, res) => {
//   const result= await validateIdTypeStatus.validateAsync(req.body);
//   const {  propertyId,propertyType, status } = result;
//   let model;
//   // Determine the model based on type
//   switch (propertyType.toLowerCase()) {
//     case "residential":
//       model = residentialModel;
//       break;
//     case "commercial":
//       model = commercialModel;
//       break;
//     case "agricultural land":
//       model = fieldModel;
//       break;
//     case "layout":
//       model = layoutModel;
//       break;
//     default:
//       return res.status(400).json({ error: "Invalid property type specified" });
//   }

//   try {
//     // Update the document with the specified propertyId
//     const result = await model.findByIdAndUpdate(
//       propertyId,
//       { $set: { status: status } },
//       { new: true }
//     );

//     if (!result) {
//       return res.status(404).json({ message: "Property not found" });
//     }

//     res.status(200).json({ message: "Status updated successfully", result });
//   } catch (error) {
//     if (error.isJoi){
//       console.log(error);
//       return res.status(422).json({
//         status: "error",
//         message: error.details.map((detail) => detail.message).join(", "),
//       });}
//     console.error("Error updating status:", error);
//     res.status(500).json({ error: "Failed to update status" });
//   }
// };

// //reset the ratings--- for my use
// const resetRatings = async (req, res) => {
//   try {
//     await fieldModel.updateMany(
//       {}, // No filter, so all documents are selected
//       {
//         $set: {
//           // rating: 0,
//           //ratingCount: 0
//           status: 0,
//         },
//       }
//     );
//     await commercialModel.updateMany(
//       {}, // No filter, so all documents are selected
//       {
//         $set: {
//           // rating: 0,
//           //ratingCount: 0
//           status: 0,
//         },
//       }
//     );
//     await residentialModel.updateMany(
//       {}, // No filter, so all documents are selected
//       {
//         $set: {
//           // rating: 0,
//           //ratingCount: 0
//           status: 0,
//         },
//       }
//     );
//     await layoutModel.updateMany(
//       {}, // No filter, so all documents are selected
//       {
//         $set: {
//           // rating: 0,
//           //ratingCount: 0
//           status: 0,
//         },
//       }
//     );
//     res.send("updated");
//   } catch (error) {
//     res.status(500).json({ error: "Failed to update status" });
//   }
// };

// //get latest props
// const getLatestProps = async (req, res) => {
//   try {
//     const properties = [];
//     const field = await fieldModel.find().sort({ _id: -1 }).limit(2);
//     const residential = await residentialModel
//       .find()
//       .sort({ _id: -1 })
//       .limit(2);
//     const commercial = await commercialModel.find().sort({ _id: -1 }).limit(2);
//     const layout = await layoutModel.find().sort({ _id: -1 }).limit(2);
//     field[0].propertyType = "Agricultural land";
//     residential[0].propertyType = "Residential";
//     commercial[0].propertyType = "Commercial";
//     layout[0].propertyType = "Layout";
//     console.log(field);
//     properties.push(field[0]);
//     properties.push(field[1]);
//     properties.push(commercial[0]);
//     properties.push(commercial[1]);
//     properties.push(layout[0]);
//     properties.push(layout[1]);
//     properties.push(residential[0]);
//     properties.push(residential[1]);
//     if (properties.length === 0) {
//       res.status(404).json("Properties not found");
//     }
//     res.status(200).json(properties);
//   } catch (error) {
//     res.status(500).json("Error fetching properties");
//   }
// };

// //get properties
// const getProperty = async (req, res) => {
//   try {
//     const result = await validateIdUserIdType.validateAsync(req,params);
//     const { propertyType, userId, propertyId } = result;
//     if (!propertyType) {
//       return res.status(404).json("Property type is required");
//     }
//     const query = {};

//     if (userId !== "@") {
//       query.userId = req.user.user.userId;
//     } else if (propertyId !== "@") {
//       query._id = propertyId;
//     }
// console.log("query",query);
//     let propertyModel;
//     if (propertyType === "Agricultural") {
//       propertyModel = fieldModel;
//     } else if (propertyType === "Commercial") {
//       propertyModel = commercialModel;
//     } else if (propertyType === "Residential") {
//       propertyModel = residentialModel;
//     } else if (propertyType === "Layout") {
//       propertyModel = layoutModel;
//     } else {
//       return res
//         .status(400)
//         .json({ message: "Invalid property type", success: false });
//     }

//     const properties = await propertyModel.find(query).sort({ status: 1, updatedAt: -1 }).exec();

//     // Check if any properties were found
//     if (properties.length === 0) {
//       return res.status(404).json({ message: "No properties found" });
//     }

//     // Send the result back to the client
//     res.status(200).json(properties);
//   } catch (error) {
//     if (error.isJoi){
//       console.log(error);
//       return res.status(422).json({
//         status: "error",
//         message: error.details.map((detail) => detail.message).join(", "),
//       });}
//     res.status(500).json({ message: error.message });
//   }
// };
// module.exports = {
//   getPropertiesByLocation, //unused
//   getPropertiesByUserId, //only fields(unused)
//   insertPropertyRatings,
//   getPropertiesByType, //by type
//   getPropertyRatings, //unused
//   getPropertiesById, // by id and type
//   getAllProperties, // for landing page
//   updatePropertyStatus, // to mark a property as sold and unsold
//   resetRatings, // my use
//   getLatestProps, // banner
//   getProperty, // get property by type or by userId or by propertyId
// };
// controllers/fieldController.js

const propertyRatingModel = require("../models/propertyRatingModel");
const residentialModel = require("../models/residentialModel");
const commercialModel = require("../models/commercialModel");
const fieldModel = require("../models/fieldModel");
const layoutModel = require("../models/layoutModel");
const usersModel = require("../models/userModel");
const { propertyRatingSchema } = require("../helpers/propertyRatingValidation");
const {
  validateType,
  validateIdAndType,
  validateIdTypeStatus,
  validateIdUserIdType,
  validateId,
} = require("../helpers/propertyValidation");
const { response } = require("express");

const getPropertiesByLocation = async (req, res) => {
  try {
    const { location } = req.params;

    if (!location) {
      return res
        .status(400)
        .json({ message: "Location parameter is required" });
    }

    // Create a query object
    let query = {};

    // Check if the location input is a number (for pinCode)
    if (!isNaN(location)) {
      // Convert to a number if it is numeric
      const pinCode = Number(location);
      query["address.pinCode"] = pinCode;
    } else {
      // Otherwise, search in other fields
      query["$or"] = [
        { "address.village": location },
        { "address.mandal": location },
        { "address.district": location },
        { "address.state": location },
      ];
    }

    // Execute the query
    const properties = await fieldModel.find(query);

    if (properties.length === 0) {
      return res.status(404).json({ message: "No properties found" });
    }

    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//getPropertyByUserId
const getPropertiesByUserId = async (req, res) => {
  try {
    const userId = req.user.user.userId;
    console.log(userId);
    const properties = await fieldModel.find({ userId: userId });
    if (properties.length === 0) {
      return res.status(404).json({ message: "No properties found" });
    }

    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get all properties ----- for landing page
const getAllProperties = async (req, res) => {
  try {
    // Define arrays to store the different property types
    let fields = [];
    let residentials = [];
    let commercials = [];
    let layouts = [];
    //get count of documnets
    const fieldsCount = await fieldModel.countDocuments();
    const commercialCount = await commercialModel.countDocuments();
    const residentialCount = await residentialModel.countDocuments();
    const layoutCount = await layoutModel.countDocuments();
    let fieldProperties,
      residentialProperties,
      commercialProperties,
      layoutProperties;
    //fetch atmost 8 properties
    if (fieldsCount > 4) {
      fieldProperties = await fieldModel
        .find(
          {},
          {
            "landDetails.images": 1,
            "address.district": 1,
            "landDetails.title": 1,
            "landDetails.size": 1,
            "landDetails.totalPrice": 1,
          }
        )
        .limit(4)
        .exec();
    } else {
      // Fetch data from Field properties collection
      fieldProperties = await fieldModel
        .find(
          {},
          {
            "landDetails.images": 1,
            "address.district": 1,
            "landDetails.title": 1,
            "landDetails.size": 1,
            "landDetails.totalPrice": 1,
          }
        )
        .exec();
    }
    // Iterate over field properties and push to the fields array
    fieldProperties.forEach((property) => {
      fields.push({
        images: property.landDetails.images,
        price: property.landDetails.totalPrice,
        size: property.landDetails.size,
        title: property.landDetails.title,
        district: property.address.district,
      });
    });

    // Fetch data from Residential properties collection
    if (residentialCount > 4) {
      residentialProperties = await residentialModel
        .find(
          {},
          {
            propPhotos: 1,
            "propertyDetails.apartmentName": 1,
            "propertyDetails.flatCost": 1,
            "propertyDetails.flatSize": 1,
            "address.district": 1,
          }
        )
        .limit(4)
        .exec();
    } else {
      residentialProperties = await residentialModel
        .find(
          {},
          {
            propPhotos: 1,
            "propertyDetails.apartmentName": 1,
            "propertyDetails.flatCost": 1,
            "propertyDetails.flatSize": 1,
            "address.district": 1,
          }
        )
        .exec();
    }
    // Iterate over residential properties and push to the residentials array
    residentialProperties.forEach((property) => {
      residentials.push({
        images: property.propPhotos,
        price: property.propertyDetails.flatCost,
        size: property.propertyDetails.flatSize,
        title: property.propertyDetails.apartmentName,
        district: property.address.district,
      });
    });

    // Fetch data from Commercial properties collection
    if (commercialCount > 4) {
      commercialProperties = await commercialModel
        .find(
          {},
          {
            "propertyDetails.landDetails": 1,
            "propertyDetails.uploadPics": 1,
            propertyTitle: 1,
          }
        )
        .limit(4)
        .exec();
    } else {
      commercialProperties = await commercialModel
        .find(
          {},
          {
            "propertyDetails.landDetails": 1,
            "propertyDetails.uploadPics": 1,
            propertyTitle: 1,
          }
        )
        .exec();
    }
    // Iterate over commercial properties and extract necessary fields
    commercialProperties.forEach((property) => {
      let price, size;
      const { landDetails } = property.propertyDetails;

      // Check if land is for sale, rent, or lease
      if (landDetails.sell?.landUsage?.length > 0) {
        price = landDetails.sell.totalAmount;
        size = landDetails.sell.plotSize;
      } else if (landDetails.rent?.landUsage?.length > 0) {
        price = landDetails.rent.totalAmount;
        size = landDetails.rent.plotSize;
      } else if (landDetails.lease?.landUsage?.length > 0) {
        price = landDetails.lease.totalAmount;
        size = landDetails.lease.plotSize;
      }

      commercials.push({
        images: property.propertyDetails.uploadPics,
        price: price,
        size: size,
        title: property.propertyTitle,
        district: landDetails?.address?.district,
      });
    });

    // Fetch data from Layout properties collection
    if (layoutCount > 4) {
      layoutProperties = await layoutModel
        .find(
          {},
          {
            uploadPics: 1,
            "layoutDetails.layoutTitle": 1,
            "layoutDetails.plotSize": 1,
            "layoutDetails.totalAmount": 1,
            "layoutDetails.address.district": 1,
          }
        )
        .limit(4)
        .exec();
    } else {
      layoutProperties = await layoutModel
        .find(
          {},
          {
            uploadPics: 1,
            "layoutDetails.layoutTitle": 1,
            "layoutDetails.plotSize": 1,
            "layoutDetails.totalAmount": 1,
            "layoutDetails.address.district": 1,
          }
        )
        .exec();
    }
    // Iterate over layout properties and push to the layouts array
    layoutProperties.forEach((property) => {
      layouts.push({
        images: property.uploadPics,
        price: property.layoutDetails.totalAmount,
        size: property.layoutDetails.plotSize,
        title: property.layoutDetails.layoutTitle,
        district: property.layoutDetails.address.district,
      });
    });

    // Combine all properties into one array
    const allProperties = [
      ...fields,
      ...residentials,
      ...commercials,
      ...layouts,
    ];

    // Check if any properties were found
    if (allProperties.length === 0) {
      return res.status(404).json({ message: "No properties found" });
    }

    // Send the combined result back to the client
    res.status(200).json(allProperties);
  } catch (error) {
    // Handle any errors
    res.status(500).json({ message: "Error fetching properties", error });
  }
};

const getPropertiesByType = async (req, res) => {
  const result = await validateType.validateAsync(req.params);
  const { type } = result; // Get property type from path parameters

  try {
    let properties;

    // Fetch data based on property type
    switch (type.toLowerCase()) {
      case "agricultural":
        properties = await fieldModel.find().exec();
        break;
      case "residential":
        properties = await residentialModel.find().exec();
        break;
      case "commercial":
        properties = await commercialModel.find().exec();
        break;
      case "layout":
        properties = await layoutModel.find().exec();
        break;
      default:
        return res.status(400).json({ message: "Invalid property type" });
    }

    // Check if any properties were found
    if (properties.length === 0) {
      return res.status(404).json({ message: "No properties found" });
    }

    // Send the result back to the client
    res.status(200).json(properties);
  } catch (error) {
    // Handle any errors
    if (error.isJoi) {
      console.log(error);
      return res.status(422).json({
        status: "error",
        message: error.details.map((detail) => detail.message).join(", "),
      });
    }
    res.status(500).json({ message: "Error fetching properties", error });
  }
};

//insertPropertyRatings
const insertPropertyRatings = async (req, res) => {
  try {
    const userId = req.user.user.userId;
    // const firstName = req.user.user.firstName;
    // const lastName = req.user.user.lastName;
    // const role = req.user.user.role;
    const status = 1;
    if (!userId) {
      return res
        .status(400)
        .json({ message: "User ID is missing in request", success: false });
    }

    const { propertyId, propertyType, rating } = req.body;

    // Insert the new rating into the propertyRating collection
    const ratingsData = {
      userId,
      // firstName,
      // lastName,
      // role,
      status,
      propertyId,
      propertyType,
      rating,
    };
    const result = await propertyRatingSchema.validateAsync(ratingsData);
    console.log("result", result);
    const newRating = new propertyRatingModel(result);
    await newRating.save();

    // Fetch all ratings for this propertyId to calculate the average rating
    const ratings = await propertyRatingModel.find({
      propertyId: result.propertyId,
    });
    const totalRatings = ratings.length;
    const sumRatings = ratings.reduce((acc, curr) => acc + curr.rating, 0);
    const avgRating = (sumRatings / totalRatings).toFixed(2); // Calculate the average rating

    // Determine which property type schema to update based on the propertyType field
    let propertyModel;
    if (result.propertyType === "Agricultural land") {
      propertyModel = fieldModel;
    } else if (result.propertyType === "Commercial") {
      propertyModel = commercialModel;
    } else if (result.propertyType === "Residential") {
      propertyModel = residentialModel;
    } else if (result.propertyType === "Layout") {
      propertyModel = layoutModel;
    } else {
      return res
        .status(400)
        .json({ message: "Invalid property type", success: false });
    }

    // Update the property rating in the corresponding schema
    if (propertyModel) {
      const updatedProperty = await propertyModel.findOneAndUpdate(
        { _id: result.propertyId }, // Ensure propertyId is the _id
        { rating: avgRating, ratingCount: totalRatings }, // Update the rating with the new average
        { new: true } // Return the updated document
      );
      if (!updatedProperty) {
        return res.status(404).json({
          message: `Property not found in ${result.propertyType} schema`,
          success: false,
        });
      }
    }

    res.status(201).json({
      message: "Rating details added successfully, and average rating updated",
      success: true,
      avgRating,
    });
  } catch (error) {
    if (error.isJoi) {
      console.log(error);
      return res.status(422).json({
        status: "error",
        message: error.details.map((detail) => detail.message).join(", "),
      });
    }
    console.error(
      "Error inserting rating details or updating the property rating:",
      error
    ); // Log the error
    res.status(500).json({
      message: "Error inserting rating details or updating the property rating",
      error,
    });
  }
};

//get property ratings
//api for displaying ratings of a property, propertyId is sent through path params
const getPropertyRatings = async (req, res) => {
  try {
    const result = await validateId.validateAsync(req.params);
    const { propertyId } = result;
    console.log(propertyId);
    const ratings = await propertyRatingModel.find({ propertyId: propertyId });
    if (ratings.length === 0) {
      return res.status(404).json({ message: "No ratings found" });
    }
    const updatedRatings = await Promise.all(
      ratings.map(async (rating) => {
        // Fetch user details based on userId
        const user = await usersModel.findById(
          rating.userId,
          "firstName lastName role"
        );

        // Add the user details to the rating result
        return {
          ...rating.toObject(), // Convert Mongoose document to plain object
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        };
      })
    );
    res.status(200).json(updatedRatings);
  } catch (error) {
    if (error.isJoi) {
      console.log(error);
      return res.status(422).json({
        status: "error",
        message: error.details.map((detail) => detail.message).join(", "),
      });
    }
    res.status(500).json({ message: error.message });
  }
};

//get properties by id and type
const getPropertiesById = async (req, res) => {
  try {
    const result = await validateIdAndType.validateAsync(req.params);
    const { propertyType, propertyId } = result;
    let properties;

    if (propertyType === "Agricultural") {
      properties = await fieldModel.findOne({ _id: propertyId });
    } else if (propertyType === "Residential") {
      properties = await residentialModel.findOne({ _id: propertyId });
    } else if (propertyType === "Layout") {
      properties = await layoutModel.findOne({ _id: propertyId });
    } else {
      properties = await commercialModel.findOne({ _id: propertyId });
    }

    if (!properties) {
      return res.status(404).json({ message: "No properties found" });
    }
    console.log(properties);
    res.status(200).json(properties);
  } catch (error) {
    if (error.isJoi) {
      console.log(error);
      return res.status(422).json({
        status: "error",
        message: error.details.map((detail) => detail.message).join(", "),
      });
    }
    res.status(500).json({ message: error.message });
  }
};

//mark a property as sold(1)
// Controller method to update status to 1 based on propertyId and type
const updatePropertyStatus = async (req, res) => {
  const result = await validateIdTypeStatus.validateAsync(req.body);
  const { propertyId, propertyType, status } = result;
  let model;
  // Determine the model based on type
  switch (propertyType.toLowerCase()) {
    case "residential":
      model = residentialModel;
      break;
    case "commercial":
      model = commercialModel;
      break;
    case "agricultural land":
      model = fieldModel;
      break;
    case "layout":
      model = layoutModel;
      break;
    default:
      return res.status(400).json({ error: "Invalid property type specified" });
  }

  try {
    let updateData = { status: status };

    // If propertyType is layout and status is 1, set availablePlots to 0
    if (propertyType.toLowerCase() === "layout" && status === 1) {
      updateData["layoutDetails.availablePlots"] = 0;
    }
    // Update the document with the specified propertyId
    const updatedResult = await model.findByIdAndUpdate(
      propertyId,
      { $set: updateData },
      { new: true }
    );

    if (!updatedResult) {
      return res.status(404).json({ message: "Property not found" });
    }

    res
      .status(200)
      .json({ message: "Status updated successfully", updatedResult });
  } catch (error) {
    if (error.isJoi) {
      console.log(error);
      return res.status(422).json({
        status: "error",
        message: error.details.map((detail) => detail.message).join(", "),
      });
    }
    console.error("Error updating status:", error);
    res.status(500).json({ error: "Failed to update status" });
  }
};

//reset the ratings--- for my use
const resetRatings = async (req, res) => {
  try {
    await fieldModel.updateMany(
      {}, // No filter, so all documents are selected
      {
        $set: {
          rating: 0,
          ratingCount: 0,
        },
      }
    );
    await commercialModel.updateMany(
      {}, // No filter, so all documents are selected
      {
        $set: {
          rating: 0,
          ratingCount: 0,
          //status: 0,
        },
      }
    );
    await residentialModel.updateMany(
      {}, // No filter, so all documents are selected
      {
        $set: {
          rating: 0,
          ratingCount: 0,
        },
      }
    );
    await layoutModel.updateMany(
      {}, // No filter, so all documents are selected
      {
        $set: {
          rating: 0,
          ratingCount: 0,
          //status: 0,
        },
      }
    );
    res.send("updated");
  } catch (error) {
    res.status(500).json({ error: "Failed to update status" });
  }
};

//get latest props
const getLatestProps = async (req, res) => {
  try {
    const properties = [];
    const field = await fieldModel.find().sort({ _id: -1 }).limit(2);
    const residential = await residentialModel
      .find()
      .sort({ _id: -1 })
      .limit(2);
    const commercial = await commercialModel.find().sort({ _id: -1 }).limit(2);
    const layout = await layoutModel.find().sort({ _id: -1 }).limit(2);
    field[0].propertyType = "Agricultural land";
    residential[0].propertyType = "Residential";
    commercial[0].propertyType = "Commercial";
    layout[0].propertyType = "Layout";
    console.log(field);
    properties.push(field[0]);
    properties.push(field[1]);
    properties.push(commercial[0]);
    properties.push(commercial[1]);
    properties.push(layout[0]);
    properties.push(layout[1]);
    properties.push(residential[0]);
    properties.push(residential[1]);
    if (properties.length === 0) {
      res.status(404).json("Properties not found");
    }
    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json("Error fetching properties");
  }
};

//get properties
const getProperty = async (req, res) => {
  try {
    const result = await validateIdUserIdType.validateAsync(req, params);
    const { propertyType, userId, propertyId } = result;
    if (!propertyType) {
      return res.status(404).json("Property type is required");
    }
    const query = {};

    if (userId !== "@") {
      query.userId = req.user.user.userId;
    } else if (propertyId !== "@") {
      query._id = propertyId;
    }
    console.log("query", query);
    let propertyModel;
    if (propertyType === "Agricultural") {
      propertyModel = fieldModel;
    } else if (propertyType === "Commercial") {
      propertyModel = commercialModel;
    } else if (propertyType === "Residential") {
      propertyModel = residentialModel;
    } else if (propertyType === "Layout") {
      propertyModel = layoutModel;
    } else {
      return res
        .status(400)
        .json({ message: "Invalid property type", success: false });
    }

    const properties = await propertyModel
      .find(query)
      .sort({ status: 1, updatedAt: -1 })
      .exec();

    // Check if any properties were found
    if (properties.length === 0) {
      return res.status(404).json({ message: "No properties found" });
    }

    // Send the result back to the client
    res.status(200).json(properties);
  } catch (error) {
    if (error.isJoi) {
      console.log(error);
      return res.status(422).json({
        status: "error",
        message: error.details.map((detail) => detail.message).join(", "),
      });
    }
    res.status(500).json({ message: error.message });
  }
};

//api to get the highest price among all the properties
const maxPrice = async (req, res) => {
  console.log(req.params);
  const { type, sell, rent, lease, flat, house } = req.params;

  try {
    let result, response;
    if (type === "agricultural") {
      result = await fieldModel.aggregate([
        {
          $group: {
            _id: null, // We're not grouping by any specific field
            maxTotalPrice: { $max: "$landDetails.totalPrice" },
          },
        },
      ]);
      response = result[0].maxTotalPrice;
    } else if (type === "residential") {
      let maxFlat = 0,
        maxHouse = 0;
      let maxPrice = 0;
      // result = await residentialModel.aggregate([
      //   {
      //     $group: {
      //       _id: null, // We are not grouping by any specific field, so we set _id to null
      //       maxTotalCost: { $max: "$propertyDetails.totalCost" }, // Get the maximum totalCost
      //     },
      //   },
      // ]);
      // response = result[0].maxTotalCost;

      result = await residentialModel.find().exec();
      result.forEach((property) => {
        let price = 0;
        const propType = property.propertyDetails.type;
        price = property.propertyDetails.totalCost;
        console.log(propType," ",price);
        if(!price){
          price = 0;
        }
        if (propType === "Flat") {
          maxFlat = Math.max(price, maxFlat);
        } else if (propType === "House") {
          maxHouse = Math.max(price, maxHouse);
        }
      });
      if (flat === "flat") {
        maxPrice = Math.max(maxPrice, maxFlat);
      }
      if (house === "house") {
        maxPrice = Math.max(maxPrice, maxHouse);
      }
      response = maxPrice > 0 ? maxPrice : 0;
    } else if (type === "layout") {
      result = await layoutModel.aggregate([
        {
          $group: {
            _id: null, // No grouping by specific field, just considering all documents
            maxTotalAmount: { $max: "$layoutDetails.totalAmount" }, // Getting the maximum totalAmount
          },
        },
      ]);
      response = result[0].maxTotalAmount;
    } else if (type === "commercial") {
      let maxSell = 0,
        maxRent = 0,
        maxLease = 0;
      let maxPrice = 0;

      commercialProperties = await commercialModel
        .find(
          {},
          {
            "propertyDetails.landDetails": 1,
          }
        )
        .exec();
      // Iterate over commercial properties and extract necessary fields
      commercialProperties.forEach((property) => {
        let price = 0;
        const { landDetails } = property.propertyDetails;

        // Check if land is for sale, rent, or lease
        if (landDetails.sell?.landUsage?.length > 0) {
          price = landDetails.sell.totalAmount;
          maxSell = Math.max(maxSell, price);
        } else if (landDetails.rent?.landUsage?.length > 0) {
          price = landDetails.rent.totalAmount;
          maxRent = Math.max(maxRent, price);
        } else if (landDetails.lease?.landUsage?.length > 0) {
          price = landDetails.lease.totalAmount;
          maxLease = Math.max(maxLease, price);
        }
      });
      if (sell === "sell") {
        maxPrice = Math.max(maxPrice, maxSell);
      }
      if (rent === "rent") {
        maxPrice = Math.max(maxPrice, maxRent);
      }
      if (lease === "lease") {
        maxPrice = Math.max(maxPrice, maxLease);
      }
      response = maxPrice > 0 ? maxPrice : 0;
    } else {
      return res.status(400).json("Invalid");
    }

    console.log(response);
    return res.status(200).json({ maxPrice: response });
  } catch (error) {
    return res.status(500).json("Internal server error");
  }
};

module.exports = {
  getPropertiesByLocation, //unused
  getPropertiesByUserId, //only fields(unused)
  insertPropertyRatings,
  getPropertiesByType, //by type
  getPropertyRatings, //unused
  getPropertiesById, // by id and type
  getAllProperties, // for landing page
  updatePropertyStatus, // to mark a property as sold and unsold
  resetRatings, // my use
  getLatestProps, // banner
  getProperty, // get property by type or by userId or by propertyId
  maxPrice,
};
