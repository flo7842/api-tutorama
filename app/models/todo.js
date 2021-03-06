var connection = require("../config/connection");
var ls = require("local-storage");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
var express = require("express");
var app = express();
var messagebis = "diidoi";
app.use(express.static("public"));
app.use("/css", express.static(__dirname + "public/css"));
app.use("/js", express.static(__dirname + "public/js"));
app.use("/img", express.static(__dirname + "public/img"));

function Todo() {
  this.reqdeconnexion = function (req, res) {
    //    res.clearCookie("essai");
    ls.remove("token");
    res.send({ status: 200, message: "deconnexion" });
  };
  this.reqlogin = function (reqemail, reqpassword, req, res) {
    //console.log(decoded.code) // bar

    if (true) {
      connection.acquire(function (err, con) {
        console.log(err);
        console.log("Connecté à la base de données MySQL!");

        con.query(
          "select idUtilisateur,password2 from utilisateur where email=?",
          reqemail,
          function (err, result) {
            con.release();
            res.header("Access-Control-Allow-Origin", "*");
            res.header(
              "Access-Control-Allow-Methods",
              "GET,HEAD,OPTIONS,POST,PUT"
            );
            res.header(
              "Access-Control-Allow-Headers",
              "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization"
            );
            if (err) {
              res.send({ status: 1, message: "email" });
            } else {
              // res.send({ status: 0, message:  result[0].password2});
              console.log("Post successful");
              if (!result[0]) {
                res.send({ status: 1, message: "email invalid" });
              } else {
                bcrypt.compare(
                  reqpassword,
                  result[0].password2,
                  function (err, result2) {
                    // result == true
                    if (err) {
                      res.send({
                        status: 0,
                        message:
                          "Erreur pour comparer les mots de passe " + reqemail,
                      });
                      con.release();
                    }
                    if (!result2) {
                      res.send({
                        status: 0,
                        message: "Mot de passe incorrect pour " + reqemail,
                      });
                    } else {
                      const jwttoken = jwt.sign(
                        { email: reqemail },
                        "secret_this_should_be_longer",
                        { expiresIn: "24d" }
                      );
                      const cookieOption = {
                        expiresIn: new Date(Date.now() + 24 * 24 * 3600),
                        httpOnly: true,
                      };

                      console.log(req.body);
                      const message =
                        "L'Utilisateur " +
                        result[0].idUtilisateur +
                        " " +
                        reqemail +
                        " c'est bien connecté !" +
                        jwttoken;
                      return res.status(200).json(message);
                    }
                  }
                );
              }
            }
          }
        );
      });
    }
  };
  this.reqpassword = function (reqemail, reqpassword, reqnouveau, req, res) {
    //console.log(decoded.code) // bar

    if (true) {
      connection.acquire(function (err, con) {
        console.log(err);
        console.log("Connecté à la base de données MySQL!");

        con.query(
          "select password2 from utilisateur where email=?",
          reqemail,
          function (err, result) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header(
              "Access-Control-Allow-Methods",
              "GET,HEAD,OPTIONS,POST,PUT"
            );
            res.header(
              "Access-Control-Allow-Headers",
              "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization"
            );
            if (err) {
              res.send({ status: 1, message: "email" });
            } else {
              // res.send({ status: 0, message:  result[0].password2});
              console.log("Post successful");
              if (!result[0]) {
                res.send({ status: 1, message: "email invalid" });
              } else {
                bcrypt.compare(
                  reqpassword,
                  result[0].password2,
                  function (err, result2) {
                    // result == true
                    if (err) {
                      res.send({
                        status: 0,
                        message:
                          "Erreur pour comparer les mots de passe " + reqemail,
                      });
                      con.release();
                    }
                    if (!result2) {
                      res.send({
                        status: 0,
                        message: "Mot de passe incorrect pour " + reqemail,
                      });
                    } else {
                      let hashpass = "";
                      let bon = "";
                      bcrypt.hash(reqnouveau, 10, function (err, hash) {
                        if (err) {
                          res.send({ status: 1, message: "Erreur" + err });
                        } else {
                          console.log(hash);
                          // Store hash in your password DB.
                          hashpass = hash;
                          con.query(
                            "update utilisateur set password2= ?  where email = ? ",
                            [hashpass, reqemail],
                            function (err, result) {
                              if (err) {
                                res.send({
                                  status: 0,
                                  message: "Erreur" + err,
                                });
                              } else {
                                res.send({
                                  status: 1,
                                  message: "ok mot de passe changé" + result2,
                                });
                              }
                            }
                          );
                          con.release();
                        }
                      });
                    }
                  }
                );
              }
            }
          }
        );
      });
    }
  };

  this.reqgister = function (
    nom,
    prenom,
    reqemail,
    avatar,
    age,
    numeroTel,
    numeroRue,
    batiment,
    code_Postale,
    libelle,
    reqpassword,
    req,
    res
  ) {
    let hashpass = "";
    let bon = "";
    connection.acquire(function (err, con) {
      console.log(err);
      console.log("Connecté à la base de données MySQL!");
      req.cookies.title = "GeeksforGeeks";
      console.log(req.cookies);

      bcrypt.hash(reqpassword, 10, function (err, hash) {
        if (err) {
          res.send({ status: 1, message: "Erreur" + err });
        } else {
          console.log(hash);
          // Store hash in your password DB.
          hashpass = hash;

          con.query(
            "insert into utilisateur (nom, prenom,email,avatar, age, numeroTel, numeroRue, batiment, code_Postale, libelle, dateInscription, password2) values (?,?,?,?,?,?,?,?,?,?,?,?)",
            [
              nom,
              prenom,
              reqemail,
              avatar,
              age,
              numeroTel,
              numeroRue,
              batiment,
              code_Postale,
              libelle,
              dateNow(),
            
              hashpass,
            ],
            function (err, result) {
              res.header("Access-Control-Allow-Origin", "*");
              res.header(
                "Access-Control-Allow-Methods",
                "GET,HEAD,OPTIONS,POST,PUT"
              );
              res.header(
                "Access-Control-Allow-Headers",
                "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization"
              );

              if (err) {
                console.log("error dans todo");
                res.send({
                  status: 1,
                  message: "Erreur de conection ou login existe" + err,
                });
                con.release();
              } else {
                console.log("IIIIIIIIIIIIIIIIIIIIIII");
                res.send({
                  status: 0,
                  message: "Utilisateur enregistrer " + reqemail,
                });
                console.log("Post successful");
                con.release();
              }
            }
          );
        }
      });
    });
  };
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "clotikriss@gmail.com",
      pass: "Tutorama2",
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  this.motdepasseoublie = function (email, req, res) {
    let hashpass = "";
    let bon = "";
    var code = "$2a$10$GJXcX8O7FNFBwmA1VZkfweWZeivSTY2oXru3PH/ujN/5IoU8eijxe";
    connection.acquire(function (err, con) {
      console.log(err);
      console.log("Connecté à la base de données MySQL!");
      req.cookies.title = "GeeksforGeeks";
      console.log(req.cookies);

      con.query(
        "update utilisateur set password2 = ? where email = ? ",
        [code, email],
        function (err, result) {
          res.header("Access-Control-Allow-Origin", "*");
          res.header(
            "Access-Control-Allow-Methods",
            "GET,HEAD,OPTIONS,POST,PUT"
          );
          res.header(
            "Access-Control-Allow-Headers",
            "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization"
          );

          if (err) {
            console.log("error dans todo");
            res.send({
              status: 1,
              message: "Erreur de conection ou login existe" + err,
            });
            con.release();
          } else {
            console.log("IIIIIIIIIIIIIIIIIIIIIII");

            var mailOptions = {
              from: "clotikriss@gmail.com",
              to: email,
              subject:
                "Un mail de changement de mot de passe vous a été envoyé pour tutorama",
              text: "Votre mot de passe provisoire est :12345",
            };

            transporter.sendMail(mailOptions, function (error, info) {
              if (error) {
                console.log(error);
              } else {
                console.log("Email sent: " + info.response);
              }
            });
            res.send({
              status: 0,
              message: "Votre mot de passe a été modifié, taper:12345  ",
            });
            console.log("Post successful");
            con.release();
          }
        }
      );
    });
  };

  this.getemail = function (res) {
    connection.acquire(function (err, con) {
      con.query("select distinct(email) from plateau", function (err, result) {
        con.release();
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
        res.header(
          "Access-Control-Allow-Headers",
          "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization"
        );

        res.send(result);
        console.log("Get successful");
      });
    });
  };
  this.getcourpromotion = function (res) {
    connection.acquire(function (err, con) {
      con.query(
        "select * from cour order by date desc limit 6",
        function (err, result) {
          con.release();
          res.header("Access-Control-Allow-Origin", "*");
          res.header(
            "Access-Control-Allow-Methods",
            "GET,HEAD,OPTIONS,POST,PUT"
          );
          res.header(
            "Access-Control-Allow-Headers",
            "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization"
          );

          res.send(result);
          console.log("Get successful");
        }
      );
    });
  };
  this.getcourmieuxnote = function (res) {
    connection.acquire(function (err, con) {
      con.query("select * from cour where Etoile>3", function (err, result) {
        con.release();
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
        res.header(
          "Access-Control-Allow-Headers",
          "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization"
        );

        res.send(result);
        console.log("Get successful");
      });
    });
  };
  this.getpanierparuser = function (paremail, res) {
    connection.acquire(function (err, con) {
      con.query(
        "SELECT * FROM panier INNER JOIN utilisateur ON panier.idUtilisateur=utilisateur.idUtilisateur INNER JOIN cour on cour.idCour=panier.idCour where utilisateur.email=? ",
        paremail,
        function (err, result) {
          con.release();
          res.header("Access-Control-Allow-Origin", "*");
          res.header(
            "Access-Control-Allow-Methods",
            "GET,HEAD,OPTIONS,POST,PUT"
          );
          res.header(
            "Access-Control-Allow-Headers",
            "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization"
          );

          if (err) {
            res.send(err);
            console.log("Get successful");
          } else {
            res.send(result);
            console.log("Get successful");
          }
        }
      );
    });
  };
  this.getcategorieMieuxNote= function (res) {
    connection.acquire(function (err, con) {
      con.query(
        "SELECT * from categorie inner join appartenir ON appartenir.idCategorie=categorie.idCategorie INNER join cour ON cour.IdCour=appartenir.IdCour where Etoile>3",
        function (err, result) {
          con.release();
          res.header("Access-Control-Allow-Origin", "*");
          res.header(
            "Access-Control-Allow-Methods",
            "GET,HEAD,OPTIONS,POST,PUT"
          );
          res.header(
            "Access-Control-Allow-Headers",
            "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization"
          );

          if (err) {
            res.send(err);
            console.log("Get successful");
          } else {
            res.send(result);
            console.log("Get successful");
          }
        }
      );
    });
  };

  this.getcategorieTout = function (res) {
    connection.acquire(function (err, con) {
      con.query(
        "SELECT * from categorie inner join appartenir ON appartenir.idCategorie=categorie.idCategorie INNER join cour ON cour.IdCour=appartenir.IdCour ",
        function (err, result) {
          con.release();
          res.header("Access-Control-Allow-Origin", "*");
          res.header(
            "Access-Control-Allow-Methods",
            "GET,HEAD,OPTIONS,POST,PUT"
          );
          res.header(
            "Access-Control-Allow-Headers",
            "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization"
          );

          if (err) {
            res.send(err);
            console.log("Get successful");
          } else {
            res.send(result);
            console.log("Get successful");
          }
        }
      );
    });
  };
  this.getcategoriePromo = function (res) {
    connection.acquire(function (err, con) {
      con.query(
        "SELECT * from categorie inner join appartenir ON appartenir.idCategorie=categorie.idCategorie INNER join cour ON cour.IdCour=appartenir.IdCour date DESC limit 6 ",
        function (err, result) {
          con.release();
          res.header("Access-Control-Allow-Origin", "*");
          res.header(
            "Access-Control-Allow-Methods",
            "GET,HEAD,OPTIONS,POST,PUT"
          );
          res.header(
            "Access-Control-Allow-Headers",
            "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization"
          );

          if (err) {
            res.send(err);
            console.log("Get successful");
          } else {
            res.send(result);
            console.log("Get successful");
          }
        }
      );
    });
  };
  this.getcategorieNom = function (Nom,res) {
    connection.acquire(function (err, con) {
      con.query(
        "SELECT * from categorie inner join appartenir ON appartenir.idCategorie=categorie.idCategorie INNER join cour ON cour.IdCour=appartenir.IdCour where Nom=? ",Nom,
        function (err, result) {
          con.release();
          res.header("Access-Control-Allow-Origin", "*");
          res.header(
            "Access-Control-Allow-Methods",
            "GET,HEAD,OPTIONS,POST,PUT"
          );
          res.header(
            "Access-Control-Allow-Headers",
            "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization"
          );

          if (err) {
            res.send(err);
            console.log("Get successful");
          } else {
            res.send(result);
            console.log("Get successful");
          }
        }
      );
    });
  };
  this.getusertout = function (res) {
    connection.acquire(function (err, con) {
      con.query("SELECT *FROM utilisateur ", function (err, result) {
        con.release();
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
        res.header(
          "Access-Control-Allow-Headers",
          "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization"
        );

        if (err) {
          res.send(err);
          console.log("Get successful");
        } else {
          res.send(result);
          console.log("Get successful");
        }
      });
    });
  };
  this.getuserparemail = function (email, res) {
    connection.acquire(function (err, con) {
      con.query(
        "SELECT *FROM utilisateur where email=?",
        email,
        function (err, result) {
          con.release();
          res.header("Access-Control-Allow-Origin", "*");
          res.header(
            "Access-Control-Allow-Methods",
            "GET,HEAD,OPTIONS,POST,PUT"
          );
          res.header(
            "Access-Control-Allow-Headers",
            "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization"
          );

          if (err) {
            res.send(err);
            console.log("Get successful");
          } else {
            res.send(result);
            console.log("Get successful");
          }
        }
      );
    });
  };
  this.getuserparmail = function (email, res) {
    connection.acquire(function (err, con) {
      con.query(
        "SELECT *FROM utilisateur where email=?",
        email,
        function (err, result) {
          con.release();
          res.header("Access-Control-Allow-Origin", "*");
          res.header(
            "Access-Control-Allow-Methods",
            "GET,HEAD,OPTIONS,POST,PUT"
          );
          res.header(
            "Access-Control-Allow-Headers",
            "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization"
          );

          if (err) {
            res.send(err);
            console.log("Get successful");
          } else {
            res.send(result);
            console.log("Get successful");
          }
        }
      );
    });
  };
  this.getcourtout = function (res) {
    connection.acquire(function (err, con) {
      con.query("SELECT * from cour", function (err, result) {
        con.release();
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
        res.header(
          "Access-Control-Allow-Headers",
          "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization"
        );

        if (err) {
          res.send(err);
          console.log("Get successful");
        } else {
          res.send(result);
          console.log("Get successful");
        }
      });
    });
  };
  this.getpromo = function (res) {
    connection.acquire(function (err, con) {
      con.query(
        "SELECT * FROM cour ORDER BY date DESC limit 6",
        function (err, result) {
          con.release();
          res.header("Access-Control-Allow-Origin", "*");
          res.header(
            "Access-Control-Allow-Methods",
            "GET,HEAD,OPTIONS,POST,PUT"
          );
          res.header(
            "Access-Control-Allow-Headers",
            "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization"
          );

          if (err) {
            res.send(err);
            console.log("Get successful");
          } else {
            res.send(result);
            console.log("Get successful");
          }
        }
      );
    });
  };
  this.getcategorieEmail = function (email, res) {
    connection.acquire(function (err, con) {
      con.query(
        "SELECT * from categorie inner join appartenir ON appartenir.idCategorie=categorie.idCategorie INNER join cour ON cour.IdCour=appartenir.IdCour INNER JOIN panier on panier.idCour=cour.IdCour INNER join utilisateur on panier.idUtilisateur=utilisateur.idUtilisateur where email=?",
        email,
        function (err, result) {
          con.release();
          res.header("Access-Control-Allow-Origin", "*");
          res.header(
            "Access-Control-Allow-Methods",
            "GET,HEAD,OPTIONS,POST,PUT"
          );
          res.header(
            "Access-Control-Allow-Headers",
            "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization"
          );

          if (err) {
            res.send(err);
            console.log("Get successful");
          } else {
            res.send(result);
            console.log("Get successful");
          }
        }
      );
    });
  };
   this.getcategorieEmail = function (email, res) {
    connection.acquire(function (err, con) {
      con.query(
        "SELECT * from categorie inner join appartenir ON appartenir.idCategorie=categorie.idCategorie INNER join cour ON cour.IdCour=appartenir.IdCour INNER JOIN panier on panier.idCour=cour.IdCour INNER join utilisateur on panier.idUtilisateur=utilisateur.idUtilisateur where email=?",
        email,
        function (err, result) {
          con.release();
          res.header("Access-Control-Allow-Origin", "*");
          res.header(
            "Access-Control-Allow-Methods",
            "GET,HEAD,OPTIONS,POST,PUT"
          );
          res.header(
            "Access-Control-Allow-Headers",
            "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization"
          );

          if (err) {
            res.send(err);
            console.log("Get successful");
          } else {
            res.send(result);
            console.log("Get successful");
          }
        }
      );
    });
  };
  this.getByID = function (id, res) {
    connection.acquire(function (err, con) {
      con.query(
        "select * from todo_list where id = ?",
        id,
        function (err, result) {
          con.release();
          res.header("Access-Control-Allow-Origin", "*");
          res.header(
            "Access-Control-Allow-Methods",
            "GET,HEAD,OPTIONS,POST,PUT"
          );
          res.header(
            "Access-Control-Allow-Headers",
            "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization"
          );

          res.send(result);
          console.log("Get by ID successful");
        }
      );
    });
  };
  this.create = function (todo, res) {
    connection.acquire(function (err, con) {
      con.query("insert into todo_list set ?", todo, function (err, result) {
        con.release();
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
        res.header(
          "Access-Control-Allow-Headers",
          "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization"
        );

        if (err) {
          res.send({ status: 1, message: "TODO creation fail" });
        } else {
          res.send({ status: 0, message: "TODO create success" });
          console.log("Post successful");
        }
      });
    });
  };
  this.update = function (todo, id, res) {
    connection.acquire(function (err, con) {
      con.query(
        "update todo_list set name = ? where id = ?",
        [todo, id],
        function (err, result) {
          con.release();
          res.header("Access-Control-Allow-Origin", "*");
          res.header(
            "Access-Control-Allow-Methods",
            "GET,HEAD,OPTIONS,POST,PUT"
          );
          res.header(
            "Access-Control-Allow-Headers",
            "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization"
          );

          if (err) {
            res.send({ status: 1, message: "TODO update fail" });
          } else {
            res.send({ status: 0, message: "TODO update success" });
            console.log("Put successful");
          }
        }
      );
    });
  };
  dateNow = function () {
    return new Date().toISOString().slice(0, 19).replace("T", " ");
  };
  this.adduser = function (
    email,
    avatar,
    age,
    numerotel,
    numeroRue,
    batiment,
    codePostale,
    libelle,
    req,
    res
  ) {
    connection.acquire(function (err, con) {
      // 2021-01-41 13:06:01

      if (true) {
        con.query(
          "insert into utilisateur(email, avatar, age, numeroTel, numeroRue, batiment, code_Postale, libelle, dateInscription) values(?,?,?,?,?,?,?,?,?)",
          [
            email,
            avatar,
            age,
            numerotel,
            numeroRue,
            batiment,
            codePostale,
            libelle,
            dateNow(),
          ],
          function (err, result) {
            con.release();
            res.header("Access-Control-Allow-Origin", "*");
            res.header(
              "Access-Control-Allow-Methods",
              "GET,HEAD,OPTIONS,POST,PUT"
            );
            res.header(
              "Access-Control-Allow-Headers",
              "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization"
            );

            if (err) {
              res.send({ status: 1, message: "TODO update fail" + err });
            } else {
              res.send({ status: 0, message: "TODO update success" });
              console.log("Put successful");
            }
          }
        );
      }
    });
  };

  this.getcours = function (res) {
    connection.acquire(function (err, con) {
      con.query(
        "SELECT * FROM cour ORDER BY date DESC",
        function (err, result) {
          con.release();
          res.header("Access-Control-Allow-Origin", "*");
          res.header(
            "Access-Control-Allow-Methods",
            "GET,HEAD,OPTIONS,POST,PUT"
          );
          res.header(
            "Access-Control-Allow-Headers",
            "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization"
          );

          if (err) {
            res.send(err);
            console.log("Get successful");
          } else {
            res.send(result);
            console.log("Get successful");
          }
        }
      );
    });
  };
  this.updateadmin = function (email, statut, req, res) {
    connection.acquire(function (err, con) {
      // 2021-01-41 13:06:01

      if (true) {
        con.query(
          "UPDATE utilisateur SET admin=? where email=?",
          [statut, email],
          function (err, result) {
            con.release();
            res.header("Access-Control-Allow-Origin", "*");
            res.header(
              "Access-Control-Allow-Methods",
              "GET,HEAD,OPTIONS,POST,PUT"
            );
            res.header(
              "Access-Control-Allow-Headers",
              "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization"
            );

            if (err) {
              res.send({ status: 1, message: "TODO update fail" + err });
            } else {
              res.send({ status: 0, message: "TODO update success" });
              console.log("Put successful");
            }
          }
        );
      }
    });
  };
  this.addcour = function (
    image,
    Auteur,
    etoile,
    contenu,
    prix,
    video,
    req,
    res
  ) {
    connection.acquire(function (err, con) {
      // 2021-01-41 13:06:01

      if (true) {
        con.query(
          "insert into cour (image,Auteur, Etoile, contenu, prix,date,video) values(?,?,?,?,?,?,?)",
          [image, Auteur, etoile, contenu, prix, video, dateNow()],
          function (err, result) {
            con.release();
            res.header("Access-Control-Allow-Origin", "*");
            res.header(
              "Access-Control-Allow-Methods",
              "GET,HEAD,OPTIONS,POST,PUT"
            );
            res.header(
              "Access-Control-Allow-Headers",
              "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization"
            );

            if (err) {
              res.send({ status: 1, message: "TODO update fail" + err });
            } else {
              res.send({ status: 0, message: "TODO update success" });
              console.log("Put successful");
            }
          }
        );
      }
    });
  };

  this.addvideo = function (nom, path, image, req, res) {
    connection.acquire(function (err, con) {
      // 2021-01-41 13:06:01

      if (true) {
        !con.query(
          "insert into video (nom, path, image) values(?,?,?)",
          [nom, path, image],
          function (err, result) {
            con.release();
            res.header("Access-Control-Allow-Origin", "*");
            res.header(
              "Access-Control-Allow-Methods",
              "GET,HEAD,OPTIONS,POST,PUT"
            );
            res.header(
              "Access-Control-Allow-Headers",
              "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization"
            );

            if (err) {
              res.send({ status: 1, message: "TODO update fail" + err });
            } else {
              res.send({ status: 0, message: "TODO update success" });
              console.log("Put successful");
            }
          }
        );
      }
    });
  };
  this.addpanier = function (idUtilisateur, idCour, req, res) {
    connection.acquire(function (err, con) {
      if (true) {
        con.query(
          "insert into panier (idUtilisateur,idCour, date ) values(?,?,?)",
          [idUtilisateur, idCour, dateNow()],
          function (err, result) {
            con.release();
            res.header("Access-Control-Allow-Origin", "*");
            res.header(
              "Access-Control-Allow-Methods",
              "GET,HEAD,OPTIONS,POST,PUT"
            );
            res.header(
              "Access-Control-Allow-Headers",
              "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization"
            );

            if (err) {
              res.send({ status: 1, message: "TODO update fail" + err });
            } else {
              res.send({ status: 0, message: "TODO update success" });
              console.log("Put successful");
            }
          }
        );
      }
    });
  };
  this.addcomposercour = function (idPanier, idCour, req, res) {
    connection.acquire(function (err, con) {
      if (true) {
        con.query(
          "insert into composer (idPanier,idCour ) values(?,?)",
          [idPanier, idCour],
          function (err, result) {
            con.release();
            res.header("Access-Control-Allow-Origin", "*");
            res.header(
              "Access-Control-Allow-Methods",
              "GET,HEAD,OPTIONS,POST,PUT"
            );
            res.header(
              "Access-Control-Allow-Headers",
              "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization"
            );

            if (err) {
              res.send({ status: 1, message: "TODO update fail" + err });
            } else {
              res.send({ status: 0, message: "TODO update success" });
              console.log("Put successful");
            }
          }
        );
      }
    });
  };
  this.suivrecour = function (idutilisateur, idCour, req, res) {
    connection.acquire(function (err, con) {
      if (true) {
        con.query(
          "insert into suivre (utilisateur_idUtilisateur, cour_IdCour) values(?,?)",
          [idutilisateur, idCour],
          function (err, result) {
            con.release();
            res.header("Access-Control-Allow-Origin", "*");
            res.header(
              "Access-Control-Allow-Methods",
              "GET,HEAD,OPTIONS,POST,PUT"
            );
            res.header(
              "Access-Control-Allow-Headers",
              "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization"
            );

            if (err) {
              res.send({ status: 1, message: "TODO update fail" + err });
            } else {
              res.send({ status: 0, message: "TODO update success" });
              console.log("Put successful");
            }
          }
        );
      }
    });
  };
  this.delete = function (id, res) {
    connection.acquire(function (err, con) {
      con.query(
        "delete from todo_list where id = ?",
        id,
        function (err, result) {
          con.release();
          res.header("Access-Control-Allow-Origin", "*");
          res.header(
            "Access-Control-Allow-Methods",
            "GET,HEAD,OPTIONS,POST,PUT"
          );
          res.header(
            "Access-Control-Allow-Headers",
            "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization"
          );

          if (err) {
            res.send({ status: 1, message: "TODO delete fail" });
          } else {
            res.send({ status: 0, message: "TODO delete success" });
            console.log("Delete successful");
          }
        }
      );
    });
  };
  this.deletetout = function (req, res) {
    connection.acquire(function (err, con) {
      con.query("delete from todo_list where id>1", function (err, result) {
        con.release();
        if (err) {
          res.header("Access-Control-Allow-Origin", "*");
          res.header(
            "Access-Control-Allow-Methods",
            "GET,HEAD,OPTIONS,POST,PUT"
          );
          res.header(
            "Access-Control-Allow-Headers",
            "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization"
          );

          res.send({ status: 1, message: "TODO delete fail" });
        } else {
          res.send({ status: 0, message: "TODO delete success" });
          console.log("Delete successful");
        }
      });
    });
  };
  this.addvideocour = function (idvideo, idcour, req, res) {
    connection.acquire(function (err, con) {
      if (true) {
        con.query(
          "insert into compose (idVideo, idCour) values(?,?)",
          [idvideo, idcour],
          function (err, result) {
            con.release();
            res.header("Access-Control-Allow-Origin", "*");
            res.header(
              "Access-Control-Allow-Methods",
              "GET,HEAD,OPTIONS,POST,PUT"
            );
            res.header(
              "Access-Control-Allow-Headers",
              "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization"
            );

            if (err) {
              res.send({ status: 1, message: "TODO update fail" + err });
            } else {
              res.send({ status: 0, message: "TODO update success" });
              console.log("Put successful");
            }
          }
        );
      }
    });
  };
  this.abonnement = function (dure, prix, req, res) {
    connection.acquire(function (err, con) {
      if (true) {
        con.query(
          "insert into abonnement (dure, prix) values(?,?)",
          [dure, prix],
          function (err, result) {
            con.release();
            res.header("Access-Control-Allow-Origin", "*");
            res.header(
              "Access-Control-Allow-Methods",
              "GET,HEAD,OPTIONS,POST,PUT"
            );
            res.header(
              "Access-Control-Allow-Headers",
              "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization"
            );

            if (err) {
              res.send({ status: 1, message: "TODO update fail" + err });
            } else {
              res.send({ status: 0, message: "TODO update success" });
              console.log("Put successful");
            }
          }
        );
      }
    });
  };
  this.categorie = function (nom, age, sousCategorie, req, res) {
    connection.acquire(function (err, con) {
      // 2021-01-41 13:06:01

      if (true) {
        con.query(
          "insert into categorie (nom, age, sousCategorie) values(?,?,?)",
          [nom, age, sousCategorie],
          function (err, result) {
            con.release();
            res.header("Access-Control-Allow-Origin", "*");
            res.header(
              "Access-Control-Allow-Methods",
              "GET,HEAD,OPTIONS,POST,PUT"
            );
            res.header(
              "Access-Control-Allow-Headers",
              "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization"
            );

            if (err) {
              res.send({ status: 1, message: "TODO update fail" + err });
            } else {
              res.send({ status: 0, message: "TODO update success" });
              console.log("Put successful");
            }
          }
        );
      }
    });
  };
  this.appartenir = function (idCategorie, idCour, req, res) {
    connection.acquire(function (err, con) {
      if (true) {
        con.query(
          "insert into appartenir (idCategorie, idCour) values(?,?)",
          [idCategorie, idCour],
          function (err, result) {
            con.release();
            res.header("Access-Control-Allow-Origin", "*");
            res.header(
              "Access-Control-Allow-Methods",
              "GET,HEAD,OPTIONS,POST,PUT"
            );
            res.header(
              "Access-Control-Allow-Headers",
              "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization"
            );

            if (err) {
              res.send({ status: 1, message: "TODO update fail" + err });
            } else {
              res.send({ status: 0, message: "TODO update success" });
              console.log("Put successful");
            }
          }
        );
      }
    });
  };
}

module.exports = new Todo();
