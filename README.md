[![Build Status](https://travis-ci.org/showpad/angular-q-spread.svg)](https://travis-ci.org/showpad/angular-q-spread)

angular-q-spread
================

Add `spread` method to the promise returned by $q.all.

`spread` can be used as a replacement for `then`. Similarly, it takes two parameters, a callback when all promises are resolved and a callback for failure.
The resolve callback is going to be called with the result of the list of promises passed to $q.all as separate parameters instead of one parameters which is an array.
 
#Usage
Add `$q-spread` as dependency when creating your angular module.

#Example
    angular.module('test', ['$q-spread']);
    
    function TestCtrl($scope, $q, MyService) {
        $scope.data1 = null;
        $scope.data2 = null;
    
        function dataSuccess(result1, result2) 
        {
            $scope.data1 = result1;
            $scope.data2 = result2;
        }
        
        function dataFailure(reason) 
        {
            alert('Could not load data: ' + reason);
        }
        
        $q
            .all([
                MyService.getData1(),
                MyService.getData2()
            ])
            .spread(dataSuccess, dataFailure);
    };
    
    TestCtrl.$inject = ['$scope', '$q', 'MyService'];
    
    angular.module('test').controller('TestCtrl', TestCtrl);

