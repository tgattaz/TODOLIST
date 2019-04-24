// TROISIEME PAGE DE L'APPLICATION - AFFICHAGE D'UNE LISTE
var ListeaFaire = angular.module('ListeaFaire', []);

function mainController($scope, $http, $location) {

    //Paramètre identifiant de la liste pour les requêtes

    var url = $location.search().list;

    // $scope.url = $location.search().list;


    //Identifiant de l'utilisateur via le cookie set à la connexion

    var cookie_username = getCookie('username');
    $scope.formData = {};
    $scope.formData.creator = cookie_username;


    // Initialisation des arrays pour les formulaires

    $scope.modifyData = {};

    $scope.listData = {};

    $scope.doneData = {};

    $scope.laliste = {};



    /* Requête pour récupérer le contenu de la liste */
    $http.get('api/laliste/'+url)
        .success(function(res) {

            //Je récupère le contenu de la liste et je la stocke
            $scope.laliste = res;

            console.log($scope.laliste);
        })
        .error(function(data) {

            console.log('Error: ' + data);
        });




    /* Création d'une tâche dans la liste */
    $scope.createTodo = function() {

        // Requête pour créer
        $http.post('api/laliste/'+url, $scope.formData)
            .success(function(data) {

                $scope.formData = {}; // clear the form so our user is ready to enter another

                // Je récupère la liste MàJ
                $scope.laliste = data;

                console.log(data);
            })
            .error(function(data) {

                console.log('Error: ' + data);
            });
    };



    /* Fonction pour éditer la liste */
    $scope.editList = function() {

        //Si pas encore en modification
        if (document.getElementById('modify-list').innerHTML=='Modifier la liste') {

            //Stockage des paramètres de la liste à modifier pour le formulaire
            $scope.listData.name = $scope.laliste.name;
            $scope.listData.description = $scope.laliste.description;

            //Initialisation des élements visuels
            document.getElementById('listname').style.display = "none";

            document.getElementById('listname_modify').style.display = "block";


            document.getElementById('listdesc').style.display = "none";

            document.getElementById('listdesc_modify').style.display = "block";

            //document.getElementById('delete-list').disabled =true;

            document.getElementById('modify-list').innerHTML='✔';
        }
        //Si modification terminée
        else {

            //Réinitialisation des élements visuels
            document.getElementById('listname').style.display = "block";

            document.getElementById('listname_modify').style.display = "none";


            document.getElementById('listdesc').style.display = "block";

            document.getElementById('listdesc_modify').style.display = "none";

            //document.getElementById('delete-list').disabled =false;

            document.getElementById('modify-list').innerHTML='Modifier';

            // Requête pour éditer 
            $http.post('api/laliste/edit/'+url, $scope.listData)
            .success(function(data) {

                $scope.laliste = data;

                console.log(data);
            })
            .error(function(data) {

                console.log('Error: ' + data);
            });
        };
    };



    /* Fonction pour modifier une tâche précise de la liste */
    $scope.modifyTodo = function(index, x) {

        //Si pas encore en modification
        if (document.getElementById('modify-'+index).innerHTML=='Modifier') {

            //Réinitialisation des élements visuels pour toutes les tâches de la liste
            for (pas = 0; pas < $scope.laliste.length; pas++) {

                document.getElementById('xcreatormodify-'+pas).style.display = "none";

                document.getElementById('xtextmodify-'+pas).style.display = "none";


                document.getElementById('xcreator-'+pas).style.display = "block";

                document.getElementById('xtext-'+pas).style.display = "block";


                document.getElementById('done-'+pas).disabled =false;

                document.getElementById('delete-'+pas).disabled =false;

                document.getElementById('modify-'+pas).innerHTML='Modifier';
            }

            //Stockage des paramètres de la tâche à modifier pour le formulaire
            $scope.modifyData.text = x.text;
            $scope.modifyData.creator = x.creator;

            //Initialisation des élements visuels
            document.getElementById('xcreatormodify-'+index).style.display = "block";

            document.getElementById('xtextmodify-'+index).style.display = "block";

            document.getElementById('xcreator-'+index).style.display = "none";

            document.getElementById('xtext-'+index).style.display = "none";

            document.getElementById('done-'+index).disabled =true;

            document.getElementById('delete-'+index).disabled =true;

            document.getElementById('modify-'+index).innerHTML='✔';

        }

        //Si modification terminée
        else {

            //Réinitialisation des élements visuels
            document.getElementById('xcreatormodify-'+index).style.display = "none";

            document.getElementById('xtextmodify-'+index).style.display = "none";

            document.getElementById('xcreator-'+index).style.display = "block";

            document.getElementById('xtext-'+index).style.display = "block";

            document.getElementById('done-'+index).disabled =false;

            document.getElementById('delete-'+index).disabled =false;

            document.getElementById('modify-'+index).innerHTML='Modifier';


            //Requête pour éditer
            $http.post('api/laliste/'+url+'/'+ x._id, $scope.modifyData)
            .success(function(data) {

                $scope.laliste = data;

                console.log(data);
            })
            .error(function(data) {

                console.log('Error: ' + data);
            });
        };
    };



    /* Fonction pour cocher/décocher une tâche */
    $scope.isChecked = function(index, x) {

        //Stockage de la valeur actuelle du la checkbox
        $scope.modifyData.checked = document.getElementById('done-'+index).checked;

        //Reqûete pour inverser la valeur du Boolean
        $http.post('api/laliste/done/' + url + '/' + x._id, $scope.modifyData)
        .success(function(data) {

            //Stockage de la liste MàJ
            $scope.laliste = data;

            console.log(data);
        })
        .error(function(data) {

            console.log('Error: ' + data);
        });

    };




    /* Fonction pour supprimer une tâche */
    $scope.deleteTodo = function(id) {

        //Reqûete pour supprimer 
        $http.delete('api/laliste/' + url + '/' + id)
        .success(function(data) {

            //Stockage de la liste MàJ
            $scope.laliste = data;

            console.log(data);
        })
        .error(function(data) {

            console.log('Error: ' + data);
        });
    };




    /* Fonction pour supprimer toutes les tâches faites */
    $scope.deleteAll = function() {

        //Reqûete pour supprimer tout
        $http.delete('api/laliste/'+ url)
        .success(function(data) {

            //Stockage de la liste MàJ
            $scope.laliste = data;

            console.log(data);
        })
        .error(function(data) {

            console.log('Error: ' + data);
        });
    };



    /* Fonction pour choisir un nom personnalisé lors de la publication de la tâche */
    $scope.persoNom = function() {

        //Si choix de modification
        if (document.getElementById('change-name').innerHTML=='+Nom') {

            //J'écrase l'ancienne valeur
            $scope.formData.creator = "";

            //Initialisation des élements visuels
            document.getElementById('change-name-div').style.display = "block";

            document.getElementById('change-name').innerHTML='⌫';
        }

        //Si choix de garder le nom d'utilisateur par défault
        else {

            //Retour à l'username du compte par défault
            $scope.formData.creator = cookie_username;

            //Réinitialisation des élements visuels
            document.getElementById('change-name-div').style.display = "none";

            document.getElementById('change-name').innerHTML='+Nom';
        };

    };



    /* Fonction afficher proprement la date sur l'IHM */
    $scope.formatDate = function(date){

        //Nouvelle variable de type Date que l'on retourne
        var dateOut = new Date(date);

        return dateOut;
    };

}

//Partie Javascript pur

//Fonction pour récupérer un cookie existant
function getCookie(cname) {

    var name = cname + "=";

    var decodedCookie = decodeURIComponent(document.cookie);

    var ca = decodedCookie.split(';');

    for(var i = 0; i <ca.length; i++) {

      var c = ca[i];

      while (c.charAt(0) == ' ') {

        c = c.substring(1);
      }

      if (c.indexOf(name) == 0) {

        return c.substring(name.length, c.length);
      }
    }

    return "";
  }