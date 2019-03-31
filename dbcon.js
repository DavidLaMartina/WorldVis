var mysql         = require('promise-mysql');
// var pool          = mysql.createPool({
//   host            : 'localhost',
//   user            : 'dlamartina',
//   password        : 'password',
//   database        : 'WorldVis'
// });

var pool              = mysql.createPool({
  host                : 'us-cdbr-iron-east-03.cleardb.net',
  user                : 'b628454daf1b5a',
  password            : '19a4ae42',
  database            : 'heroku_73aae69f32f9eae'
})

module.exports.pool = pool;
