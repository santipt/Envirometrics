// Autor: Emilio Esteve Peir�
// Fecha de inicio: 23/10/2019
// �ltima actualizaci�n: 23/10/2019

create table Sensores(
  idSensor INTEGER not null,
  idTipoMedida INTEGER not null,
  FOREIGN KEY (idTipoMedida) REFERENCES TipoSensores(idTipoMedida),
  PRIMARY KEY (idSensor)
);
