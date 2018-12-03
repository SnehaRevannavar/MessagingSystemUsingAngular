var app = angular.module("myApp", ['ngRoute']);
var loggedIn="";
storage();

app.config(function($routeProvider) {
	
	$routeProvider.when('/',{
        templateUrl:'user_login.html',
        controller:'loginController'
     	})
	.when('/sign_up',{
        templateUrl:'sign_up.html',
        controller:'signController'
        
     })
	.when('/home',{
        templateUrl:'home.html',
       // controller:'homecntrl',
        resolve: ['authService', function(authService){
        	return authService.checkUserStatus();
        }]
        
     })
	.when('/profiles',{
        templateUrl:'profiles.html',
        controller:'profilescntrl',
        resolve: ['authService', function(authService){
        	return authService.checkUserStatus();
        }]
        
     })
	.when('/message/:index',{
		templateUrl:'message.html',
		controller:'msgdetcontroller',
		resolve: ['authService', function(authService){
        	return authService.checkUserStatus();
        }]
	})
	.when('/reply/:index',{
		templateUrl:'reply.html',
		controller:'replyController',
		resolve: ['authService', function(authService){
        	return authService.checkUserStatus();
        }]
	})
	.when('/messagelist',{
		templateUrl:'messagelist.html',
		controller:'msgController',
		resolve: ['authService', function(authService){
        	return authService.checkUserStatus();
        }]
		
	})
	.otherwise({
		redirectTo:"/"
	});

	
});

app.factory('authService', function($q, $location)
{

	return {
		current_user: "",
		 checkUserStatus : function()
			 {
		 	var defer = $q.defer();
		 	if(this.current_user)
		 	defer.resolve();
			 else{
			 	$location.path('/');
			 	defer.reject();
				 }
		 	return defer.promise;
			 }
		}
})
	


app.controller('loginController', function($scope,$location,authService,$rootScope){
	$scope.authform = {};
	$scope.login = function() {
		if(!$scope.authform.username || $scope.authform.username=='' || !$scope.authform.pwd || $scope.authform.pwd=='')
		{
			
			alert("please enter valid details");
			return false;
		}
		else {
			var users=[];
	    	if(localStorage.a_users)
				{
				users=JSON.parse(localStorage.a_users);
				console.log(users);
				for(i=0; i<users.length; i++){
					if(users[i].username==$scope.authform.username && users[i].pwd== $scope.authform.pwd)
					{
							loggedIn = users[i].username;
							authService.current_user= loggedIn;
							alert("Hi "+ users[i].username);
							localStorage.isLoggedIn=true;
							$rootScope.status=true;
							$location.path("/home");
							return true;
					}
				}
			}
		}

		alert("username/password did not match");
		return false;		
	}
	$scope.sign = function(){
	$location.path("/sign_up");
}

}); 

//app.controller('homecntrl', function($scope, authService,$rootScope){
//})




app.controller('signController', function($scope, $location){
      	$scope.authform ={};
      	$scope.signup=function(){
      		
   		var users=[];
        if(localStorage.a_users)
			{
				users=JSON.parse(localStorage.a_users)
        		console.log(users);
    		}
        var user = {
        'Username': username,
        'Password': pwd,
        'Firstname': firstname,
        'Lastname': lastname,
        'Email' : email,
        'Phone': phone,
        'Location': location,
   			}
        users.push($scope.authform);
        localStorage.a_users = JSON.stringify(users);
	        
        }

        $scope.previous = function(){
	        $location.path("/");
        	 
        }
 });


app.controller('msgController', function($scope, authService){
	
	$scope.msgs = JSON.parse(localStorage.msgs).filter(m => !m.delete  && m.recipient === authService.current_user);
	console.log($scope.msgs);
});


app.controller('profilescntrl',  function($scope, authService, $location){
	var users=[];
    if(localStorage.a_users)
		{
			users=JSON.parse(localStorage.a_users)
    		console.log(users);
		}
		$scope.authform = users.find(u => u.username === authService.current_user)
	$scope.update = function(){

      console.log($scope.authform, users)
        localStorage.a_users = JSON.stringify(users);
	        
        

	}
	$scope.back = function()
	{
		$location.path('/home');
	}
	
})

   
app.controller('msgdetcontroller', function($scope, $routeParams,$location,authService)
{
$scope.index = $routeParams.index;
$scope.msgs = JSON.parse(localStorage.msgs);
$scope.message = $scope.msgs.filter(m => !m.delete && m.recipient === authService.current_user)[$scope.index];

$scope.back = function(){

$location.path("/messagelist");

}

$scope.important = function(){
	$scope.message.important = 1;
	localStorage.msgs =  JSON.stringify($scope.msgs);
}

$scope.delete = function(){
	$scope.message.delete = 1;
	localStorage.msgs =  JSON.stringify($scope.msgs);
	$location.path("/messagelist");
}
$scope.Reply = function() {
$location.path("/reply/" + $scope.index);

}

$scope.replies = $scope.msgs[0].replies;

});


	
app.controller('replyController',  function($scope, $routeParams,$location,authService){
	$scope.index = $routeParams.index;
	$scope.msgs = JSON.parse(localStorage.msgs);
	$scope.message = $scope.msgs.filter(m => !m.delete && m.recipient === authService.current_user)[$scope.index];

	$scope.submit = function()
	{
		var obj = {
            "recipient":$scope.message.sender,
            "recipient_img":"http://simpleicon.com/wp-content/uploads/user1.png",
            "sender":$scope.message.recipient,
            "sender_img":"http://simpleicon.com/wp-content/uploads/user1.png",
            "title":"Re: " + $scope.message.title,
            "description": $scope.reply,
            "created_at": new Date(),
            "important":"0"
		}

		$scope.msgs[0].replies.push(obj);
	localStorage.msgs = JSON.stringify($scope.msgs);

	$location.path("/messagelist");

	}

	
})
    app.controller('mycntrl',  function($scope, $rootScope, authService){
    	$rootScope.status = false;
    	if(localStorage.isLoggedIn)
    	{
    		$rootScope.status=true;
    	}

	$scope.logout = function()
	{
		authService.current_user = ""
		localStorage.removeItem("isLoggedIn");
		$rootScope.status = false;
	}


    	
    })
 
function storage()
{
	localStorage.msgs =  JSON.stringify([
        {
            "recipient":"Sneha",
            "recipient_img":"http://simpleicon.com/wp-content/uploads/user1.png",
            "sender":"Haridra",
            "sender_img":"http://simpleicon.com/wp-content/uploads/user1.png",
            "title":"Message from Haridra to Sneha.",
            "description":"Hi Sneha!!",
            "created_at":"2017-01-19 09:45:00",
            "important":"0",
            "replies" :[]
        },
        {
            "recipient":"Haridra",
            "recipient_img":"http://simpleicon.com/wp-content/uploads/user1.png",
            "sender":"Sneha",
            "sender_img":"http://simpleicon.com/wp-content/uploads/user1.png",
            "title":"Message from Sneha to Haridra.",
            "description":"Hi Haridra!!",
            "created_at":"2017-01-19 09:45:00",
            "important":"0",
            "replies" :[]
        }
	]);
	return true;
}
