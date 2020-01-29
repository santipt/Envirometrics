

pragma foreign_keys = on;


drop table Usuarios;

drop table Medidas;

CREATE TABLE IF NOT EXISTS Usuarios (
        email TEXT NOT NULL,
        password      TEXT NOT NULL,
        idUsuario     INTEGER NOT NULL,
        telefono      TEXT NOT NULL,
        PRIMARY KEY(idUsuario)
);

CREATE TABLE IF NOT EXISTS Medidas (
        valorMedida   REAL NOT NULL,
        idMedida      INTEGER NOT NULL,
        idUsuario     INTEGER NOT NULL,
        PRIMARY KEY(idMedida),
        FOREIGN KEY(idUsuario) REFERENCES Usuarios(idUsuario)
);

insert into Usuarios values ( "a@b", "1234", 1111, "969333");

insert into Medidas values ( 2.3, 1, 1111 );
