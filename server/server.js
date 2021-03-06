/**
 * Created by Anton on 3/20/2016.
 */

'use strict';

var app = require('./app');
var port = process.env.PORT || 3000;
var models = require("./models");

app.set('port', process.env.PORT || 3000);

models.sequelize.sync().then(function () {
  var server = app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + server.address().port);
  });
})

