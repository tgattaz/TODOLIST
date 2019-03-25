

var dataLayer = {
  init : function(cb){
    //Initialize connection once
    client.connect(function(err) {
      if(err) throw err;
      db = client.db("Poly");
      cb();
    });
  },

getTaskSet : function(cb){
  db.collection("Tasks").find({}).toArray(function(err, docs){
  cb.docs;
  });
},

insertTask : function(task,cb){
  db.collection("Tasks").insertOne(task, function(err, result) {
    cb();
  });
}


}
module.exports = dataLayer;