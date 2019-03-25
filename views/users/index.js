var Connexion = angular.module('Connexion', []);

function mainController($scope, $http) {
  $scope.coData = {};

  $scope.connectUser = function() {
    $http.post('/connectUser', $scope.coData)
        .success(function(data) {
            $scope.coData = {}; // clear the form so our user is ready to enter another
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
};


}