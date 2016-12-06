angular.module('app', [])

.controller('foodController', function($scope, $http) {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth();
  var yyyy = today.getFullYear();

  $scope.recipe = {};
  $scope.food = {};
  $scope.food.expiration = new Date(yyyy, mm, dd);

  $scope.fridge = [];

  $scope.submit = function() {
    var utcTime = $scope.food.expiration.getTime();
    var dateString = $scope.food.expiration.toString();

    dateString = dateString.slice(0, dateString.indexOf('00:00:00') - 1);
    $scope.fridge.push({'item': $scope.food.item, 'expiration': dateString, 'utc': utcTime});
    $scope.food.item = '';
  };

  $scope.findRecipe = function(item) {
    // console.log(item);
    $http({
      method: 'GET',
      url: 'https://edamam-recipe-search-and-diet-v1.p.mashape.com/search?_app_id=2af97890&_app_key=160c5ee86186e01199bc9f1d149f5edd&q=' + item,
      headers: {'X-Mashape-Key': 'ferQqnXlPYmshIrSnrLD0wb2zi85p1BrvHjjsn75BKDmgANAwo'}
    }).then(function (response) {
      var random = Math.floor(Math.random() * (9));
      $scope.recipe = response.data.hits[random].recipe;
      $scope.recipe.calories = Math.floor($scope.recipe.calories);
      // console.log($scope.recipe);
    });
  };
});

// .controller('submitController', function($scope) {
//   $scope.food = {};
//   var today = new Date();
//   var dd = today.getDate();
//   var mm = today.getMonth();
//   var yyyy = today.getFullYear();

//   $scope.food.expiration = new Date(yyyy, mm, dd);
 
//   $scope.submit = function() {

//     console.log($scope.food.item, $scope.food.expiration);
//   };
// });
