// ........................................................
// Autor: Emilio Esteve Peiró
// Fecha inicio: 24/10/2019
// Última actualización: 24/10/2019
// mainTest3.js
// ........................................................

const Logica = require( "../Logica.js" )
var assert = require ('assert')

// ........................................................
// main ()
// ........................................................

describe( "TEST 3: INSERTAR SENSOR", function() {
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

  it( "Puedo insertar y buscar un Sensor",
  async function() {

    // INSERTAMOS UN TIPO DE SENSOR
    await laLogica.insertarTipoSensor({
      idTipoMedida: 1, descripcion: "SENSOR DE CO"
    })

    // INSERTAMOS UN SENSOR
    await laLogica.insertarSensor({
      idTipoMedida: 1, idSensor: 1
    })

    // BUSCAMOS EL SENSOR QUE HEMOS INSERTADO
    var res = await laLogica.buscarSensor( 1 );

    assert.equal( res.idTipoMedida, 1 )

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
