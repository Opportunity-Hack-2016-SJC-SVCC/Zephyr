window.app = angular.module('starter.controllers', [])


app.controller('AppCtrl', function($scope, $ionicModal, $timeout, DataService,Salesforce) {

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
      alert("Login done");
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
.controller('FormsCtrl', function($scope, $ionicModal, $stateParams, DataService) {

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


//the code for search catagories
//$scope.myTitle = 'Auto Complete Example';

$scope.data = {}

$scope.data.categories= {"list":[],"value":"",all:DataService.categories}
$scope.data.client= {"list":[],"value":"",all:DataService.clients}
$scope.data.clientReps= {"list":[],"value":"",all:DataService.clientReps}



$scope.data.itemList = [];


$scope.search = function(ref) {
  DataService.search(ref.value,ref.all).then(
    function(matches) {
      ref.list = matches;
    }
    )
}

$scope.selectedCategory = function(itemNameCat){
  $scope.data.categories.list = [];
  $scope.data.categories.value = "";

  var newItem = {name:itemNameCat};
  $scope.data.itemList.push(newItem);
}

  $scope.globalSelectedFunction = function(itemName, ref){
     ref.list = [];
     ref.value = itemName;
   }

})





