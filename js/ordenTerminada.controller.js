function callOrdenTerminada(idOrden){
	console.info("Llamando a vista de la orden terminada");
	$("#modulo").attr("modulo", "orden").html(plantillas["ordenTerminada"]);
	setPanel($("#modulo"));
	console.info("Carga de la orden finalizada");
	height100($("#generales"));
	var orden = new TOrden;
	
	orden.get({
		"id": idOrden,
		"fn": {
			before: function(){
				blockUI("Cargando detalle del servicio");
			},
			after: function(datos){
				unBlockUI();
				setDatos($("#modulo"), datos);
				datosOrden = datos;
				console.log(datos.calificaciones);
				if (datos.calificaciones.runner > 0){
					for (i = 0 ; i < datos.calificaciones.runner ; i++)
						$(".calificacionTerminada").append('<i class="fa fa-3x fa-star" aria-hidden="true"></i>');
						
					for (i = datos.calificaciones.runner ; i < 5 ; i++)
						$(".calificacionTerminada").append('<i class="fa fa-3x fa-star-o" aria-hidden="true"></i>');
				}
			}
		}
	});
}