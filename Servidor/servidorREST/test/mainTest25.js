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
describe( "Test 15 : Probamos /borrarSensor", function() {

  // ....................................................
  // PROBAMOS POST /borrarSensor
  // ....................................................

  it( "probar post /borrarSensor", function( hecho ) {

    request.post(
      { url : IP_PUERTO+"/borrarSensor/1",
      headers : { 'User-Agent' : 'jordi', 'Content-Type' : 'application/json' },
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
