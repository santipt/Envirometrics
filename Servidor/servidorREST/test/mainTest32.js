// ........................................................
// Autor: Joan Calabuig Artes
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
describe( "Test 32 : Probamos /obtenerDatosEstacionGandia", function() {

  // ....................................................
  // PROBAMOS GET /buscarUnTipoDeMedidas
  // ....................................................

  it( "probar get /calidadDelAireRespiradoEnElUltimoDia", function( hecho ) {

    request.get(
      { url : IP_PUERTO+"/obtenerDatosEstacionGandia", headers : { 'User-Agent' : 'jordi' }},
      function( err, respuesta, carga ) {
        var json = JSON.parse(carga)
        assert.equal( err, null, "¿ha habido un error?" )
        //Comprobamos que los valores obtenidos por la llamada del test corresponden con valores reales

        switch (json[json.length-1].co) {
          case '0.1':
            assert.equal(json[json.length-1].co, '0.1');
            break;
          case '0.2':
            assert.equal(json[json.length-1].co, '0.2');
            break;
          case '0.3':
            assert.equal(json[json.length-1].co, '0.3');
            break;
          case '0.4':
            assert.equal(json[json.length-1].co, '0.4');
            break;
          default:
            assert.equal(json[json.length-1].co, "TextoParaProvocarElError");
            break;
        }
        hecho()
      } // callback()
    ) // .get
  }) // it

}) // describe
