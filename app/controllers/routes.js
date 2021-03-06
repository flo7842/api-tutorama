
const checkEmailAndPass = require('../middlewars/CheckEmailAndPass.js');
var todo = require('../models/todo');

module.exports = {
  

  configure: function(app) {

  
    app.post('/register', checkEmailAndPass, (req, res) =>{
      todo.reqgister(req.body.nom, req.body.prenom,req.body.email, req.body.avatar, req.body.age,req.body.numeroTel, req.body.numeroRue, req.body.batiment, req.body.code_Postale, req.body.libelle,req.body.password,req, res);
   
    });
    app.post('/perdu', (req, res) =>{
      todo.motdepasseoublie(req.body.email,req, res);
   
    });
    // this.addabonnent= function ( dure,prix, req,res) 
    app.post('/abonnement', function(req, res){
      todo.suivrecour(req.body.utilisateur, req.body.cour,req, res);
    });
    app.post('/suivre/abonnement', function(req, res){
      todo.abonnement(req.body.dure, req.body.prix,req, res);
    });
    app.post('/video/cour', function(req, res){
      todo.addvideocour(req.body.idvideo, req.body.idcour,req, res);
    });
    app.post('/login', checkEmailAndPass, function(req, res){
      todo.reqlogin(req.body.email, req.body.password,req, res);
    });
    app.post('/changepass', checkEmailAndPass, function(req, res){
      todo.reqpassword(req.body.email, req.body.password,req.body.nouveau,req, res);
    });
    app.post('/adduser', function(req, res){
      todo.adduser(req.body.email,req.body.avatar, req.body.age, req.body.numeroTel, req.body.numeroRue, req.body.batiment, req.body.codePostale, req.body.libelle,req, res);
    });
  
    //categorie
    app.post('/addcour', function(req, res){
      todo.addcour(req.body.image,req.body.Auteur, req.body.Etoile, req.body.Contenu, req.body.prix,req.body.video, req, res);
    });
    app.post('/updateadmin', function(req, res){
      todo.updateadmin(req.body.email,req.body.statut, req, res);
    });
    app.post('/addcategorie', function(req, res){
      todo.categorie(req.body.nom, req.body.age, req.body.sousCategorie, req, res);
    });
    app.post('/appartenir/categorie', function(req, res){
      todo.appartenir(req.body.idCategorie, req.body.idCour,req, res);
    });
    app.post('/addvideo', function(req, res){
      todo.addvideo(req.body.nom, req.body.path,req.body.image,req, res);
    });
    app.post('/addpanier', function(req, res){
      todo.addpanier(req.body.idUtilisateur, req.body.idCour,req, res);
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
    app.get('/panier/:email', function(req, res){
      todo.getpanierparuser(req.params.email, res)
    });
    app.get('/paniertout', function(req, res){
      todo.getpaniertout( res)
    });
    app.get('/categorieTout', function(req, res){
      todo.getcategorieTout( res)
    });
    app.get('/categoriePromo', function(req, res){
      todo.getcategoriePromo( res)
    });
    app.get('/categorieMieuxNote', function(req, res){
      todo.getcategorieMieuxNote( res)
    });
    app.get('/courCategorie/:Categorie', function(req, res){
      todo.getcategorieNom( req.params.Categorie,res)
    });
    app.get('/categorie/:utilisateur', function(req, res){
      todo.getcategorieEmail( req.params.utilisateur,res)
    });
    app.get('/usertout', function(req, res){
      todo.getusertout( res)
    });
    app.get('/utilisateur/:email', function(req, res){
      todo.getuserparemail( req.params.email, res)
    });
    app.get('/user/:email', function(req, res){
      todo.getcourparmail( req.params.email, res)
    });
    app.get('/courtout', function(req, res){
      todo.getcourtout( res)
    });
    app.get('/cour/:email', function(req, res){
      todo.getcourparmail( req.params.email,res)
    });
    app.get('/promo', function(req, res){
      todo.getpromo(res)
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
    app.get('/cours', function(req, res){
      todo.getcours(res)
    });
    app.get('/todo/:id',function(req,res) {
      todo.getByID(req.params.id,res);
    });
    app.get('/promotion',function(req,res) {
      todo.getcourpromotion(res);
    });
    app.get('/mieunote',function(req,res) {
      todo.getcourmieuxnote(res);
    });
    app.post('/delete/:id',function(req,res) {
      todo.delete(req.params.id,res);
    });
    app.post('/delete/tout',function(req,res) {
      todo.deletetout(req,res);
    });
  }
};
