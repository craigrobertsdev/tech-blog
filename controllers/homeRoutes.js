const router = require("express").Router();
const { Post, User, Comment } = require("../models");
const withAuth = require("../utils/auth");

// called when a user accesses the site. displays all posts in the blog
router.get("/", async (req, res) => {
  try {
    // Get all posts and JOIN with user data
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

// on accessing dashboard, when signed in, gets all posts authored by that user
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

    // Serialize data so the template can read it
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
    res.redirect("/dashboard");
    return;
  }

  res.render("login", {
    page_title: "Login",
  });
});

// loads the create-post form
router.get("/post", withAuth, (req, res) => {
  res.render("create-post", {
    logged_in: req.session.logged_in,
  });
});

// gets the requested post and all comments associated with it including the usernames of the people who posted
// does not use withAuth middleware as it is desirable to be able to view comments without being logged in and
// checks are done in the view to prevent unauthorised users from modifying things.
router.get("/post/:id", async (req, res) => {
  try {
    // get post with matching id,  the user who wrote it and all comments
    const postData = await Post.findByPk(req.params.id, {
      include: [
        { model: Comment, order: [["date_created", "DESC"]] },
        {
          model: User,
          attributes: ["name"],
        },
      ],
    });

    // create array of user ids
    const userIds = postData.comments.map((post) => post.user_id);

    // get all users whose ids are in the userIds array
    const userData = await User.findAll({
      where: {
        id: [...userIds],
      },
      attributes: ["id", "name"],
    });

    const users = userData.map((user) => user.get({ plain: true }));

    if (!postData) {
      res.status(404).json("Cannot find the requested post");
    }

    const post = postData.get({ plain: true });


    for (const user of users) {
      post.comments.forEach((comment) => {
        if (comment.user_id === user.id) {
          comment.user_name = user.name;
        }
      });
    }

    // allows partial to determine whether the post partial should show the options to update/delete the post or whether it should allow comments to be added by another user
    const isPostOwner = post.user_id === req.session.user_id ? true : false;

    res.status(200).render("post", {
      post,
      isPostOwner,
      page_title: "View Post",
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
