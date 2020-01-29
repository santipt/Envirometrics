// ........................................................
// Autor: Emilio Esteve Peiró
// Fecha inicio: 24/10/2019
// Última actualización: 24/10/2019
// mainTest2.js
// ........................................................
var request = require ('request')
var assert = require ('assert')
// ........................................................
// ........................................................
const IP_PUERTO="http://localhost:8080"
// ........................................................
// main ()
// ........................................................
describe( "Test 4 : Probamos insertar y buscar medidas", function() {

  // ....................................................
  // PROBAMOS POST /insertarMedida
  // ....................................................

  it( "probar POST /insertarMedida", function( hecho ) {
    var datosMedida = {
      valorMedida : 74, tiempo : 350,
      latitud : 0.0, longitud: 0.0,
      idUsuario: 1, idTipoMedida: 1
    }
    request.post(
      { url : IP_PUERTO+"/insertarMedida",
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

// ....................................................
// PROBAMOS GET /medidasPorIdUsuario/<idUsuario>
// ....................................................

it( "GET /medidasPorIdUsuario/1 responde con las Medidas de ese Usuario", function( hecho ) {
  request.get(
    { url : IP_PUERTO+"/medidasPorIdUsuario/1", headers : { 'User-Agent' : 'jordi' }},
    function( err, respuesta, carga ) {
      var json = JSON.parse(carga);
      assert.equal( err, null, "¿ha habido un error?" )
      assert.equal( respuesta.statusCode, 200, "¿El código no es 200 (OK)" )
      if( json.length == 0 ){
        assert.equal( json[0].valorMedida, 74, "¿La medida es 74?" + json[0].valorMedida )
      } else{
        assert.equal( json[json.length - 1].valorMedida, 74, "¿La medida es 74?" + json[json.length - 1].valorMedida )
      }
      hecho()
    } // callback()
  ) // .get
}) // it

// ....................................................
// PROBAMOS GET /medidasPorIdUsuario/<idUsuario>
// ....................................................

it( "GET /ultimaMedida/1 responde con la última Medida tomada por el Usuario", function( hecho ) {
  request.get(
    { url : IP_PUERTO+"/ultimaMedida/1", headers : { 'User-Agent' : 'jordi' }},
    function( err, respuesta, carga ) {
      var json = JSON.parse(carga);
      assert.equal( err, null, "¿ha habido un error?" )
      assert.equal( respuesta.statusCode, 200, "¿El código no es 200 (OK)" )
      assert.equal( json.valorMedida, 74, "¿La medida es 74?" + json.valorMedida )
      hecho()
    } // callback()
  ) // .get
}) // it

}) // describe
