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
describe( "Test 19 : Probamos /medidasDelUltimoDia", function() {

  // ....................................................
  // PROBAMOS GET /buscarUnTipoDeMedidas
  // ....................................................

  it( "probar get /medidasDelUltimoDia", function( hecho ) {

    request.get(
      { url : IP_PUERTO+"/medidasDelUltimoDia", headers : { 'User-Agent' : 'jordi' }},
      function( err, respuesta, carga ) {
        var json = JSON.parse(carga);
        assert.equal( err, null, "¿ha habido un error?" )
        console.log(json);
        assert.equal(json.length, 3)
        hecho()
      } // callback()
    ) // .get
  }) // it

}) // describe
