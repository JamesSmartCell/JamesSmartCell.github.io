/**
 * @author  Nick White <nickswhite89@gmail.com>
 * @description Returns the distance between Longitude and Latitude geographical
 *              distances
 * @version 1.0.0
 * @copyright Nick White
 *
 * Free to use under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Based Latitude/longitude spherical geodesy formulae & scripts
 * Copyright 2011 Chris Veness
 * Project Home: www.movable-type.co.uk/scripts/latlong.html
 *
 */

(function () {

    if (typeof(Number.prototype.toRad) === 'undefined') {
        /**
         * Converts numeric degrees to radians
         * @return {number} Returns the radian of the number
         */
        Number.prototype.toRad = function () {
            return this * Math.PI / 180;
        };
    }

    /**
     * GeoDistance
     * @namespace  geoDistance
     */
    window.geoDistance = {
        /**
         * Contains the radius of earth based on different distances such as
         * miles or kilometers (km)
         * @memberOf geoDistance
         * @type {Object}
         */
        distances: {
            'yards': 6967410,
            'km': 6371,
            'miles': 3959,
            'metres': 6371000,
            'feet': 20902231
        },
        /**
         * Sort the to object in ascending or descending order if called
         * @param  {object} toObj      [Going to Lng, Lat and distance]
         * @param  {number} toObj.lat  [Latitude]
         * @param  {number} toObj.lng  [Longitutde]
         * @param  {number} toObj.distance [Distance]
         * @param  {string} orderBy [Ascending or Descending]
         * @return {object}         [Object to, in order by distance]
         */
        distanceSort: function (toObj, orderBy) {
            toObj.sort(function (a, b) {
                var a1 = a.distance, b1 = b.distance;
                if (a1 == b1) { return 0; }
                return a1> b1 ? 1 : -1;
            });

            if (orderBy != 'asc') {
                toObj.reverse();
            }

            return toObj;
        },
        /**
         * Function to retrieve the difference in a human readable length such
         * as km between two difference longitude and latitude points
         * @function init
         * @memberOf geoDistance
         *
         * @param  {object} from    [Contains the main starting lng/lat point]
         * @param  {number} from.lat [Latitude]
         * @param  {number} from.lng [Longitutde]
         * @param  {array<object>}  to [Can contain multiple end lng/lat points]
         * @param  {number} to.lat [Latitude]
         * @param  {number} to.lng [Longitude]
         *
         * @return {Object}          [Returns the to object with the distance]
         */
        init: function (from, to, orderBy, length, decimals) {
            decimals = decimals || 2;
            length = length || 'km';

            var fromObj = from,
                toObj = to.slice(0),
                earthRadius = this.distances[length],
                fromLng = parseFloat(fromObj.lng),
                fromLat = parseFloat(fromObj.lat);

            fromLat = fromLat.toRad();

            for (var i = to.length - 1; i >= 0; i--) {
                var lngLat = toObj[i],
                    toLat = parseFloat(lngLat.lat),
                    toLng = parseFloat(lngLat.lng),
                    dLat = (fromLat - toLat).toRad(),
                    dLng = (fromLng - toLng).toRad(),
                    data = {
                        earthRadius: earthRadius,
                        decimals: decimals,
                        dLat: dLat,
                        dLng: dLng,
                        toLng: toLng,
                        fromLat: fromLat
                    };

                data.toLat = toLat.toRad();

                toObj[i].distance = this.retrieveDistance(data);
            }

            if (orderBy) {
                toObj = this.distanceSort(toObj, orderBy);
            }

            return toObj;
        },
        /**
         * Function which calculates a single distance between two points
         * @function retrieveDistance
         * @memberOf geoDistance
         * @param  {object} data [Created by the run function]
         * @param  {number} data.earthRadius [Contains the radius]
         * @param  {number} data.decimals [Contains the amount of decimals]
         * @param  {number} data.dLat [From minus to Lat radian]
         * @param  {number} data.dLng [From minus to Lng radian]
         * @param  {number} data.toLat [To Latitude]
         * @param  {number} data.toLng [To Longitude]
         * @param  {number} data.fromLat [From Latitude radian]
         * @return {number}      [Returns the caculated distance]
         */
        retrieveDistance: function (data) {
            var earthRadius = data.earthRadius,
                decimals = data.decimals,
                dLat = data.dLat,
                dLng = data.dLng,
                toLat = data.toLat,
                toLng = data.toLng,
                fromLat = data.fromLat,

                a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                    Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(toLat) *
                    Math.cos(fromLat),
                b = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)),
                c = earthRadius * b,
                d = (Math.round(c * Math.pow (10, decimals)) /
                    Math.pow(10, decimals)) * 1000;

            return d;
        }
    };

})();
