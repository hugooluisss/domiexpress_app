function callOrdenTrabajo(idOrden){
	console.info("Llamando a vista de la orden");
	$("#modulo").attr("modulo", "orden").html(plantillas["ordenTrabajo"]);
	setPanel($("#modulo"));
	console.info("Carga de la orden finalizada");
	var orden = new TOrden;
	var mapa = undefined;
	var datosOrden = undefined;
	var coordenadas = undefined;
	height100($("#generales"));
	
	
	var posicionActual = new google.maps.Marker({
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
	
	
	$("#btnCamara").click(function(){
		var el = $(this);
		navigator.camera.getPicture(function(imageURI){
			agregarFoto(imageURI, el);
		}, function(message){
			alertify.error("Ocurrio un error al obtener la imagen");
		}, {
			quality: 100,
			destinationType: Camera.DestinationType.DATA_URL,
			encodingType: Camera.EncodingType.JPEG,
			targetWidth: 500,
			targetHeight: 500,
			correctOrientation: true,
			allowEdit: false,
			saveToPhotoAlbum: false
		});
	});
	
	$("#btnGaleria").click(function(){
		var el = $(this);
		navigator.camera.getPicture(function(imageURI){
			agregarFoto(imageURI, el);
		}, function(message){
			alertify.error("Ocurrio un error al obtener la imagen");
		}, {
			quality: 100,
			destinationType: Camera.DestinationType.DATA_URL,
			encodingType: Camera.EncodingType.JPEG,
			targetWidth: 500,
			targetHeight: 500,
			correctOrientation: true,
			allowEdit: false,
			sourceType: navigator.camera.PictureSourceType.SAVEDPHOTOALBUM
		});
	});
	
	function agregarFoto(imageURI, el){
		$("#addImagen").find("img").remove();
		var img = $("<img />",{
			"src": "data:image/jpeg;base64," + imageURI,
			"src2": imageURI
		});
		
		$("#addImagen").append(img);
	}

	
	
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
				"imagen": $("#addImagen").find("img").attr("src2"),
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
	
	$("#btnEnviarCalificacion").click(function(){
		var calificacion = $('input[name=estrellas]:checked').val();
		if (calificacion == undefined)
			mensajes.alert({"titulo": "Calificación", "mensaje": "Escoge una estrella"});
		else{
			orden.finalizar({
				"id": idOrden,
				"calificacion": calificacion,
				"fn": {
					before: function(){
						blockUI("Espera un momento por favor");
					}, after: function(resp){
						unBlockUI();
						if (resp.band){
							$("#winFinalizar").modal("hide");
							mensajes.alert({"titulo": "Servicio terminado", "mensaje": "Muchas gracias, le informaremos al cliente para que lo antes posible apruebe la finalización del servicio"});
							callHome();
						}else
							mensajes.alert({"titulo": "Error", "mensaje": "No se pudo finalizar el servicio"});
					}
				}
			})
		}
	});
	
	$('#winReporte').on('show.bs.modal', function(){
		$("#addImagen").find("img").remove();
	});
}