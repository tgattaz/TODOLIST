var Inscription = angular.module('Inscription', []);

function mainController($scope, $http) {
  $scope.insData = {};

  $scope.createUser = function() {
    $http.post('/newUser', $scope.insData)
        .success(function(data) {
            $scope.insData = {}; // clear the form so our user is ready to enter another
            window.location.replace("/confirmation");
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
};


}