// Autor: Emilio Esteve Peir�
// Fecha de inicio: 23/10/2019
// �ltima actualizaci�n: 23/10/2019

create table UsuarioSensor(
  idUsuario INTEGER not null,
  idSensor INTEGER not null,
  FOREIGN KEY (idUsuario) REFERENCES Usuarios(idUsuario),
  FOREIGN KEY (idSensor) REFERENCES Sensores(idSensor)
);
