// Autor: Emilio Esteve Peiró
// Fecha de inicio: 23/10/2019
// Última actualización: 23/10/2019

create table Sensores(
  idSensor INTEGER not null,
  idTipoMedida INTEGER not null,
  FOREIGN KEY (idTipoMedida) REFERENCES TipoSensores(idTipoMedida),
  PRIMARY KEY (idSensor)
);
