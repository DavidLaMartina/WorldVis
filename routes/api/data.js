var express             = require('express'),
    mysql               = require('./../../dbcon.js');
    router              = express.Router();

/* Get all entries from given data table */
router.get('/:table', function(req, res){
  if (req.params.table.toLowerCase() === 'units'){
    mysql.pool.query(`SELECT * FROM Units`)
    .then(results => res.json(results))
    .catch(error => res.json(error));
  }else{
    var sql = `SELECT Countries.name AS country, Countries.un_code,
                ${req.params.table}.year, ${req.params.table}.data FROM Countries
                RIGHT JOIN ${req.params.table}
                ON Countries.id = ${req.params.table}.country`;

    var results = {}
    mysql.pool.query(sql).then(function(rows){
      results.data = rows;
      return mysql.pool.query(`SELECT * FROM Units`);
    })
    .catch( error => res.json(error))
    .then(function(rows){
      results.units = rows;
      res.json(results);
    })
    .catch( error => res.json(error));
  }
})

module.exports = router;
