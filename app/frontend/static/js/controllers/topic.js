'use strict';

angular.module('sbirezApp')
  .controller('TopicCtrl', function ($scope, $http, $window, $state, AuthenticationService) {
    $scope.isLoggedIn = AuthenticationService.isLogged && $window.sessionStorage.token;
    $scope.topicId = $state.params.id;
    $scope.fromSearch = $state.params.fromSearch;
    $scope.data = {
      "pre_release_date": "2014-12-12T00:00:00", 
      "phases": [
        "PHASE I:  Research and develop concept of the core innovative technologies approach and report complete description in final Phase I report on how the technical approach will be applied to satisfying the Topic requirement.   Provide a Phase II methodology development plan if selected for Phase II contract.", 
        "PHASE II:  Continue research and development of technology for a prototype demonstration in an Air Force Sustainment Center (AFSC) complex facility and demonstrate the commercial viability of the approach.  Develop transition plan for an enterprise wide implementation of the technology across AFSC complexes.", 
        "PHASE III:  Dual application for the military and commercial industry that includes DoD maintenance depots and commercial aviation and automotive industry."],
      "description": "As the age of our legacy fleets increase, there is an increasing requirement to scan very large areas of the outer mold line.  Traditional inspection equipment were primarily designed as hand held operations for specific locations on the structure.  This equipment was adapted for semi-automated operations and manipulation by computers and x-y scanners.  Research should include but not limited to the use of array probes, both ultrasonic and eddy current, to increase the area that can be scanned at one time, increased scan speed, improve data collection rates, improve data fusion, and provide automatic defect recognition/reporting.  This program will also investigate using multiple inspection modes simultaneously, (i.e., ultrasonic/eddy current, high frequency/low frequency).  For example, the KC-135 has an inspection requirement on the crown skin for both a high frequency and a low frequency eddy current inspection of the spot welds.  This currently requires two set ups and two separate scans.  If high frequency and low frequency eddy current could be combined, this would result in an automatic 50 percent reduction in manhours, and the use of arrays will be faster than manual, further reducing the manhours required.",
      "title": "Very Large Multi-Modal NDI", 
      "url": "http://www.dodsbir.net/sitis/display_topic.asp?Bookmark=46448", 
      "participating_components": ["Air Force", "ARMY", "DARPA", "DHP", "NAVY", "SOCOM"], 
      "proposals_begin_date": "2015-01-15T00:00:00", 
      "topic_number": "AF151-158  (AirForce)", 
      "proposals_end_date": "2015-02-18T00:00:00", 
      "keywords": ["large area NDI", "multi modal", "NDI", "array probes", "ultrasonic scan", "eddy current"], 
      "program": "SBIR", 
      "references": [
        "1.  Technical Order 1C-135-36, para 8.4.2, 8.4.3 and 8.4.13.", 
        "2.  Technical Order158 1B-52H-36, Fig 7-2.1.30."], 
      "objective": "The objective is to move away from non-destructive inspection (NDI) hand-held operations to very large surface areas of aircraft structures that will reduce man hours and depot cycle times.",
      "solicitation_id": "DoD SBIR 2015.1", 
      "areas": ["Materials/Processes"]
    };

    $scope.jwt = $window.sessionStorage.token;
//    $http.get('api/v1/topics/' + $scope.topicId).success(function(data) {
//      $scope.data = data;
//    });
  });
