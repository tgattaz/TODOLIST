var router = require('express').Router();

var Liste = require('./model');

router.get('/', function(req, res) {
  res.sendFile('./public/index.html');
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

router.delete('/api/laliste', function(req, res) {
    Liste.deleteMany({}, function(err, liste) {
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