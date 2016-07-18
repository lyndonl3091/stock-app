'use strict';

var app = angular.module('myApp');

app.service('Stock', function($http) {

  this.search = input => {
    console.log('input', input);
    return $http.jsonp(`http://dev.markitondemand.com/Api/v2/Lookup/jsonp?input=${input}&callback=JSON_CALLBACK`)
  }

  this.getQuote= symbol => {
    return $http.jsonp(`http://dev.markitondemand.com/Api/v2/Quote/jsonp?symbol=${symbol}&callback=JSON_CALLBACK`)
  }


})

app.service('User', function($http, $q) {


  this.getProfile = () => {
    return $http.get('/api/users/profile')
    .then(res => {
      console.log('profile res', res);
      return $q.resolve(res.data);
    })
  }

  this.addStock = symbol => {
    console.log('services symbol', symbol);
    return $http.post(`/api/users/${symbol}`)
  }

  this.findStocks = id => {
    return $http.get(`/api/users/${id}`)
  }

  this.deleteStock = id => {
    console.log('services id', id);
    return $http.put(`/api/users/${id}`)
  }


})
