// Conectamos a la BD
var conexiondb = require('../lib/conexiondb');

function obternerCompetencia(request, response){

    let query = 'select * from competencia';

    conexiondb.query(query, function(error, results){
        if (error) {
            console.log('error!!', error);
            throw error;
        }
        
        // creamos un objeto literal para pasar en la respuesta
        let respuesta = {
            competencias: results
        };

        // enviamos la respuesta
        response.send(JSON.stringify(respuesta));
    })
}

function obtenerOpciones(request, response){

    let idComp = request.params.id;
	
	
    let queryCompetencia= `SELECT c.pregunta, c.genero_id FROM competencia c WHERE id='${idComp}'`;
	
    conexiondb.query(queryCompetencia, function(error, result){
		if (error){
			console.log('Error!!!!', error);
            throw error;
        }
        
        console.log(result);
		
        if (result.length==0){
			response.status(404).send("no encontramos esa competencia");
			return;
        }
		
		let queryPeliculas= `
		Select p.titulo, p.poster, p.id, p.genero_id from pelicula p 
		where  
		(${result[0].genero_id} is null or p.genero_id = ${result[0].genero_id})
		order by rand() 
		limit 0,2;`;
		
		conexiondb.query(queryPeliculas, function(error, result2){
            if (error){
                console.log('Error!!!!', error);
                throw error;
            }
            var respuesta = {
                competencia: result[0].pregunta,
                peliculas: result2
            };
            
            response.send(JSON.stringify(respuesta));
        })
        
    })
}

function guardarVoto(request, response){

    let idCompetencia = request.params.id; //llega por parametro en la URL
    let idPelicula = request.body.idPelicula; //llega en el Body del request
    
    //definimos los query para buscar en la tabla de Votos si tiene votos previos
    let querySelect = `select * from votos where pelicula_id = '${idPelicula}' and competencia_id = '${idCompetencia}'`;
    let queryInsert = `INSERT INTO votos (pelicula_id, competencia_id, cantidad_votos) VALUES (${idPelicula}, ${idCompetencia}, 1)`;
    
    conexiondb.query(querySelect, function(error, results){
        if (error) {
            console.log('error!!', error);
            throw error;
        }
        
        if (results.length > 0){
            
            let queryUpdate = `UPDATE votos SET cantidad_votos = ${++results[0].cantidad_votos} WHERE id = ${results[0].id}`;
            
            conexiondb.query(queryUpdate, function(error, resultsUpdate){
                if (error) {
                    console.log('error!!', error);
                    throw error;
                }
                response.send("Se actualizaron los votos de la pelicula");
            })

        }else {
            
            conexiondb.query(queryInsert, function(error, resultsInsert){
                if (error) {
                    console.log('error!!', error);
                    throw error;
                }
                response.send("Se agregaron los votos de la pelicula");
            })


        }

    })
}

function crearCompetencia(request, response){

	let idCompetencia = request.params.id; //llega por parametro en la URL
	let nombreCompetencia = request.body.nombre.trim(); //llega en el Body del request

	let genero = request.body.genero==0?null:request.body.genero;
	let director = request.body.director==0?null:request.body.director;
	
	let queryDirectorGenero =`SELECT COUNT(*) AS cantidad 
	FROM competencia WHERE trim(lower(pregunta)) = lower("${nombreCompetencia}")
	UNION all
	SELECT COUNT(distinct p.id) AS cantidad 
	FROM pelicula p, director_pelicula dp 
	WHERE p.id = dp.pelicula_id 
	AND (${director} is NULL OR dp.director_id = ${director})
	AND (${genero} is NULL OR p.genero_id = ${genero});`;
	
	//let querySelect = `select * from competencia where trim(lower(pregunta))=lower("${nombreCompetencia}")`;
        
	let queryInsert = `INSERT INTO competencia (pregunta, genero_id, director_id) VALUES ("${nombreCompetencia}", ${genero}, ${director})`;
    
	
	conexiondb.query(queryDirectorGenero, function(error, result){
		if (error) {
			console.log('error!!', error);
			throw error;
		}

		Aca tenemos que agregar el if para chequear las condiciones
		
		// if(result.length!=0){
		// 	response.status(422).send('Una competencia ya existe con ese nombre!');
		// 	return;
		// }

		conexiondb.query(queryInsert, function(error, results){
			if (error) {
				console.log('error!!', error);
				throw error;
			}       
			
			response.send("La competencia ya fue agregada");
	    })

	})
}

function obtenerResultados (request, response){

	let id=request.params.id;

	let queryCompetencia = `select c.pregunta from competencia c where c.id = ${id};`;
	let queryResultados = `select v.pelicula_id, v.cantidad_votos as votos, p.titulo, p.poster
	from pelicula p
	inner join votos v
	on v.pelicula_id=p.id
	where v.competencia_id=${id}
	order by votos desc
	limit 0,3;`;

	conexiondb.query(queryCompetencia, function(error, result){
		if (error){
			console.log("error!!", error);
			throw error;
		};

		if (result.length != 1){
			response.status(400).send('no se ha encontrado la competencia');
			return;
		};
		
		conexiondb.query(queryResultados, function (error, result2) { 
			if (error){
				console.log("error!!", error);
				throw error;
			};

			let respuesta = {
				competencia: result[0].pregunta,
				resultados: result2 //como la query devuelve un array se lo paso directamente
			};
	
			response.send(JSON.stringify(respuesta));

		 });



	})


}

function reiniciarCompetencia(request, response){

	let idCompetencia = request.params.id; //llega por parametro en la URL
	
	let querySelect = `select * from competencia where id=${idCompetencia}`
    //definimos los query para buscar en la tabla de Votos si tiene votos previos
	let queryUpdate = `update votos set cantidad_votos=0 where competencia_id=${idCompetencia}`;
    
	conexiondb.query(querySelect, function(error, result){
		if (error) {
			console.log('error!!', error);
			throw error;
		}

		if(result.length==0){
			response.status(422).send('la competencia no existe!');
			return;
		}

		conexiondb.query(queryUpdate, function(error, results){
			if (error) {
				console.log('error!!', error);
				throw error;
			}       
			
			response.send("La competencia ya reiniciada!");
	    })

	})
}

function obtenerGeneros(request, response){

	let querySelect = 'select g.id, g.nombre from genero g;';

	conexiondb.query(querySelect, function(error, results){
        if (error) {
            console.log('error!!', error);
            throw error;
        }
          
        // enviamos la respuesta
        response.send(JSON.stringify(results));
    })

}

function obtenerDirectores(request, response){
	
	let querySelect = 'select d.id, d.nombre from director d;';

	conexiondb.query(querySelect, function(error, results){
        if (error) {
            console.log('error!!', error);
            throw error;
        }
          
        // enviamos la respuesta
        response.send(JSON.stringify(results));
    })

}

module.exports = {
    obternerCompetencia:	obternerCompetencia,
    obtenerOpciones: 		obtenerOpciones,
	guardarVoto: 			guardarVoto,
	crearCompetencia: 		crearCompetencia,
	obtenerResultados: 		obtenerResultados,
	reiniciarCompetencia:	reiniciarCompetencia,
	obtenerGeneros:			obtenerGeneros,
	obtenerDirectores:		obtenerDirectores
}

