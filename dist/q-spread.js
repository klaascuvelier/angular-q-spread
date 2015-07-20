(function (angular) {
    'use strict';

    angular
        .module('$q-spread', [])
        .config(['$provide', function ($provide) {

            $provide.decorator('$q', ['$delegate', function ($delegate) {

                /**
                 * Creates the method to spread the result
                 * @param promise
                 * @returns {Function}
                 */
                function spread(promise)
                {
                    /**
                     * Spread method, proxies to `then` but spreads the results for the resolve callback
                     * @param {Function} resolve
                     * @param {Function} reject
                     */
                    return function (resolve, reject) {
                        function spreadResult(data) {
                            if (typeof resolve === 'function') {
                                return resolve.apply(void 0, data);
                            }
                        }

                        return promise.then(spreadResult, reject);
                    };
                }

                /**
                 * Decorate the promise of a method returning a defer with the spread method
                 * @param {function} method
                 * @returns {function}
                 */
                function decorateDeferMethod(method)
                {
                    return function ()
                    {
                        var parameters  = Array.prototype.slice.call(arguments, 0);
                        var instance    = method.apply(method, parameters);

                        instance.promise.spread = spread(instance.promise);
                        instance.promise.then   = decorateThen(instance.promise);

                        return instance;
                    };
                }

                /**
                 * Decorate the promise of a method with the spread method
                 * @param {function} method
                 * @returns {function}
                 */
                function decoratePromiseMethod(method)
                {
                    return function ()
                    {
                        var parameters  = Array.prototype.slice.call(arguments, 0);
                        var promise     = method.apply(method, parameters);

                        promise.spread  = spread(promise);
                        promise.then    = decorateThen(promise);

                        return promise;
                    };
                }

                /**
                 * Decorate `then` methods created through the other decoration methods
                 * @param promise
                 * @returns {Function}
                 */
                function decorateThen(promise)
                {
                    var thenMethod = promise.then;

                    return function ()
                    {
                        var parameters  = Array.prototype.slice.call(arguments, 0);
                        var result = thenMethod.apply(promise, parameters);

                        result.spread = spread(result);

                        return result;
                    };
                }

                $delegate.defer     = decorateDeferMethod($delegate.defer);
                $delegate.when      = decoratePromiseMethod($delegate.when);
                $delegate.all       = decoratePromiseMethod($delegate.all);

                // Resolve is only added in Angular 1.4.1
                if (typeof $delegate.resolve === 'function') {
                    $delegate.resolve   = decoratePromiseMethod($delegate.resolve);
                }

                return $delegate;
            }]);
        }]);
})(window.angular);