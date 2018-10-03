function callOrdenTrabajo(idOrden){
	console.info("Llamando a vista de la orden");
	$("#modulo").attr("modulo", "orden").html(plantillas["ordenTrabajo"]);
	setPanel($("#modulo"));
	console.info("Carga de la orden finalizada");
	var orden = new TOrden;
	var mapa = undefined;
	var datosOrden = undefined;
	var coordenadas = undefined;
	
	posicionActual = new google.maps.Marker({
		icon: "img/miPosicion.png"
	});
	
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
							}else
								mensajes.alert({"titulo": "Error", "mensaje": "No pudo ser asignada la carga"});
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
		posicionActual.setMap(mapa);
	}
	
	miUbicacion();
	function miUbicacion(){
		if ($("#winReporte").length > 0){
			navigator.geolocation.getCurrentPosition(function(pos){
					var datos = pos.coords;
					coordenadas = pos.coords;
					posicionActual.setPosition(new google.maps.LatLng(datos.latitude, datos.longitude));
				}, function(){
					mensajes.log({"mensaje": "No pudimos obtener tu ubicación, revisa tener habilitado el GPS de tu dispositivo", "titulo": "Error GPS"});
					callPanel("home");
				}
			);
		}else{
			clearInterval(ciclo);
			console.info("Ciclo detenido");
		}
	}
	
	var ciclo = setInterval(function(){
		miUbicacion();
	}, 3000);
	
	
	
	
	$("#frmEvidencia").validate({
		debug: true,
		errorClass: "validateError",
		rules: {
			txtComentario: "required"
		},
		wrapper: 'span',
		submitHandler: function(form){
			orden.addEvidencia({
				"orden": idOrden,
				"latitude": coordenadas.latitude,
				"longitude": coordenadas.longitude,
				"comentario": $(form).find("#txtComentario").val(),
				"fn": {
					before: function(){
						blockUI("Cargando detalle del servicio");
					},
					after: function(resp){
						unBlockUI();
						if (resp.band){
							mensajes.log({"mensaje": "Tu evidencia fue guardada"});
							$("#winReporte").modal("hide")
						}else
							mensajes.alert({"titulo": "Error", "mensaje": "No pudo ser guardada tu evidencia"});
					}
				}
			});
		}
	});
}