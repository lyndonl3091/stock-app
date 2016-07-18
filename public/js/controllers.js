'use strict';

var app = angular.module('myApp');

app.controller('mainCtrl', function($scope, $state, $auth, $rootScope, Stock) {
  console.log('mainCtrl!');

  $scope.isAuthenticated = () => $auth.isAuthenticated();

  $scope.logOut = () => {
    $auth.logout();
    $state.go('login');
    $rootScope.currentUser = null;
  }

  $scope.search = () => {
      $state.go('search', {input: $scope.input})
  }

});

app.controller('searchCtrl', function($scope, $state, $stateParams, Stock) {


    Stock.search($stateParams.input)
    .then(res => {
      $scope.results = res.data
    })
    .catch(err => {
      console.log('err:', err);
    })

    $scope.showCom = symbol => {
      $state.go('show', {symbol: symbol})
    }


});

app.controller('showCtrl', function($scope, $state, $stateParams, $rootScope, Stock, User) {

    Stock.getQuote($stateParams.symbol)
    .then(res => {
      $scope.comp = res.data
    })
    .catch(err => {
      console.log('err:', err);
    })

    $scope.refresh = () => {

      Stock.getQuote($stateParams.symbol)
      .then(res => {
        $scope.comp = res.data
      })
      .catch(err => {
        console.log('err:', err);
      })
    }

    $scope.save = symbol => {
      User.addStock(symbol)
      .then(res =>{
      console.log('res', res);
    })
    .catch (err => {
      console.log('err', err);
    })
  }

});

app.controller('loginregisterCtrl', function($scope, $state, $rootScope, $auth) {
  console.log('loginregisterCtrl!');

  $scope.userLogin = () => {
    $auth.login($scope.user)
    .then(res => {

      $rootScope.currentUser = res.data;

      $state.go('profile')
    })
    .catch(err => {
      console.log('err:', err);
    })
  }

  $scope.register = () => {
    if($scope.newUser.password !== $scope.newUser.password2) {
      $scope.newUser.password = null;
      $scope.newUser.password2 = null;
      alert('Passwords must match.  Try again.')
    } else {
      console.log('$scope.newUser', $scope.newUser)
      $auth.signup($scope.newUser)
      .then(res => {
        $auth.login($scope.newUser)
        .then(res => {
          $state.go('profile')
        })
      })
      .catch(err => {
        console.log('err:', err);
      })
    }
  }
})

app.controller('profileCtrl', function($scope, $state, User, CurrentUser) {
    console.log('profileCtrl!');

    $scope.user = CurrentUser;

    $scope.tracked = () => {
      $state.go('track', {userId : $scope.user._id})
    }


})

app.controller('trackCtrl', function($scope, $state, $stateParams, User) {

  User.findStocks($stateParams.userId)
  .then(res => {
    $scope.user = res.data.stocks
    console.log('res.data', res.data.stocks);
  })

  $scope.refreshTrack = () => {
    User.findStocks($stateParams.userId)
    .then(res => {
      $scope.user = res.data.stocks
    })
  }

  $scope.deleteStock = (id, index) => {
    console.log('id:', id);
    User.deleteStock(id)
    .then(res => {
      $scope.user.splice(index, 1)
    })
    .catch(err => {
      console.log('err:', err);
    })
  }

})
