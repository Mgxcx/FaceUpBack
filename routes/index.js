var express = require("express");
var router = express.Router();
const fs = require("fs");
var uniqid = require("uniqid");

var cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "drchl4shw",
  api_key: "379964762789531",
  api_secret: "gn_MumuC9aXYTyj7Rq5Ua4Z7TCA",
});

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.post("/upload", async function (req, res, next) {
  var imagePath = `./tmp/${uniqid()}.jpg`;
  var resultCopy = await req.files.avatar.mv(imagePath);

  if (!resultCopy) {
    var resultCloudinary = await cloudinary.uploader.upload(imagePath);

    ("use strict");

    const axios = require("axios").default;

    // Add a valid subscription key and endpoint to your environment variables.
    let subscriptionKey = "fe081b8101cb4341a1f8f82a70e8a79c";
    let endpoint = "https://mgxcx.cognitiveservices.azure.com/face/v1.0/detect?";

    // Optionally, replace with your own image URL (for example a .jpg or .png URL).
    let imageUrl = resultCloudinary.secure_url;

    axios({
      method: "post",
      url: endpoint,
      params: {
        detectionModel: "detection_01",
        returnFaceAttributes:
          "age,gender,headPose,smile,facialHair,glasses,emotion,hair,makeup,occlusion,accessories,blur,exposure,noise",
        returnFaceId: true,
      },
      data: {
        url: imageUrl,
      },
      headers: { "Ocp-Apim-Subscription-Key": subscriptionKey },
    })
      .then(function (response) {
        console.log("Status text: " + response.status);
        console.log("Status text: " + response.statusText);
        console.log();
        console.log(response.data);
        let age = "";
        if (response.data[0].faceAttributes.age) {
          age = `${response.data[0].faceAttributes.age} ans`;
        }
        let gender = "";
        if (response.data[0].faceAttributes.gender == "female") {
          gender = "Femme";
        } else {
          gender = "Homme";
        }
        let glasses = "";
        let glassesexist;
        if (response.data[0].faceAttributes.glasses == "ReadingGlasses") {
          glasses = "Lunettes de vue";
          glassesexist = true;
        } else if (response.data[0].faceAttributes.glasses == "SunGlasses") {
          glasses = "Lunettes de soleil";
          glassesexist = true;
        } else {
          glassesexist = false;
        }
        let facialHair = "";
        let beardexist;
        if (response.data[0].faceAttributes.facialHair.beard >= 0.5) {
          facialHair = "Barbe";
          beardexist = true;
        } else {
          beardexist = false;
        }
        let smile = "";
        if (response.data[0].faceAttributes.smile >= 0.7) {
          smile = "Content(e)!";
        } else {
          smile = "Triste...";
        }
        let haircolor = "";
        if (response.data[0].faceAttributes.hair.hairColor[0].color == "brown") {
          haircolor = "Cheveux châtains";
        } else if (response.data[0].faceAttributes.hair.hairColor[0].color == "black") {
          haircolor = "Cheveux bruns";
        } else if (response.data[0].faceAttributes.hair.hairColor[0].color == "blond") {
          haircolor = "Cheveux blonds";
        } else if (response.data[0].faceAttributes.hair.hairColor[0].color == "red") {
          haircolor = "Cheveux roux";
        } else if (response.data[0].faceAttributes.hair.hairColor[0].color == "gray") {
          haircolor = "Cheveux gris";
        } else if (response.data[0].faceAttributes.hair.hairColor[0].color == "white") {
          haircolor = "Cheveux blancs";
        } else {
          haircolor = "Cheveux colorés";
        }

        res.json({
          result: true,
          message: "File uploaded!",
          age: age,
          gender: gender,
          glasses: glasses,
          glassesexist: glassesexist,
          facialhair: facialHair,
          beardexist: beardexist,
          smile: smile,
          haircolor: haircolor,
          url: resultCloudinary.secure_url,
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  } else {
    res.json({ result: false, message: resultCopy });
  }

  fs.unlinkSync(imagePath);
});

module.exports = router;
