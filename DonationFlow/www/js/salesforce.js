
function Fifo(){
  var ls = window.localStorage;

  if( !ls["start"] ){
    ls["start"] = "0";
  }

  if( !ls["end"] ){
    ls["end"] = "0";
  }

  this.start = function(){
    return parseInt(ls["start"]);
  }

  this.setStart  = function(start){
    ls["start"] = start + "";
  }

  this.end = function(){
    return parseInt(ls["end"])
  }

  this.setEnd = function(end){
    ls["end"] = end + "";
  }

  this.post = function(item){
    ls[(this.end() + 0) + ""] = JSON.stringify(item);
    this.setEnd(this.end()+1);
  }

  this.peek = function(){
    if( this.end() <= this.start() ){
      return null;
    }
    var itemJson = ls[this.start()+""];
    return JSON.parse(itemJson);
  }

  this.remove = function(num){
    if( this.end() <= this.start() ){
      return null;
    }
    this.setStart(this.start()+1);
  }

  this.size  = function(){
    return this.end() - this.start()
  }

}

app.service("Salesforce",function($q,$http){
  var fifo = new Fifo()

  var prefix = "https://unitycare-developer-edition.na35.force.com"

  var state = {};
  state.posting = false;
  var _this = this;
  _this.unsyncedItems = fifo.size()


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
    $http({headers:headers(),method:"GET",url: prefix + "/services/apexrest/Outgoing"}).then(function(data){
      this.clients = data;
    })
  }

  this._postOutgoing = function(data){
    if( this.size() <= 0 ){
      return 
    }
    $http({headers:headers(),method:"POST",url: prefix + "/services/apexrest/Outgoing",data:data}).then(function(){

    })
  }

  this._postIncoming = function(data){
    return $http({headers:headers(),method:"POST",url: prefix + "/services/apexrest/Incoming",data:data}).then(function(){

    })
  }

  this.isSyncing = function(){
    return _this.posting;
  }


  this.sync = function(){
    this._postNext(); 
  }
  this._postNext = function(data){
    if( fifo.size() <= 0 ){
      //done
      console.log("All posted");
      return;
    }
    if( state.posting ){
      console.log("allready posting");
      return;
    }

    var next = fifo.peek();
    if( !next ){
      console.log("fifo empty, all posted");
      return;
    }

    state.posting = true;

    console.log("Posting ",next.endpoint, next.data)

    $http({headers:headers(),method:"POST",url: prefix + next.endpoint, data:next.data}).then(function ok(){
      console.log("Posted ",next.data)

      state.posting = false;
      fifo.remove();
       _this.unsyncedItems = fifo.size()
      _this._postNext();
    },function fail(error,error2){
      state.posting = false;
      var err = error.data || []
      var errs = JSON.stringify(err);
      if( errs.indexOf("DUPLICATES_DETECTED") > 0 ){
        //this is fine
        state.posting = false;
        fifo.remove();
        _this.unsyncedItems = fifo.size()

        _this._postNext();
         return;
      }
      if( err.length ){
        alert(errs);
      }else if(err.statusText){
        alert(error.statusText);
      }else{
        alert("Can't save to Salesforce right now. Try to SYNC again later when you have Internet Connection.");
      }
      console.log(error,error2,err,next.data);
      //alert(error.statusText);
      //_this.postNext();
    })
  }

  this.saveOutgoing = function(data){
    data.id = ("" + new Date().getTime()).substring(5);
    fifo.post({data:data,endpoint:"/services/apexrest/Outgoing"})
    _this.unsyncedItems = fifo.size()
    this._postNext()
  };

  this.saveIncoming = function(data){
    data.id = ("" + new Date().getTime()).substring(5);
    fifo.post({data:data,endpoint:"/services/apexrest/Incoming"})
            _this.unsyncedItems = fifo.size()
    this._postNext()
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

  $state.go('app.forms');

  $scope.testPost = function(){
    var test = 
        {
                "client_name" : "Batman" ,
                "item" : "Pyjamas Youth - New",
                "count" : 1 ,
                "dev_staff" : "Debb51",
                "client_rep" : "Debb 12",
                "created":"2016-12-12"
        };
    Salesforce.saveOutgoing(test)
  }

  $scope.testPost2 = function(){
    var test = 
        {
"item" : "Pyjamas Youth - New" ,
"donor_name" : "Spiderwoman" ,
"count" : 15 ,
"dev_staff" : "Debb51" ,
"created":"2016-12-12" ,
"estimated_cost" : 200 , 
"email" : "abc@gmail.com",
"phone" : "4981734207"
 }
    Salesforce.saveIncoming(test)
  }
})
