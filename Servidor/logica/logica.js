// .....................................................................
// Autor: Emilio Esteve Peiró
// Fecha inicio: 24/10/2019
// Última actualización: 24/10/2019
// Logica.js
// .....................................................................
const sjcl = require('sjcl')
const sqlite3 = require("sqlite3")
var fs = require('fs');
var estacionGandia = require('./estacionGandia')
/*const SimpleCrypto = require("simple-crypto-js").default;*/
// .....................................................................
// .....................................................................


module.exports = class Logica {


  // .................................................................
  // menorBD: Texto
  // -->
  // constructor () -->
  // .................................................................
  constructor(nombreBD, cb) {
    this.laConexion = new sqlite3.Database(
      nombreBD,
      (err) => {
        if (!err) {
          this.laConexion.run("PRAGMA foreign_keys = ON")
        }
        cb(err)
      })
  } // ()


  // .................................................................
  // menorTabla:Texto
  // -->
  // borrarFilasDe() -->
  // .................................................................
  borrarFilasDe(tabla) {
    return new Promise((resolver, rechazar) => {
      this.laConexion.run(
        "delete from " + tabla + ";",
        (err) => (err ? rechazar(err) : resolver())
      )
    })
  } // ()


  // .................................................................
  // borrarFilasDeTodasLasTablas() -->
  // .................................................................
  async borrarFilasDeTodasLasTablas() {
    await this.borrarFilasDe("Medidas")
    await this.borrarFilasDe("Sensores")
    await this.borrarFilasDe("Usuarios")
    await this.borrarFilasDe("UsuarioSensor")
    await this.borrarFilasDe("TipoSensores")
  } // ()

  // .................................................................
  // datos:{email:Texto, password:Texto}
  // -->
  // cambiarPassword() -->
  // .................................................................
  cambiarPassword(datos) {
    var textoSQL =
      'UPDATE Usuarios SET password = $password WHERE email = $email'

    var valoresParaSQL = {
      $password: sjcl.encrypt(datos.email, datos.password),
      $email: datos.email
    }
    return new Promise((resolver, rechazar) => {
      this.laConexion.run(textoSQL, valoresParaSQL, function (err) {
        (err ? rechazar(err) : resolver())
      })
    })
  } // ()

  // .................................................................
  // datos:{email:Texto, telefono:Texto}
  // -->
  // cambiarTelefono() -->
  // .................................................................
  cambiarTelefono(datos) {
    var textoSQL =
      'UPDATE Usuarios SET telefono = $telefono WHERE email = $email'

    var valoresParaSQL = {
      $telefono: datos.telefono,
      $email: datos.email
    }
    return new Promise((resolver, rechazar) => {
      this.laConexion.run(textoSQL, valoresParaSQL, function (err) {
        (err ? rechazar(err) : resolver())
      })
    })
  } // ()

  // .................................................................
  // datos:{email:Texto, emailNuevo:Texto}
  // -->
  // cambiarEmail() -->
  // .................................................................
  async cambiarEmail(datos) {

    var textoSQL =
      'UPDATE Usuarios SET email = $emailNuevo WHERE email = $email';

    var valoresParaSQL = {
      $email: datos.email,
      $emailNuevo: datos.emailNuevo
    }

    return new Promise((resolver, rechazar) => {
      this.laConexion.run(textoSQL, valoresParaSQL, function (err) {
        (err ? rechazar(err) : resolver())
      })
    })
  } // ()

  // .................................................................
  // idUsuario:N
  // -->
  // borrarRelacionUsuarioSensorPorIdUsuario() -->
  // .................................................................
  borrarRelacionUsuarioSensorPorIdUsuario(idUsuario) {

    var textoSQL =
      'DELETE from UsuarioSensor where idUsuario=$idUsuario';

    var valoresParaSQL = {
      $idUsuario: idUsuario
    }

    return new Promise((resolver, rechazar) => {
      this.laConexion.run(textoSQL, valoresParaSQL, function (err) {
        (err ? rechazar(err) : resolver())
      })
    })
  } // ()

  // .................................................................
  // idUsuario:N
  // -->
  // borrarMedidasDeUnUsuarioPorIdUsuario() -->
  // .................................................................

  borrarMedidasDeUnUsuarioPorIdUsuario(idUsuario) {

    var textoSQL =
      'DELETE from Medidas where idUsuario=$idUsuario';

    var valoresParaSQL = {
      $idUsuario: idUsuario
    }

    return new Promise((resolver, rechazar) => {
      this.laConexion.run(textoSQL, valoresParaSQL, function (err) {
        (err ? rechazar(err) : resolver())
      })
    })

  }

  // .................................................................
  // idUsuario:N
  // -->
  // borrarUsuarioPorIdUsuario() -->
  // .................................................................
  async borrarUsuarioPorIdUsuario(idUsuario) {

    await this.borrarRelacionUsuarioSensorPorIdUsuario(idUsuario);
    await this.borrarMedidasDeUnUsuarioPorIdUsuario(idUsuario);

    var textoSQL =
      'DELETE from Usuarios where idUsuario=$idUsuario';

    var valoresParaSQL = {
      $idUsuario: idUsuario
    }

    return new Promise((resolver, rechazar) => {
      this.laConexion.run(textoSQL, valoresParaSQL, function (err) {
        (err ? rechazar(err) : resolver())
      })
    })
  } // ()

  // .................................................................
  // idSensor:N
  // -->
  // borrarRelacionUsuarioSensorPorIdSensor() -->
  // .................................................................
  borrarRelacionUsuarioSensorPorIdSensor(idSensor) {

    var textoSQL =
      'DELETE from UsuarioSensor where idSensor=$idSensor';

    var valoresParaSQL = {
      $idSensor: idSensor
    }

    return new Promise((resolver, rechazar) => {
      this.laConexion.run(textoSQL, valoresParaSQL, function (err) {
        (err ? rechazar(err) : resolver())
      })
    })
  } // ()

  // .................................................................
  // idSensor:N
  // -->
  // borrarSensorPorIdSensor() -->
  // .................................................................
  async borrarSensorPorIdSensor(idSensor) {

    await this.borrarRelacionUsuarioSensorPorIdSensor(idSensor);

    var textoSQL =
      'DELETE from Sensores where idSensor=$idSensor';

    var valoresParaSQL = {
      $idSensor: idSensor
    }

    return new Promise((resolver, rechazar) => {
      this.laConexion.run(textoSQL, valoresParaSQL, function (err) {
        (err ? rechazar(err) : resolver())
      })
    })
  } // ()


  // .................................................................
  // datos:{valorMedida:R, tiempo:N: latitud:R, longitud:R, idMedida:N, idUsuario:N, idTipoMedida:N}
  // -->
  // insertarMedida() -->
  // .................................................................
  async insertarMedida(datos) {
    var textoSQL =
      'insert into Medidas values( $valorMedida, $tiempo, $latitud, $longitud, $idMedida, $idUsuario, $idTipoMedida );'
    var res = await this.getUltimoIdMedida();
    var valoresParaSQL = {
      $valorMedida: datos.valorMedida,
      $tiempo: datos.tiempo,
      $latitud: datos.latitud,
      $longitud: datos.longitud,
      $idUsuario: datos.idUsuario,
      $idTipoMedida: datos.idTipoMedida,
      $idMedida: res + 1
    }
    return new Promise((resolver, rechazar) => {
      this.laConexion.run(textoSQL, valoresParaSQL, function (err) {
        (err ? rechazar(err) : resolver())
      })
    })
  } // ()

  // .................................................................
  // --> idUsuario: N
  // buscarMedidasPorIdUsuario()
  // --> [{valorMedida:R, tiempo:N: latitud:R, longitud:R, idMedida:N, idUsuario:N, idTipoMedida:N}]
  // .................................................................
  buscarMedidasPorIdUsuario(idUsuario) {
    var textoSQL = "select * from Medidas where idUsuario=$idUsuario";
    var valoresParaSQL = {
      $idUsuario: idUsuario
    }
    return new Promise((resolver, rechazar) => {
      this.laConexion.all(textoSQL, valoresParaSQL,
        (err, res) => {
          if (err) {
            rechazar(err)
          }
          if (res == undefined) {
            resolver(null)
          }
          resolver(res)
        })
    })
  }

  // .................................................................
  // getUsuarios()
  // --> [{email:Texto, password:Texto, telefono:Texto, idUsuario:N}]
  // .................................................................
  getUsuarios() {
    var textoSQL = "select * from Usuarios";
    var valoresParaSQL = {}
    return new Promise((resolver, rechazar) => {
      this.laConexion.all(textoSQL, valoresParaSQL,
        (err, res) => {
          (err ? rechazar(err) : resolver(res))
        })
    })
  }

  // .................................................................
  // getUltimoIDUsuario()
  // --> N
  // .................................................................
  getUltimoIDUsuario() {
    var textoSQL = "select * from Usuarios";
    var valoresParaSQL = {}
    return new Promise((resolver, rechazar) => {
      this.laConexion.all(textoSQL, valoresParaSQL,
        (err, res) => {
          if (err) {
            rechazar(err)
          }
          if (res.length == 0) {
            resolver(0)
          } else {
            resolver(res[res.length - 1].idUsuario)
          }
        })
    })
  }

  // .................................................................
  // --> idUsuario: N
  // getUltimaMedidaDeUnUsuario()
  // --> {valorMedida:R, tiempo:N: latitud:R, longitud:R, idMedida:N, idUsuario:N, idTipoMedida:N}
  // .................................................................
  async getUltimaMedidaDeUnUsuario(idUsuario) {

    var res = await this.buscarMedidasPorIdUsuario(idUsuario);

    return new Promise((resolver, rechazar) => {
      if (res == null) {
        resolver(null)
      }
      resolver(res[res.length - 1])
    })

  }


  //-------------------------------------------------------------------------
  // idUsuario:N -->
  // elUsuarioTieneMedidas()
  // --> V/F
  //-------------------------------------------------------------------------
  async elUsuarioTieneMedidas(idUsuario) {

    var res = await this.buscarMedidasPorIdUsuario(idUsuario);

    return new Promise((resolver, rechazar) => {

      if (res == null) {
        resolver(false)
      }

      resolver(true)

    })

  }

  // .................................................................
  // getUltimoIdMedida()
  // --> N
  // .................................................................
  async getUltimoIdMedida() {

    var textoSQL = "select * from Medidas";
    var valoresParaSQL = {}
    return new Promise((resolver, rechazar) => {
      this.laConexion.all(textoSQL, valoresParaSQL,
        (err, res) => {
          if (err) {
            rechazar(err)
          }
          if (res.length == 0) {
            resolver(0)
          } else {
            resolver(res[res.length - 1].idMedida)
          }
        })
    })

  }

  // .................................................................
  // --> email: Texto
  // buscarUsuarioPorEmail()
  // --> {email:Texto, telefono:Texto, password:Texto, idUsuario:Texto}
  // .................................................................
  buscarUsuarioPorEmail(email) {
    var textoSQL = "select * from Usuarios where email=$email";
    var valoresParaSQL = {
      $email: email
    }
    return new Promise((resolver, rechazar) => {
      this.laConexion.all(textoSQL, valoresParaSQL,
        (err, res) => {
          (err ? rechazar(err) : resolver(res[0]))
        })
    })
  }

  // .................................................................
  // --> path: Texto ('')
  // buscarTodosLosMapas()
  // --> {Texto}
  // .................................................................
  buscarTodosLosMapas(path) {
    var mapas = fs.readdirSync(path);
    return new Promise(function (resolver, rechazar) {
      resolver(mapas)
    });
  }

  // .................................................................
  // --> lista[Medida]
  // filtrarMedidasDelUltimoDia()
  // --> lista[Medida]
  // .................................................................
  filtrarMedidasDelUltimoDia(lista) {
    var laLista = []
    for (var i = 0; i < lista.length; i++) {
      var now = Date.now()
      if ((now - lista[i].tiempo) < 86400000) {
        laLista.push(lista[i])
      }
    }
    return laLista;
  }

  // .................................................................
  // --> idUsuario: N
  // buscarMedidasDelUltimoDiaDeUnUsuario()
  // --> [JSON{valorMedida:R, latitud:R, longitud:R, idMedida:N, idUsuario:N, idTipoMedida:N}]
  // .................................................................
  buscarMedidasDelUltimoDiaDeUnUsuario(idUsuario) {
    var textoSQL = "select * from Medidas where idUsuario=$idUsuario";
    var valoresParaSQL = {
      $idUsuario: idUsuario
    }
    return new Promise((resolver, rechazar) => {
      this.laConexion.all(textoSQL, valoresParaSQL,
        (err, res) => {
          if (err) {
            rechazar(err)
          }
          if (res == undefined) {
            resolver(false)
          }
          var lista = this.filtrarMedidasDelUltimoDia(res)
          resolver(lista)
        })
    })
  }

  // .................................................................
  // buscarMedidasDelUltimoDia()
  // --> [JSON{valorMedida:R, latitud:R, longitud:R, idMedida:N, idUsuario:N, idTipoMedida:N}]
  // .................................................................
  buscarMedidasDelUltimoDia() {
    var textoSQL = "select * from Medidas";
    var valoresParaSQL = {}
    return new Promise((resolver, rechazar) => {
      this.laConexion.all(textoSQL, valoresParaSQL,
        (err, res) => {
          if (err) {
            rechazar(err)
          }
          if (res == undefined) {
            resolver(false)
          }
          var lista = this.filtrarMedidasDelUltimoDia(res)
          resolver(lista)
        })
    })
  }

  // .................................................................
  // idUsuario:N -->
  // calidadDelAireRespiradoEnElUltimoDiaPorUnUsuario()
  // --> R
  // .................................................................
  async calidadDelAireRespiradoEnElUltimoDiaPorUnUsuario(idUsuario) {

    var medidas = await this.buscarMedidasDelUltimoDiaDeUnUsuario(idUsuario)

    return new Promise(function (resolver, rechazar) {
      if (medidas == false) {
        resolver(false)
      }
      var res = 0;
      for (var i = 0; i < medidas.length; i++) {
        res += medidas[i].valorMedida;
      }
      resolver(res / medidas.length);
    })

  }

  // .................................................................
  // --> idUsuario: N
  // distanciaRecorridaEnUnDiaPorIdUsuario()
  // --> R
  // .................................................................
  async distanciaRecorridaEnUnDiaPorIdUsuario(idUsuario) {

    var res = await this.buscarMedidasDelUltimoDiaDeUnUsuario(idUsuario);

    /*
    console.log("distancia: " + res)
    console.log(res[3].latitud);*/
    if (res == undefined) {
      return false
    }

    if (res.length < 2) {
      return false
    }

    return this.calcularDistanciaEntreLosPuntosDeUnaLista(res)

  }


  rad(x) {
    return x * Math.PI / 180;
  }

  // .................................................................
  // 4 R -->
  // calcularDistanciaEntreDosPuntos()
  // --> R
  // .................................................................
  calcularDistanciaEntreDosPuntos(lat1, lon1, lat2, lon2) {
    var R = 6378.137; //Radio de la tierra en km
    var dLat = this.rad(lat2 - lat1);
    var dLong = this.rad(lon2 - lon1);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(this.rad(lat1)) * Math.cos(this.rad(lat2)) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d; //Retorna tres decimales
  }

  // .................................................................
  // lista <Medida> -->
  // calcularDistanciaEntreLosPuntosDeUnaLista()
  // --> R
  // .................................................................
  calcularDistanciaEntreLosPuntosDeUnaLista(lista) {

    var distancia = 0;

    for (var i = 0; i < lista.length - 1; i++) {

      distancia += this.calcularDistanciaEntreDosPuntos(lista[i].latitud, lista[i].longitud, lista[i + 1].latitud, lista[i + 1].longitud)

    }
    var distanciaEnKm = distancia / 1000;
    //console.log(distanciaEnKm);
    return distanciaEnKm;

  }

  //-------------------------------------------------------------------
  // email:Texto -->
  // elUsuarioExiste()
  // --> V/F
  //-------------------------------------------------------------------
  async elUsuarioExiste(email) {

    var res = await this.buscarUsuarioPorEmail(email);

    return new Promise((resolver, rechazar) => {
      try {
        if (res.email != email) {
          resolver(false)
        }

        resolver(true)
      } catch (error) {
        resolver(false)
      }
    })
  }

  // .................................................................
  // -->{email:Texto, telefono:Texto, password:Texto, idUsuario:Texto}
  // darAltaUsuario()
  // .................................................................
  async darAltaUsuario(datos) {
    var textoSQL =
      'insert into Usuarios values ( $email, $password, $idUsuario, $telefono );'

    var ultimaIdUsuario = await this.getUltimoIDUsuario();

    var elUsuarioExiste = await this.elUsuarioExiste(datos.email)

    // encriptamos la contraseña con el email.
    var laPasswordEncriptada = sjcl.encrypt(datos.email, datos.password)

    var valoresParaSQL = {
      $idUsuario: ultimaIdUsuario + 1,
      $email: datos.email,
      $password: laPasswordEncriptada,
      $telefono: datos.telefono
    }

    return new Promise((resolver, rechazar) => {
      if (!elUsuarioExiste) {
        this.laConexion.run(textoSQL, valoresParaSQL, function (err) {
          if (err) {
            rechazar(err)
          }
          resolver(true)
        })
      } else {
        resolver(false)
      }
    })
  }

  // .................................................................
  // -->{idUsuario:N, idSensor:N}
  // comprobarSensorEsDeUsuario()
  // -->{V/F}
  //Comprobamos que un sensor este asociado a un usuario o no
  // Si pertenece a usuario devolvemos true y sino false
  // .................................................................
  comprobarSensorEsDeUsuario(datos) {
    var valoresSQL = {
      $idSensor: datos.idSensor
    }
    var sqlText = "select idSensor from UsuarioSensor where idSensor=$idSensor";

    return new Promise((resolver, rechazar) => {
      this.laConexion.all(sqlText, valoresSQL, function (err, res) {
        console.log("En el callback de la promesa de comprobar: " + res.length);
        if (err) {
          rechazar(err);
        } else if (res.length > 0) {
          resolver(true)
        } else {
          resolver(false);
        }
      })
    })
  }

  // .................................................................
  // -->{idUsuario:N, idSensor:N}
  // asociarSensorUsuario()
  // -->codigo:N
  // .................................................................
  async asociarSensorUsuario(datos) {

    //Llamada a buscarSensor()
    var res = await this.buscarSensor(datos.idSensor);
    console.log("Respuesta en logica:");
    console.log(res);
    if (res == undefined) {
      return new Promise((resolver, rechazar) => {
        resolver(404);
      });
    } else {
      //Llamada a comprobarSensorDeusuario
      res = await this.comprobarSensorEsDeUsuario(datos);
      console.log("comprobado que sensor es de un usuario: ");
      console.log(res);
      if (res) {
        //Es verdadero y por tanto el sensor ya pertenece a otro usuario
        return new Promise((resolver, rechazar) => {
          resolver(300);
        });
      } else {
        //EL sensor existe y no pertenece a ningun usuario
        var textoSQL = 'insert into UsuarioSensor values ( $idUsuario, $idSensor );'
        var valoresParaSQL = {
          $idUsuario: datos.idUsuario,
          $idSensor: datos.idSensor
        }
        return new Promise((resolver, rechazar) => {
          console.log("Dentro de la promesa de darSensor");
          this.laConexion.run(textoSQL, valoresParaSQL, function (err) {
            console.log("Dentro del callback de la promesa de dar sensor");
            (err ? rechazar(err) : resolver(200))
          })
        })
      }
    }
  }

  // .................................................................
  // -->{idTipoMedida:N, idSensor:N}
  // insertarSensor()
  // .................................................................
  insertarSensor(datos) {
    var textoSQL =
      'insert into Sensores values ( $idTipoMedida, $idSensor );'
    var valoresParaSQL = {
      $idTipoMedida: datos.idTipoMedida,
      $idSensor: datos.idSensor
    }
    return new Promise((resolver, rechazar) => {
      this.laConexion.run(textoSQL, valoresParaSQL, function (err) {
        (err ? rechazar(err) : resolver())
      })
    })
  }

  // .................................................................
  // -->{idTipoMedida:N, descripcion:Texto}
  // insertarTipoSensor()
  // .................................................................
  insertarTipoSensor(datos) {
    var textoSQL =
      'insert into TipoSensores values ( $idTipoMedida, $descripcion );'
    var valoresParaSQL = {
      $idTipoMedida: datos.idTipoMedida,
      $descripcion: datos.descripcion
    }
    return new Promise((resolver, rechazar) => {
      this.laConexion.run(textoSQL, valoresParaSQL, function (err) {
        (err ? rechazar(err) : resolver())
      })
    })
  }

  // .................................................................
  // --> idSensor:N
  // getUsuarioQueTieneElSensor()
  // --> {idSensor:N, idUsuario:N}
  // .................................................................
  buscarIDUsuarioQueTieneElSensor(idSensor) {
    var textoSQL = "select * from UsuarioSensor where idSensor=$idSensor";
    var valoresParaSQL = {
      $idSensor: idSensor
    }
    return new Promise((resolver, rechazar) => {
      this.laConexion.all(textoSQL, valoresParaSQL,
        (err, res) => {
          (err ? rechazar(err) : resolver(res[0]))
        })
    })
  }

  // --------------------------------------------------------
  // --> idSensor:N
  // buscarSensor()
  // {idSensor: N, idTipoMedida: N}
  // --------------------------------------------------------
  buscarSensor(idSensor) {
    var textoSQL = "select * from Sensores where idSensor=$idSensor";
    var valoresParaSQL = {
      $idSensor: idSensor
    }
    return new Promise((resolver, rechazar) => {
      this.laConexion.all(textoSQL, valoresParaSQL,
        (err, res) => {
          if (err) {
            rechazar(err)
          }
          if (res == undefined) {
            resolver(undefined)
          }
          resolver(res[0])
        })
    })
  }

  // .................................................................
  // buscarRelacionesUsuarioSensor()
  // --> [{idSensor:N, idUsuario:N}]
  // .................................................................
  buscarRelacionesUsuarioSensor() {
    var textoSQL = "select * from UsuarioSensor";
    var valoresParaSQL = {}
    return new Promise((resolver, rechazar) => {
      this.laConexion.all(textoSQL, valoresParaSQL,
        (err, res) => {
          (err ? rechazar(err) : resolver(res))
        })
    })
  }

  // --------------------------------------------------------
  // --> nombre:Texto
  // buscarUsuarioAdmin()
  // {nombre:Texto, password:Texto}
  // --------------------------------------------------------
  buscarUsuarioAdmin(nombre) {
    var textoSQL = "select * from UsuariosAdmin where nombre=$nombre";
    var valoresParaSQL = {
      $nombre: nombre
    }
    return new Promise((resolver, rechazar) => {
      this.laConexion.all(textoSQL, valoresParaSQL,
        (err, res) => {
          (err ? rechazar(err) : resolver(res[0]))
        })
    })
  }

  // --------------------------------------------------------
  // {email:Texto, password:Texto}
  // iniciarSesion()
  // --> V/F
  // --------------------------------------------------------
  async iniciarSesion(datos) {

    var res = await this.buscarUsuarioPorEmail(datos.email);

    return new Promise((resolver, rechazar) => {

      try {
        if (sjcl.decrypt(datos.email, res.password) == datos.password) {
          resolver(true)
        } else {
          resolver(false)
        }
      } catch (error) {
        resolver(false)
      }

    })

  }

  //-----------------------------------------------------------------------
  // getTaxistas() -->
  // [{email:Texto, telefono:Texto, password:Texto, idUsuario:N}]
  //-----------------------------------------------------------------------
  async getTaxistas() {

    var res = await this.getUsuarios();
    var taxistas = [];

    return new Promise(function (resolver, rechazar) {

      if (res != undefined) {
        for (var i = 0; i < res.length; i++) {
          if (res[i].email.includes("@taxista.com")) {
            taxistas.push(res[i])
          }
        }
        resolver(taxistas)
      } else {
        resolver(false)
      }

    })

  }

  //-----------------------------------------------------------------------
  // idUsuario:N
  // buscarIdSensorPorIdUsuario() -->
  // N
  //-----------------------------------------------------------------------
  buscarIdSensorPorIdUsuario(idUsuario) {
    var textoSQL = "select * from UsuarioSensor where idUsuario=$idUsuario";
    var valoresParaSQL = {
      $idUsuario: idUsuario
    }
    return new Promise((resolver, rechazar) => {
      this.laConexion.all(textoSQL, valoresParaSQL,
        (err, res) => {
          if (err) {
            rechazar(err)
          }
          console.log(res);
          if (undefined) {
            resolver(0)
          } if (res.length == 0) {
            resolver(0)
          } else {
            resolver(res[0].idSensor)
          }
        })
    })
  }


  //-----------------------------------------------------------------------
  // filtrarTaxistasQueNoHanEnviadoEn24H() -->
  // [{email:Texto, telefono:Texto, idUsuario:N, seHaPasado24HSinEnviar:V/F}, idSensor:N]
  //-----------------------------------------------------------------------
  async filtrarTaxistasQueNoHanEnviadoEn24H() {

    var now = Date.now();

    var losTaxistas = await this.getTaxistas();

    var taxistasFiltrados = [];

    for (var i = 0; i < losTaxistas.length; i++) {

      var laMedida = await this.getUltimaMedidaDeUnUsuario(losTaxistas[i].idUsuario);
      var idSensor = await this.buscarIdSensorPorIdUsuario(losTaxistas[i].idUsuario)
      if (laMedida != null) {
        console.log(now - laMedida.tiempo);

        if ((now - laMedida.tiempo) > 86400000) {

          var json = {
            email: losTaxistas[i].email,
            telefono: losTaxistas[i].telefono,
            idUsuario: losTaxistas[i].idUsuario,
            seHaPasado24HSinEnviar: true,
            idSensor: idSensor
          }

        } else {

          var json = {
            email: losTaxistas[i].email,
            telefono: losTaxistas[i].telefono,
            idUsuario: losTaxistas[i].idUsuario,
            seHaPasado24HSinEnviar: false,
            idSensor: idSensor
          }
        }
      } else {
        var json = {
          email: losTaxistas[i].email,
          telefono: losTaxistas[i].telefono,
          idUsuario: losTaxistas[i].idUsuario,
          seHaPasado24HSinEnviar: false,
          idSensor: idSensor
        }
      }

      taxistasFiltrados.push(json)
    }

    return new Promise(function (resolver, rechazar) {
      if (taxistasFiltrados.length == 0) {
        rechazar()
      }
      console.log(taxistasFiltrados);
      resolver(taxistasFiltrados)
    })

  }

  // --------------------------------------------------------
  // {nombre:Texto, password:Texto}
  // iniciarSesion()
  // --> V/F
  // --------------------------------------------------------
  async iniciarSesionAdmin(datos) {

    var res = await this.buscarUsuarioAdmin(datos.nombre);

    return new Promise((resolver, rechazar) => {

      try {
        if (res.password == datos.password) {
          resolver(true)
        } else {
          resolver(false)
        }
      } catch (error) {
        resolver(false)
      }

    })

  }

  // .................................................................
  // getTodasLasMedidas()
  // --> [{{valorMedida:R, tiempo:N: latitud:R, longitud:R, idMedida:N, idUsuario:N, idTipoMedida:N}}]
  // .................................................................
  getTodasLasMedidas() {
    var textoSQL = "select * from Medidas";
    var valoresParaSQL = {}
    return new Promise((resolver, rechazar) => {
      this.laConexion.all(textoSQL, valoresParaSQL,
        (err, res) => {
          (err ? rechazar(err) : resolver(res))
        })
    })
  }

  // .................................................................
  // idTipoDeMedida:N -->
  // buscarUnTipoDeMedidas()
  // --> [{{valorMedida:R, tiempo:N: latitud:R, longitud:R, idMedida:N, idUsuario:N, idTipoMedida:N}}]
  // .................................................................
  buscarUnTipoDeMedidas(idTipoMedida) {
    var textoSQL = "select * from Medidas where idTipoMedida = $idTipoMedida";
    var valoresParaSQL = {
      $idTipoMedida: idTipoMedida
    }
    return new Promise((resolver, rechazar) => {
      this.laConexion.all(textoSQL, valoresParaSQL,
        (err, res) => {
          (err ? rechazar(err) : resolver(res))
        })
    })
  }

  // .................................................................
  // email:Texto -->
  // getTodasLasMedidasDeUnUsuarioPorEmail()
  // --> [{{valorMedida:R, tiempo:N: latitud:R, longitud:R, idMedida:N, idUsuario:N, idTipoMedida:N}}]
  // .................................................................
  async getTodasLasMedidasDeUnUsuarioPorEmail(email) {

    var usuario = await this.buscarUsuarioPorEmail(email)

    var textoSQL = "select * from Medidas where idUsuario=$idUsuario";

    var valoresParaSQL = {
      $idUsuario: usuario.idUsuario
    }
    return new Promise((resolver, rechazar) => {
      this.laConexion.all(textoSQL, valoresParaSQL,
        (err, res) => {
          (err ? rechazar(err) : resolver(res))
        })
    })
  }

  // .................................................................
  // getDatosEstacionGandia()
  // --> [{{tiempo: N, so2: R, co: R, no: R, no2: R, nox: R, o3: R}}]
  // .................................................................
  async getDatosEstacionGandia() {

    var res = estacionGandia.obtenerDatosEstacionGandia()

    return new Promise((resolver, rechazar) => {
      try {
        resolver(res)
      } catch (error) {
        rechazar(error)
      }
    })
  }

  // .................................................................
  //   {file:String} --> guardarImagenEnCarpeta()
  // .................................................................
  async guardarImagenEnCarpeta(datos) {

    let image = datos["file"];

    // extraer la cabecera de imagen url
    var base64Data = image.replace(/^data:image\/jpeg;base64,/, "");

    // grabas la imagen el disco
    fs.writeFile('../Imagenes_A_Procesar/paraProcesar.jpg', base64Data, 'base64', function (err) {
      if (err != null) {
        console.log(err);
      }
    });

    const res = await this.obtenerImagenProcesada()
    //console.log("String imagen: " + res)

    return new Promise((resolver, rechazar) => {
      try {
        resolver(res)
      } catch (error) {
        rechazar(error)
      }
    })
  }

  // .................................................................
  //   obtenerImagenProcesada() --> imagenProcesada
  // .................................................................
  async obtenerImagenProcesada (){
    return new Promise((resolver, rechazar) => {
      setTimeout(function(){
        var res = fs.readFileSync('../Imagenes_Procesadas/binaria.jpg')
        resolver(res)
      }, 5000);
    });
  }


  // .................................................................
  // cerrar() -->
  // .................................................................
  cerrar() {
    return new Promise((resolver, rechazar) => {
      this.laConexion.close((err) => {
        (err ? rechazar(err) : resolver())
      })
    })
  } // ()

} // class
// .....................................................................
// .....................................................................
