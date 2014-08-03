/// <reference path="Scripts/typings/angularjs/angular.d.ts" />

var appModule = angular.module("myApp", []);

appModule.controller("MyController", ["$scope", "$log", "MyService", ($scope, $log, MyService)
    => new Application.Controllers.MyController($scope, $log, MyService)]);

appModule.factory("MyService", ["$http", "$location", ($http, $location)
    => new Application.Services.MyService($http, $location)]);

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
    }

    export class MyController {

        scope: IMyScope;
        //scope: any;
        log:any;
        myService: Services.IMyService;

        constructor($scope: IMyScope, $log: ng.ILogService, myService: Services.IMyService) {
            this.log = $log;
            this.scope = $scope;
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

        onUserComplete = (data:any) => {
            this.scope.user = data;
        }

        onError() {
            this.log.error("Got an error fetching the user");
            this.scope.error = "Could not fetch the data";
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

        constructor($http: ng.IHttpService, $location: ng.ILocationService) {
            this.http = $http;
            this.location = $location;
        }

        getUser(username: string) {
            return this.http.get("https://api.github.com/users/" + username)
                .then((response) => {
                    return response.data;
                });
        }

        getRepos(user: any) {
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
