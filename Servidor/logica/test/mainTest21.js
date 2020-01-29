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

describe( "TEST 11: cambiar datos de Usuario", function() {
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

  it( "cambio la contraseña de un usuario",
  async function() {

    await laLogica.cambiarPassword({email:"emilioxeraco@gmail.com", password:"4321"})

    var res = await laLogica.buscarUsuarioPorEmail("emilioxeraco@gmail.com");
    var laNuevaPassword = sjcl.decrypt("emilioxeraco@gmail.com", res.password)
    assert.equal(laNuevaPassword, 4321)

    await laLogica.cambiarEmail({email:"emilioxeraco@gmail.com", emailNuevo:"oilime@gmail.com"})
    var res2 = await laLogica.buscarUsuarioPorEmail("oilime@gmail.com");
    console.log(res2)
    assert.equal(res2.email, "oilime@gmail.com")

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
