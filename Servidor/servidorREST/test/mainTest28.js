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
describe( "Test 18 : Probamos /taxistasFiltradosQueNoHanEnviadoEn24H", function() {

  // ....................................................
  // PROBAMOS GET /buscarUnTipoDeMedidas
  // ....................................................

  it( "probar POST /darAltaUsuario", function( hecho ) {
    var datosUsuario = {
      email: "emilioxeraco@taxista.com",
      password: "1234", telefono: "646601542"
    }
    request.post(
      { url : IP_PUERTO+"/darAltaUsuario",
      headers : { 'User-Agent' : 'jordi', 'Content-Type' : 'application/json' },
      body : JSON.stringify( datosUsuario )
    },
    function( err, respuesta, carga ) {
      assert.equal( err, null, "¿ha habido un error?" )
      assert.equal( respuesta.statusCode, 200, "¿El código no es 200 (OK)" )
      console.log(carga);
      hecho()
    } // callback
    ) // .post
  }) // it

  it( "probar get /taxistasFiltradosQueNoHanEnviadoEn24H", function( hecho ) {

    request.get(
      { url : IP_PUERTO+"/taxistasFiltradosQueNoHanEnviadoEn24H", headers : { 'User-Agent' : 'jordi' }},
      function( err, respuesta, carga ) {
        var json = JSON.parse(carga);
        assert.equal( err, null, "¿ha habido un error?" )
        console.log(json);
        assert.equal(json.length, 1)
        hecho()
      } // callback()
    ) // .get
  }) // it

}) // describe
