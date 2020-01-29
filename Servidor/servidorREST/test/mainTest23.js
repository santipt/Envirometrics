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
describe( "Test 13 : Probamos /cambiarTelefono", function() {

  // ....................................................
  // PROBAMOS POST /cambiarTelefono
  // ....................................................

  it( "probar post /cambiarTelefono", function( hecho ) {
    var datosUsuario = {
      email: "emilioxeraco@gmail.com", telefono: "842145547"
    }
    request.post(
      { url : IP_PUERTO+"/cambiarTelefono",
      headers : { 'User-Agent' : 'jordi', 'Content-Type' : 'application/json' },
      body : JSON.stringify( datosUsuario )
    },
    function( err, respuesta, carga ) {
      assert.equal( err, null, "¿ha habido un error?" )
      assert.equal( respuesta.statusCode, 200, "¿El código no es 200 (OK)" )
      assert.equal( carga, '{"respuesta":true}' )
      hecho()
    } // callback
    ) // .post
  }) // it

}) // describe
