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
describe( "Test 1 : Recuerda arrancar el servidor", function() {

  // ....................................................
  // PROBAMOS POST /borrarFilasDe/<tabla>
  // ....................................................

  it( "probar POST /borrarFilasDe/Medidas", function( hecho ) {

    request.post(
      { url : IP_PUERTO+"/borrarFilasDe/Medidas",
      headers : { 'User-Agent' : 'jordi', 'Content-Type' : 'application/json' },
    },
    function( err, respuesta, carga ) {
      assert.equal( carga, "OK", "¿La carga no es OK" )
      hecho()
    } // callback
    ) // .post

  }) // it

  it( "probar POST /borrarFilasDe/UsuarioSensor", function( hecho ) {

        request.post(
          { url : IP_PUERTO+"/borrarFilasDe/UsuarioSensor",
          headers : { 'User-Agent' : 'jordi', 'Content-Type' : 'application/json' },
        },
        function( err, respuesta, carga ) {
          assert.equal( carga, "OK", "¿La carga no es OK" )
          hecho()
        } // callback
        ) // .post

  }) // it

  it( "probar POST /borrarFilasDe/Sensores", function( hecho ) {

        request.post(
          { url : IP_PUERTO+"/borrarFilasDe/Sensores",
          headers : { 'User-Agent' : 'jordi', 'Content-Type' : 'application/json' },
        },
        function( err, respuesta, carga ) {
          assert.equal( carga, "OK", "¿La carga no es OK" )
          hecho()
        } // callback
        ) // .post

  }) // it

  it( "probar POST /borrarFilasDe/TipoSensores", function( hecho ) {

        request.post(
          { url : IP_PUERTO+"/borrarFilasDe/TipoSensores",
          headers : { 'User-Agent' : 'jordi', 'Content-Type' : 'application/json' },
        },
        function( err, respuesta, carga ) {
          assert.equal( carga, "OK", "¿La carga no es OK" )
          hecho()
        } // callback
        ) // .post

  }) // it

  it( "probar POST /borrarFilasDe/Usuarios", function( hecho ) {

        request.post(
          { url : IP_PUERTO+"/borrarFilasDe/Usuarios",
          headers : { 'User-Agent' : 'jordi', 'Content-Type' : 'application/json' },
        },
        function( err, respuesta, carga ) {
          assert.equal( carga, "OK", "¿La carga no es OK" )
          hecho()
        } // callback
        ) // .post

  }) // it


}) // describe
