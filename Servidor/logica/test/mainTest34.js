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

describe("TEST 23: getDatosEstacionGandia", function() {
  // ....................................................
  // ....................................................

  var now = Date.now()
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

  it("getDatosEstacionGandia",
    async function() {

      var res = await laLogica.getDatosEstacionGandia()
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
