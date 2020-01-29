
pragma foreign_keys = on;

drop table Medidas;
drop table UsuarioSensor;
drop table Sensores;
drop table TipoSensores;
drop table Usuarios;

CREATE TABLE IF NOT EXISTS  TipoSensores  (
         idTipoMedida   INTEGER NOT NULL,
         descripcion    TEXT NOT NULL,
        PRIMARY KEY( idTipoMedida )
);

CREATE TABLE IF NOT EXISTS  Usuarios  (
         email  TEXT NOT NULL UNIQUE,
         password       TEXT NOT NULL,
         idUsuario      INTEGER NOT NULL,
         telefono       TEXT NOT NULL,
        PRIMARY KEY( idUsuario )
);
CREATE TABLE IF NOT EXISTS  Medidas  (
         valorMedida    REAL NOT NULL,
         tiempo         INTEGER NOT NULL,
         latitud        REAL,
         longitud       REAL,
         idMedida       INTEGER NOT NULL,
         idUsuario      INTEGER NOT NULL,
         idTipoMedida   INTEGER NOT NULL,
        PRIMARY KEY( idMedida ),
        FOREIGN KEY( idUsuario ) REFERENCES  Usuarios ( idUsuario ),
        FOREIGN KEY( idTipoMedida ) REFERENCES  TipoSensores ( idTipoMedida )
);
CREATE TABLE IF NOT EXISTS  UsuarioSensor  (
         idUsuario      INTEGER NOT NULL,
         idSensor       INTEGER NOT NULL,
        FOREIGN KEY( idUsuario ) REFERENCES  Usuarios ( idUsuario ),
        FOREIGN KEY( idSensor ) REFERENCES  Sensores ( idSensor )
);
CREATE TABLE IF NOT EXISTS  Sensores  (
         idTipoMedida   INTEGER NOT NULL,
         idSensor       INTEGER NOT NULL,
        PRIMARY KEY( idSensor ),
        FOREIGN KEY( idTipoMedida ) REFERENCES  TipoSensores ( idTipoMedida )
);


insert into Usuarios values ( "a@b", "1234", 1111, "969333");

insert into TipoSensores values ( 101, "co2");

insert into Medidas values ( 2.3, 13, 38.9, -0.2, 101, 1111, 101 );

insert into Sensores values ( 101, 1 );

insert into UsuarioSensor values ( 1111, 1 );


select * from Usuarios;
select * from TipoSensores;
select * from Medidas;

-- delete from Medidas;

-- select * from Medidas;
