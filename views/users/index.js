var Connexion = angular.module('Connexion', []);

function mainController($scope, $http) {
  $scope.coData = {};
  $scope.response = {};

  $scope.connectUser = function() {
    $http.post('/connectUser', $scope.coData)
        .success(function(data) {
            $scope.coData = {}; // clear the form so our user is ready to enter another
            $scope.response.text = data + ', redirection sur votre espace ...';
            if (data == 'Connexion avec succès'){
                $scope.response.color = 'green';
            } else {
                $scope.response.color = 'red';
            };
            setTimeout(function(){
                window.location.replace("/todolists");
            }, 2000);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
};


}