TOrden = function(){
	var self = this;
	
	this.get = function(datos){
		if (datos.fn.before !== undefined) datos.fn.before();
		
		$.post(server + 'cordenes', {
				"id": datos.id,
				"runner": datos.runner,
				"action": "getDatos",
				"movil": true
			}, function(data){
				if (data.band == false)
					console.log("No se guardó el registro");
					
				if (datos.fn.after !== undefined)
					datos.fn.after(data);
			}, "json");
	};
	
	this.adjudicar = function(datos){
		if (datos.fn.before !== undefined) datos.fn.before();
		
		$.post(server + 'cordenes', {
				"id": datos.id,
				"runner": objUsuario.idUsuario,
				"action": "adjudicar",
				"movil": true
			}, function(data){
				if (data.band == false)
					console.log("No se realizó");
					
				if (datos.fn.after !== undefined)
					datos.fn.after(data);
			}, "json");
	};
	
	this.addEvidencia = function(datos){
		if (datos.fn.before !== undefined) datos.fn.before();
		
		$.post(server + 'cordenes', {
				"orden": datos.orden,
				"latitude": datos.latitude,
				"longitude": datos.longitude,
				"comentario": datos.comentario,
				"action": "addEvidencia",
				"movil": true
			}, function(data){
				if (data.band == false)
					console.log("No se realizó");
					
				if (datos.fn.after !== undefined)
					datos.fn.after(data);
			}, "json");
	};
	
	this.finalizar = function(datos){
		if (datos.fn.before !== undefined) datos.fn.before();
		
		$.post(server + 'cordenes', {
				"id": datos.id,
				"calificacion": datos.calificacion,
				"action": "finalizar",
				"movil": true
			}, function(data){
				if (data.band == false)
					console.log("No se realizó");
					
				if (datos.fn.after !== undefined)
					datos.fn.after(data);
			}, "json");
	};
};