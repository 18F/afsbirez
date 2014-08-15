'use strict';

angular.module('sbirezApp')
  .controller('SearchCtrl', function ($scope, $http, $window) {
    $scope.jwt = $window.sessionStorage.token;
    $scope.results = {};

    $scope.simpleMode = true;

    console.log('Search Ctrl');

    var dummyData = {'topics':
      [{
        'id':1,
        'topicId':'A14-083',
        'title':'Scalable Design Method for Reconfigurable Canard Actuation Systems',
        'description':'A variety of technical challenges are encountered during the development of gun-launched guided projectiles. The projectile is subjected to extremely high external forces due to the shock and vibration encountered during the gun launch in significantly different frequency regimes on mechanical and electrical components.'
      },
      {
        'id':2,
        'topicId':'A14-084',
        'title':'Hybrid Projectile Components Miniaturization',
        'description':'The US Army is aggressively pursuing guided gun-fired munitions and projectiles that provide a real-time video feed and control to the User. Currently, commercially available components on the developmental guided 40mm munition with a camera system are heavy, expensive, bulky, and not sufficiently resilient to withstand the G force produced when the munition is fired.'
      },
      {
        'id':3,
        'topicId':'A14-091',
        'title':'Nuclear Magnetic Resonance Instrumentation for Geotechnical, Geospatial and Geophysical Investigations',
        'description':'The US Army requires field survey instruments to determine moisture content in the top 2 meters of the subsurface. Such moisture measurements are required for: modeling and detecting various targets in the top 2 meters of the subsurface; military construction, including assessment of building sites, airfields and roads; and mobility assessments, including battlefield assessment of the ability of terrain to support various mechanized operations.'
      }]};

    $scope.search = function() {
      $scope.simpleMode = false;
      $scope.results = dummyData;
    };
  });
