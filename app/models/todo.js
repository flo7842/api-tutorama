var connection = require("../config/connection");

const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const bcrypt = require('bcryptjs');
const cookieParser = require("cookie-parser");
var express = require('express');
var app = express();
var messagebis = "diidoi";
app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/js', express.static(__dirname + 'public/js'))
app.use('/img', express.static(__dirname + 'public/img'))
let transport = nodemailer.createTransport({
  host: "mail.krissdeveloppeur.com",
  secure: false,
  auth: {
    user: "envoi@krissdeveloppeur.com",
    pass: "envoienvoi!",
  },
  tls: {
    rejectUnauthorized: false,
  },
});

function Todo() {
  this.reqdeconnexion = function ( req, res) {

    res.clearCookie("essai");
    res.send({ status: 200, message: "deconnexion"});
   
  }
  this.reqlogin = function (reqemail, reqpassword, req, res) {
    let conection2 = false;
    let email="";
    jwt.verify(req.cookies['essai'], 'secret_this_should_be_longer', function (err, decoded) {
   ;
      if (decoded === undefined) {
        conection2 = true;
        
      }
      else {
        email=decoded.email;
        conection2 = false;
        
      }
      //console.log(decoded.code) // bar
    });
    if (conection2 == true) {
      connection.acquire(function (err, con) {
        console.log(err);
        console.log("Connecté à la base de données MySQL!");

        con.query(
          'select password2 from user where email=?',
          reqemail,
          function (err, result) {
            con.release();
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");
            if (err) {
              res.send({ status: 1, message: "email"});
              
            }



            else {



              // res.send({ status: 0, message:  result[0].password2});
              console.log("Post successful");
              if(!result[0]){
                res.send({ status: 1, message: "email invalid"});
               
              } 
                else{

              bcrypt.compare(reqpassword, result[0].password2, function (err, result2) {
                // result == true
              if(err){
                res.send({ status: 0, message: "Erreur pour comparer les mots de passe " + reqemail });
                con.release();
              }
                if (!result2) {

                  res.send({ status: 0, message: "Mot de passe incorrect pour " + reqemail });
                  
                }
                else {



                  const jwttoken = jwt.sign(
                    {  email:reqemail },
                    "secret_this_should_be_longer",
                    { expiresIn: "1h" }
                  );
                  const cookieOption = {
                    expiresIn: new Date(
                      Date.now() + 24 * 3600
                    ),
                    httpOnly: true
                  }
                  res.cookie('essai', jwttoken, cookieOption);
                  console.log(req.body) 
                  const message = "L'Utilisateur" + req.body.email + " c'est bien connecté !" + jwttoken;
                  return res.status(200).json(message)
                  
                }
                
              });
            }
            }
          }
        );
      });

    } else {
      // res.clearCookie("essai");
      res.send({ status: 1, message: "Connecté "+email });

    }
  }
  this.reqgister = function (reqemail, reqpassword, req, res) {
    let hashpass = "";
    let bon = "";
    connection.acquire(function (err, con) {
      console.log(err);
      console.log("Connecté à la base de données MySQL!");
      req.cookies.title = 'GeeksforGeeks';
      console.log(req.cookies);

      bcrypt.hash(reqpassword, 10, function (err, hash) {
        if(err){
          res.send({ status: 1, message: "Erreur" + err });
        }
        else{

        

        console.log(hash);
        // Store hash in your password DB.
        hashpass = hash;
        
        
        con.query(
          "insert into user (email, password2) values (?,?)", [reqemail, hashpass]
          ,

          function (err, result) {


            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");

            if (err) {
              console.log("error dans todo");
                            res.send({ status: 1, message: "Erreur de conection ou login existe" + err });
              con.release();
            } else {
              console.log("IIIIIIIIIIIIIIIIIIIIIII");
              res.send({ status: 0, message: "Utilisateur enregistrer " + reqemail});
              console.log("Post successful");
              con.release();
            
            }
          
          }
        );
        }
      });
    
    });
  
  }
  

    
  this.getemail = function (res) {
    connection.acquire(function (err, con) {

      con.query("select distinct(email) from plateau", function (err, result) {
        con.release();
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");




        res.send(result);
        console.log("Get successful");
      });
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
          res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
          res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");

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
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");

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
          res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
          res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");

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
  dateNow=function(){
    
   return  new Date().toISOString().slice(0, 19).replace('T', ' ');
  }
  this.adduser = function (avatar, age, numerotel, numeroRue, batiment,codePostale, libelle, req,res) {
    connection.acquire(function (err, con) {
    

 // 2021-01-41 13:06:01
      let conection2 = false;
    let email="";
    jwt.verify(req.cookies['essai'], 'secret_this_should_be_longer', function (err, decoded) {
   ;
      if (decoded === undefined) {
        conection2 = true;
        res.send({ status: 1, message: "Veuillez vous connecter" });
      }
      else {
        email=decoded.email;
        conection2 = false;
        
      }
      //console.log(decoded.code) // bar
    });
    
    if(!(conection2==true)){
     
      con.query(
        "insert into utilisateur(email, avatar, age, numeroTel, numeroRue, batiment, code_Postale, libelle, dateInscription) values(?,?,?,?,?,?,?,?,?)",[email,avatar,age,numerotel, numeroRue,batiment,codePostale,libelle, dateNow()],
        function (err, result) {
          con.release();
          res.header("Access-Control-Allow-Origin", "*");
          res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
          res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");

          if (err) {
            res.send({ status: 1, message: "TODO update fail"+err });
          } else {
            res.send({ status: 0, message: "TODO update success" });
            console.log("Put successful");
          }
        }
      );
    }
    });
  };
  this.addcour = function (Auteur, etoile, Conetenu, prix, req,res) {
    connection.acquire(function (err, con) {
      

 // 2021-01-41 13:06:01
      let conection2 = false;
    let email="";
    jwt.verify(req.cookies['essai'], 'secret_this_should_be_longer', function (err, decoded) {
   ;
      if (decoded === undefined) {
        conection2 = true;
        res.send({ status: 1, message: "Veuillez vous connecter" });
      }
      else {
        email=decoded.email;
        conection2 = false;
        
      }
      //console.log(decoded.code) // bar
    });
    
    if(!(conection2==true)){
     
      con.query(
        "insert into Cour (Auteur, Etoile, Conetenu, prix,date) values(?,?,?,?,?)",[Auteur, etoile, Conetenu, prix, dateNow()],
        function (err, result) {
          con.release();
          res.header("Access-Control-Allow-Origin", "*");
          res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
          res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");

          if (err) {
            res.send({ status: 1, message: "TODO update fail"+err });
          } else {
            res.send({ status: 0, message: "TODO update success" });
            console.log("Put successful");
          }
        }
      );
    }
    });
  };

  this.addvideo = function (nom, path, image,req,res) {
    connection.acquire(function (err, con) {
     

 // 2021-01-41 13:06:01
      let conection2 = false;
    let email="";
    jwt.verify(req.cookies['essai'], 'secret_this_should_be_longer', function (err, decoded) {
   ;
      if (decoded === undefined) {
        conection2 = true;
        res.send({ status: 1, message: "Veuillez vous connecter" });
      }
      else {
        email=decoded.email;
        conection2 = false;
        
      }
      //console.log(decoded.code) // bar
    });
    
    if(!(conection2==true)){
     
      con.query(
        "insert into video (nom, path, image) values(?,?,?)",[nom, path,image],
        function (err, result) {
          con.release();
          res.header("Access-Control-Allow-Origin", "*");
          res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
          res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");

          if (err) {
            res.send({ status: 1, message: "TODO update fail"+err });
          } else {
            res.send({ status: 0, message: "TODO update success" });
            console.log("Put successful");
          }
        }
      );
    }
    });
  };
  this.addpanier = function ( idUtilisateur, idArticle, req,res) {
    connection.acquire(function (err, con) {
   

 // 2021-01-41 13:06:01
      let conection2 = false;
    let email="";
    jwt.verify(req.cookies['essai'], 'secret_this_should_be_longer', function (err, decoded) {
   ;
      if (decoded === undefined) {
        conection2 = true;
        res.send({ status: 1, message: "Veuillez vous connecter" });
      }
      else {
        email=decoded.email;
        conection2 = false;
        
      }
      //console.log(decoded.code) // bar
    });
    
    if(!(conection2==true)){
     
      con.query(
        "insert into panier (idUtilisateur,idArticle, date ) values(?,?,?)",[idUtilisateur,idArticle,dateNow()],
        function (err, result) {
          con.release();
          res.header("Access-Control-Allow-Origin", "*");
          res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
          res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");

          if (err) {
            res.send({ status: 1, message: "TODO update fail"+err });
          } else {
            res.send({ status: 0, message: "TODO update success" });
            console.log("Put successful");
          }
        }
      );
    }
    });
  };
  this.addcomposercour = function (  idPanier,idCour, req,res) {
    connection.acquire(function (err, con) {
      

 // 2021-01-41 13:06:01
      let conection2 = false;
    let email="";
    jwt.verify(req.cookies['essai'], 'secret_this_should_be_longer', function (err, decoded) {
   ;
      if (decoded === undefined) {
        conection2 = true;
        res.send({ status: 1, message: "Veuillez vous connecter" });
      }
      else {
        email=decoded.email;
        conection2 = false;
        
      }
      //console.log(decoded.code) // bar
    });
    
    if(!(conection2==true)){
     
      con.query(
        "insert into composer (idPanier,idCour ) values(?,?)",[idPanier,idCour],
        function (err, result) {
          con.release();
          res.header("Access-Control-Allow-Origin", "*");
          res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
          res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");

          if (err) {
            res.send({ status: 1, message: "TODO update fail"+err });
          } else {
            res.send({ status: 0, message: "TODO update success" });
            console.log("Put successful");
          }
        }
      );
    }
    });
  };
  this.suivrecour = function (  idutilisateur,idCour, req,res) {
    connection.acquire(function (err, con) {
      
 // 2021-01-41 13:06:01
      let conection2 = false;
    let email="";
    jwt.verify(req.cookies['essai'], 'secret_this_should_be_longer', function (err, decoded) {
   ;
      if (decoded === undefined) {
        conection2 = true;
        res.send({ status: 1, message: "Veuillez vous connecter" });
      }
      else {
        email=decoded.email;
        conection2 = false;
        
      }
      //console.log(decoded.code) // bar
    });
    
    if(!(conection2==true)){
     
      con.query(
        "insert into suivre (utilisateur_idUtilisateur, cour_IdCour) values(?,?)",[idutilisateur,idCour],
        function (err, result) {
          con.release();
          res.header("Access-Control-Allow-Origin", "*");
          res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
          res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");

          if (err) {
            res.send({ status: 1, message: "TODO update fail"+err });
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
          res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
          res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");

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
      con.query(
        "delete from todo_list where id>1",
        function (err, result) {
          con.release();
          if (err) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");

            res.send({ status: 1, message: "TODO delete fail" });
          } else {
            res.send({ status: 0, message: "TODO delete success" });
            console.log("Delete successful");
          }
        }
      );
    });
  };
  this.addvideocour = function ( idvideo ,idcour, req,res) {
    connection.acquire(function (err, con) {
      
 // 2021-01-41 13:06:01
      let conection2 = false;
    let email="";
    jwt.verify(req.cookies['essai'], 'secret_this_should_be_longer', function (err, decoded) {
   ;
      if (decoded === undefined) {
        conection2 = true;
        res.send({ status: 1, message: "Veuillez vous connecter" });
      }
      else {
        email=decoded.email;
        conection2 = false;
        
      }
      //console.log(decoded.code) // bar
    });
    
    if(!(conection2==true)){
     
      con.query(
        "insert into compose (idVideo, idCour) values(?,?)",[idvideo,idcour],
        function (err, result) {
          con.release();
          res.header("Access-Control-Allow-Origin", "*");
          res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
          res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");

          if (err) {
            res.send({ status: 1, message: "TODO update fail"+err });
          } else {
            res.send({ status: 0, message: "TODO update success" });
            console.log("Put successful");
          }
        }
      );
    }
    });
  };
  this.abonnement= function ( dure,prix, req,res) {
    connection.acquire(function (err, con) {
      
 // 2021-01-41 13:06:01
      let conection2 = false;
    let email="";
    jwt.verify(req.cookies['essai'], 'secret_this_should_be_longer', function (err, decoded) {
   ;
      if (decoded === undefined) {
        conection2 = true;
        res.send({ status: 1, message: "Veuillez vous connecter" });
      }
      else {
        email=decoded.email;
        conection2 = false;
        
      }
      //console.log(decoded.code) // bar
    });
    
    if(!(conection2==true)){
     
      con.query(
        "insert into abonnement (dure, prix) values(?,?)",[dure,prix],
        function (err, result) {
          con.release();
          res.header("Access-Control-Allow-Origin", "*");
          res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
          res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");

          if (err) {
            res.send({ status: 1, message: "TODO update fail"+err });
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
