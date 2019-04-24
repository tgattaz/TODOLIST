/* Routes des todolists  */

var router = require('express').Router();

var dataLayer = require('../dataLayer');


/* Route pour se rendre sur la page d'affichage de la liste  */
router.get('/', function(req, res) {

  res.render('todolists/index.html');

});



/* Route pour se rendre sur la page d'affichage de la liste v2  */
router.get('/#?list=:id', function(req, res) {

    res.render('todolists/index.html');

  });



/* Route pour récupérer la todolist  */
router.get('/api/laliste/:id', function(req, res) {

    param = req.params;

    dataLayer.getList(param,function(result){

      res.send(result);

    });

});





/* Route pour créer une liste  */
router.post('/api/laliste/create/:id', function(req, res) {

    data = req.body;

    param = req.params;

    dataLayer.createList(param,data,function(result){res.send(result)});
    
});




/* Route pour éditer une liste  */
router.post('/api/laliste/edit/:id', function(req, res) {

    data = req.body;

    param = req.params;

    dataLayer.editList(param,data,function(){

        dataLayer.getList(param,function(result){

            res.send(result);

        });

    });

});




/* Route pour supprimer une liste  */
router.delete('/api/laliste/delete/:user/:id', function(req, res) {

    param = req.params;

    dataLayer.collabList(param,function(result){

        for(i=0; i<result.length; i++){

            dataLayer.deleteCollab2(param,result[i]);

        };

        dataLayer.deleteList(param,function(result){

            res.send(result);

        });

    });

});



/* Route pour supprimer une liste (version mobile) */
router.delete('/api/laliste/mdelete/:id', function(req, res) {

    param = req.params;

    dataLayer.deleteList(param,function(result){

        res.send(result);

    });

});



/* Route pour éditer une tâche  */
router.post('/api/laliste/:id/:task_id', function(req, res) {

    data = req.body;

    param = req.params;

    dataLayer.updateTask(param,data,function(){

        dataLayer.getList(param,function(result){

            res.send(result);

        });

    });

});





/* Route pour insérer une tâche  */
router.post('/api/laliste/:id', function(req, res) {

    data = req.body;

    param = req.params;

    dataLayer.insertTask(param,data,function(){

        dataLayer.getList(param,function(result){

            res.send(result);

        });

    });

});




/* Route pour changer le Booléen 'fait' une tâche  */
router.post('/api/laliste/done/:id/:task_id', function(req, res) {

    data = req.body;

    param = req.params;

    dataLayer.updateDone(param,data,function(){

        dataLayer.getList(param,function(result){

            res.send(result);

        });

    });

});



/* Route pour supprimer les tâches faites  */
router.delete('/api/laliste/:id', function(req, res) {

    dataLayer.deleteDone(function(){

        dataLayer.getList(param,function(result){

            res.send(result);

        });

    });

});



/* Route pour supprimer une tâche  */
router.delete('/api/laliste/:id/:task_id', function(req, res) {

    param = req.params;

    dataLayer.delete(param,function(){

        dataLayer.getList(param,function(result){

            res.send(result);

        });

    });

});



module.exports = router;