// ........................................................
// Autor: Emilio Esteve Peiró
// Fecha inicio: 24/10/2019
// Última actualización: 24/10/2019
// mainTest1.js
// ........................................................
var request = require ('request')
var assert = require ('assert')
// ........................................................
// ........................................................
const IP_PUERTO="http://localhost:8080"
// ........................................................
// main ()
// ........................................................
describe( "Test 11 : Probamos /darSensorAUsuario", function() {

  // ....................................................
  // PROBAMOS POST /darSensorAUsuario
  // ....................................................

  it( "probar post /darSensorAUsuario", function( hecho ) {
    var datosUsuario = {
      idUsuario:1, idSensor: 1
    }
    request.post(
      { url : IP_PUERTO+"/darSensorAUsuario",
      headers : { 'User-Agent' : 'jordi', 'Content-Type' : 'application/json' },
      body : JSON.stringify( datosUsuario )
    },
    function( err, respuesta, carga ) {
      assert.equal( err, null, "¿ha habido un error?" )
      assert.equal( respuesta.statusCode, 200, "¿El código no es 200 (OK)" )
      assert.equal( carga, "OK" )
      hecho()
    } // callback
    ) // .post
  }) // it

}) // describe
