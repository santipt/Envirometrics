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
describe( "Test 7 : Probamos /getTodasLasMedidas", function() {

  // ....................................................
  // PROBAMOS get /getTodasLasMedidas
  // ....................................................

  it( "probar get /getTodasLasMedidas", function( hecho ) {
    request.get(
      { url : IP_PUERTO+"/getTodasLasMedidas", headers : { 'User-Agent' : 'jordi' }},
      function( err, respuesta, carga ) {
        var listaJson = JSON.parse(carga);
        assert.equal( err, null, "¿ha habido un error?" )
        console.log(listaJson)
        assert.equal( listaJson.length, 1)
        hecho()
      } // callback()
    ) // .get
  }) // it

}) // describe
