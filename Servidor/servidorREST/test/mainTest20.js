// ........................................................
// Autor: Joan Calabuig Artes
// Fecha inicio: 01/12/2019
// Última actualización: 01/12/2019
// mainTest20.js
// ........................................................
var request = require ('request')
var assert = require ('assert')
// ........................................................
// ........................................................
const IP_PUERTO="http://localhost:8080"
// ........................................................
// main ()
// ........................................................
describe( "Test 10 : Probamos /asociarSensorUSuario", function() {

  // ....................................................
  // PROBAMOS POST /asociarSensorUSuario
  // ....................................................


  it( "probar POST /asociarSensorUsuario", function( hecho ) {
    var datosMedida = {
      idUsuario: 1, idSensor: 1
    }
    request.post(
      { url : IP_PUERTO+"/asociarSensorUsuario",
      headers : { 'User-Agent' : 'jordi', 'Content-Type' : 'application/json' },
      body : JSON.stringify( datosMedida )
    },
    function( err, respuesta, carga ) {
      assert.equal( err, null, "¿ha habido un error?" )
      assert.equal( respuesta.statusCode, 200, "¿El código no es 200 (OK)" );
      hecho()
    } // callback
    ) // .post
  }) // it

  it( "probar POST /asociarSensorUsuario", function( hecho ) {
    var datosMedida = {
      idUsuario: 1, idSensor: 1
    }
    request.post(
      { url : IP_PUERTO+"/asociarSensorUsuario",
      headers : { 'User-Agent' : 'jordi', 'Content-Type' : 'application/json' },
      body : JSON.stringify( datosMedida )
    },
    function( err, respuesta, carga ) {
      assert.equal( err, null, "¿ha habido un error?" )
      assert.equal( respuesta.statusCode, 300, "El sensor ya pertenece a otra persona, 300" );
      hecho()
    } // callback
    ) // .post
  }) // it

  it( "probar POST /asociarSensorUsuario", function( hecho ) {
    var datosMedida = {
      idUsuario: 1, idSensor: 234156789
    }
    request.post(
      { url : IP_PUERTO+"/asociarSensorUsuario",
      headers : { 'User-Agent' : 'jordi', 'Content-Type' : 'application/json' },
      body : JSON.stringify( datosMedida )
    },
    function( err, respuesta, carga ) {
      assert.equal( err, null, "¿ha habido un error?" )
      assert.equal( respuesta.statusCode, 404, "El sensor no se encuentra en la base de datos" );
      hecho()
    } // callback
    ) // .post
  }) // it

}) // describe
