var sys = require('util'),
    http = require('http'),
    mysql = require('mysql');


http.createServer(function(req, res) {
  var parts = req.url.split("/"),
      searchVid = parts[1] 
      searchText = parts[2];

  // Test for empties
  if (typeof searchVid == 'undefined') {
    searchVid = '0';
  }

  if (typeof searchText == 'undefined') {
    searchText = 'zzz-undefined-zzz';
  }

  if (!(searchVid.length > 0 && searchText.length > 0)) {
    searchVid = '0';
    searchText = 'a'; 
  }

  if (isNaN(searchVid)) {
    searchVid = 0;
  }
  // End of tests

  var connection = mysql.createConnection(
    {
      host     : 'envisionme-dev.cklua31smzle.eu-west-1.rds.amazonaws.com',
      user     : 'envisionme_dev',
      password : '25#!34AC9de!##!794!##!e7942E',
      database : 'envisionme_dev',
    }
  );

  connection.connect();
 
  var queryString = 'SELECT tid, name FROM term_data WHERE name LIKE "%' + searchText + '%" AND vid = ' + searchVid;
 
  connection.query(queryString, function(err, rows, fields) {
    if (err) throw err;
 
    if (rows.length > 0) {

      for (var i in rows) {
        var result = rows[i].name;
        res.writeHead(200, {'Content-Type': 'text/plain'});
        
        var myarray = new Array();
        var obj = new Object();
        obj.id = rows[i].tid;
        obj.value = result;
        myarray.push(obj);
        res.end("" + JSON.stringify(myarray));
      }
     }
    else {
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end("");
    }
    });
 
    connection.end();  

}).listen(3000, "127.0.0.1");


