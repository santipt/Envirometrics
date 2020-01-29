// ........................................................
// Autor: Emilio Esteve Peiró
// Fecha inicio: 24/10/2019
// Última actualización: 24/10/2019
// mainTest3.js
// ........................................................

const Logica = require( "../Logica.js" )
var assert = require ('assert')
const sjcl = require ('sjcl')

// ........................................................
// main ()
// ........................................................

describe( "TEST 12: darSensorAUsuario", function() {
// ....................................................
// ....................................................

  var laLogica = null

// ....................................................
// ....................................................

  it( "conectar a la base de datos", function( hecho ) {
    laLogica = new Logica(
      "../bd/datos.db",
      function( err ) {
        if ( err ) {
          throw new Error ("No he podido conectar con datos.db")
        }
        hecho()
      })
    }) // it

// ....................................................
// ....................................................

  it( "ASociar un sensor no asociado a un usuario",
  async function() {

    var res = await laLogica.asociarSensorUsuario({idSensor:1, idUsuario:1})

    assert.equal(res, 200)
    

  }) // it

  // ....................................................
// ....................................................

it( "Asociar un sensor ya asociado a un usuario",
async function() {

  var res = await laLogica.asociarSensorUsuario({idSensor:1, idUsuario:1})

  assert.equal(res, 300)
  

}) // it

// ....................................................
// ....................................................

it( "Asociar un sensor que no existe",
async function() {

  var res = await laLogica.asociarSensorUsuario({idSensor:12, idUsuario:1})

  assert.equal(res, 404)

}) // it

// ....................................................
// ....................................................

  it( "cerrar conexión a la base de datos",
  async function() {
    try {
      await laLogica.cerrar()
    } catch( err ) {
      // assert.equal( 0, 1, "cerrar conexión a BD fallada: " + err)
      throw new Error( "cerrar conexión a BD fallada: " + err)
    }
  }) // it
}) // describe
