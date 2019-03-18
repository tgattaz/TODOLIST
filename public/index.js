// public/core.js
var ListeaFaire = angular.module('ListeaFaire', []);

function mainController($scope, $http) {
    $scope.formData = {};

    // when landing on the page, get all todos and show them
    $http.get('/api/laliste')
        .success(function(data) {
            $scope.laliste = data;
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    // when submitting the add form, send the text to the node API
    $scope.createTodo = function() {
        $http.post('/api/laliste', $scope.formData)
            .success(function(data) {
                $scope.formData = {}; // clear the form so our user is ready to enter another
                $scope.laliste = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    $scope.modifyTodo = function(id) {
        $http.delete('/api/laliste/' + id)
            .success(function(data) {
                $scope.laliste = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    // delete a todo after checking it
    $scope.deleteTodo = function(id) {
        $http.delete('/api/laliste/' + id)
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    // delete a todo after checking it
    $scope.deleteAll = function() {
        $http.delete('/api/laliste')
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    $scope.formatDate = function(date){
        var dateOut = new Date(date);
        return dateOut;
    };

}