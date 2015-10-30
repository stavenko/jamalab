var config = require('./config.json');
var _ = require('underscore');

module.exports.production = _.extend({}, config.default, config.production || {});
module.exports.test = _.extend({}, config.default, config.test || {})

