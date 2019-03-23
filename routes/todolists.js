var router = require('express').Router();

var Liste = require('../models/Todolist');

router.get('/', function(req, res) {
  res.render('todolists/index.html');
});


router.get('/api/laliste', function(req, res) {
  Liste.find(function(err, laliste) {
      if (err)
          res.send(err)
      res.json(laliste);
  });
});

router.post('/api/laliste', function(req, res) {
  Liste.create({
      text : req.body.text,
      creator : req.body.creator,
      date: Date.now(),
      done : false
  }, function(err, liste) {
      if (err)
          res.send(err);
      Liste.find(function(err, laliste) {
          if (err)
              res.send(err)
          res.json(laliste);
      });
  });
});

router.post('/api/laliste/:liste_id', function(req, res) {
        Liste.updateOne({
            _id : req.params.liste_id
        },{
            text : req.body.text,
            creator : req.body.creator
        }, function(err, liste) {
            if (err)
                res.send(err);
            Liste.find(function(err, laliste) {
                if (err)
                    res.send(err)
                res.json(laliste);
            });
        });
    });

    router.post('/api/laliste/done/:liste_id', function(req, res) {
        Liste.updateOne({
            _id : req.params.liste_id
        },{
            done : req.body.checked
        }, function(err, liste) {
            if (err)
                res.send(err);
            Liste.find(function(err, laliste) {
                if (err)
                    res.send(err)
                res.json(laliste);
            });
        });
  });

router.delete('/api/laliste', function(req, res) {
    Liste.deleteMany({
        done : true
    }, function(err, liste) {
        if (err)
            res.send(err);
        Liste.find(function(err, laliste) {
            if (err)
                res.send(err)
            res.json(laliste);
        });
    });
  });

router.delete('/api/laliste/:liste_id', function(req, res) {
  Liste.deleteOne({
      _id : req.params.liste_id
  }, function(err, liste) {
      if (err)
          res.send(err);
      Liste.find(function(err, laliste) {
          if (err)
              res.send(err)
          res.json(laliste);
      });
  });
});

module.exports = router;