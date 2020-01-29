create table Usuarios(
  idUsuario INTEGER not null,
  email TEXT not null,
  password TEXT not null,
  telefono TEXT not null,
  PRIMARY KEY (email)
);
