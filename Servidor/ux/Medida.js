// Autor: Emilio Esteve Peiro
// Fecha de inicio: 18/10/2019 . 21:00
// Última actualización: 18/10/2019 . 21:09
// Equipo 2

class Medida{

    constructor( _valorMedida, _tiempo, _latitud, _longitud, _idMedida, _idTipoMedida, _idUsuario ){

      this.valorMedida = _valorMedida;
      this.tiempo = _tiempo;
      this.latitud = _latitud;
      this.longitud = _longitud;
      this.idMedida = _idMedida;
      this.idTipoMedida = _idTipoMedida;
      this.idUsuario = _idUsuario;

    }

    constructor( eljson ){

      this.valorMedida = eljson.valorMedida;
      this.tiempo = eljson.tiempo;
      this.latitud = eljson.latitud;
      this.longitud = eljson.longitud;
      this.idMedida = eljson.idMedida;
      this.idTipoMedida = eljson.idTipoMedida;
      this.idUsuario = eljson.idUsuario;

    }

    getValorMedida( ){ return this.valorMedida }

    getTiempo(){ return this.tiempo }

    getLatitud(){ return this.latitud }

    getLongitud(){ return this.longitud }

    getIdMedida(){ return this.idMedida }

    getIdTipoMedida(){ return this.idTipoMedida }

    getIdUsuario(){ return this.idUsuario }

    setValorMedida( _valorMedida ){ this.valorMedida = _valorMedida }

    setTiempo( _tiempo ){ this.tiempo = _tiempo }

    setLatitud( _latitud ){ this.latitud = _latitud }

    setLongitud( _longitud ){ this.longitud = _longitud }

    setIdMedida( _idMedida ){ this.idMedida = _idMedida }

    setIdTipoMedida( _idTipoMedida ){ this.idTipoMedida = _idTipoMedida }

    setIdUsuario( _idUsuario ){ this.idUsuario }

}
