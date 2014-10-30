(function (angular) {
    'use strict';

    angular
        .module('$q-spread', [])
        .config(['$provide', function ($provide) {

            $provide.decorator('$q', ['$delegate', function ($delegate) {

                var originalAll = $delegate.all;

                $delegate.all = function (promises) {
                    var promise = originalAll(promises);

                    /**
                     * Spread method, proxies to `then` but spreads the results for the resolve callback
                     * @param {Function} resolve
                     * @param {Function} reject
                     */
                    promise.spread = function (resolve, reject) {

                        function spread(data) {
                            resolve.apply(void 0, data);
                        }

                        promise.then(spread, reject);
                    };

                    return promise;
                };

                return $delegate;
            }]);
        }]);
})(window.angular);
