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

describe("TEST 18:distancia recorrida por un usuario en un dia", function() {
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

  it("distancia recorrida en un dia",
    async function() {

      var now = Date.now()

      await laLogica.darAltaUsuario({
        email: "emilioxeraco@gmail.com",
        password: "1234",
        telefono: "646601542"
      })

      await laLogica.insertarMedida({
        valorMedida: 15,
        tiempo: now,
        latitud: 2,
        longitud: 2,
        idUsuario: 1,
        idTipoMedida: 1,
      })

      await laLogica.insertarMedida({
        valorMedida: 45,
        tiempo: 0,
        latitud: 1,
        longitud: 2,
        idUsuario: 1,
        idTipoMedida: 1,
      })

      var lista = [{
        latitud: 1,
        longitud: 2
      }, {
        latitud: 2,
        longitud: 2
      }];

      var res2 = laLogica.calcularDistanciaEntreLosPuntosDeUnaLista(lista);
      //console.log(res2);

      var res3 = await laLogica.distanciaRecorridaEnUnDiaPorIdUsuario(1)
      console.log(res3);
      var res4 = false;
      if( res3 > 300 ){
        res4 = true;
      }
      assert.equal(res4, false)

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
