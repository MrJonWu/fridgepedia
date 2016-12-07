angular.module('app', [])

.controller('foodController', function($scope, $http) {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth();
  var yyyy = today.getFullYear();

  $scope.recipe = {};
  $scope.food = {};
  $scope.food.expiration = new Date(yyyy, mm, dd);
  var todayUTC = $scope.food.expiration.getTime();

  $scope.fridge = [];

  $http.get('/api/fridge')
  .then(function(data) {
    $scope.fridge = data.data;
    for (var i = 0; i < $scope.fridge.length; i++) {
      if ($scope.fridge[i].utc < todayUTC) {
        $scope.fridge[i].status = '../assets/danger.png';
      } else {
        $scope.fridge[i].status = '../assets/safe.png';
      }
    }
  });

  $scope.submit = function() {
    var utcTime = $scope.food.expiration.getTime();
    var dateString = $scope.food.expiration.toString();

    dateString = dateString.slice(0, dateString.indexOf('00:00:00') - 1);
    // $scope.fridge.push({'item': $scope.food.item, 'expiration': dateString, 'utc': utcTime});

    $http.post('/api/fridge', {'item': $scope.food.item, 'expiration': dateString, 'utc': utcTime})
      .then(function() {
        $scope.food.item = '';
        $http.get('/api/fridge')
          .then(function(data) {
            $scope.fridge = data.data;
            for (var i = 0; i < $scope.fridge.length; i++) {
              if ($scope.fridge[i].utc < todayUTC) {
                $scope.fridge[i].status = '../assets/danger.png';
              } else {
                $scope.fridge[i].status = '../assets/safe.png';
              }
            }
          });
      });
  };

  $scope.findRecipe = function(item) {
    $http({
      method: 'GET',
      url: 'https://edamam-recipe-search-and-diet-v1.p.mashape.com/search?_app_id=2af97890&_app_key=160c5ee86186e01199bc9f1d149f5edd&q=' + item,
      headers: {'X-Mashape-Key': 'ferQqnXlPYmshIrSnrLD0wb2zi85p1BrvHjjsn75BKDmgANAwo'}
    }).then(function (response) {
      var random = Math.floor(Math.random() * (9));
      $scope.recipe = response.data.hits;
      for (recipe in $scope.recipe) {
        $scope.recipe[recipe].recipe.calories = Math.floor($scope.recipe[recipe].recipe.calories);
      }
    });
  };

  $scope.trash = function(id) {
    $http.delete('/api/fridge/' + id)
      .then(function(data) {
        $scope.fridge = data.data;
        $http.get('/api/fridge')
          .then(function(data) {
            $scope.fridge = data.data;
            for (var i = 0; i < $scope.fridge.length; i++) {
              if ($scope.fridge[i].utc < todayUTC) {
                $scope.fridge[i].status = '../assets/danger.png';
              } else {
                $scope.fridge[i].status = '../assets/safe.png';
              }
            }
          });
      });
  };
});