/* PREMIERE PAGE DE L'APPLICATION - CONNEXION*/
var Connexion = angular.module('Connexion', []);

function mainController($scope, $http) {

  $scope.coData = {};
  $scope.result = {};
  $scope.response = {};

    /* Connexion de l'utilisateur */
  $scope.connectUser = function() {

      console.log($scope.coData);

    $http.post('/connectUser', $scope.coData)

        .success(function(data) {

            $scope.response.text = data;

            //Afficher la réponse en fonction du résultat de la requête
            if (data!="Utilisateur non trouvé ou mot de passe incorrect" && data!="Tu as atteints la limite d'essais de connexion"){
                
                $scope.response.text = 'Bonjour ' + $scope.coData.username + ' ! Redirection sur votre espace en cours ...';
                //On met en place un cookie pour savoir qui se connecte

                setCookie('username', $scope.coData.username, 0.01);
                $scope.coData = {};
                $scope.response.color = 'green';

                setTimeout(function(){

                    //On redirige sur l'espace utilisateur
                    window.location.replace('/'+data.replace(/^"(.*)"$/, '$1'));

                }, 2000);

            } else {

                //Si réponse d'erreur
                $scope.response.color = 'red';
            };
        })
        .error(function(data) {

            console.log('Error: ' + data);

        });
};
}

/* Fonction pour mettre en place un cookie */
function setCookie(cname, cvalue, exdays) {

    var d = new Date();

    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));

    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    
    console.log('je te fais un cookie');
  }