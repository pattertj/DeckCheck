angular.module('cardService', [])

	// super simple service
	// each function returns a promise object 
	.factory('Cards', ['$http',function($http) {
		return {
			get : function(name) {
				return $http.get('/api/cards/' + name);
			}
		}
	}]);