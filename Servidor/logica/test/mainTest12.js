// ........................................................
// Autor: Emilio Esteve Peiró
// Fecha inicio: 24/10/2019
// Última actualización: 24/10/2019
// mainTest2.js
// ........................................................

const Logica = require( "../Logica.js" )
var assert = require ('assert')

// ........................................................
// main ()
// ........................................................

describe( "TEST 2: DAR DE ALTA UN USUARIO", function() {
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

  it( "Puedo dar de alta a un usuario",
   async function() {

     //DOY DE ALTA AL USUARIO
     await laLogica.darAltaUsuario({
       email: "emilioxeraco@gmail.com",
       password: "1234", telefono: "646601542"
     })

     var haRegistradoElUsuario = await laLogica.darAltaUsuario({
       email: "emilioxeraco@gmail.com",
       password: "1234", telefono: "646601542"
     })

     var elUsuarioExiste = await laLogica.elUsuarioExiste("emilioxeraco@gmail.com")

     assert.equal(elUsuarioExiste, true)

     //BUSCO AL USUARIO POR SU EMAIL
     var res = await laLogica.buscarUsuarioPorEmail("emilioxeraco@gmail.com")

     // COMPRUEBO QUE ES ESE USUARIO
     assert.equal( res.idUsuario, 1, "El ID usuario es: " + res.idUsuario)

     var res2 = await laLogica.getUltimoIDUsuario();

     assert.equal( res2, 1 );

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
