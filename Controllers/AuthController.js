const firebaseAdmin = require("../Utils/DB/firebaseInit");
exports.authController = async (req, res) => {
  try {
    const data = req.body;
    const user = data.user;
    let sent = false;
    await firebaseAdmin
      .firestore()
      .collection("users")
      .doc(user.id)
      .get()
      .then((doc) => {
        if (doc.exists) {
          sent = true;
          return res.status(200).json({
            id: user.id,
            name: user.name,
            image: user.picture.url,
            pages: user.pages,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
    if (!sent) {
      await firebaseAdmin.firestore().collection("users").doc(user.id).create({
        id: user.id,
        name: user.name,
        image: user.picture.data.url,
        pages: user.pages,
      });
      res.status(200).json({
        id: user.id,
        name: user.name,
        image: user.picture.url,
      });
    }
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ error: "Unexpected error occured", originalError: err });
  }
};
