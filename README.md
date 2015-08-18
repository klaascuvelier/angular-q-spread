[![GitHub version](https://badge.fury.io/gh/showpad%2Fangular-q-spread.svg)](http://badge.fury.io/gh/showpad%2Fangular-q-spread)
[![Bower version](https://badge.fury.io/bo/angular-q-spread.svg)](http://badge.fury.io/bo/angular-q-spread)
[![NPM version](https://badge.fury.io/js/angular-q-spread.svg)](http://badge.fury.io/js/angular-q-spread)

[![Build Status](https://travis-ci.org/showpad/angular-q-spread.svg)](https://travis-ci.org/showpad/angular-q-spread)

angular-q-spread
================

Add `spread` method to all promises created by the $q service.

`spread` can be used as a replacement for `then`. Similarly, it takes two parameters, a callback when all promises are resolved and a callback for failure.
The resolve callback is going to be called with the result of the list of promises passed to $q.all as separate parameters instead of one parameters which is an array.

`spread` can be chained onto every promise.

#Compatibility
This plugin has been tested with Angular 1.2 and 1.3
 
#Usage
Add `$q-spread` as dependency when creating your angular module.

#Example
    angular.module('test', ['$q-spread']);
    
    function TestCtrl($scope, $q, MyService) {
        $scope.name = null;

        function firstCallback(firstname, lastname)
        {
            return firstname + ' ' + lastname;
        }

        function anotherCallback(fullname)
        {
            $scope.name = fullname;
        }

        function failureCallback(reason)
        {
            alert('Could not load data: ' + reason);
        }
        
        $q
            .all([
                MyService.getFirstname(),
                MyService.getLastname()
            ])
            .spread(firstCallback)
            .then(anotherCallback)
            .catch(failureCallback);
    };
    
    TestCtrl.$inject = ['$scope', '$q', 'MyService'];
    
    angular.module('test').controller('TestCtrl', TestCtrl);

# License
This Angular module has been published under the [MIT license](LICENSE)
