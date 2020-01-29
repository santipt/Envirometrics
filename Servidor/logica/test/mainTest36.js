// ........................................................
// Autor: Emilio Esteve Peiró
// Fecha inicio: 24/10/2019
// Última actualización: 24/10/2019
// mainTest3.js
// ........................................................

const Logica = require("../Logica.js")
var assert = require('assert')
const sjcl = require('sjcl')
var laLogica =

  // ........................................................
  // main ()
  // ........................................................

  describe("TEST 23: buscarIdSensorPorIdUsuario", function() {
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

    it("buscamos idSensor por idUsuario",
      async function() {
        //DOY DE ALTA AL USUARIO
        await laLogica.darAltaUsuario({
          email: "eladirixd@gmail.com",
          password: "1234", telefono: "646601542"
        })

        var res1 = await laLogica.buscarUsuarioPorEmail("eladirixd@gmail.com")
        console.log(res1.idUsuario);

        // INSERTAMOS UN SENSOR
        await laLogica.insertarSensor({
          idTipoMedida: 1, idSensor: 7
        })

        var res = await laLogica.asociarSensorUsuario({idSensor:7, idUsuario: res1.idUsuario})
        console.log(res);
        assert.equal(res, 200)


      }) // it


    // ....................................................
    // ....................................................

    it("buscamos idSensor por idUsuario",
      async function() {
        var res = await laLogica.buscarIdSensorPorIdUsuario(4);
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
