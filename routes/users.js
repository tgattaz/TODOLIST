var router = require('express').Router();
var dataLayer = require('../dataLayer');

router.get('/getTaskSet', function(req, res) {
  param = req.params;
  if (!param.id)
    param.id = "5cb6f06feba3f51f984609c6";
  dataLayer.getList(param,function(result){
    res.send(result);
  });
});

router.post('/connectUser', function(req, res) {
  data = req.body;
  dataLayer.connectUser(data,function(user,result){
    if (result==null){
      res.send(user._id);
    } else {
      res.send(result);
    }
  });
});


router.get('/', function(req, res) {
  res.render('users/index.html');
});

router.get('/registration', function(req, res) {
  res.render('users/registration.html');
});

router.get('/confirmation', function(req, res) {
  res.render('users/confirmation.html');
});

router.post('/newUser', function(req, res){
  data = req.body;
  dataLayer.createUser(data,function(result){
    res.send(result);
  });
});



router.post('/collab/:id', function(req, res) {
  param = req.params;
  dataLayer.getCollab(param,function(result){
    res.send(result);
  });
});

router.post('/collabList', function(req, res) {
  data = req.body;
  dataLayer.createCollab(data,function(result){
    res.send(result);
  });
});

router.post('/decollabList', function(req, res) {
  data = req.body;
  dataLayer.deleteCollab(data,function(result){
    res.send(result);
  });
});

router.post('/decollabListmobile', function(req, res) {
  data = req.body;
  dataLayer.deleteCollabmobile(data,function(result){
    res.send(result);
  });
});

router.get('/:id', function(req, res) {
  param = req.params;
  dataLayer.getMySpace(param,function(result){
    res.render('users/espace.html', { user: result, id : param.id });
  });
});

router.get('/mobile/:id', function(req, res) {
  param = req.params;
  dataLayer.getMySpace(param,function(result){
    res.send(result);
  });
});

router.post('/jeneveuxplus/:liste_id/:user_id', function(req, res) {
  param = req.params;
  dataLayer.jeneveuxplus(param,function(result){
    res.send(result);
  });
});

router.post('/veuxplus', function(req, res) {
  data = req.body;
  dataLayer.jeneveuxplus(data,function(result){
    res.send(result);
  });
});

module.exports = router;