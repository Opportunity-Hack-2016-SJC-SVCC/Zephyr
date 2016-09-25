window.app = angular.module('starter.controllers', [])


app.controller('AppCtrl', function($scope, $ionicModal, $timeout,Salesforce,DataService) {
 
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    //$scope.modal.show();
    Salesforce.login().then(function(){

    });
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
  { title: 'Reggae', id: 1 },
  { title: 'Chill', id: 2 },
  { title: 'Dubstep', id: 3 },
  { title: 'Indie', id: 4 },
  { title: 'Rap', id: 5 },
  { title: 'Cowbell', id: 6 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
})

//Incoming-donations
.controller('FormsCtrl', function($scope, $ionicModal, $stateParams, FlightDataService) {

  $ionicModal.fromTemplateUrl('templates/incoming-donations.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.incomingDonations = function() {
    //alert('in donation!');
    $scope.modal.show();
  };
  // Close incoming donations
  $scope.closeIncomingDonations = function() {
    $scope.modal.hide();
  };

  $scope.userData = {
    staffName: '',
    programName: '',
    familyName: ''
  }

  $scope.selections = {
  list: [
      {
        item: 'shoes',
        options: [{value: 'medium'},{value: 'large'}]
      },
      {
        item: 'clothes'
      }
      ]
}



  $scope.incomingDonationsSubmit = function(form) {
    if(form.$valid) {
      //$state.go('home'); + $scope.userData.staffName
      console.log($scope .userData.staffName);
    }
  };  

// out going

$ionicModal.fromTemplateUrl('templates/outgoing-donations.html', {
    scope: $scope
  }).then(function(outmodal) {
    $scope.outmodal = outmodal;
  });

  

  $scope.outgoingDonations = function() {
    //alert('out donation!');
    $scope.outmodal.show();
    };

    // Close outgoing donations
  $scope.closeOutgoingDonations = function() {
    $scope.outmodal.hide();
  };
//the code for search
  $scope.myTitle = 'Auto Complete Example';

      $scope.data = { "airlines" : [], "itemName" : '' };
      $scope.data.itemList = [];

      $scope.search = function() {

        FlightDataService.searchAirlines($scope.data.itemName).then(
          function(matches) {
            $scope.data.airlines = matches;
          }
        )
      }

      $scope.selectedItem = function(itemName){
        $scope.data.airlines = [];
        $scope.data.itemName = "";
        var newItem = {name:itemName};
        $scope.data.itemList.push(newItem);
      }
  
})

.factory("Login",function($q){
  this.login = function(){
    var q = $q.defer();

    var redirect_uri = "https://donationflow.herokuapp.com/#/app/login_return";

    var loginUrl = "https://login.salesforce.com/services/oauth2/authorize?response_type=token&client_id=3MVG9szVa2RxsqBYv25vb5u8fnRIDC_itm48NSkcQASWCTa4niLmieviNcUPJfdnE8BQk2nzSrRuRqLXwBwVY"
    loginUrl += "&redirect_uri=" + encodeURIComponent(redirect_uri) 
    loginUrl += "&state=" + encodeURIComponent("" + new Date());


    window.location = ( loginUrl );

    return q.promise;
  }
  return this;
})
.controller("LoginReturnCtrl", function($scope){
  $scope.token = "Im a token";
})



