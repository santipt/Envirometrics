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

describe( "TEST 14: cambiarTelefono", function() {
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

  it( "cambio el telefono de un usuario",
  async function() {

    await laLogica.darAltaUsuario({email:"emiliet@xd", telefono:"3434", password:"1234"})
    var res = await laLogica.buscarUsuarioPorEmail("emiliet@xd")
    console.log(res);;
    await laLogica.cambiarTelefono({email:"emiliet@xd", telefono:"62142"});
    var res2 = await laLogica.buscarUsuarioPorEmail("emiliet@xd")
    console.log(res2)
    assert.equal(res2.telefono, "62142")

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
