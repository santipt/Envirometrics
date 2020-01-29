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
describe( "Test 17 : Probamos /distanciaRecorridaEnUnDia", function() {

  // ....................................................
  // PROBAMOS GET /buscarUnTipoDeMedidas
  // ....................................................

  var now = Date.now()


  it( "probar POST /insertarMedida", function( hecho ) {
    var datosMedida = {
      valorMedida : 56, tiempo : now,
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

  it( "probar POST /insertarMedida", function( hecho ) {
    var datosMedida = {
      valorMedida : 56, tiempo : now,
      latitud : 3, longitud: 4,
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

  it( "probar POST /insertarMedida", function( hecho ) {
    var datosMedida = {
      valorMedida : 56, tiempo : now,
      latitud : 1, longitud: 2,
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


  it( "probar get /distanciaRecorridaEnUnDia", function( hecho ) {

    request.get(
      { url : IP_PUERTO+"/distanciaRecorridaEnUnDia/1", headers : { 'User-Agent' : 'jordi' }},
      function( err, respuesta, carga ) {
        console.log(carga);
        /*var json = JSON.parse(carga);
        assert.equal( err, null, "¿ha habido un error?" )
        console.log(json);*/
        hecho()
      } // callback()
    ) // .get
  }) // it

  it( "probar get /buscarMedidasDelUltimoDiaDeUnUsuario", function( hecho ) {

    request.get(
      { url : IP_PUERTO+"/buscarMedidasDelUltimoDiaDeUnUsuario/1", headers : { 'User-Agent' : 'jordi' }},
      function( err, respuesta, carga ) {
        var json = JSON.parse(carga);
        assert.equal( err, null, "¿ha habido un error?" )
        console.log(json);
        hecho()
      } // callback()
    ) // .get
  }) // it

}) // describe
