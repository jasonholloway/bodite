global.angular = require('angular');
require('angular-mocks');
global.module = angular.mock.module;
global.inject = angular.mock.inject;

global.$ = global.jQuery = require('jquery');

global.chai = require('chai');
chai.use(require('chai-shallow-deep-equal'));
global.expect = chai.expect;

global._ = require('lodash');

module.exports = {
    //...
}
