// ........................................................
// Autor: Emilio Esteve Peiró
// Fecha inicio: 24/10/2019
// Última actualización: 24/10/2019
// mainTest1.js
// ........................................................

const Logica = require( "../Logica.js" )
var assert = require ('assert')

// ........................................................
// main ()
// ........................................................

describe( "TEST 1: BORRAR FILAS DE LA BD", function() {
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

  it( "Puedo borrar filas de la bd",
  async function() {

    //BORRO LAS FILAS DE LAS SIGUIENTES TABLAS
    await laLogica.borrarFilasDe("Medidas")
    await laLogica.borrarFilasDe("UsuarioSensor")
    await laLogica.borrarFilasDe("Sensores")
    await laLogica.borrarFilasDe("TipoSensores")
    await laLogica.borrarFilasDe("Usuarios")

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
