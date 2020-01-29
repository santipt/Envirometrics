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

describe( "TEST 4: INSERTAR UNA MEDICIÓN", function() {
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

  it( "Puedo insertar y buscar una Medición",
  async function() {

    var now = Date.now()

    // INSERTAMOS UNA MEDIDA
    await laLogica.insertarMedida({
      valorMedida: 15, tiempo: now,
      latitud: 0.0, longitud: 0.0,
      idUsuario: 1, idTipoMedida: 1,
    })

      await laLogica.insertarMedida({
        valorMedida: 45, tiempo: now,
        latitud: 0.0, longitud: 0.0,
        idUsuario: 1, idTipoMedida: 1,
      })

      var res = await laLogica.getUltimaMedidaDeUnUsuario( 1 );

      assert.equal( res.valorMedida, 45 )

    // COMPROBAMOS QUE NOS DA LA ULTIMA MEDIDA QUE HEMOS INSERTADO

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
