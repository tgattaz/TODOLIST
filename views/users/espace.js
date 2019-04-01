var ListeGestion = angular.module('ListeGestion', []);

function mainController($scope, $http, $location) {

  $scope.listData = {};
  var identifiant = document.getElementById('id').innerHTML;

  $scope.createList = function() {
    if (document.getElementById('create-list').innerHTML=='Ajouter une liste') {
        $scope.listData.name = '';
        $scope.listData.description = '';
        document.getElementById('listname_label').style.display = "block";
        document.getElementById('listname').style.display = "block";
        document.getElementById('listdesc_label').style.display = "block";
        document.getElementById('listdesc').style.display = "block";
        document.getElementById('create-list').innerHTML='✔';
    }
    else {
      document.getElementById('listname_label').style.display = "none";
      document.getElementById('listname').style.display = "none";
      document.getElementById('listdesc_label').style.display = "none";
      document.getElementById('listdesc').style.display = "none";
      document.getElementById('create-list').innerHTML='Ajouter une liste';
        $http.post('todolists/api/laliste/create/'+identifiant, $scope.listData)
        .success(function(data) {
            console.log(data);
            window.location.replace("/"+identifiant);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
    };
};

  $scope.deleteList = function(param) {
    $http.delete('todolists/api/laliste/delete/'+param)
    .success(function(data) {
      console.log(data);
      window.location.replace("/"+identifiant);
    })
    .error(function(data) {
        console.log('Error: ' + data);
    });
  };

}