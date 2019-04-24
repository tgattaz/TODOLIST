/* Le Datalayer avec Mongoose  */

var client = require('mongoose');

var urlmongo = 'mongodb+srv://user:user@cluster0-zt25f.mongodb.net/todolist';

var db;

Schema = client.Schema;


/* Le schéma de la tâche  */

var TaskSchema = new Schema({

  text : String,

  date : String,

  creator : String,

  done : Boolean

});



var Task = client.model('Task', TaskSchema);


/* Le schéma de la todolist  */

var TodolistSchema = new Schema({

  name : String,

  description : String,

  creator: {

    type    : Schema.Types.ObjectId,

    ref     : 'User'

  },

  collaboraters: [

    {

        type: client.Schema.Types.ObjectId,

        ref: 'User'

    }

  ],

  tasks: [

    {

        type: client.Schema.Types.ObjectId,

        ref: 'Task'

    }

  ]

});



TodolistSchema.virtual('users', {

  ref: 'User',

  localField: '_id',

  foreignField: 'listes'

});



var Todolist = client.model('Liste', TodolistSchema);



/* Le schéma de l'utilisateur  */

bcrypt = require('bcrypt'),

SALT_WORK_FACTOR = 10,

// these values can be whatever you want - we're defaulting to a
// max of 5 attempts, resulting in a 2 hour lock

MAX_LOGIN_ATTEMPTS = 5,

LOCK_TIME = 2 * 60 * 60 * 1000;


var UserSchema = new Schema({

username: { type: String, required: true, index: { unique: true } },

password: { type: String, required: true },

loginAttempts: { type: Number, required: true, default: 0 },

lockUntil: { type: Number },

listes: [

    {
        type: client.Schema.Types.ObjectId,

        ref: 'Liste'

    }

  ]

});



UserSchema.virtual('isLocked').get(function() {

// check for a future lockUntil timestamp

return !!(this.lockUntil && this.lockUntil > Date.now());

});


UserSchema.pre('save', function(next) {

var user = this;

// only hash the password if it has been modified (or is new)

if (!user.isModified('password')) return next();


// generate a salt

bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {

    if (err) return next(err);

    // hash the password using our new salt

    bcrypt.hash(user.password, salt, function (err, hash) {

        if (err) return next(err);

        // set the hashed password back on our user document

        user.password = hash;

        next();

    });

});

});


UserSchema.methods.comparePassword = function(candidatePassword, cb) {

bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {

    if (err) return cb(err);

    cb(null, isMatch);

});

};



UserSchema.methods.incLoginAttempts = function(cb) {

// if we have a previous lock that has expired, restart at 1

if (this.lockUntil && this.lockUntil < Date.now()) {

    return this.update({

        $set: { loginAttempts: 1 },

        $unset: { lockUntil: 1 }

    }, cb);

}


// otherwise we're incrementing

var updates = { $inc: { loginAttempts: 1 } };

// lock the account if we've reached max attempts and it's not locked already

if (this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked) {

    updates.$set = { lockUntil: Date.now() + LOCK_TIME };

}

return this.update(updates, cb);

};



// expose enum on the model, and provide an internal convenience reference

var reasons = UserSchema.statics.failedLogin = {

NOT_FOUND: 0,

PASSWORD_INCORRECT: 1,

MAX_ATTEMPTS: 2

};



UserSchema.statics.getAuthenticated = function(username, password, cb) {

this.findOne({ username: username }, function(err, user) {

    if (err) return cb(err);

    // make sure the user exists

    if (!user) {

        return cb(null, null, reasons.NOT_FOUND);

    }


    // check if the account is currently locked

    if (user.isLocked) {

        // just increment login attempts if account is already locked

        return user.incLoginAttempts(function(err) {

            if (err) return cb(err);

            return cb(null, null, reasons.MAX_ATTEMPTS);

        });

    }


    // test for a matching password

    user.comparePassword(password, function(err, isMatch) {

        if (err) return cb(err);

        // check if the password was a match

        if (isMatch) {

            // if there's no lock or failed attempts, just return the user

            if (!user.loginAttempts && !user.lockUntil) return cb(null, user);

            // reset attempts and lock info

            var updates = {

                $set: { loginAttempts: 0 },

                $unset: { lockUntil: 1 }

            };

            return user.update(updates, function(err) {

                if (err) return cb(err);

                return cb(null, user);

            });

        }

        // password is incorrect, so increment login attempts before responding

        user.incLoginAttempts(function(err) {

            if (err) return cb(err);

            return cb(null, null, reasons.PASSWORD_INCORRECT);

        });

    });

});

};



var User = client.model('User', UserSchema);


// var Todolist = require('./models/Todolist');
// var User = require('./models/User');
// var Task = require('./models/Task');


/* Partie Datalayer  */


var dataLayer = {

  /* Initialisation du dataLayer  */
  init : function(cb){

    //Initialise la connexion entre l'API et notre BDD

    client.connect(urlmongo, { useNewUrlParser: true});

    db = client.connection;

    db.on('error', console.error.bind(console, 'Erreur lors de la connexion'));

    db.once('open', function (){

    console.log("Connexion à la base OK");

    });

    //callback vide

    cb();

  },



  /* Insérer une tâche  */
  insertTask : function(param,data,cb){

  Task.create({

    text : data.text,

    creator : data.creator,

    date: Date.now(),

    done : false

  }, function(err, task) {

    if (err)

      cb(err);

    Todolist.findByIdAndUpdate(param.id, {$push: {tasks: task._id}}, {'new':true}, cb);

  });

  },



  /* MàJ une tâche  */
  updateTask : function(param,data,cb) {

  Task.updateOne({

    _id : param.task_id

  },{

    text : data.text,

    creator : data.creator

  }, function(err) {

    if (err)

        cb(err);

    cb();

  });

  },



  /* Màj du booléen 'fait'  */
  updateDone : function(param,data,cb) {

  Task.updateOne({

    _id : param.task_id

  },{

    done : data.checked

  }, function(err) {

    if (err)

        cb(err);

    cb();

  });

  },



  /* Supprimer les tâches faites  */
  deleteDone : function(cb) {

  Task.deleteMany({

    done : true

  }, function(err) {

    if (err)

        cb(err);

    cb();

  });

  },



  /* Supprimer la tâche  */
  delete : function(param,cb) {

  Task.deleteOne({

    _id : param.task_id

  }, function(err) {

    if (err)

        cb(err);

    Todolist.findByIdAndUpdate(param.id, {$pull: {tasks: param.task_id}}, {'new':false}, cb);

  });

  },



  /* Récupérer l'espace  */
  getMySpace: function(param,cb) {

    User.findById(param.id).populate({path : 'listes', populate : [{path:'creator'}, {path:'collaboraters'}, {path:'tasks'}]}).then(leuser => {
      
      cb(leuser)

    });

  },



  /* Ajouter une collaboration  */
  getCollab: function(param,cb) {

    Todolist.findById(param.id).populate({path:'collaboraters'}).then(collabs => {

      cb(collabs)

    });

  },



  /* Récupérer la liste  */
  getList: function(param,cb) {

    Todolist.findById(param.id).populate('tasks').then(theliste => {cb(theliste)});

  },



  /* Ajouter une liste  */
  createList: function(param,data,cb) {

    var create = param.id;

    Todolist.create({

      name : data.name,

      description : data.description,

      creator: create

    }, function(err, list) {

      if (err)

        cb(err);

      User.findByIdAndUpdate(param.id, {$push: {listes: list._id}}, {'new':true}, cb);

    });

    },




  /* Editer une liste  */
  editList: function(param,data,cb) {

    Todolist.findByIdAndUpdate(param.id, {name: data.name, description: data.description}, cb);
    
  },




  /* Supprimer une tâche  */
  deleteList: function(param,cb){

    Todolist.findByIdAndDelete(param.id, cb);

  },

  /* Collaborer à une liste  */
  collabList: function(param,cb) {

    Todolist.findById(param.id).populate('users').then(liste=> {

      cb(liste.users);

    });

  },



  /* Créer une collaboration  */
  createCollab: function(data,cb){

    User.findOne({ username: data.name }).then(user=> {

        if(user==null) cb(false);

        User.findByIdAndUpdate(user._id, {$push: {listes: data.list_id}}, {'new':true}).then(leuser=> { Todolist.findByIdAndUpdate(data.list_id, {$push: {collaboraters: user._id}}, {'new':true}, cb);});
    
      });

  },




  /* Sortir d'une collaboration  */
  jeneveuxplus: function(data,cb){

    User.findByIdAndUpdate(data.user_id, {$pull: {listes: data.liste_id}}, {'new':true}).then(leuser=> { Todolist.findByIdAndUpdate(data.liste_id, {$pull: {collaboraters: data.user_id}}, {'new':true}, cb);});
  
  },




  /* Supprimer la collaboration complet  */
  deleteCollab: function(data,cb){
    
    User.findByIdAndUpdate(data.liste[data.lequel]._id, {$pull: {listes: data.list_id}}, {'new':true}).then(leuser=> { Todolist.findByIdAndUpdate(data.list_id, {$pull: {collaboraters: data.liste[data.lequel]._id}}, {'new':true}, cb);});
  
  },




  /* Supprimer la collaboration simple  */
  deleteCollab2: function(param,data,cb){
    
    User.findByIdAndUpdate(data._id, {$pull: {listes: param.id}}, {'new':true}, cb);
  
  },




  /* Créer un utilisateur  */
  createUser : function(data,cb) {
  
    // create a user a new user
  
    var newUser = new User({
  
      username: data.username,
      password: data.password
  
    });

  // save user to database
  newUser.save({}, function(err) {
  
  if (err)
    
    cb(err);
  
   cb();
  
  });
 
  },




  /* Connexion d'un utilisateur  */
  connectUser: function(data,cb) {

  // attempt to authenticate user

  User.getAuthenticated(data.username, data.password, function(err, user, reason) {

  if (err)

    cb(null, err);

  // login was successful if we have a user

  if (user) {

    // handle login success

    cb(user, null);

    return;
  }

  // otherwise we can determine why we failed

  var reasons = User.failedLogin;

  switch (reason) {

    case reasons.NOT_FOUND:

      cb(null, 'Utilisateur non trouvé ou mot de passe incorrect');

      return;

    case reasons.PASSWORD_INCORRECT:

      cb(null, 'Utilisateur non trouvé ou mot de passe incorrect');

      return;

        // note: these cases are usually treated the same - don't tell
        // the user *why* the login failed, only that it did
        //break;

    case reasons.MAX_ATTEMPTS:

      cb(null, "Tu as atteints la limite d'essais de connexion");

      return;

        // send email or otherwise notify user that account is
        // temporarily locked
        //break;

  }

  });

  }

}

module.exports = dataLayer;