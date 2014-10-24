'use strict';

describe('$q-spread: $q.all', function() {

    var $q, $rootScope;

    beforeEach(module('$q-spread'));

    beforeEach(inject(function(_$q_, _$rootScope_) {
        $q = _$q_;
        $rootScope = _$rootScope_;
    }));

    describe('`then` method', function () {

        it('should exist', function () {
            expect($q.all([]).then).toBeDefined();
        });

        it('should call the resolve method with 1 argument which is an array on success', function () {
            var defer1 = new $q.defer(),
                defer2 = new $q.defer();

            window.allSuccess = function () {};

            spyOn(window, 'allSuccess').and.callThrough();

            $q
                .all([
                    defer1.promise,
                    defer2.promise
                ])
                .then(allSuccess);

            defer1.resolve(1);
            defer2.resolve('b');

            $rootScope.$digest();

            expect(allSuccess).toHaveBeenCalledWith([1, 'b']);
        });

        it('should call the defer method with the reason of the failed defer on failure', function () {
            var defer1 = new $q.defer(),
                defer2 = new $q.defer();

            window.allFailure = function () {};

            spyOn(window, 'allFailure').and.callThrough();

            $q
                .all([
                    defer1.promise,
                    defer2.promise
                ])
                .then(null, allFailure);

            defer1.resolve(1);
            defer2.reject('b');

            $rootScope.$digest();

            expect(allFailure).toHaveBeenCalledWith('b');
        });

    });

    describe('`spread` method', function () {

        it('should exist', function () {
            expect($q.all([]).spread).toBeDefined();
        });

        it('should call the resolve method with list of arguments which is an array on success', function () {
            var defer1 = new $q.defer(),
                defer2 = new $q.defer();

            window.allSuccess = function (result1, result2) {};

            spyOn(window, 'allSuccess').and.callThrough();

            $q
                .all([
                    defer1.promise,
                    defer2.promise
                ])
                .spread(allSuccess);

            defer1.resolve(1);
            defer2.resolve('b');

            $rootScope.$digest();

            expect(allSuccess).toHaveBeenCalledWith(1, 'b');
        });

        xit('should call the defer method with the reason of the failed defer on failure', function () {
            var defer1 = new $q.defer(),
                defer2 = new $q.defer();

            window.allFailure = function () {};

            spyOn(window, 'allFailure').and.callThrough();

            $q
                .all([
                    defer1.promise,
                    defer2.promise
                ])
                .spread(null, allFailure);

            defer1.resolve(1);
            defer2.reject('b');

            $rootScope.$digest();

            expect(allFailure).toHaveBeenCalledWith('b');
        });

    });
});
