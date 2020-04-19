var mysql = require('mysql');

var conexiondb = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'Corralejo#13',
    database: 'competencias'
});

//debemos exportar la variable de conexion definida antes
module.exports=conexiondb;