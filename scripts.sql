-- PASO 2
-- Creamos la tabla competencia

create table competencia(
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `pregunta` varchar(200) NOT NULL,
  PRIMARY KEY (`id`)
  );

-- Creamos algunas preguntas  
  insert into competencia (pregunta)
  values
  ('¿Cuál es la película más bizarra?'),
  ('¿Cuál es la mejor película?'),
  ('¿Qué drama te hizo llorar?'),
  ('¿Cuál peli de acción es mejor?');

select * from competencia;

-- ------------------------------------
-- ETAPA 2 DE LA GUIA
use competencias;

SELECT p.titulo, p.poster, p.id FROM pelicula p ORDER BY RAND() LIMIT 0,2;

SELECT c.pregunta FROM competencia c WHERE id=2;

SELECT c.pregunta FROM competencia c WHERE id='1';

use competencias;
-----------------------------
-- Guia parte 5 guardar votos
select * from votos;

update votos set cantidad_votos=0
where competencia_id=9;

-- Ver resultados
select c.pregunta from competencia c where c.id = 1;

select v.pelicula_id, v.cantidad_votos as votos, p.titulo, p.poster
from pelicula p
inner join votos v
on v.pelicula_id=p.id
where v.competencia_id=1
order by votos desc
limit 0,3;


-------------------------------
-- PASO 3 - Competencias por Genero
-- Modificamos la tabla para agregar ref de genero

alter table competencias.competencia 
add column genero_id int unsigned, 
add constraint fk_genero foreign key (genero_id) references competencias.genero(id);

select g.id, g.nombre from genero g; 

-- buscar peliculas por genero de competencia


SET @idGenero = 8;
Select p.titulo, p.poster, p.id, p.genero_id from pelicula p 
 where  
 (@idGenero is null or p.genero_id = @idGenero)
order by rand() 
limit 0,2;

----------------------------------------------------------
--- Guia 3 paso 4 ----------------------------------------
ALTER TABLE competencia 
ADD COLUMN director_id int unsigned,
ADD CONSTRAINT fk_director
FOREIGN KEY (director_id) REFERENCES competencias.director (id);

-- buscamos cuantas peliculas tenemos con la combinacion de Genero Director
set @variable_dir = 3364;
set @variable_gen = 13;

SELECT DISTINCT p.id 
FROM pelicula p, director_pelicula dp 
WHERE p.id = dp.pelicula_id 
AND (@variable_dir is NULL OR dp.director_id = @variable_dir)
AND (@variable_gen is NULL OR p.genero_id = @variable_gen);


-- Alternativa 
set @variable_dir = 3364;
set @variable_gen = 13;


SELECT COUNT(*) AS cantidad FROM competencia WHERE trim(lower(pregunta)) = lower("Bla")
UNION all
SELECT COUNT(distinct p.id) AS cantidad 
FROM pelicula p, director_pelicula dp 
WHERE p.id = dp.pelicula_id 
AND (@variable_dir is NULL OR dp.director_id = @variable_dir)
AND (@variable_gen is NULL OR p.genero_id = @variable_gen);

----------------------------------------------
-- Guia 3 - paso 5 - Agregamos actores a las competencias

select a.id, a.nombre from actor a;

ALTER TABLE competencia
ADD COLUMN actor_id int unsigned,
ADD CONSTRAINT fk_actor
FOREIGN KEY (actor_id) REFERENCES competencias.actor (id);

alter table actor drop FOREIGN KEY fk_actor;
alter table actor drop column actor_id;


-- ---------
use competencias;
alter table competencia drop FOREIGN KEY fk_actor;

alter table votos drop FOREIGN KEY votos_ibfk_2;

ALTER TABLE votos 
  ADD CONSTRAINT `votos_ibfk_2` 
  FOREIGN KEY (`competencia_id`) 
 REFERENCES `competencia` (`id`)
  ON DELETE CASCADE;
  
  -- ----------
select C.ID, C.pregunta COMPETENCIA , G.NOMBRE GENERO , D.NOMBRE DIRECTOR , A.NOMBRE ACTOR
from   competencia C,
	   genero G,
       DIRECTOR D,
       ACTOR A
where  C.GENERO_ID=16
AND    C.DIRECTOR_ID=D.ID
AND	   C.ACTOR_ID=A.ID;

