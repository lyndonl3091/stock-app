'use strict';

var app = angular.module('myApp', ['ui.router', 'satellizer']);

app.config(function($authProvider) {

    $authProvider.loginUrl = '/api/users/login'
    $authProvider.signupUrl = '/api/users/signup'


})

app.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('home', { url: '/', templateUrl: '/html/home.html' })
    .state('profile', { url: '/profile',
            templateUrl: '/html/profile.html',
            controller: 'profileCtrl',
            resolve: {
              CurrentUser: function(User) {
                return User.getProfile();
              }
            }
          })
    .state('track', { url: '/profile/:userId',
            templateUrl: '/html/tracked.html',
            controller: 'trackCtrl',
          })

    .state('stocks', { url: '/trackedStocks', templateUrl: '/html/tracked.html' })
    .state('search',
            { url: '/search/:input',
            templateUrl: '/html/search.html',
            controller: 'searchCtrl' })
    .state('show',
            { url: '/show/:symbol',
            templateUrl: '/html/searchShow.html',
            controller: 'showCtrl' })
    .state('login', {
            url: '/',
            templateUrl: '/html/loginregister.html',
            controller: 'loginregisterCtrl'
        })


  $urlRouterProvider.otherwise('/');
});
