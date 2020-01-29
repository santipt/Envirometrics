// ........................................................
// Autor: Emilio Esteve Peiró
// Fecha inicio: 9/1/2020
// Última actualización: 9/1/2020
// mainTest32.js
// ........................................................
var request = require ('request')
var assert = require ('assert')
// ........................................................
// ........................................................
const IP_PUERTO="http://localhost:8080"
// ........................................................
// main ()
// ........................................................
describe( "Test 32 : Probamos /listaNombresMapas", function() {

  // ....................................................
  // PROBAMOS GET /buscarUnTipoDeMedidas
  // ....................................................

  it( "probar a obtener un mapa", function( hecho ) {

    request.get(
      { url : IP_PUERTO+"/mapa/lol.pdf", headers : { 'User-Agent' : 'jordi' }},
      function( err, respuesta, carga ) {
        var json = JSON.parse(carga)
        console.log(json);
        assert.equal( err, null, "¿ha habido un error?" )
        hecho()
      } // callback()
    ) // .get
  }) // it

}) // describe
