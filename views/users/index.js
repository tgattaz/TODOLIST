var Connexion = angular.module('Connexion', []);

function mainController($scope, $http) {
  $scope.coData = {};
  $scope.result = {};
  $scope.response = {};

  $scope.connectUser = function() {
    $http.post('/connectUser', $scope.coData)
        .success(function(data) {
            $scope.response.text = data;
            if (data!="Utilisateur non trouvé ou mot de passe incorrect" && data!="Tu as atteints la limite d'essais de connexion"){
                $scope.response.text = 'Bonjour ' + $scope.coData.username + ' ! Redirection sur votre espace en cours ...';
                $scope.coData = {};
                $scope.response.color = 'green';
                setTimeout(function(){
                    window.location.replace('/'+data.replace(/^"(.*)"$/, '$1'));
                }, 2000);
            } else {
                $scope.response.color = 'red';
            };
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
};
}