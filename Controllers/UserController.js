const firebaseAdmin = require("../Utils/DB/firebaseInit");
exports.getUser = (req, res) => {
  try {
    if (!res.locals.userId) {
      res.status(400).json({ error: "User Id not found" });
    } else {
      firebaseAdmin
        .firestore()
        .collection("users")
        .doc(res.locals.userId)
        .get()
        .then((doc) => {
          if (!doc.exists) {
            res.status(400).json({
              error:
                "The given access token does not pertain to a user in this application",
            });
          } else {
            res.status(200).json(doc.data());
          }
        })
        .catch((err) => {
          console.log("error occured while fetch document from DB", err);
          res.status(500).json({ error: "Internal Server Error" });
        });
    }
  } catch (err) {
    console.log("error:", err);
    res
      .status(500)
      .json({ error: "Unexpected error occured", originalError: err });
  }
};
