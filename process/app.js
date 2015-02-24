'use strict';

var Q = require('q');
var http = require('http');

var CLIENT_SECRET = process.env.TWITTER_BOT_SECRET;
/**
 * getLabel - passes in the config object from the client.
 * This function MUST exist and MUST return a string.
 */
exports.getLabel = function (property, settings) {

    // this is the object saved from your the /input portion of the slab.
    var searchTerm = 'example';

    if (settings && settings.searchTerm) {
        searchTerm = settings.searchTerm;
    }

    if (property === 'mentions') {
        return 'tweets containing ' + searchTerm;
    }
    return property + ' : bad property name';

};



/**
 * getData - passes in the config object from the client.
 * This function MUST exist and MUST return a promise.
 */
exports.getData = function (settings, networkId) {

    // this is the object saved from your the /input portion of the slab.
    var searchTerm = 'example';
    var deferred = Q.defer();

    if (settings && settings.searchTerm) {
        searchTerm = settings.searchTerm;
    }

    var id = networkId + searchTerm;

    var req = http.request({
        host: 'twitter.slabs.io',
        path: '/check',
        method: 'POST',
        headers: {
            'User-Agent': 'slabs.io twitter query',
            'Content-Type': 'application/json'
        }
    }, function (res) {

        var output = '';
        var data = {
            count: 0
        };

        res.setEncoding('utf8');

        res.on('data', function (chunk) {
            output += chunk;
        });

        req.on('error', function (e) {
            deferred.error('problem with request: ' + e.message);
        });

        res.on('end', function () {
            data = JSON.parse(output);
            deferred.resolve({
                mentions: data.count
            });
        });


    });

    req.end(JSON.stringify({
        query: searchTerm,
        id: id,
        clientSecret: CLIENT_SECRET,
        accessToken: settings.accessToken,
        accessSecret: settings.accessSecret
    }));

    // Always return your promise here.
    return deferred.promise;

};
