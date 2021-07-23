const firebaseAdmin = require("../Utils/DB/firebaseInit");
module.exports.getConversationList = async (req, res) => {
  try {
    let postIds = [];
    const postsSnapshot = await firebaseAdmin
      .firestore()
      .collection("posts")
      .where("pageId", "==", req.body.pageId)
      .get();
    postsSnapshot.docs.forEach((post) => {
      postIds.push(post.id);
    });
    console.log(postIds);
    const CommentsGroupedByPost = await Promise.all(
      postIds.map((postId) => {
        return firebaseAdmin
          .firestore()
          .collection("comments")
          .where("parentId", "==", postId)
          .get();
      })
    );
    let commentThreads = [];
    for (let i = 0; i < CommentsGroupedByPost.length; i++) {
      commentThreads.push(
        CommentsGroupedByPost[i].docs.map((comment) => comment.data())
      );
    }
    res.status(200).json({ comments: commentThreads });
  } catch (err) {
    console.log("Unexpected error occured", err);
    res
      .status(500)
      .json({ error: "Internal server error", originalError: err });
  }
};

module.exports.getConversationById = async (req, res) => {
  try {
    const conversationId = req.params.conversationId;
    let initialComment = await firebaseAdmin
      .firestore()
      .collection("comments")
      .doc(conversationId)
      .get();
    let comments = [initialComment.data()];
    let list = [conversationId];
    while (list.length > 0) {
      console.log(list);
      let current = list[0];
      list.splice(0, 1);
      const docList = await firebaseAdmin
        .firestore()
        .collection("comments")
        .where("parentId", "==", current)
        .get();
      docList.docs.map((doc) => {
        console.log(doc.id);
        list.push(doc.id);
        comments.push(doc.data());
      });
    }
    console.log(comments);
    res.status(200).json({ comments: comments });
  } catch (err) {
    console.log("Unexpected error occured", err);
    res
      .status(500)
      .json({ error: "Internal server error", originalError: err });
  }
};
