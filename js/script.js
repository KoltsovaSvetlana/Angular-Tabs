var app = angular.module( "tab", ["ngRoute"] );

app.run( function($rootScope, $http) {
	$rootScope.loadError = false;

	$http.get("web/tabs.json")
		.success( function (data) {
			$rootScope.loadError = false;
			$rootScope.tabsData = sortOrder(data);
		})
		.error( function (data, status, headers, config) {
			$rootScope.loadError = true;
			$rootScope.errorMessage = "Couldn't load the list of Tabs, error # " + status;
		});

	function sortOrder(arr) {
		for(var i = 0, length = arr.length; i < length; i++){
			for(var j = i + 1, length = arr.length; j < length; j++){
				if (arr[j].order < arr[i].order) {
					var temp = arr[i];
					arr[i] = arr[j];
					arr[j] = temp;
				}
			}
		}
		return arr;
	};
});

app.controller("tabController", function ($scope, $window) {
	$scope.selectTab = function (id) {
		$scope.currentTab = id;
	};

	$scope.isSelected = function (id) {
		return $window.location.hash === "#/" + id;
	};
});

app.config( ["$routeProvider",
	function ($routeProvider) {
		var pathes = ["dummyList", "dummyChart", "dummyTable"];
		var path;

		for( var i = 0, length = pathes.length; i < length; i++) {
			path = pathes[i];
			$routeProvider.when("/" + path, { controller: "tabController", templateUrl: "tabs\\" + path + ".html" });
		}
		$routeProvider.otherwise({ redirectTo: "/" + pathes[0] });
	}
]);