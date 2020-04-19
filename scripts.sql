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



--------------------------------
-- Modificamos la tabla para agregar ref de genero
alter table competencias.competencia add column genero_id int unsigned, 
add constraint fk_genero foreign key (genero_id) references competencias.genero(id);