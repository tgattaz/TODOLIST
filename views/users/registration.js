/* PREMIERE PAGE bis DE L'APPLICATION - INSCRIPTION*/
var Inscription = angular.module('Inscription', []);

function mainController($scope, $http) {

  $scope.insData = {};


    // Création de l'utilisateur à partir du formulaire rempli
  $scope.createUser = function() {

    //Si le formulaire a été validé
    if(validateForm(event)){

        //Requête de création de l'utilisateur
        $http.post('/newUser', $scope.insData)
        .success(function(data) {

            $scope.insData = {}; // clear the form so our user is ready to enter another

            //Redirection vers la page de confirmation de création de l'utilisateur
            window.location.replace("/confirmation");

        })

        .error(function(data) {

            console.log('Error: ' + data);
        });
    }
};
}

//Partie - vérification du formulaire - Javascript Pur
document.addEventListener("DOMContentLoaded", function(event) {

    //Récupération d'élements
    var btSwitch = document.getElementById("formInscr");

    var nom = document.getElementById("nom");

    //Affichage commentaire si focus sur le nom
    nom.addEventListener("focus", function () {

        document.getElementById("aidenom").textContent = " - 6 à 24 caractères";

    })

    //Lance la vérification si input sur le nom
    nom.addEventListener("input", function () {

        verifnom(nom);

    });

    //Stop le commentaire si blur le nom
    nom.addEventListener("blur", function () {

        finnom(nom);

        document.getElementById("aidenom").textContent = "";

    });

    //Récupération d'élements
    var mdp = document.getElementById("pass1");

    var mdp2 = document.getElementById("pass2");

    //Affichage commentaire si focus sur le mot de passe 1
    mdp.addEventListener("focus", function () {

        document.getElementById("aidemdp").textContent = " - 7 et 22 caractères";

    });

    //Lance la vérification si input sur le mot de passe 1
    mdp.addEventListener("input", function () {

        verifmdp(mdp);

    });

    //Stop le commentaire si blur le mot de passe 1
    mdp.addEventListener("blur", function () {

        finmdp2(mdp,mdp2);

        document.getElementById("aidemdp").textContent = "";

    });

    //Affichage commentaire si focus sur le mot de passe 2
    mdp2.addEventListener("focus", function () {

        document.getElementById("aidemdp2").textContent = " - Doit être identique";

    });

    //Lance la vérification si input sur le mot de passe 2
    mdp2.addEventListener("input", function () {

        verifmdp2(mdp,mdp2);

    });

    //Stop le commentaire si blur le mot de passe 2
    mdp2.addEventListener("blur", function () {

        finmdp2(mdp,mdp2);

        document.getElementById("aidemdp2").textContent = "";

    });

});

//Vérification du nom
function verifnom(champ)
{
    //Si ne respecte pas les conditions ....
   if(champ.value.length < 6 || champ.value.length > 24){

        //Surligage du nom
      surligne(champ, true);

      //Il n'est pas vérifié
      return false;

   } else {

        //Désurligage du nom
      surligne(champ, false);

      //Il est vérifié
      return true;

   }
}

//Couleur réinitialisé si nom correct
function finnom(champ){

    if(verifnom(champ)){

      champ.style.backgroundColor = "";

    }
}

//Vérification du mot de passe 1
function verifmdp(champ){

    //Si ne respecte pas les conditions ....
   if(champ.value.length < 7 || champ.value.length > 22){

        //Surligage du mot de passe 1
      surligne(champ, true);

      //Il n'est pas vérifié
      return false;

   } else {

        //Désurligage du mot de passe 1
      surligne(champ, false);

      //Il est vérifié
      return true;
   }
}

//Vérification du mot de passe 2
function verifmdp2(champ, champ2){

    //Si ne respecte pas les conditions ....
   if(champ.value != champ2.value){

        //Surligage du mot de passe 2
      surligne(champ2, true);

      //Il n'est pas vérifié
      return false;
   }
   else{

        //Désurligage du mot de passe 2
      surligne(champ2, false);

      //Il est vérifié
      return true;
   }
}

//Couleur réinitialisé si mot de passe 1 et le mot de passe 2 corrects
function finmdp2(champ, champ2){

    if(verifmdp2(champ, champ2))
    {

      champ.style.backgroundColor = "";

      champ2.style.backgroundColor = "";
    }
}

//Fonction de surlignage en fonction de erreur ou nom
function surligne(champ, erreur){

   if(erreur)
      champ.style.backgroundColor = "#fba";

   else
      champ.style.backgroundColor = "#afb";
}

//Fonction de validation de formulaire
function validateForm(event)
{
        //Prevent Default de l'envoi
        event.preventDefault();

        //Si le formulaire n'est pas vérifié complètement
        if(!verifnom(nom) || !verifmdp(pass1) || !verifmdp2(pass1,pass2))
        {
          //Affichage d'un commentaire
          document.getElementById("warning").textContent = " - Erreur ! vérifier votre formulaire !";

          //Retour négatif
          return false;

        }
        else
        {
            //Si tout est OK

            //Affichage d'un commentaire
            document.getElementById("warning").color = "green";

            document.getElementById("warning").textContent = " - Formulaire valdié, envoi ...";

            //Retour positif
            return true;
        }
}