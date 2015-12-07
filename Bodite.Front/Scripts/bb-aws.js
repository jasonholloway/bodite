(function () {

    var ng = require('angular');
    var AWS = require('aws-sdk');

    var app = ng.module('BoditeAdmin');



    app.service('aws', ['accessKeyProvider', function (accessKeyProv) {

        //or shouldn't we provide keys individually?
        //packing them all together into one cached object seems naff.
        //Should have single API key which we can store locally
        //Then all services will enquire for the exact details they need

        var awsKeys = accessKeyProv.getKeys().aws;

        AWS.config.update(awsKeys);

        AWS.config.region = 'eu-central-1';

        return AWS;
    }])




})();



