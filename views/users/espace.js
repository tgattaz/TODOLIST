/* SECONDE PAGE DE L'APPLICATION - L'ESPACE UTILISATEUR */
var ListeGestion = angular.module('ListeGestion', []);

function mainController($scope, $http, $location) {

  $scope.listData = {};
  $scope.collabData = {};

  // Identifiant de l'utilisateur, récupéré en paramètre de la page 
  var identifiant = document.getElementById('id').innerHTML;
  var collab_list;

  /* Création d'une liste */
  $scope.createList = function() {

    if (document.getElementById('create-list').innerHTML=='Ajouter une liste') {

        //Réinitialisation du formulaire 
        $scope.listData.name = '';
        $scope.listData.description = '';

        //Affichage des élements visuels lors d'une modification
        document.getElementById('listname_label').style.display = "block";
        document.getElementById('listname').style.display = "block";
        document.getElementById('listdesc_label').style.display = "block";
        document.getElementById('listdesc').style.display = "block";

        document.getElementById('create-list').innerHTML='✔';

    }
    else {

      //Réinitialisation des élements visuels en normal
      document.getElementById('listname_label').style.display = "none";
      document.getElementById('listname').style.display = "none";
      document.getElementById('listdesc_label').style.display = "none";
      document.getElementById('listdesc').style.display = "none";

      document.getElementById('create-list').innerHTML='Ajouter une liste';

      //Requête pour ajouter une liste
        $http.post('todolists/api/laliste/create/'+identifiant, $scope.listData)
        .success(function(data) {

            console.log(data);

            //Rechargement de la page
            window.location.replace("/"+identifiant);

        })
        .error(function(data) {

            console.log('Error: ' + data);
        });
    };
};


  /* Supprimer une liste */
  $scope.deleteList = function(param) {

    //Requête pour supprimer la liste
    $http.delete('todolists/api/laliste/delete/'+identifiant+'/'+param)
    .success(function(data) {

      console.log(data);

      //Rechargement de la page
      window.location.replace("/"+identifiant);

    })
    .error(function(data) {

        console.log('Error: ' + data);
    });
  };



  /* Ajouter des collaborateurs à sa liste */
  $scope.createCollab = function() {

    //Requête pour ajouter un collaborateur sur la base de son nom
    $http.post('collabList', $scope.collabData)
      .success(function(result) {

        //L'utilisateur n'a pas été trouvé dans la BDD
        if (result=='false'){

          //Réponse négative - échec de la collaboration
          document.getElementById('result').color='red';

          document.getElementById('result').innerHTML="Collaboration échouée, pas d'utilisateur "+$scope.collabData.name+" trouvé.";
        
        } else {

          //Réponse positive - la collaboration a été mise en place
          document.getElementById('result').color='green';

          document.getElementById('result').innerHTML="Collaboration créee avec "+$scope.collabData.name+".";

          //Rechargement de la page
          setTimeout(window.location.replace("/"+identifiant), 2000);

        }
      })
      .error(function(data) {

          console.log('Error: ' + data);
      });
  };



  /* Ouverture de la fenêtre pour ajouter un collaborateur */
  $scope.addCollab = function(list_id,longueur) {

    for (pas = 1; pas <= longueur; pas++) {

      //Blocage des élements visuels
      document.getElementById("add-collab-"+pas).disabled =true;
    }

    //Affichage de la fenêtre
    document.getElementById('collab-tab').style.display = "block";

    //On passe l'identifiant de la liste concernée
    $scope.collabData.list_id=list_id;
  };



  /* Fermeture de la fenêtre pour ajouter un collaborateur */
  $scope.fermerCollab = function(longueur) {

    for (pas = 1; pas <= longueur; pas++) {

      //Réinitialisation des élements visuels
      document.getElementById("add-collab-"+pas).disabled =false;
    }

    document.getElementById('result').innerHTML="";

    //Fermeture de la fenêtre
    document.getElementById('collab-tab').style.display = "none";

  };


  /* Supprimer des collaborateurs de sa liste (un ou plusieurs) */
  $scope.deleteCollab = function(longueur) {

    //Boucle sur la tab des collaborateurs
    for(i=0; i<longueur; i++){

      //Si cet utilisateur à été sélectionner pour être supprimer
      if(document.getElementById('decollab-'+i).className=="badge badge-danger"){

        //On récupérer son index dans la tab des collaborateurs
        $scope.collabData.lequel = i;

        //Requête pour le supprimer 
        $http.post('decollabList', $scope.collabData);

      }

      //Rechargement de la page
      setTimeout(window.location.reload("/"+identifiant), 2000);

    };
  };


  /* Choisir les collaborateurs à supprimer */
  $scope.chooseDecollab = function(index, identifiant) {

    //Si non sélectionné
    if(document.getElementById('decollab-'+index).className=="badge badge-success"){

      //Sélection
      document.getElementById('decollab-'+index).className ="badge badge-danger";

    } else {

      //Désélection
      document.getElementById('decollab-'+index).className ="badge badge-success";

    }
  };



  /* Ouverture de la fenêtre pour supprimer un collaborateur */
  $scope.removeCollab = function(list_id,longueur) {

    //Requête pour aller récupérer tous les collaborateurs existant sur la bas de l'identifiant de la liste considérée
    $http.post('collab/'+list_id)
      .success(function(result) {

        //Récupération en local de cette liste de collaborateurs pour affichage
        $scope.collabData.liste=result.collaboraters;

      })
      .error(function(data) {

          console.log('Error: ' + data);
      });

    //Initialisation des visuels
    for (pas = 1; pas <= longueur; pas++) {

      document.getElementById("remove-collab-"+pas).disabled =true;
    }

    document.getElementById('decollab-tab').style.display = "block";

    //On passe l'identifiant de la liste concernée
    $scope.collabData.list_id=list_id;

  };



  /* Fermeture de la fenêtre pour supprimer un collaborateur */
  $scope.fermerDecollab = function(longueur) {

    //Réinitialisation des visuels
    for (pas = 1; pas <= longueur; pas++) {

      document.getElementById("remove-collab-"+pas).disabled =false;
    }

    document.getElementById('decollab-tab').style.display = "none";

    document.getElementById('result').innerHTML="";

  };



  /* Chosir de quitter une liste où l'on est un collaborateur */
  $scope.jeneveuxplus = function(list_id) {

    //Requête pour choisir de quitter sa collaboration en cours dans une liste spécifique
    $http.post('jeneveuxplus/'+list_id+'/'+identifiant)
      .success(function(result) {

        //Rechargement de la page
        setTimeout(window.location.reload("/"+identifiant), 2000);
        
      })
      .error(function(data) {

          console.log('Error: ' + data);
      });
  };

}


