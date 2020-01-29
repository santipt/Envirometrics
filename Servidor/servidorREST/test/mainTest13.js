// ........................................................
// Autor: Emilio Esteve Peiró
// Fecha inicio: 24/10/2019
// Última actualización: 24/10/2019
// mainTest3.js
// ........................................................
var request = require ('request')
var assert = require ('assert')
// ........................................................
// ........................................................
const IP_PUERTO="http://localhost:8080"
// ........................................................
// main ()
// ........................................................
describe( "Test 3 : Probamos insertar y buscar sensores", function() {

  // ....................................................
  // PROBAMOS POST /insertarTipoSensor
  // ....................................................

  it( "probar POST /insertarTipoSensor", function( hecho ) {
    var datosTipoSensor = {
      idTipoMedida: 1, descripcion: "SENSOR DE CO"
    }
    request.post(
      { url : IP_PUERTO+"/insertarTipoSensor",
      headers : { 'User-Agent' : 'jordi', 'Content-Type' : 'application/json' },
      body : JSON.stringify( datosTipoSensor )
    },
    function( err, respuesta, carga ) {
      assert.equal( err, null, "¿ha habido un error?" )
      assert.equal( respuesta.statusCode, 200, "¿El código no es 200 (OK)" )
      hecho()
    } // callback
    ) // .post
  }) // it

// ....................................................
// PROBAMOS GET /medidaPorIdMedida/<idMedida>
// ....................................................

it( "probar POST /insertarSensor", function( hecho ) {
  var datosSensor = {
    idTipoMedida: 1, idSensor: 1
  }
  request.post(
    { url : IP_PUERTO+"/insertarSensor",
    headers : { 'User-Agent' : 'jordi', 'Content-Type' : 'application/json' },
    body : JSON.stringify( datosSensor )
  },
  function( err, respuesta, carga ) {
    assert.equal( err, null, "¿ha habido un error?" )
    assert.equal( respuesta.statusCode, 200, "¿El código no es 200 (OK)" )
    hecho()
  } // callback
  ) // .post
}) // it

// ....................................................
// PROBAMOS GET /medidasPorIdUsuario/<idUsuario>
// ....................................................

it( "GET /buscarSensor/1 responde con el sensor", function( hecho ) {
  request.get(
    { url : IP_PUERTO+"/buscarSensor/1", headers : { 'User-Agent' : 'jordi' }},
    function( err, respuesta, carga ) {
      var json = JSON.parse(carga);
      assert.equal( err, null, "¿ha habido un error?" )
      assert.equal( respuesta.statusCode, 200, "¿El código no es 200 (OK)" )
      assert.equal( json.idSensor, 1 )
      hecho()
    } // callback()
  ) // .get
}) // it

}) // describe
