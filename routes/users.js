/* Routes des utlisateurs  */

var router = require('express').Router();

var dataLayer = require('../dataLayer');


/* Route pour récupérer les tâches de la liste de fond-d'écran de l'app mobile */
router.get('/getTaskSet', function(req, res) {

  param = req.params;

  if (!param.id)

    param.id = "5cc07a3eb47eea001719b0fa";

  dataLayer.getList(param,function(result){

    res.send(result);

  });

});


/* Route de connexion de l'utilisateur */
router.post('/connectUser', function(req, res) {

  data = req.body;

  console.log(data);

  dataLayer.connectUser(data,function(user,result){

    if (result==null){

      res.send(user._id);

    } else {

      res.send(result);

    }

  });

});




/* Route root pour aller sur la page de connexion */
router.get('/', function(req, res) {

  res.render('users/index.html');

});



/* Route pour s'inscrire au service */
router.get('/registration', function(req, res) {

  res.render('users/registration.html');

});



/* Route de confirmation de l'inscription */
router.get('/confirmation', function(req, res) {

  res.render('users/confirmation.html');

});



/* Route de création d'un utilisateur */
router.post('/newUser', function(req, res){

  data = req.body;

  dataLayer.createUser(data,function(result){

    res.send(result);

  });

});



/* Route de récupération des collaborateurs pour une liste spécifique */
router.post('/collab/:id', function(req, res) {

  param = req.params;

  dataLayer.getCollab(param,function(result){

    res.send(result);

  });

});



/* Route pour créer une nouvelle collaboration */
router.post('/collabList', function(req, res) {

  data = req.body;

  dataLayer.createCollab(data,function(result){

    res.send(result);

  });

});



/* Route pour supprimer une collaboration */
router.post('/decollabList', function(req, res) {

  data = req.body;

  dataLayer.deleteCollab(data,function(result){

    res.send(result);

  });

});



/* Route pour supprimer une collaboration (version mobile) */
router.post('/decollabListmobile', function(req, res) {

  data = req.body;

  dataLayer.deleteCollabmobile(data,function(result){

    res.send(result);

  });

});



/* Route pour récupérer son espace */
router.get('/:id', function(req, res) {

  param = req.params;

  dataLayer.getMySpace(param,function(result){

    res.render('users/espace.html', { user: result, id : param.id });

  });

});



/* Route pour récupérer son espace (version mobile) */
router.get('/mobile/:id', function(req, res) {

  param = req.params;

  dataLayer.getMySpace(param,function(result){

    res.send(result);

  });

});



/* Route pour sortir d'une collaboration */
router.post('/jeneveuxplus/:liste_id/:user_id', function(req, res) {

  param = req.params;

  dataLayer.jeneveuxplus(param,function(result){

    res.send(result);

  });

});



/* Route pour sortir d'une collaboration (version mobile) */
router.post('/veuxplus', function(req, res) {

  data = req.body;

  dataLayer.jeneveuxplus(data,function(result){

    res.send(result);

  });

});

module.exports = router;