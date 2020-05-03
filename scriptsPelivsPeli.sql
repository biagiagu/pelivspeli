-- Creamos la tabla competencia
use competencias;

drop table if exists competencia;
create table competencia(
  id int(11) unsigned NOT NULL AUTO_INCREMENT,
  pregunta varchar(200) NOT NULL,
  PRIMARY KEY (id)
  );

-- Cargamos algunas competencias
  insert into competencia (pregunta)
  values
  ('¿Cuál es la película más bizarra?'),
  ('¿Cuál es la mejor película?'),
  ('¿Qué drama te hizo llorar?'),
  ('¿Cuál peli de acción es mejor?');


-- creamos la tabla votos
drop table if exists votos;

CREATE TABLE votos(
	id int not null auto_increment,
    pelicula_id int unsigned not null, 
	competencia_id int not null,
    cantidad_votos int not null,
    primary key (id),
    foreign key (pelicula_id) references competencias.pelicula(id),
	foreign key (competencia_id) references competencias.competencia(id)
);
-- ------------------------------------
-- Modificamos la tabla para agregar ref de genero

alter table competencias.competencia 
add column genero_id int unsigned, 
add constraint fk_genero foreign key (genero_id) references competencias.genero(id);

-- Modificamos la tabla para agregar ref de director
ALTER TABLE competencia 
ADD COLUMN director_id int unsigned,
ADD CONSTRAINT fk_director
FOREIGN KEY (director_id) REFERENCES competencias.director (id);

-- Modificamos la tabla para agregar ref de actores
ALTER TABLE competencia
ADD COLUMN actor_id int unsigned,
ADD CONSTRAINT fk_actor
FOREIGN KEY (actor_id) REFERENCES competencias.actor (id);

alter table actor drop FOREIGN KEY fk_actor;
alter table actor drop column actor_id;
-- ---------
alter table competencia drop FOREIGN KEY fk_actor;
alter table votos drop FOREIGN KEY votos_ibfk_2;

ALTER TABLE votos 
  ADD CONSTRAINT `votos_ibfk_2` 
  FOREIGN KEY (`competencia_id`) 
 REFERENCES `competencia` (`id`)
  ON DELETE CASCADE;
  



