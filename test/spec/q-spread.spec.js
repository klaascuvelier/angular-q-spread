'use strict';

describe('$q-spread', function() {

    var $q, $rootScope;

    beforeEach(module('$q-spread'));

    beforeEach(inject(function(_$q_, _$rootScope_) {
        $q = _$q_;
        $rootScope = _$rootScope_;
    }));

    describe('$q.defer():', function () {

        var defer;

        beforeEach(function () {
            defer = new $q.defer();

            window.resolveCallback = function () {};
            window.rejectCallback = function () {};
        });

        describe('default behaviour of its promise:', function () {
            it('should have a then method', function () {
                expect(typeof defer.promise.then).toBe('function');
            });

            it('should call the resolve callback when the defer is resolved', function () {
                spyOn(window, 'resolveCallback');
                spyOn(window, 'rejectCallback');

                var result = 'some result';

                defer.promise.then(resolveCallback, rejectCallback);
                defer.resolve(result);
                $rootScope.$digest();

                expect(window.resolveCallback).toHaveBeenCalledWith(result);
                expect(window.rejectCallback).not.toHaveBeenCalled();
            });

            it('should call the reject callback when the defer is rejected', function () {
                 spyOn(window, 'resolveCallback');
                 spyOn(window, 'rejectCallback');

                 var reason = 'some reason';

                 defer.promise.then(resolveCallback, rejectCallback);
                 defer.reject(reason);
                 $rootScope.$digest();

                 expect(window.resolveCallback).not.toHaveBeenCalled();
                 expect(window.rejectCallback).toHaveBeenCalledWith(reason);
             });
        });

        describe('spread behaviour of its promise:', function () {
            it('should have a spread method', function () {
                expect(typeof defer.promise.spread).toBe('function');
            });

            it('should spread the results over the callback', function () {
                spyOn(window, 'resolveCallback');
                spyOn(window, 'rejectCallback');

                var result = ['result 1', 'result 2'];

                defer.promise.spread(resolveCallback, rejectCallback);
                defer.resolve(result);
                $rootScope.$digest();

                expect(window.resolveCallback).toHaveBeenCalledWith(result[0], result[1]);
                expect(window.rejectCallback).not.toHaveBeenCalled();
            });

            it('should reject the same way as then', function () {
                spyOn(window, 'resolveCallback');
                spyOn(window, 'rejectCallback');

                var reason = ['reason 1', 'reason 2'];

                defer.promise.spread(resolveCallback, rejectCallback);
                defer.reject(reason);
                $rootScope.$digest();

                expect(window.resolveCallback).not.toHaveBeenCalled();
                // regular call, not spread
                expect(window.rejectCallback).toHaveBeenCalledWith(reason);
            });

            it('should be chainable', function () {
                expect(typeof defer.promise.spread().then).toBe('function')
            });
        });

    });

    describe('$q.when():', function () {

        beforeEach(function () {
            window.resolveCallback = function () {};
            window.rejectCallback = function () {};
        });

        describe('default behaviour:', function () {
            it('should have a then method', function () {
                expect(typeof $q.when().then).toBe('function');
            });

            it('should resolve the promise with the specified value', function () {
                spyOn(window, 'resolveCallback');
                spyOn(window, 'rejectCallback');

                var result = 'some result';

                $q.when(result).then(resolveCallback, rejectCallback);
                $rootScope.$digest();

                expect(window.resolveCallback).toHaveBeenCalledWith(result);
                expect(window.rejectCallback).not.toHaveBeenCalled();
            });
        });

        describe('spread behaviour:', function () {
            it('should have a spread method', function () {
                expect(typeof $q.when().spread).toBe('function');
            });

            it('should spread the results over the callback', function () {
                spyOn(window, 'resolveCallback');
                spyOn(window, 'rejectCallback');

                var result = ['result 1', 'result 2'];

                $q.when(result).spread(resolveCallback, rejectCallback);
                $rootScope.$digest();

                expect(window.resolveCallback).toHaveBeenCalledWith(result[0], result[1]);
                expect(window.rejectCallback).not.toHaveBeenCalled();
            });

            it('should be chainable', function () {
                expect(typeof $q.when().spread().then).toBe('function');
            });
        });
    });

    describe('$q.all():', function () {

        beforeEach(function () {
            window.resolveCallback = function () {};
            window.rejectCallback = function () {};
        });

        describe('default behaviour:', function () {
            it('should have a then method', function () {
                expect(typeof $q.all([]).then).toBe('function');
            });

            it('should resolve the promise with an array with the results of all its promises', function () {
                spyOn(window, 'resolveCallback');
                spyOn(window, 'rejectCallback');

                var result1 = 'result 1';
                var result2 = 'result 2';

                $q
                    .all([$q.when(result1), $q.when(result2)])
                    .then(resolveCallback, rejectCallback);

                $rootScope.$digest();

                expect(window.resolveCallback).toHaveBeenCalledWith([result1, result2]);
                expect(window.rejectCallback).not.toHaveBeenCalled();
            });

            it('should reject the promise when one of its promises fails', function () {
                spyOn(window, 'resolveCallback');
                spyOn(window, 'rejectCallback');

                var result1 = 'result 1';
                var reason2 = 'reason 2';

                $q
                    .all([$q.when(result1), $q.reject(reason2)])
                    .then(resolveCallback, rejectCallback);

                $rootScope.$digest();

                expect(window.resolveCallback).not.toHaveBeenCalled();
                expect(window.rejectCallback).toHaveBeenCalledWith(reason2);
            });
        });

        describe('spread behaviour:', function () {
            it('should have a spread method', function () {
                expect(typeof $q.all([]).spread).toBe('function');
            });

            it('should spread the results over the callback', function () {
                spyOn(window, 'resolveCallback');
                spyOn(window, 'rejectCallback');

                var result1 = 'result 1';
                var result2 = 'result 2';

                $q
                    .all([ $q.when(result1), $q.when(result2) ])
                    .spread(resolveCallback, rejectCallback);
                $rootScope.$digest();

                expect(window.resolveCallback).toHaveBeenCalledWith(result1, result2);
                expect(window.rejectCallback).not.toHaveBeenCalled();
            });

            it('should call reject callback with the plain reason when on of its promises is rejected', function () {
                spyOn(window, 'resolveCallback');
                spyOn(window, 'rejectCallback');

                var result1 = 'result 1';
                var reason2 = 'reason 2';

                $q
                    .all([ $q.when(result1), $q.reject(reason2) ])
                    .spread(resolveCallback, rejectCallback);
                $rootScope.$digest();

                expect(window.resolveCallback).not.toHaveBeenCalled();
                expect(window.rejectCallback).toHaveBeenCalledWith(reason2);
            });

            it('should be chainable', function () {
                expect(typeof $q.all([]).spread().then).toBe('function');
            });
        });
    });

    describe('$q.then():', function () {

        beforeEach(function () {
            window.resolveCallback1 = function (data1, data2) {
                return data1 + ' ' + data2;
            };

            window.rejectCallback1 = function () {};

            window.resolveCallback2 = function (data1, data2) {
                return data1 + '-' + data2;
            };

            window.rejectCallback2 = function () {};

            window.finalCallback = function () {};
        });

        it('should implement spread behaviour', function () {

            spyOn(window, 'resolveCallback1').and.callThrough();
            spyOn(window, 'rejectCallback1').and.callThrough();
            spyOn(window, 'resolveCallback2').and.callThrough();
            spyOn(window, 'rejectCallback2').and.callThrough();
            spyOn(window, 'finalCallback').and.callThrough();


            var result1 = 'result 1';
            var result2 = 'result 2';
            var result3 = 'result 3';

            $q.when(result1)
                .then(function (firstResult) {
                    return $q.all([ $q.when(firstResult), $q.when(result2) ]);
                })
                .spread(window.resolveCallback1, window.rejectCallback1)
                .then(function (secondResult) {
                    return [secondResult, result3];
                })
                .spread(window.resolveCallback2, window.rejectCallback2)
                .then(finalCallback);

            $rootScope.$digest();

            expect(window.rejectCallback1).not.toHaveBeenCalled();
            expect(window.rejectCallback2).not.toHaveBeenCalled();

            expect(window.resolveCallback1).toHaveBeenCalledWith(result1, result2);
            expect(window.resolveCallback2).toHaveBeenCalledWith(result1 + ' ' + result2, result3);

            expect(window.finalCallback).toHaveBeenCalledWith(result1 + ' ' + result2 + '-' + result3);
        });

    });

});
