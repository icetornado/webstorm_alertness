'use strict';

/* App Module */
//angular.module('Authentication', []);
//angular.module('Home', []);
 
var myApp = angular.module('AtoAlertnessApp', [
    //'Authentication',
    //'Home',
    'ngRoute',
    'ngCookies',
    'rzModule',
    'ngRadialGauge',
    'ui.bootstrap.collapse',
    'ui.bootstrap.accordion',
    'atoAlertnessControllers',
    'atoAlertnessServices'
]);

myApp.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/login', {
            controller: 'LoginController',
            templateUrl: 'views/login.html'
        })
        .when('/resetpassword', {
            controller: 'ResetPasswordController',
            templateUrl: 'views/resetPassword.html'
        })
        .when('/dashboard', {
            controller: 'DashboardController',
            templateUrl: 'views/dashboard.html'
        })
        .when('/chronotype', {
            controller: 'ChronotypeController',
            templateUrl: 'views/chronotype.html'
        })
        .when('/profile', {
            controller: 'ProfileController',
            templateUrl: 'views/profile.html'
        })
        .when('/sleepneed', {
            controller: 'SleepNeedController',
            templateUrl: 'views/sleepneed.html'
        })
        .when('/sleepdebt', {
            controller: 'SleepDebtController',
            templateUrl: 'views/sleepdebt.html'
        })
        .when('/checklist', {
            controller: 'ChecklistController',
            templateUrl: 'views/checklist.html'
        })
        .when('/insomnia', {
            templateUrl: 'views/insomnia.html'
        })
        .when('/rls', {
                templateUrl: 'views/rls.html'
        })
        .when('/plm', {
                templateUrl: 'views/plm.html'
        })
        .when('/apnea', {
            templateUrl: 'views/apnea.html'
        })
        .when('/sleepdisorder', {
            templateUrl: 'views/sleepdisorder.html'
        })
        .when('/todos', {
            controller: 'ToDosController',
            templateUrl: 'views/todos.html'
        })
        .when('/home', {
            templateUrl: 'views/home.html'
        })
        .when('/charts', {
            templateUrl: 'views/charts.html'
        })
        .when('/gauge', {
            controller: 'GaugeController',
            templateUrl: 'views/gauge.html'
        })
        .when('/gauge2', {
            controller: 'Gauge2Controller',
            templateUrl: 'views/gauge2.html'
        })
        .when('/mycharge', {
            controller: 'MyChargeController',
            templateUrl: 'views/mycharge.html'
        })
        .otherwise({ redirectTo: '/login' });
}]);
  
myApp.run(['$rootScope', '$location', '$window', '$cookieStore', '$http', 'TokenService', 'RememberMeService',
    function ($rootScope, $location, $window, $cookieStore, $http, TokenService, RememberMeService) {
        $rootScope.logout = false;
        $rootScope.csrfToken = $cookieStore.get('X-CSRF-TOKEN');
        $rootScope.location = $location.path();
        $rootScope.asGuest = $cookieStore.get("asGuestCookies");
       
        if($rootScope.csrfToken) {
            $http.defaults.headers.common['X-CSRF-TOKEN'] = $rootScope.csrfToken;
        }
        else {
            TokenService.getToken(function(response){
                if(response.success == "true") {
                    //console.log('get 1st csrf token ' + response.token);
                    $cookieStore.put('X-CSRF-TOKEN', response.token);
                    $rootScope.csrfToken = response.token;
                    $http.defaults.headers.common['X-CSRF-TOKEN'] = $rootScope.csrfToken;
                }
            });
        }
        
        $rootScope.isAuthenticated = false;
                
        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            console.log('on change fired');
            console.log($location.path());
            // keep user logged in after page refresh
            $rootScope.globals = $cookieStore.get('globals') || {};
            $rootScope.csrfToken = $cookieStore.get('X-CSRF-TOKEN');
            $rootScope.rememberMe = $cookieStore.get('alertness-rememberme');
            $rootScope.location = $location.path();
            
            //always get a new csrf token in login page
            if ($location.path() == '/login') {
                TokenService.getToken(function(response){
                    if(response.success == "true") {
                        //console.log('get login csrf token ' + response.token);
                        $cookieStore.put('X-CSRF-TOKEN', response.token);
                        $rootScope.csrfToken = response.token;
                        $http.defaults.headers.common['X-CSRF-TOKEN'] = $rootScope.csrfToken;
                    }
                });
            }
                
            if($rootScope.csrfToken) {
                $http.defaults.headers.common['X-CSRF-TOKEN'] = $rootScope.csrfToken;
            }
            else {
                TokenService.getToken(function(response){
                    if(response.success == "true") {
                        //console.log('get subsequent csrf token ' + response.token);
                        $cookieStore.put('X-CSRF-TOKEN', response.token);
                        $rootScope.csrfToken = response.token;
                        $http.defaults.headers.common['X-CSRF-TOKEN'] = $rootScope.csrfToken;
                    }
                });
            }
            
            if ($location.path() == '/login') { //check if in login page and rememberMe is set
                //temporary disable remember me check
                /*if($rootScope.rememberMe) {
                    var rememberCookie = angular.fromJson($rootScope.rememberMe);
                    $http.defaults.headers.common['Authorization'] = 'Basic ' + rememberCookie.token;
                    
                    RememberMeService.authenticateMe(function(res){
                        if(res.success == "true") {
                            AuthenticationService.SetCredentials(res.username, res.token);
                            $rootScope.isAuthenticated = true;
                        }

                        if($rootScope.isAuthenticated == true) {
                            if($location.path() == "/" || $location.path() == "/login")
                                $location.path('/profile');
                        }
                    });
                }*/
            }
            else if($rootScope.asGuest) {
                //doing nothing
                console.log('as guest');
            }
            else if (($location.path() !== '/login' && $location.path() !== '/resetpassword') && !$rootScope.globals.currentUser) { // redirect to login page if not logged in
                $location.path('/login');
            }
            console.log("after if");
            if ($rootScope.globals.currentUser) {
                $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata;
            }
            else {
                $http.defaults.headers.common['Authorization'] = 'Basic';
            }
        });
        
        $rootScope.$watch('logout', function(newValue, oldValue){
            if(newValue == true) {
                TokenService.getToken(function(response){
                    if(response.success == "true") {
                        //console.log('get subsequential csrf token in watch' + response.token);
                        $cookieStore.put('X-CSRF-TOKEN', response.token);
                        $rootScope.csrfToken = response.token;
                    }
                    $http.defaults.headers.common['X-CSRF-TOKEN'] = $rootScope.csrfToken;
                });
            }
        });
        //guarantee page move to top when loaded 
        $rootScope.$on('$routeChangeSuccess', function(evt, absNewUrl, absOldUrl){
            $window.scrollTo(0,0);    //scroll to top of page after each route change
        });
}]);

myApp.config(['$httpProvider', 
    function($httpProvider){
        //$httpProvider.defaults.useXDomain = true;
        //delete $httpProvider.defaults.headers.common['X-Requested-With'];
        // Use x-www-form-urlencoded Content-Type
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
        /**
         * The workhorse; converts an object to x-www-form-urlencoded serialization.
         * @param {Object} obj
         * @return {String}
         */ 
        var param = function(obj) {
            var query = '', name, value, fullSubName, subName, subValue, innerObj, i;

            for(name in obj) {
                value = obj[name];

                if(value instanceof Array) {
                    for(i=0; i<value.length; ++i) {
                        subValue = value[i];
                        fullSubName = name + '[' + i + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                }
                else if(value instanceof Object) {
                    for(subName in value) {
                        subValue = value[subName];
                        fullSubName = name + '[' + subName + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                }
                else if(value !== undefined && value !== null){
                    query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
                }
            }

            return query.length ? query.substr(0, query.length - 1) : query;
        };

        // Override $http service's default transformRequest
        /*$httpProvider.defaults.transformRequest = [function(data) {
            return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
        }];*/
    }
]);





