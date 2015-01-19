'use strict';

var Q       = require('q');
var http = require('http');
/**
 * getLabel - passes in the config object from the client.
 * This function MUST exist and MUST return a string.
 */
exports.getLabel = function(property, settings){

    // this is the object saved from your the /input portion of the slab.
    var searchTerm  = 'example';

    if(settings && settings.searchTerm){
        searchTerm  = settings.searchTerm;
    }

    if(property === 'mentions'){
        return 'tweets containing ' + searchTerm;
    }

    return property + ' : bad property name';

};



/**
 * getData - passes in the config object from the client.
 * This function MUST exist and MUST return a promise.
 */
exports.getData = function(settings) {

    // this is the object saved from your the /input portion of the slab.
    var searchTerm  = 'example';
    var deferred = Q.defer();

    var data = {
        mentions : 0
    };

    if(settings && settings.searchTerm){
        searchTerm  = settings.searchTerm;
    }

    var req = http.request({
        host:'labs.benbru.com',
        port:80,
        path: '/search_twitter',
        method: 'POST',
        headers: {
            'User-Agent': 'benbru.com twitter app',
            'Content-Type' : 'application/json'
        }
    }, function(res){

        var output = '';
        res.setEncoding('utf8');
        console.log(res.statusCode);

        res.on('data', function (chunk) {
            output += chunk;
        });

        req.on('error', function(e) {
            deferred.error('problem with request: ' + e.message);
        });

        res.on('end', function(){
            var data = JSON.parse(output);
            deferred.resolve({
                mentions: data.count
            });
        });


    });

    req.end(JSON.stringify({keyword:searchTerm, id:keyword.searchTerm}));

    // Always return your promise here.
    return deferred.promise;

};
