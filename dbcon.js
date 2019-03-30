var mysql         = require('promise-mysql');
var pool          = mysql.createPool({
  host            : 'localhost',
  user            : 'dlamartina',
  password        : 'password',
  database        : 'WorldVis'
});
module.exports.pool = pool;
