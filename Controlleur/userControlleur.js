const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const router = express.Router();

const User = require("../models/user");

/*
router.post('/add', (req, res) => {
  const userData = req.body;
  const user = new User(userData);
  user.save()
    .then(savedUser => {
      console.log('User added:', savedUser);
      res.send('User added successfully');
    })
    .catch(error => {
      console.error('Error adding user:', error);
      res.status(500).send('Error adding user');
    });
});
*/

router.post("/register", async (req, res) => {
  try {
    const data = req.body;

    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      return res.status(409).send("Email already exists");
    }

    // Create a new user with the provided data
    const newUser = new User({
      name: data.name,
      lastname: data.lastname,
      phone: data.phone,
      email: data.email,
      password: data.password,
    });

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const cryptpass = await bcrypt.hash(newUser.password, salt);
    newUser.password = cryptpass;

    // Save the user to the database
    const savedUser = await newUser.save();

    res.status(201).json(savedUser);
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).send("Internal server error");
  }
});

  router.post("/login", async (req, res) => {
  try {
    const data = req.body;
    const user = await User.findOne({ email: data.email });

    if (!user) {
      return res.status(404).send("Email or password is incorrect");
    }

    const validPass = await bcrypt.compare(data.password, user.password);

    if (!validPass) {
      return res.status(401).send("Email or password is incorrect");
    }

    const payload = {
      id: user._id, 
      name: user.name,
      role: user.role,
      lastname: user.lastname,
      phone: user.phone,
      email: user.email,
      image: user.image,
    };

    const token = jwt.sign(payload, "%kernel.project_dir%/config/jwt/private.pem", { expiresIn: "10h" });

    res.status(200).send({ token: token }); 
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).send("Internal server error");
  }
});



router.get("/getall", (req, res) => {
  User.find({})
    .then((users) => {
      console.log("All users:", users);
      res.json(users);
    })
    .catch((error) => {
      console.error("Error retrieving users:", error);
      res.status(500).send("Error retrieving users");
    });
});




router.get("/userdetails/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).send("Error fetching user details");
  }
});


router.get("/userdetailsemail/:email", async (req, res) => {
  try {
    const email = req.params.email;
    console.log("Email parameter:", email); 
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).send("User not found");
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).send("Error fetching user details");
  }
});


router.put("/updatepassword/:id", async (req, res) => {
  const userId = req.params.id;
  const { currentPassword, newPassword } = req.body; // Extract both current and new passwords from the request body

  try {
    // Find the user by their ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send("User not found");
    }

    // Compare the entered current password with the stored password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

    if (!isPasswordValid) {
      // If current password is incorrect, return an error
      return res.status(400).send("Incorrect current password");
    }

    // If current password is correct, hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the password in the database
    user.password = hashedPassword;
    await user.save();

    console.log("Password updated:", user);
    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).send("Error updating password");
  }
});

router.put("/updateuserdata/:id", (req, res) => {
  const userId = req.params.id;
  const { NewName, NewLastName, NewPhone } = req.body;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send("User not found");
      }
      user.name = NewName;
      user.lastname = NewLastName;
      user.phone = NewPhone;
      return user.save();
    })
    .then((updatedUser) => {
      console.log("data updated:", updatedUser);
      res.json({ message: "User data updated successfully" }); 
    })
    .catch((error) => {
      console.error("Error updating user data:", error);
      res.status(500).json({ message: "Error updating user data" });
    });
});

router.get("/getById/:id", (req, res) => {
  const myId = req.params.id;

  User.findById(myId)
    .then((user) => {
      if (!user) {
        return res.status(404).send("User not found");
      }

      res.json(user);
    })
    .catch((err) => {
      console.error("Error retrieving user:", err);
      res.status(500).send("Error retrieving user");
    });
});

router.delete("/deleteUser/:id", (req, res) => {
  const myId = req.params.id;

  User.findByIdAndDelete(myId)
    .then((user) => {
      if (!user) {
        return res.status(404).send("User not found");
      }

      res.json(user);
    })
    .catch((err) => {
      console.error("Error deleting user:", err);
      res.status(500).send("Error deleting user");
    });
});

router.post("/reset-password", async (req, res) => {
  try {
    const data = req.body;
    const user = await User.findOne({ email: data.email });

    if (!user) {
      return res
        .status(404)
        .json({ error: `Adresse email n'existe pas: ${data.email}` });
    }

    // Generate a new password
    const newPassword = Math.random().toString(36).slice(-8);

    // Hash the new password using bcrypt
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user's password in the database
    user.password = hashedPassword;
    await user.save();

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "sabriskandar5@gmail.com", 
        pass: "kqioggxxhollqcxb", // Your Gmail password or app-specific password
      },
    });

    const mailOptions = {
      from: "sabriskandar5@gmail.com",
      to: data.email,
      subject: "Réinitialisation du mot de passe",
      html: `
        <p>Bonjour,</p>
        <p>Nous avons récemment mis à jour nos systèmes de sécurité et, pour garantir la sécurité de votre compte, nous avons généré un nouveau mot de passe pour vous.</p>
        <p>Votre nouveau mot de passe est : <strong>${newPassword}</strong></p>
        <p>Veuillez noter que ce mot de passe est sensible à la casse et doit être saisi exactement tel qu'il apparaît ci-dessus lors de votre prochaine connexion à notre service. Nous vous recommandons également de changer ce mot de passe dès que possible pour un mot de passe que vous seul connaissez.</p>
        <p>Cordialement,<br>L'équipe de sécurité</p>
        <a href="http://localhost:4200/login" style="display:inline-block; background-color: dark; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Aller sur notre site web</a>
    `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).json("Error sending email");
      }

      console.log("Email sent:", info.response);
      res.status(200).json("Sent");
    });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json("Error resetting password");
  }
});



router.get("/countUsers", async (req, res) => {
  try {
    const Count = await User.countDocuments({});
    res.json({ Count });
  } catch (error) {
    console.error("Error counting Users:", error);
    res.status(500).json({ error: "Error counting Users" });
  }
});

module.exports = router;
