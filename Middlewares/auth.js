const axios = require("axios");
module.exports = async (req, res, next) => {
  try {
    if (!req.headers["x-access-token"]) {
      res.status(400).json({ error: "No access token provided" });
    } else {
      const token = req.headers["x-access-token"];
      console.log(req.headers);
      let resp = await axios.get(
        `https://graph.facebook.com/me?access_token=${token}`
      );
      res.locals.userId = resp.data.id;
      next();
    }
  } catch (err) {
    console.log("error", err);
    res
      .status(500)
      .json({ error: "An unexpectedd error occured", originalError: err });
  }
};
