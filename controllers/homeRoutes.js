const router = require("express").Router();
const { Post, User, Comment } = require("../models");
const withAuth = require("../utils/auth");

router.get("/", async (req, res) => {
  try {
    // Get all projects and JOIN with user data
    const postData = await Post.findAll({
      include: [
        {
          model: User,
          attributes: ["name"],
        },
      ],
    });

    if (!postData) {
      res.status(400).send("There are no posts on the blog at the moment.");
    }

    // Serialize data so the template can read it
    const posts = postData.map((project) => project.get({ plain: true }));

    // Pass serialized data and session flag into template
    res.render("homepage", {
      posts,
      logged_in: req.session.logged_in,
      page_title: "The Tech Blog",
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/dashboard", withAuth, async (req, res) => {
  try {
    const postData = await Post.findAll({
      where: {
        user_id: req.session.user_id,
      },
      include: [
        {
          model: User,
          attributes: ["name"],
        },
      ],
    });

    const posts = postData.map((post) => post.get({ plain: true }));

    res.render("dashboard", {
      posts,
      logged_in: req.session.logged_in,
      page_title: "Dashboard",
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/login", (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect("/profile");
    return;
  }

  res.render("login");
});

router.get("/signup", (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect("/profile");
    return;
  }

  res.render("signup");
});

router.get("/post", withAuth, (req, res) => {
  res.render("create-post");
});

router.get("/post/:id", withAuth, async (req, res) => {
  try {
    const postData = await Post.findByPk(req.params.id, {
      include: [
        { model: Comment },
        {
          model: User,
          attributes: ["name"],
        },
      ],
    });

    if (!postData) {
      res.status(404).json("Cannot find the requested post");
    }

    const post = postData.get({ plain: true });

    // allows partial to determine whether the post partial should show the options to update/delete the post or whether it should allow comments to be added by another user
    const isPostOwner = post.user_id === req.session.user_id ? true : false;

    res
      .status(200)
      .render("post", { post, isPostOwner, page_title: "View Post" });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
