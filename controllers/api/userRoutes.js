const router = require("express").Router();
const { User } = require("../../models");

// called when a user attempts to sign up to the app. checks if the username already exists.
// if the sign-up is successful, they are logged in with a cookie
router.post("/", async (req, res) => {
  try {
    // first check if that user exists in database
    const checkUser = await User.findOne({
      where: {
        name: req.body.name,
      },
    });

    // if so, return
    if (checkUser) {
      res.status(400).json({ message: "username already exists" });
      return;
    }

    const userData = await User.create(req.body);

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;

      res.status(200).redirect("/");
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

// tries to locate username in database and check the stored password against the hashed password. throws an error if not found.
// if the login is successful, they are given a cookie with their session details
router.post("/login", async (req, res) => {
  try {
    const userData = await User.findOne({ where: { name: req.body.name } });

    if (!userData) {
      res
        .status(400)
        .json({ message: "Incorrect username or password, please try again" });
      return;
    }

    const validPassword = userData.checkPassword(req.body.password);

    if (!validPassword) {
      res
        .status(400)
        .json({ message: "Incorrect username or password, please try again" });
      return;
    }

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;

      res.redirect("/");
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

// destroys the cookie on the server and returns to the homepage
router.post("/logout", (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).redirect("/");
    });
  } else {
    res.status(404).redirect("/");
  }
});

module.exports = router;
