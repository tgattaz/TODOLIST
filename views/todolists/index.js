var ListeaFaire = angular.module('ListeaFaire', []);

function mainController($scope, $http, $location) {

    var url = $location.search().list;
    // $scope.url = $location.search().list;
    $scope.formData = {};
    $scope.modifyData = {};
    $scope.listData = {};
    $scope.doneData = {};
    $scope.laliste = {};

    // when landing on the page, get all todos and show them
    $http.get('api/laliste/'+url)
        .success(function(res) {
            $scope.laliste = res;
            console.log($scope.laliste);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    // when submitting the add form, send the text to the node API
    $scope.createTodo = function() {
        $http.post('api/laliste/'+url, $scope.formData)
            .success(function(data) {
                $scope.formData = {}; // clear the form so our user is ready to enter another
                $scope.laliste = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    $scope.editList = function() {
        if (document.getElementById('modify-list').innerHTML=='Modifier') {
            $scope.listData.name = $scope.laliste.name;
            $scope.listData.description = $scope.laliste.description;
            document.getElementById('listname').style.display = "none";
            document.getElementById('listname_modify').style.display = "block";
            document.getElementById('listdesc').style.display = "none";
            document.getElementById('listdesc_modify').style.display = "block";
            document.getElementById('delete-list').disabled =true;
            document.getElementById('modify-list').innerHTML='✔';
        }
        else {
            document.getElementById('listname').style.display = "block";
            document.getElementById('listname_modify').style.display = "none";
            document.getElementById('listdesc').style.display = "block";
            document.getElementById('listdesc_modify').style.display = "none";
            document.getElementById('delete-list').disabled =false;
            document.getElementById('modify-list').innerHTML='Modifier';
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

    $scope.modifyTodo = function(index, x) {
        if (document.getElementById('modify-'+index).innerHTML=='Modifier') {
            for (pas = 0; pas < $scope.laliste.length; pas++) {
                document.getElementById('xcreatormodify-'+pas).style.display = "none";
                document.getElementById('xtextmodify-'+pas).style.display = "none";
                document.getElementById('xcreator-'+pas).style.display = "block";
                document.getElementById('xtext-'+pas).style.display = "block";
                document.getElementById('done-'+pas).disabled =false;
                document.getElementById('delete-'+pas).disabled =false;
                document.getElementById('modify-'+pas).innerHTML='Modifier';
            }
            $scope.modifyData.text = x.text;
            $scope.modifyData.creator = x.creator;
            document.getElementById('xcreatormodify-'+index).style.display = "block";
            document.getElementById('xtextmodify-'+index).style.display = "block";
            document.getElementById('xcreator-'+index).style.display = "none";
            document.getElementById('xtext-'+index).style.display = "none";
            document.getElementById('done-'+index).disabled =true;
            document.getElementById('delete-'+index).disabled =true;
            document.getElementById('modify-'+index).innerHTML='✔';
        }
        else {
            document.getElementById('xcreatormodify-'+index).style.display = "none";
            document.getElementById('xtextmodify-'+index).style.display = "none";
            document.getElementById('xcreator-'+index).style.display = "block";
            document.getElementById('xtext-'+index).style.display = "block";
            document.getElementById('done-'+index).disabled =false;
            document.getElementById('delete-'+index).disabled =false;
            document.getElementById('modify-'+index).innerHTML='Modifier';
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

    $scope.isChecked = function(index, x) {
        $scope.modifyData.checked = document.getElementById('done-'+index).checked;
        $http.post('api/laliste/done/' + url + '/' + x._id, $scope.modifyData)
        .success(function(data) {
            $scope.laliste = data;
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
    };

    $scope.deleteList = function() {
        $http.delete('api/laliste/delete/'+url)
        .success(function(data) {
            history.back();
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
    };

    // delete a todo after checking it
    $scope.deleteTodo = function(id) {
        $http.delete('api/laliste/' + url + '/' + id)
        .success(function(data) {
            $scope.laliste = data;
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
    };

    // delete a todo after checking it
    $scope.deleteAll = function() {
        $http.delete('api/laliste/'+ url)
        .success(function(data) {
            $scope.laliste = data;
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
    };

    $scope.formatDate = function(date){
        var dateOut = new Date(date);
        return dateOut;
    };

}