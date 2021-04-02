
const checkEmailAndPass = require('../middlewars/CheckEmailAndPass.js');
var todo = require('../models/todo');

module.exports = {
  

  configure: function(app) {

  
    app.post('/register', checkEmailAndPass, (req, res) =>{
      todo.reqgister(req.body.email, req.body.password,req, res);
   
    });

    app.post('/login', checkEmailAndPass, function(req, res){
      todo.reqlogin(req.body.email, req.body.password,req, res);
    });
    app.post('/adduser', function(req, res){
      todo.adduser(req.body.avatar, req.body.age, req.body.numeroTel, req.body.numeroRue, req.body.batiment, req.body.codePostale, req.body.libelle,req, res);
    });
    app.get('/panier', function(req, res){
      todo.reqlogin(req.body.email, req.body.password,req, res);
    });
    
    app.post('/panier', function(req, res){
      todo.reqlogin(req.body.email, req.body.password,req, res);
    });
    app.post('/addcour', function(req, res){
      todo.addcour(req.body.Auteur, req.body.Etoile, req.body.Conetenu, req.body.prix, req, res);
    });
    app.post('/addvideo', function(req, res){
      todo.addvideo(req.body.nom, req.body.path,req.body.image,req, res);
    });
    app.post('/addpanier', function(req, res){
      todo.addpanier(req.body.idUser, req.body.idArticle,req, res);
    });
    app.post('/addcour/panier', function(req, res){
      todo.addcomposercour(req.body.idPanier, req.body.idCour,req, res);
    });
    app.post('/deconnexion', function(req, res){
      todo.reqdeconnexion(req,res);
    });
    
    app.get('/email', function(req, res){
      todo.getemail(res)
    });
    
    app.post('/envoi', function(req,res){
      todo.envoi(req.body.message,res);
    });
   
    app.post('/send',function(req,res) {
      envoi(req.aqui, req.sujet, req.message,res);
    });
    app.get('/todo',function(req,res) {
      todo.get(res);
    });
    app.get('/todo/:id',function(req,res) {
      todo.getByID(req.params.id,res);
    });
    app.post('/delete/:id',function(req,res) {
      todo.delete(req.params.id,res);
    });
    app.post('/delete/tout',function(req,res) {
      todo.deletetout(req,res);
    });
  }
};
