app.service("Salesforce",function($q,$http){
  var prefix = "https://unitycare-developer-edition.na35.force.com"

  var state = {};
  this._loginComplete = function(){
    this.loadAutocompleteData();
   
  }

  this.login = function(){
    state.q = $q.defer();

    var redirect_uri = "https://donationflow.herokuapp.com/#/app/login_return";

    var loginUrl = "https://login.salesforce.com/services/oauth2/authorize?response_type=token&client_id=3MVG9szVa2RxsqBYv25vb5u8fnRIDC_itm48NSkcQASWCTa4niLmieviNcUPJfdnE8BQk2nzSrRuRqLXwBwVY"
    loginUrl += "&redirect_uri=" + encodeURIComponent(redirect_uri) 
    loginUrl += "&state=" + encodeURIComponent("" + new Date());


    window.location = ( loginUrl );

    return state.q.promise;
  }

  function headers(){
    var headers = {
        'Content-Type': "application/json",
        "Authorization" : "Bearer " + window.localStorage["access_token"]
    }
    return headers;
  }

  this.loadAutocompleteData = function(){

  }

  this.postOutgoing = function(data){
    
    $http({headers:headers(),method:"POST",url: prefix + "/services/apexrest/Outgoing",data:data}).then(function(){

    })
  }

  this.queueOutgoing = function(data){

  };

  this.clients = ["Bob","John"];
  this.client_reps = ["Ana","Sara"];
  this.categories = ["Furniture"];

})
.controller("LoginReturnCtrl", function($scope,$location,Salesforce){
  var loc = window.location + "";
  var i = loc.indexOf("access_token=");
  loc = loc.substring(i);
  locA = loc.split("&");
  var tokens = locA[0].split("=")
  window.localStorage["access_token"] =  tokens[1];
  $scope.token = window.localStorage["access_token"];
  Salesforce._loginComplete();

  $scope.testPost = function(){
    var test = 
        {
        "Name" : "Batman" ,
        "item" : "Pants",
        "Count" : 1 ,
        "Dev_staff" : "Debb51",
        "Client_rep" : "Debb 12"
        };
    Salesforce.postOutgoing(test)
  }
})
