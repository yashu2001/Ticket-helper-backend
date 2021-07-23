// Import admin sdk 
var firebaseAdmin = require("firebase-admin");

// File is gitignored for safe keeping
var serviceAccount = require("./firebase.json");

// Initialize the firebase app with the service account
firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
});


// Export the firebase app
module.exports = firebaseAdmin;