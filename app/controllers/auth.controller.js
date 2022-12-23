const db = require("../models/index.js");
const config = require("../config/auth.config.js");
const User = db.User;
const Role = db.Role;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {
  try {
    // Save User to Database
    const user = await User.create({
      firtstName: req.body.firstName,
      lastName: req.body.lastName,
      username: req.body.username,
      email: req.body.email,
      password: await bcrypt.hashSync(req.body.password, 8)
    });
    if (req.body.roles) {
      await Role.findAll({
        where: {
          name: {
            [Op.or]: req.body.roles
          }
        }
      });
      await user.setRoles(roles);
      res.send({
        message: "User was registered successfully!"
      });
    } else {
      // user role = 1
      await user.setRoles([1]);
      res.send({ message: "User was registered successfully!" });
    }
  } catch (error) {
    res.failServerError(error.message);
  }

  //   User.create({
  //     username: req.body.username,
  //     email: req.body.email,
  //     password: bcrypt.hashSync(req.body.password, 8)
  //   })
  //     .then(user => {
  //       if (req.body.roles) {
  //         Role.findAll({
  //           where: {
  //             name: {
  //               [Op.or]: req.body.roles
  //             }
  //           }
  //         }).then(roles => {
  //           user.setRoles(roles).then(() => {
  //             res.send({ message: "User was registered successfully!" });
  //           });
  //         });
  //       } else {
  //         // user role = 1
  //         user.setRoles([1]).then(() => {
  //           res.send({ message: "User was registered successfully!" });
  //         });
  //       }
  //     })
  //     .catch(err => {
  //       res.status(500).send({ message: err.message });
  //     });
};

exports.signin = (req, res) => {
  User.findOne({
    where: {
      username: req.body.username
    }
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      const token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400 // 24 hours
      });

      const authorities = [];
      user.getRoles().then(roles => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }
        res.status(200).send({
          id: user.id,
          username: user.username,
          email: user.email,
          roles: authorities,
          accessToken: token
        });
      });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};
