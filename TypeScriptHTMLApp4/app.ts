/// <reference path="Scripts/typings/angularjs/angular.d.ts" />

var appModule = angular.module("myApp", []);

appModule.controller("MyController", ["$scope", "$log", "$location", "$anchorScroll","MyService", ($scope, $log, $location, $anchorScroll, MyService)
    => new Application.Controllers.MyController($scope, $log, $location, $anchorScroll, MyService)]);

appModule.factory("MyService", ["$http", "$location", "$log", ($http, $location, $log)
    => new Application.Services.MyService($http, $location, $log)]);

appModule.directive("myDirective", ()
    => new Application.Directives.MyDirective());

module Application.Controllers {

    import Services = Application.Services;

    export interface IMyScope extends ng.IScope {
        username: string;
        myService: Services.IMyService;
        message: string;
        search: any;
        user: any;
        error: string;
        repos: any;
    }

    export class MyController {

        scope: IMyScope;
        //scope: any;
        log:any;
        myService: Services.IMyService;
        location: ng.ILocationService;
        anchorScroll: ng.IAnchorScrollService;

        constructor($scope: IMyScope, $log: ng.ILogService, $location: ng.ILocationService, $anchorScroll:ng.IAnchorScrollService, myService: Services.IMyService) {
            this.log = $log;
            this.location = $location;
            this.scope = $scope;
            this.anchorScroll = $anchorScroll;
            this.scope.myService = myService;
            this.scope.message = "Angular/Typescript integration";
            this.scope.search = this.search;
            this.scope.username = "angular";
        }

        /*I don't know why I need fat arrow notation for this to work. Need to ask James*/
        search = (username) => {
            this.log.debug("searching user...");
            this.scope.myService.getUser(this.scope.username)
            .then(this.onUserComplete, this.onError);
        }

        onUserComplete = (data: any) => {
            this.log.debug("placing user data in scope...");
            this.scope.user = data;
            this.log.debug("calling getRepos...");
            this.scope.myService.getRepos(this.scope.user).then(this.onRepos, this.onError);
        }

        onError = (reason) => {
            this.log.error("logging error on console");
            this.scope.error = "Could not fetch the data";
        }

        onRepos = (data) => {
            this.log.debug("fetching repos..");
            this.scope.repos = data;
            this.location.hash("userDetails");
            this.anchorScroll();
        }

    }
}

module Application.Services {

    export interface IMyService {
        getUser(username: string)
        getRepos(user:any)
    }

    export class MyService {

        http: ng.IHttpService;
        location: ng.ILocationService;
        log: ng.ILogService;

        constructor($http: ng.IHttpService, $location: ng.ILocationService, $log:ng.ILogService) {
            this.http = $http;
            this.location = $location;
            this.log = $log;
        }

        getUser = (username: string) => {
            this.log.debug("fetching user data with $http service...");
            return this.http.get("https://api.github.com/users/" + username)
                .then((response) => {
                    return response.data;
                });
        }

        getRepos = (user: any) => {

            return this.http.get(user.repos_url)
                .then((response) => {
                    return response.data;
                });
        }

    }
}

module Application.Directives {
    export class MyDirective {
        constructor() {
            return this.CreateDirective();
        }
        private CreateDirective(): any {
            return {
                restrict: 'E',
                template: '<div>MyDirective</div>'
            };
        }
    }
}
