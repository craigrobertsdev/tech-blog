const router = require("express").Router();
const { Post } = require("../../models");
const withAuth = require("../../utils/auth");

router.post("/post", withAuth, async (req, res) => {
  try {
    const newPost = await Post.create({
      ...req.body,
      user_id: req.session.user_id,
      date_created: new Date(),
    });

    res.status(200).json(newPost);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put("/post/:id", withAuth, async (req, res) => {
  try {
    const postData = await Post.findByPk(req.params.id);
    console.log(
      "🚀 ~ file: dashboardRoutes.js:70 ~ router.post ~ req:",
      req.body
    );

    if (req.session.user_id !== postData.user_id) {
      res
        .status(401)
        .json({ message: "You are not authorised to update this post" });
    }

    if (!postData) {
      res.status(404).json({ message: "Post not found." });
    }

    // TODO - complete the PUT route
    const post = await postData.update(
      { title: req.body.title, content: req.body.content }
      // {
      //   where: {
      //     id: req.params.id,
      //   },
      // }
    );

    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/post/:id", withAuth, async (req, res) => {
  try {
    const postData = await Post.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (!postData) {
      res.status(404).json({ message: "No post found with this id!" });
      return;
    }

    res.status(200).json(postData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/comment", withAuth, async (req, res) => {
  try {
    const newComment = await Post.create({
      title: req.body.title,
      content: req.body.content,
      post_id: req.body.postId,
      user_id: req.session.user_id,
      date_created: new Date(),
    });

    res.status(200).json(newComment);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
