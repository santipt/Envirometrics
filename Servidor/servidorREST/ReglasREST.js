// .....................................................................
// Autor: Emilio Esteve Peiró
// Fecha inicio: 24/10/2019
// Última actualización: 24/10/2019
// ReglasREST.js
// .....................................................................

const path = require('path')
const multer = require('multer')
var fs = require('fs')


module.exports.cargar = function (servidorExpress, laLogica) {

  // .......................................................
  // GET /prueba
  // .......................................................
  servidorExpress.get('/prueba', function (peticion, respuesta) {
    console.log(" * GET /prueba ")
    respuesta.send("¡Funciona!")
  }) // get /prueba

  // .......................................................
  // GET /medidaPorIdMedida/<idMedida>
  // .......................................................
  servidorExpress.get('/medidaPorIdMedida/:idMedida',
    async function (peticion, respuesta) {
      console.log(" * GET /medidasPorIdMedida ")
      // averiguo la fecha
      var idMedida = peticion.params.idMedida
      // llamo a la función adecuada de la lógica
      var res = await laLogica.buscarMedidasPorIdMedida(idMedida)
      // si no hay resultados...
      if (res) {
        // 404: not found
        respuesta.status(404).send("no encontré medidas con esa id " + idMedida)
        return
      }
      // todo ok
      respuesta.send(JSON.stringify(res))
    }) // get /medidaPorIdMedida/<idMedida>

  // .......................................................
  // GET /medidasPorIdUsuario/<idMedida>
  // .......................................................
  servidorExpress.get('/medidasPorIdUsuario/:idUsuario',
    async function (peticion, respuesta) {
      console.log(" * GET /medidasPorIdUsuario ")
      // averiguo la fecha
      var idUsuario = peticion.params.idUsuario
      // llamo a la función adecuada de la lógica
      var res = await laLogica.buscarMedidasPorIdUsuario(idUsuario)
      // si no hay resultados...
      if (res.length == 0) {
        // 404: not found
        respuesta.status(404).send("no encontré medidas con esa id " + idUsuario)
        return
      }
      // todo ok
      respuesta.send(JSON.stringify(res))
    }) // get /medidasPorIdUsuario/<idUsuario>

  // .......................................................
  // GET /ultimoIdUsuario
  // .......................................................
  servidorExpress.get('/ultimoIdUsuario',
    async function (peticion, respuesta) {
      console.log(" * GET /ultimoIdUsuario ")

      var res = await laLogica.getUltimoIDUsuario()

      respuesta.send({ ultimoIdUsuario: res })
    }) // get /ultimoIdUsuario

  // .......................................................
  // GET /medidasPorIdUsuario/<idMedida>
  // .......................................................
  servidorExpress.get('/ultimaMedida/:idUsuario',
    async function (peticion, respuesta) {
      console.log(" * GET /ultimaMedida ")
      // averiguo la fecha
      var idUsuario = peticion.params.idUsuario
      // llamo a la función adecuada de la lógica
      var res = await laLogica.getUltimaMedidaDeUnUsuario(idUsuario)
      // si no hay resultados...
      if (res == undefined) {
        // 404: not found
        respuesta.status(404).send("no encontré medidas con esa id " + idUsuario)
        return
      }
      // todo ok
      respuesta.send(JSON.stringify(res))
    }) // get /medida/<idMedida>

  // .......................................................
  // GET /medidasPorIdUsuario/<idMedida>
  // .......................................................
  servidorExpress.get('/elUsuarioTieneMedidas/:idUsuario',
    async function (peticion, respuesta) {
      console.log(" * GET /elUsuarioTieneMedidas ")
      // averiguo la fecha
      var idUsuario = peticion.params.idUsuario
      // llamo a la función adecuada de la lógica
      var res = await laLogica.elUsuarioTieneMedidas(idUsuario)
      // si no hay resultados...
      if (res == false) {
        // 404: not found
        respuesta.send({
          respuesta: false
        })
        return
      }
      // todo ok
      respuesta.send({
        respuesta: true
      })
    }) // get /medida/<idMedida>

  // .......................................................
  // GET /medidasPorIdUsuario/<idMedida>
  // .......................................................
  servidorExpress.get('/buscarSensor/:idSensor',
    async function (peticion, respuesta) {
      console.log(" * GET /buscarSensor ")

      var idSensor = peticion.params.idSensor
      // busco el sensor por su id
      var res = await laLogica.buscarSensor(idSensor)
      // si no hay resultados...
      if (res.length == 0) {
        // 404: not found
        respuesta.status(404).send("no encontré sensor con esa id " + idSensor)
        return
      }
      // todo ok
      respuesta.send(JSON.stringify(res))
    }) // get /medida/<idMedida>

  // .......................................................
  // GET /usuarios
  // .......................................................
  servidorExpress.get('/usuarios',
    async function (peticion, respuesta) {
      console.log(" * GET /usuarios ")
      // busco los usuarios
      var res = await laLogica.getUsuarios()
      // si no hay resultados...
      if (res.length == 0) {
        // 404: not found
        respuesta.status(404).send("No encontré usuarios")
        return
      }
      // todo ok
      respuesta.send(JSON.stringify(res))
    }) // get /usuarios


  // ......................................................
  // GET /relacionesUsuarioSensor
  // .......................................................
  servidorExpress.get('/relacionesUsuarioSensor',
    async function (peticion, respuesta) {
      console.log(" * GET /usuarios ")
      // busco las relacionesUsuarioSensor
      var res = await laLogica.buscarRelacionesUsuarioSensor()
      // si no hay resultados...
      if (res == undefined) {
        // 404: not found
        respuesta.status(404).send({ respuesta: "No hay relacionesUsuarioSensor" })
        return
      }
      // todo ok
      respuesta.send(JSON.stringify(res))
    }) // get /relacionesUsuarioSensor

  // ......................................................
  // GET /listaNombresMapas
  // .......................................................
  servidorExpress.get('/listaNombresMapas',
    async function (peticion, respuesta) {
      console.log(" * GET /listaNombresMapas ")
      // busco las relacionesUsuarioSensor
      var res = await laLogica.buscarTodosLosMapas('../ux/mapas')
      // todo ok
      respuesta.send(JSON.stringify(res))
    }) // get /listaNombresMapas

  // ......................................................
  // GET /distanciaRecorridaEnUnDia/<idUsuario>
  // .......................................................
  servidorExpress.get('/distanciaRecorridaEnUnDia/:idUsuario',
    async function (peticion, respuesta) {
      console.log(" * GET /distanciaRecorrida ")

      var idUsuario = peticion.params.idUsuario;

      // busco las relacionesUsuarioSensor
      var res = await laLogica.distanciaRecorridaEnUnDiaPorIdUsuario(idUsuario)

      // si no hay resultados...
      if (res == false) {
        // 404: not found
        respuesta.status(404).send("No hay medidas suficientes")
        return
      }

      //console.log("distancia " + res);
      // todo ok
      respuesta.send({
        respuesta: res
      })
    }) // get /distanciaRecorridaEnUnDia

  // ......................................................
  // GET /medidasDelUltimoDiaDeUnUsuario/<idUsuario>
  // .......................................................
  servidorExpress.get('/medidasDelUltimoDiaDeUnUsuario/:idUsuario',
    async function (peticion, respuesta) {
      console.log(" * GET /distanciaRecorrida ")

      var idUsuario = peticion.params.idUsuario;

      // busco las relacionesUsuarioSensor
      var res = await laLogica.buscarMedidasDelUltimoDiaDeUnUsuario(idUsuario)

      // si no hay resultados...
      if (res == false) {
        // 404: not found
        respuesta.status(404).send("No hay medidas suficientes")
        return
      }

      //console.log("distancia " + res);
      // todo ok
      respuesta.send({
        respuesta: res
      })
    }) // get /medidasDelUltimoDiaDeUnUsuario

  // ......................................................
  // GET /medidasDelUltimoDia
  // .......................................................
  servidorExpress.get('/medidasDelUltimoDia',
    async function (peticion, respuesta) {
      console.log(" * GET /medidasDelUltimoDia ")

      // busco las relacionesUsuarioSensor
      var res = await laLogica.buscarMedidasDelUltimoDia()

      // si no hay resultados...
      if (res == false) {
        // 404: not found
        respuesta.status(404).send("No hay medidas suficientes")
        return
      }

      respuesta.send(res)
    }) // get /medidasDelUltimoDia

  // ......................................................
  // GET /buscarMedidasDelUltimoDiaDeUnUsuario/<idUsuario>
  // .......................................................
  servidorExpress.get('/buscarMedidasDelUltimoDiaDeUnUsuario/:idUsuario',
    async function (peticion, respuesta) {
      console.log(" * GET /buscarMedidasDelUltimoDiaDeUnUsuario ")

      var idUsuario = peticion.params.idUsuario;
      // busco las relacionesUsuarioSensor
      var res = await laLogica.buscarMedidasDelUltimoDiaDeUnUsuario(idUsuario)
      console.log(res);
      // si no hay resultados...
      if (res == false) {
        // 404: not found
        respuesta.status(404).send("No hay medidas suficientes")
        return
      }
      // todo ok
      respuesta.send(res)
    }) // get /relacionesUsuarioSensor

  // ......................................................
  // GET /calidadDelAireRespiradoEnElUltimo/<idUsuario>
  // .......................................................
  servidorExpress.get('/calidadDelAireRespiradoEnElUltimoDia/:idUsuario',
    async function (peticion, respuesta) {
      console.log(" * GET /calidadDelAireRespiradoEnElUltimoDia ")

      var idUsuario = peticion.params.idUsuario;
      // busco las relacionesUsuarioSensor
      var res = await laLogica.calidadDelAireRespiradoEnElUltimoDiaPorUnUsuario(idUsuario)
      // si no hay resultados...
      if (res == false) {
        // 404: not found
        respuesta.status(404).send("No hay medidas suficientes")
        return
      }
      // todo ok
      respuesta.send({
        respuesta: res
      })
    }) // get /relacionesUsuarioSensor

  // .......................................................
  // GET /getTodasLasMedidas
  // .......................................................
  servidorExpress.get('/getTodasLasMedidas',
    async function (peticion, respuesta) {
      console.log(" * GET /getTodasLasMedidas ")

      var res = await laLogica.getTodasLasMedidas()
      // si no hay resultados...
      if (res.length == 0) {
        // 404: not found
        respuesta.status(404).send("No encontré medidas")
        return
      }
      // todo ok
      respuesta.send(res)
    }) // get /getTodasLasMedidas

  // .......................................................
  // GET /getTodasLasMedidasDeUnUsuarioPorEmail/<email>
  // .......................................................
  servidorExpress.get('/getTodasLasMedidasDeUnUsuarioPorEmail/:email',
    async function (peticion, respuesta) {
      console.log(" * GET /getTodasLasMedidasDeUnUsuarioPorEmail ")

      var email = peticion.params.email

      var res = await laLogica.getTodasLasMedidasDeUnUsuarioPorEmail(email)
      // si no hay resultados...
      if (res.length == 0) {
        // 404: not found
        respuesta.status(404).send("No encontré medidas")
        return
      }
      // todo ok
      respuesta.send(JSON.stringify(res))
    }) // get /getTodasLasMedidas

  // .......................................................
  // GET /taxistasFiltradosQueNoHanEnviadoEn24H
  // .......................................................
  servidorExpress.get('/taxistasFiltradosQueNoHanEnviadoEn24H',
    async function (peticion, respuesta) {
      console.log(" * GET /taxistasFiltradosQueNoHanEnviadoEn24H ")

      var res = await laLogica.filtrarTaxistasQueNoHanEnviadoEn24H()
      // todo ok
      respuesta.send(JSON.stringify(res))
    }) // get /taxistasFiltradosQueNoHanEnviadoEn24H

  // .......................................................
  // GET /getTodasLasMedidasDeUnUsuarioPorEmail/<email>
  // .......................................................
  servidorExpress.get('/buscarIDUsuarioQueTieneElSensor/:idSensor',
    async function (peticion, respuesta) {
      console.log(" * GET /buscarIDUsuarioQueTieneElSensor ")

      var idSensor = peticion.params.idSensor

      var res = await laLogica.buscarIDUsuarioQueTieneElSensor(idSensor)

      // todo ok
      respuesta.send(JSON.stringify(res))
    }) // get /getTodasLasMedidas

  // .......................................................
  // GET /buscarUnTipoDeMedidas/<idTipoMedida>
  // .......................................................
  servidorExpress.get('/buscarUnTipoDeMedidas/:idTipoMedida',
    async function (peticion, respuesta) {
      console.log(" * GET /buscarUnTipoDeMedidas ")

      var idTipoMedida = peticion.params.idTipoMedida

      var res = await laLogica.buscarUnTipoDeMedidas(idTipoMedida)

      // todo ok
      respuesta.send(JSON.stringify(res))
    }) // get /getTodasLasMedidas

  // .......................................................
  // GET /obtenerDatosEstacionGandia
  // .......................................................
  servidorExpress.get('/obtenerDatosEstacionGandia',
    async function (peticion, respuesta) {
      console.log(" * GET /obtenerDatosEstacionGandia ")

      var res = await laLogica.getDatosEstacionGandia()

      //console.log(res)
      // todo ok
      respuesta.send(JSON.stringify(res))
    }) // get /obtenerDatosEstacionGandia

  // .......................................................
  // GET /obtenerFactorCalibracion
  // .......................................................
  servidorExpress.get('/obtenerFactorCalibracion',
    async function (peticion, respuesta) {
      console.log(" * GET /obtenerFactorCalibracion")

      var res = await laLogica.getDatosEstacionGandia()

      respuesta.send(JSON.stringify(res[res.length - 1].co))
    }) // get /obtenerFactorCalibracion

  // .......................................................
  // GET /mapa/<nombreMapa>
  // .......................................................
  servidorExpress.get('/mapa/:nombreMapa',
    async function (peticion, respuesta) {
      console.log(" * GET /mapa")

      var data = fs.readFileSync('../ux/mapas/' + peticion.params.nombreMapa);
      respuesta.contentType("application/pdf");
      respuesta.send(data);

    }) // get /mapa/<nombreMapa>

  //-----------------------------------------------------------------------------
  // POST /insertarMedida
  // peticion.body --> JSON
  // al llamarlo deberemos insertar un JSON en el body para que lo pueda procesar.
  //-----------------------------------------------------------------------------
  servidorExpress.post('/insertarMedida',
    async function (peticion, respuesta) {
      console.log(" * POST /insertarMedida ")
      var datos = JSON.parse(peticion.body)
      // supuesto procesamiento
      console.log(peticion.body);

      // llamamos al método de la lógica que se encarga de insertar medida
      await laLogica.insertarMedida(datos);

      // enviarmos una respuesta que demuestra que todo ha salido correctamente
      respuesta.send({
        laRespuesta: "OK"
      });
      console.log("Peticion POST insertarMedida recibido");
    }) // post / insertarMedida

  //-----------------------------------------------------------------------------
  // POST /cambiarPassword
  // peticion.body --> JSON
  // al llamarlo deberemos insertar un JSON en el body para que lo pueda procesar.
  //-----------------------------------------------------------------------------
  servidorExpress.post('/cambiarPassword',
    async function (peticion, respuesta) {
      console.log(" * POST /cambiarPassword ")
      var datos = JSON.parse(peticion.body)
      // supuesto procesamiento
      console.log(peticion.body);

      await laLogica.cambiarPassword(datos)
      // enviarmos una respuesta que demuestra que todo ha salido correctamente
      respuesta.send({
        respuesta: "OK"
      });
      console.log("Peticion POST cambiarPassword recibido");
    }) // post / cambiarPassword

  //-----------------------------------------------------------------------------
  // POST /cambiarEmail
  // peticion.body --> JSON
  // al llamarlo deberemos insertar un JSON en el body para que lo pueda procesar.
  //-----------------------------------------------------------------------------
  servidorExpress.post('/cambiarEmail',
    async function (peticion, respuesta) {
      console.log(" * POST /cambiarEmail ")
      var datos = JSON.parse(peticion.body)
      // supuesto procesamiento
      console.log(peticion.body);

      var res = await laLogica.buscarUsuarioPorEmail(datos.emailNuevo);

      if (res != undefined) {
        respuesta.send({
          respuesta: false
        });
      }

      await laLogica.cambiarEmail(datos)
      // enviarmos una respuesta que demuestra que todo ha salido correctamente
      respuesta.send({
        respuesta: true
      });

      console.log("Peticion POST cambiarEmail recibido");
    }) // post / cambiarEmail

  //-----------------------------------------------------------------------------
  // POST /borrarRelacionUsuarioSensor/<idUsuario>
  // peticion.body --> JSON
  // al llamarlo deberemos insertar un JSON en el body para que lo pueda procesar.
  //-----------------------------------------------------------------------------
  servidorExpress.post('/borrarRelacionUsuarioSensorPorIdUsuario/:idUsuario',
    async function (peticion, respuesta) {

      var res = await laLogica.borrarRelacionUsuarioSensorPorIdUsuario(peticion.params.idUsuario);

      respuesta.send({
        respuesta: true
      });

      console.log("Peticion POST /borrarRelacionUsuarioSensor recibido");
    }) // post /borrarRelacionUsuarioSensor/:idUsuario

  //-----------------------------------------------------------------------------
  // POST /cambiarEmail
  // peticion.body --> JSON
  // al llamarlo deberemos insertar un JSON en el body para que lo pueda procesar.
  //-----------------------------------------------------------------------------
  servidorExpress.post('/cambiarTelefono',
    async function (peticion, respuesta) {
      console.log(" * POST /cambiarTelefono ")
      var datos = JSON.parse(peticion.body)
      // supuesto procesamiento
      console.log(peticion.body);

      await laLogica.cambiarTelefono(datos)
      // enviarmos una respuesta que demuestra que todo ha salido correctamente
      respuesta.send({
        respuesta: true
      });

      console.log("Peticion POST cambiarTelefono recibido");
    }) // post / cambiarTelefono

  //-----------------------------------------------------------------------------
  // POST /darAltaUsuario
  // peticion.body --> JSON
  // al llamarlo deberemos insertar un JSON en el body para que lo pueda procesar.
  //-----------------------------------------------------------------------------
  servidorExpress.post('/darAltaUsuario',
    async function (peticion, respuesta) {
      console.log(" * POST /darAltaUsuario ")
      var datos = JSON.parse(peticion.body)
      // supuesto procesamiento
      console.log(peticion.body);

      // llamamos al método de la lógica que se encarga de registrar usuario
      var seHaRegistradoElUsuario = await laLogica.darAltaUsuario(datos);

      var res = await laLogica.buscarUsuarioPorEmail(datos.email)

      console.log(seHaRegistradoElUsuario)

      if (seHaRegistradoElUsuario) {
        respuesta.send({
          respuesta: seHaRegistradoElUsuario,
          idUsuario: res.idUsuario
        })
      }

      respuesta.send({
        respuesta: seHaRegistradoElUsuario
      })

      console.log("Peticion POST darAltaUsuario recibido");
    }) // post / darAltaUsuario

  //-----------------------------------------------------------------------------
  // POST /insertarSensor
  // peticion.body --> JSON
  // al llamarlo deberemos insertar un JSON en el body para que lo pueda procesar.
  //-----------------------------------------------------------------------------
  servidorExpress.post('/insertarSensor',
    async function (peticion, respuesta) {
      console.log(" * POST /insertarSensor ")
      var datos = JSON.parse(peticion.body)
      // supuesto procesamiento
      console.log(peticion.body);

      // llamamos al método de la lógica que se encarga de insertar medida
      await laLogica.insertarSensor(datos);

      // enviarmos una respuesta que demuestra que todo ha salido correctamente
      respuesta.send("OK");
      console.log("Peticion POST insertarSensor recibido");
    }) // post / insertarSensor

  //-----------------------------------------------------------------------------
  // POST /insertarSensor
  // peticion.body --> JSON
  // al llamarlo deberemos insertar un JSON en el body para que lo pueda procesar.
  //-----------------------------------------------------------------------------
  servidorExpress.post('/insertarTipoSensor',
    async function (peticion, respuesta) {
      console.log(" * POST /insertarTipoSensor ")
      var datos = JSON.parse(peticion.body)
      // supuesto procesamiento
      console.log(peticion.body);

      // llamamos al método de la lógica que se encarga de insertar medida
      await laLogica.insertarTipoSensor(datos);

      // enviarmos una respuesta que demuestra que todo ha salido correctamente
      respuesta.send({
        laRespuesta: "OK"
      });
      console.log("Peticion POST insertarSensor recibido");
    }) // post / insertarTipoSensor

  //-----------------------------------------------------------------------------
  // POST /iniciarSesion
  // peticion.body --> JSON
  // al llamarlo deberemos insertar un JSON en el body para que lo pueda procesar.
  //-----------------------------------------------------------------------------
  servidorExpress.post('/iniciarSesion',
    async function (peticion, respuesta) {
      console.log(" * POST /iniciarSesion ")
      var datos = JSON.parse(peticion.body)
      // supuesto procesamiento
      console.log(peticion.body);

      // llamamos al método de la lógica que se encarga de insertar medida
      var res = await laLogica.iniciarSesion(datos);
      var res2 = await laLogica.buscarUsuarioPorEmail(datos.email)
      console.log(res)

      if (res) {
        respuesta.send({
          respuesta: true,
          idUsuario: res2.idUsuario,
          telefono: res2.telefono
        });
      }

      respuesta.send({
        respuesta: false
      });


      console.log("Peticion POST insertarSensor recibido");
    }) // post / iniciarSesion

  //-----------------------------------------------------------------------------
  // POST /iniciarSesion
  // peticion.body --> JSON
  // al llamarlo deberemos insertar un JSON en el body para que lo pueda procesar.
  //-----------------------------------------------------------------------------
  servidorExpress.post('/iniciarSesionAdmin',
    async function (peticion, respuesta) {
      console.log(" * POST /iniciarSesion ")
      var datos = JSON.parse(peticion.body)
      // supuesto procesamiento
      console.log(peticion.body);

      // llamamos al método de la lógica que se encarga de insertar medida
      var res = await laLogica.iniciarSesionAdmin(datos);
      console.log(res)

      if (res) {
        respuesta.send(true);
      }

      respuesta.send(false);


      console.log("Peticion POST insertarSensor recibido");
    }) // post / iniciarSesion

  //-----------------------------------------------------------------------------
  // POST /borrarFilasDe/<tabla>
  // peticion.body --> JSON
  // al llamarlo deberemos insertar un JSON en el body para que lo pueda procesar.
  //-----------------------------------------------------------------------------
  servidorExpress.post('/borrarFilasDe/:tabla',
    async function (peticion, respuesta) {

      var tabla = peticion.params.tabla;

      await laLogica.borrarFilasDe(tabla);

      respuesta.send("OK")

    }) // post / borrarFilasDe/<tabla>

  //-----------------------------------------------------------------------------
  // POST /darSensorAUsuario
  // peticion.body --> JSON
  // al llamarlo deberemos insertar un JSON en el body para que lo pueda procesar.
  //-----------------------------------------------------------------------------
  servidorExpress.post('/darSensorAUsuario',
    async function (peticion, respuesta) {

      console.log(" * POST /darSensorAUsuario ")

      var datos = JSON.parse(peticion.body)

      //var res = await laLogica.darSensorAUsuario(datos);

      respuesta.sendStatus(200);
      respuesta.send("OK");
      console.log("Peticion POST darSensorAUsuario recibido");

    }) // post / darSensorAUsuario

  //-----------------------------------------------------------------------------
  // POST /borrarUsuario/<idUsuario>
  // peticion.body --> JSON
  // al llamarlo deberemos insertar un JSON en el body para que lo pueda procesar.
  //-----------------------------------------------------------------------------
  servidorExpress.post('/borrarUsuario/:idUsuario',
    async function (peticion, respuesta) {

      console.log(" * POST /borrarUsuario ")

      var idUsuario = peticion.params.idUsuario
      await laLogica.borrarUsuarioPorIdUsuario(idUsuario);

      respuesta.send("OK")

      console.log("Peticion POST borrarUsuario recibido");

    }) // post / darSensorAUsuario

  //-----------------------------------------------------------------------------
  // POST /borrarSensor/<idSensor>
  // peticion.body --> JSON
  // al llamarlo deberemos insertar un JSON en el body para que lo pueda procesar.
  //-----------------------------------------------------------------------------
  servidorExpress.post('/borrarSensor/:idSensor',
    async function (peticion, respuesta) {

      console.log(" * POST /borrarSensor ")

      var idSensor = peticion.params.idSensor
      await laLogica.borrarSensorPorIdSensor(idSensor);

      respuesta.send("OK")

      console.log("Peticion POST borrarSensor recibido");

    }) // post / darSensorAUsuario

  //-----------------------------------------------------------------------------
  // POST /asociarSensorUsuario
  // peticion.body --> JSON
  // al llamarlo deberemos insertar un JSON en el body para que lo pueda procesar.
  //-----------------------------------------------------------------------------
  servidorExpress.post('/asociarSensorUsuario',
    async function (peticion, respuesta) {

      console.log(" * POST /asociarSensorUsuario")

      var datos = JSON.parse(peticion.body)

      console.log("datos" + peticion.body);

      var res = await laLogica.asociarSensorUsuario(datos);

      if (res == 200) {
        //respuesta.send("OK")
        respuesta.sendStatus(200);
      } else if (res == 404) {
        //respuesta.send("No OK, sensor no existe en DB");
        respuesta.sendStatus(404);
      } else if (res == 300) {
        //respuesta.send("No Ok, sensor ya pertenece a otra persona")
        respuesta.sendStatus(300);
      } else {
        respuesta.send(res);
      }

      console.log("Peticion POST asociarSensorUsuario recibida");

    }) // post / asociarSensorUsuario

  //-----------------------------------------------------------------------------
  // POST /subirImagen
  // peticion.body --> JSON{file: String}
  // al llamarlo deberemos insertar una imagen en el body para que lo pueda procesar.
  //-----------------------------------------------------------------------------
  servidorExpress.post('/subirImagen',
    async function (peticion, respuesta) {
      console.log(" * POST /subirImagen ")

      var datos = JSON.parse(peticion.body)

      var res = await laLogica.guardarImagenEnCarpeta(datos);
      
      respuesta.send( Buffer(res).toString('base64'));

    }) // post / subirImagen


  //-----------------------------------------------------------------------------
  // GET /ux/<pagina>
  //-----------------------------------------------------------------------------
  servidorExpress.get('/ux/:pagina', function (peticion, respuesta) {
    console.log(" servint html normal: " + peticion.params.pagina)

    var elPath = path.join(__dirname, '..', 'ux');
    respuesta.sendFile(elPath + "/" + peticion.params.pagina);
  });

  //-----------------------------------------------------------------------------
  // GET /ux/html/<pagina>
  //-----------------------------------------------------------------------------
  servidorExpress.get('/ux/html/:pagina', function (peticion, respuesta) {
    console.log(" servint html normal: " + peticion.params.pagina)

    var elPath = path.join(__dirname, '..', 'ux', 'html');
    respuesta.sendFile(elPath + "/" + peticion.params.pagina);
  });

  //-----------------------------------------------------------------------------
  // GET /ux/css/<estilos>
  //-----------------------------------------------------------------------------
  servidorExpress.get('/ux/css/:estilos', function (peticion, respuesta) {
    console.log(" servint css: " + peticion.params.estilos)

    var elPath = path.join(__dirname, '..', 'ux', 'css');
    respuesta.sendFile(elPath + "/" + peticion.params.estilos);
  });

  //-----------------------------------------------------------------------------
  // GET /ux/images/<imagen>
  //-----------------------------------------------------------------------------
  servidorExpress.get('/ux/images/:imagen', function (peticion, respuesta) {
    console.log(" servint imagenes: " + peticion.params.imagen)

    var elPath = path.join(__dirname, '..', 'ux', 'images');
    respuesta.sendFile(elPath + "/" + peticion.params.imagen);
  });

  //-----------------------------------------------------------------------------
  // GET /ux/mapas/<mapa>
  //-----------------------------------------------------------------------------
  servidorExpress.get('/ux/mapas/:mapa', function (peticion, respuesta) {
    console.log(" servint mapa: " + peticion.params.mapa)

    var elPath = path.join(__dirname, '..', 'ux', 'mapas');
    respuesta.sendFile(elPath + "/" + peticion.params.mapa);
  });

} // cargar()

// .....................................................................
// .....................................................................
