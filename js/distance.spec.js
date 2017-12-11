describe('Get distance', function () {
    var to = [
            {
                lat: -22.853840,
                lng: 19.882812
            },
            {
                lat: 44.514772,
                lng: 20.058594
            }
        ],
        from = {
            lat: 58.114637,
            lng: -4.375000
        },
        geoDist = window.geoDistance;

    it('should have toRad function on number prototype', function () {
        var num = 50;

        expect(typeof num.toRad).toBe('function');
        expect(num.toRad()).toEqual(0.8726646259971648);
    });

    it('should attach geoDistance on to window scope with functions', function () {
        expect(geoDist).toBeDefined();
        expect(typeof geoDist.distances).toBe('object');
        expect(typeof geoDist.distanceSort).toBe('function');
        expect(typeof geoDist.init).toBe('function');
        expect(typeof geoDist.retrieveDistance).toBe('function');
    });

    describe('Has the correct lengths available', function () {
        var distances = geoDist.distances;

        it('should have yards as a distance', function () {
            expect(distances.yards).toBeDefined();
            expect(distances.yards).toEqual(6967410);
        });

        it('should have km as a distance', function () {
            expect(distances.km).toBeDefined();
            expect(distances.km).toEqual(6371);
        });

        it('should have miles as a distance', function () {
            expect(distances.miles).toBeDefined();
            expect(distances.miles).toEqual(3959);
        });

        it('should have metres as a distance', function () {
            expect(distances.metres).toBeDefined();
            expect(distances.metres).toEqual(6371000);
        });

        it('should have feet as a distance', function () {
            expect(distances.feet).toBeDefined();
            expect(distances.feet).toEqual(20902231);
        });
    });

    describe('Check ordering of objects', function () {
        var toOrder = [
                {
                    distance: 5141690
                },
                {
                    distance: 3265390
                },
                {
                    distance: 5357190
                },
                {
                    distance: 5357190
                }
            ],
            toBe = [
                {
                    distance: 5357190
                },
                {
                    distance: 5141690
                },
                {
                    distance: 3265390
                }
            ];

        it('Should order ascending', function () {
            var ordered = geoDist.distanceSort(toOrder, 'asc');

            expect(ordered[0].distance).toBe(toBe[2].distance);
            expect(ordered[1].distance).toBe(toBe[1].distance);
            expect(ordered[2].distance).toBe(toBe[0].distance);
        });

        it('Should order descending', function () {
            var ordered = geoDist.distanceSort(toOrder, 'desc');

            expect(ordered[0].distance).toBe(toBe[0].distance);
            expect(ordered[1].distance).toBe(toBe[0].distance);
            expect(ordered[2].distance).toBe(toBe[1].distance);
        });

    });

    it('Should return the distance', function () {
        var data = {
                'earthRadius': 6967410,
                'decimals': 2,
                'dLat': -0.7592266063998,
                'dLng': -0.4264466633955314,
                'toLng': 20.058594,
                'fromLat': 1.0142917592513199,
                'toLat': 0.7769293371745812
            },
            distance = geoDist.retrieveDistance(data);

        expect(distance).toBe(5623014900);
    });

    describe('Init function retrieves the distances', function () {
        it('Uses geoDistance function sort and retrieve', function () {
            spyOn(geoDist, 'distanceSort');
            spyOn(geoDist, 'retrieveDistance');

            geoDist.init(from, to, 'asc', 'yards', 2);

            expect(geoDist.distanceSort).toHaveBeenCalled();
            expect(geoDist.retrieveDistance).toHaveBeenCalled();
        });

        it('Doesn\'t need decimals or length set', function () {
            var result = geoDist.init(from, to);

            expect(result[0].distance).toBe(3265390);
            expect(result[1].distance).toBe(5141690);
        });

        it('Takes a lng and lat using yards', function () {
            var resultYards = geoDist.init(from, to, 'asc', 'yards', 2);

            expect(resultYards[0].distance).toBe(3571078080);
            expect(resultYards[1].distance).toBe(5623014900);
        });

        it('Takes a lng and lat using km', function () {
            var resultKm = geoDist.init(from, to, 'asc', 'km', 2);

            expect(resultKm[0].distance).toBe(3265390);
            expect(resultKm[1].distance).toBe(5141690);
        });

        it('Takes a lng and lat using miles', function () {
            var resultMiles = geoDist.init(from, to, 'asc', 'miles', 2);

            expect(resultMiles[0].distance).toBe(2029150);
            expect(resultMiles[1].distance).toBe(3195090);
        });

        it('Takes a lng and lat using metres', function () {
            var resultMetres = geoDist.init(from, to, 'asc', 'metres', 2);

            expect(resultMetres[0].distance).toBe(3265393950);
            expect(resultMetres[1].distance).toBe(5141685060);
        });

        it('Takes a lng and lat using feet', function () {
            var resultFeet = geoDist.init(from, to, 'asc', 'feet', 2);

            expect(resultFeet[0].distance).toBe(10713234760);
            expect(resultFeet[1].distance).toBe(16869045500);
        });
    });

});
