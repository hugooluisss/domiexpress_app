function callOrdenVista(idOrden){
	console.info("Llamando a vista previa de la orden");
	$("#modulo").attr("modulo", "orden").html(plantillas["ordenVistaPrevia"]);
	setPanel($("#modulo"));
	console.info("Carga de la vista previa finalizada");
	var orden = new TOrden;
	var mapa = undefined;
	var datosOrden = undefined;
	
	height100($("#generales"));
	
	mensajes.log({"mensaje": "Estamos obteniendo tu ubicación"});
	navigator.geolocation.getCurrentPosition(function(){
		}, function(){
		mensajes.alert({"mensaje": "No pudimos obtener tu ubicación, revisa tener habilitado el GPS de tu dispositivo", "titulo": "Error GPS"});
		callPanel("home");
	});
	
	orden.get({
		"id": idOrden,
		"runner": objUsuario.idUsuario,
		"fn": {
			before: function(){
				blockUI("Cargando detalle del servicio");
			},
			after: function(datos){
				unBlockUI();
				setDatos($("#modulo"), datos);
				datosOrden = datos;
				setMapa(datos);
			}
		}
	});
	
	$("#btnAceptar").click(function(){
		mensajes.confirm({"titulo": "Aceptar", "mensaje": "¿Seguro de aceptar el servicio?", "botones": "Aceptar, Cancelar", "funcion": function(resp){
			if (resp == 1){
				orden.adjudicar({
					"id": idOrden,
					"fn": {
						before: function(){
							blockUI("Espera un momento, te estamos asignando la carga");
						},
						after: function(resp){
							unBlockUI();
							if (resp.band){
								mensajes.alert({"titulo": "Felicidades", "mensaje": "Felicidades, la carga con folio " + datosOrden.folio + " te fue asignada, ahora preparate para realizar el servicio en tiempo y forma"});
								callHome();
							}else if(resp.mensaje == '')
								mensajes.alert({"titulo": "Error", "mensaje": "No pudo ser asignada la carga"});
							else
								mensajes.alert({"titulo": "Error", "mensaje": resp.mensaje});
						}
					}
				});
			}
		}});
	});
	
	function setMapa(datos){
		if (mapa == undefined){
			mapa = new google.maps.Map(document.getElementById("mapa"), {
				center: {lat: parseFloat(datos.latitude), lng: parseFloat(datos.longitude)},
				scrollwheel: true,
				fullscreenControl: true,
				zoom: 14,
				zoomControl: true
			});
		}
		
		var destinoCliente = new google.maps.LatLng(datos.latitude, datos.longitude);
		
		marcaCliente = new google.maps.Marker({
			icon: "img/destinoCliente.png"
		});
		marcaCliente.setPosition(destinoCliente);
		marcaCliente.setMap(mapa);
		
		
	}
}