// ........................................................
// Autor: Santiago Pérez Torres
// Fecha inicio: 20/11/2019
// Última actualización: 20/11/2019
// testMapa.js
// ........................................................

const sqlite3 = require("sqlite3")

console.log("------ TEST MAPA CONTAMINACIÓN --------");

var medida = 0.0;
var idMedida = 1;

// abrir base de datos
let db = new sqlite3.Database("../../bd/datos.db", (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Conectado a datos.db ');
});

console.log("------ Borrar todas las medidas que tengan tipo de medida 2 --------");

//Para que no se repitan los idMedida
var textoSQL = 'delete from Medidas where idTipoMedida = ' + 2 + ';'

db.run(textoSQL);

console.log("------ Añadir medidas a la bd de manera gradual --------");

var textoSQL = 'insert into Medidas values( $valorMedida, $tiempo, $latitud, $longitud, $idMedida, $idUsuario, $idTipoMedida );'

for (var longitud = -0.5; longitud <= 0.5; longitud = longitud + 0.1) {
    for (var latitud = 38; latitud <= 39; latitud = latitud + 0.1) {

        console.log("longitud= " + longitud + " latitud= " + latitud + " medida= " + medida);

        var valoresParaSQL = {
            $valorMedida: medida,
            $tiempo: 1,
            $latitud: latitud,
            $longitud: longitud,
            $idUsuario: 1,
            $idTipoMedida: 2,
            $idMedida: idMedida++,
        }
    }
    db.run(textoSQL, valoresParaSQL);
    medida = medida + 2000;
}

// cerra la conexión con la base de datos
db.close((err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Cerrando la conexión a la bbdd');
});



