const express = require("express");
const router = express.Router();
const firebaseAdmin = require("../../Utils/DB/firebaseInit");

router.get("/verify", (req, res) => {
  res.send(req.query["hub.challenge"]);
});

router.post("/verify", async (req, res) => {
  const payload = req.body;
  switch (payload.entry[0].changes[0].field) {
    case "feed":
      const feed = payload.entry[0].changes[0].value;
      switch (feed.item) {
        case "post":
          switch (feed.verb) {
            case "add":
              const createdPost = {
                id: feed.post_id,
                message: feed.message,
                from: feed.from,
                pageId: payload.entry[0].id,
              };
              firebaseAdmin
                .firestore()
                .collection("posts")
                .doc(createdPost.id)
                .create(createdPost)
                .then((res) => console.log(res))
                .catch((err) => console.log(err));
              break;
            case "edit":
              const editedPost = {
                id: feed.post_id,
                message: feed.message,
                from: feed.from,
                pageId: feed.recipient_id,
              };
              firebaseAdmin
                .firestore()
                .collection("posts")
                .doc(editedPost.id)
                .update(editedPost)
                .then((res) => console.log(res))
                .catch((err) => console.log(err));
              break;
            case "remove":
              firebaseAdmin
                .firestore()
                .collection("posts")
                .doc(feed.post_id)
                .delete()
                .then((res) => console.log(res))
                .catch((err) => console.log(err));
              break;
            default:
              console.log(feed.verb);
              break;
          }
        case "comment":
          switch (feed.verb) {
            case "add":
              const createdComment = {
                id: feed.comment_id,
                message: feed.message,
                from: feed.from,
                parentId: feed.parent_id,
              };
              if (feed.parent_id === feed.post_id) {
                let docRef = await firebaseAdmin
                  .firestore()
                  .collection("posts")
                  .doc(feed.post_id)
                  .get();
                if (!docRef.exists) {
                  console.log("Post doesn't exist");
                  firebaseAdmin
                    .firestore()
                    .collection("posts")
                    .doc(feed.post_id)
                    .create({ id: feed.post_id, pageId: payload.entry[0].id })
                    .then((res) => console.log(res))
                    .catch((err) => console.log(err));
                }
              }
              firebaseAdmin
                .firestore()
                .collection("comments")
                .doc(createdComment.id)
                .create(createdComment)
                .then((res) => console.log(res))
                .catch((err) => console.log(err));
              break;
            case "edited":
              const editedComment = {
                id: feed.comment_id,
                message: feed.message,
                from: feed.from,
                parentid: feed.parent_id,
              };
              firebaseAdmin
                .firestore()
                .collection("comments")
                .doc(editedComment.id)
                .update(editedComment)
                .then((res) => console.log(res))
                .catch((err) => console.log(err));
              break;
            case "remove":
              firebaseAdmin
                .firestore()
                .collection("comments")
                .doc(feed.comment_id)
                .delete()
                .then((res) => console.log(res))
                .catch((err) => console.log(err));
              break;
            default:
              console.log(feed.verb);
              break;
          }
      }
    case "messages":
      break;
    default:
      console.log(payload);
  }
  res.status(200).send("ok");
});

module.exports = router;
