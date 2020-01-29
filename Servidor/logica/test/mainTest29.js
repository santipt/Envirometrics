// ........................................................
// Autor: Emilio Esteve Peiró
// Fecha inicio: 24/10/2019
// Última actualización: 24/10/2019
// mainTest3.js
// ........................................................

const Logica = require("../Logica.js")
var assert = require('assert')
const sjcl = require('sjcl')

// ........................................................
// main ()
// ........................................................

describe("TEST 19: getTaxistas", function() {
  // ....................................................
  // ....................................................

  var laLogica = null

  // ....................................................
  // ....................................................

  it("conectar a la base de datos", function(hecho) {
    laLogica = new Logica(
      "../bd/datos.db",
      function(err) {
        if (err) {
          throw new Error("No he podido conectar con datos.db")
        }
        hecho()
      })
  }) // it

  // ....................................................
  // ....................................................

  it("busco los taxistas",
    async function() {


      //DOY DE ALTA AL USUARIO
      await laLogica.darAltaUsuario({
        email: "emilioxeraco@taxista.com",
        password: "1234",
        telefono: "646601542"
      })

      var res = await laLogica.getTaxistas();
      console.log(res);

    }) // it

  // ....................................................
  // ....................................................

  it("cerrar conexión a la base de datos",
    async function() {
      try {
        await laLogica.cerrar()
      } catch (err) {
        // assert.equal( 0, 1, "cerrar conexión a BD fallada: " + err)
        throw new Error("cerrar conexión a BD fallada: " + err)
      }
    }) // it
}) // describe
