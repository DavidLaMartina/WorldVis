var mysql         = require('mysql');
var pool          = mysql.createPool({
  host            : 'localhost',
  user            : 'dlamartina',
  password        : '2470C0C06DEE42FD1618BB99005ADCA2EC9D1E19',
  database        : 'WorldVis'
});
module.exports.pool = pool;
