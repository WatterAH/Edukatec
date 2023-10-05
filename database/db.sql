CREATE DATABASE IF NOT EXISTS users;

USE users;

CREATE TABLE IF NOT EXISTS coordinadores(
    id int auto_increment,
    id_ciclo int,
    id_periodo int,
    name text,
    lastname text,
    mail varchar(250) unique,
    pass text,
    primary key (id)
);

CREATE TABLE IF NOT EXISTS maestros(
    id int auto_increment,
    id_coord int,
    name text,
    lastname text,
    mail varchar(250) unique,
    pass text,
    type int,
    code varchar(10),
    primary key (id)
);

CREATE TABLE IF NOT EXISTS padres (
    id int auto_increment,
    id_coord int,
    mail varchar(250) unique,
    pass text,
    primary key(id)
);

CREATE TABLE IF NOT EXISTS alumnos (
    id int auto_increment,
    name text,
    spaterno text,
    smaterno text,
    grupo int,
    primary key (id)
);

CREATE TABLE IF NOT EXISTS grupos (
    id int auto_increment,
    name text,
    primary key (id)
);

CREATE TABLE IF NOT EXISTS asignacion_grupos (id_maestro int, id_grupo int);

CREATE TABLE IF NOT EXISTS asignacion_hijos (id_padre int, id_hijo int);

CREATE TABLE IF NOT EXISTS reporte_parcial (
    id int auto_increment,
    id_alumno int,
    id_ciclo int,
    id_periodo int,
    accepted boolean,
    primary key(id)
);

CREATE TABLE IF NOT EXISTS eval_parcial(
    id int auto_increment,
    id_pattern int,
    id_materia int,
    texto text,
    primary key(id)
);

CREATE TABLE IF NOT EXISTS reporte_adicional (
    id int auto_increment,
    id_alumno int,
    id_ciclo int,
    id_periodo int,
    accepted boolean,
    primary key(id)
);

CREATE TABLE IF NOT EXISTS eval_adicional(
    id int auto_increment,
    id_pattern int,
    id_materia int,
    texto text,
    primary key(id)
);

CREATE TABLE IF NOT EXISTS evaluaciones(
    id int auto_increment,
    id_alumno int,
    id_ciclo int,
    id_periodo int,
    performance int,
    title text,
    date text,
    notes text,
    primary key(id)
);

CREATE TABLE IF NOT EXISTS sala_comentarios (
    id int auto_increment,
    type int,
    reportID int,
    id_coord int,
    id_teach int,
    primary key(id)
);

CREATE TABLE IF NOT EXISTS comentarios(
    id int auto_increment,
    id_pattern int,
    txt text,
    sender int,
    date text,
    primary key(id)
);

CREATE TABLE IF NOT EXISTS materias(
    id int auto_increment,
    id_type int,
    nombre text,
    primary key(id)
);

CREATE TABLE IF NOT EXISTS periodo (
    id int auto_increment,
    nombre text,
    primary key(id)
);

CREATE TABLE IF NOT EXISTS ciclo (
    id int auto_increment,
    fecha text,
    primary key(id)
);

-- INSERT INTO
--     periodo (nombre)
-- VALUES
--     ("1"),
--     ("2"),
--     ("3"),
--     ("4"),
--     ("5");
-- INSERT INTO
--     materias (id_type, nombre)
-- VALUES
--     (1, "Lenguaje y comunicación"),
--     (1, "Pensamiento matemático"),
--     (
--         1,
--         "Exploración y comprensión del mundo natural y social"
--     ),
--     (1, "Artes"),
--     (2, "Inglés"),
--     (3, "Educación fisica");