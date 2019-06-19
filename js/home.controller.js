function callHome(){
	console.info("Llamando a home");
	$("#modulo").attr("modulo", "home").html(plantillas["home"]);
	setPanel($("#modulo"));
	console.info("Carga de home finalizada");
	
	function getPosicionActual(fn){
		blockUI("Estamos obteniendo tu ubicación");
		navigator.geolocation.getCurrentPosition(function(pos){
			posicionActual = pos.coords;
			getListaOrdenesUsuario();
			console.info("Obtiendo lista");
			unBlockUI();
		});
		
		if (fn != undefined)
			if (fn.after != undefined)
				fn.after();
	}
	
	getPosicionActual();
	height100($("#ordenes"));
	
	$("#btnAdjudicadas").click(function(){
		$(".nav-item").removeClass("active");
		$(this).addClass("active");
		if (posicionActual == undefined)
			getPosicionActual();
		else
			getListaOrdenesUsuario();
	});
	
	$("#btnNuevas").click(function(){
		$(".nav-item").removeClass("active");
		$(this).addClass("active");
		getListaPublicadas();
	});
	
	function getListaOrdenesUsuario(){
		blockUI("Espera en lo que obtenemos tus servicios asignados");
		$.post(server + "listaordenesrunner", {
			"runner": objUsuario.idUsuario,
			"latitude": posicionActual.latitude,
			"longitude": posicionActual.longitude,
			"movil": true,
			"json": true
		}, function(ordenes){
			$("#ordenes").find("a").remove();
			$(".list-group").find("p").remove();
			
			if (ordenes.length == 0)
				$("#ordenes").html(plantillas["sinOrdenesAsignadas"]);
				
			if (ordenes.length == 0)
				unBlockUI();
			
			$.each(ordenes, function(i, orden){
				pl = $(plantillas["itemOrden"]);
				setDatos(pl, orden);
				
				pl.attr("idOrden", orden.idOrden);
				pl.attr("estado", orden.idEstado);
				pl.click(function(){
					console.log($(this).attr("estado"));
					switch($(this).attr("estado")){
						case '2':
							callOrdenTrabajo($(this).attr("idOrden"));
						break;
						case '3': case '4':
							callOrdenTerminada($(this).attr("idOrden"));
						break;
					}
				});
				
				pl.find("[campo=nombreEstado]").css("color", orden.colorEstado);
				pl.find("[campo=folio]").css("color", orden.colorEstado);
				
				$("#ordenes").append(pl);
				unBlockUI();
			});
		}, "json");
	}
	
	function getListaPublicadas(){
		blockUI("Espera estamos buscando nuevos servicios");
		$.post(server + "listaordenespublicadas", {
			"movil": true,
			"json": true
		}, function(ordenes){
			$(".list-group").find("a").remove();
			$(".list-group").find("p").remove();
			if (ordenes.length == 0)
				$("#ordenes").html(plantillas["sinOrdenesPublicadas"]);
			$.each(ordenes, function(i, orden){
				pl = $(plantillas["itemOrden"]);
				
				setDatos(pl, orden);
				pl.find("[campo=nombreEstado]").css("color", orden.colorEstado);
				pl.find("[campo=folio]").css("color", orden.colorEstado);
				
				pl.attr("idOrden", orden.idOrden);
				pl.click(function(){
					callOrdenVista($(this).attr("idOrden"));
				});
				
				$("#ordenes").append(pl);
			});
			
			unBlockUI();
		}, "json");
	}
	
	objUsuario.getData({
		fn: {
			after: function(datos){
				setDatos($(".bienvenida"), datos);
				
				if(datos.imgPerfil != '')
					$("#fotoPerfil").attr("src", server + datos.imgPerfil);
				
				$(".bienvenida .perfilCamara").click(function(){
					navigator.camera.getPicture(function(imageURI){
						setFotoPerfil(imageURI);
					}, function(message){
						alertify.error("Ocurrio un error al obtener la imagen");
					}, {
						quality: 100,
						destinationType: Camera.DestinationType.DATA_URL,
						encodingType: Camera.EncodingType.JPEG,
						targetWidth: 800,
						targetHeight: 800,
						correctOrientation: true,
						allowEdit: true,
						saveToPhotoAlbum: false
					});
				});

				$(".bienvenida .perfilGaleria").click(function(){
					navigator.camera.getPicture(function(imageURI){
						setFotoPerfil(imageURI);
					}, function(message){
						alertify.error("Ocurrio un error al obtener la imagen");
					}, {
						quality: 100,
						destinationType: Camera.DestinationType.DATA_URL,
						encodingType: Camera.EncodingType.JPEG,
						targetWidth: 800,
						targetHeight: 800,
						correctOrientation: true,
						allowEdit: true,
						sourceType: navigator.camera.PictureSourceType.SAVEDPHOTOALBUM
					});
				});
			}
		}
	});
	
	//getListaPublicadas();
	
	//getListaOrdenesUsuario();
	
	$("#btnSalir").click(function(){
		alertify.confirm("¿Seguro?", function(e){
    		if(e) {
    			window.plugins.PushbotsPlugin.removeTags(["runner"]);
    			window.plugins.PushbotsPlugin.removeAlias();
	    		window.localStorage.removeItem("session");
	    		location.href = "index.html";
	    		cordova.plugins.backgroundMode.disable();
	    	}
    	});
	});
	
	function setFotoPerfil(imageURI){
		var img = $("#fotoPerfil");
		objUsuario.setFotoPerfil({
			"img": imageURI,
			"id": objUsuario.idUsuario,
			"fn": {
				before: function(){
					blockUI("Estamos actualizando tu foto de perfil");
				}, after: function(resp){
					unBlockUI();
					if (resp.band){
						$("#fotoPerfil").attr("src", "data:image/jpeg;base64," + imageURI);
						img.attr("src2", imageURI);
					}else
						mensajes.alert({"mensaje": "No se pudo actualizar tu fotografía"});
				}
			}
		});
	}
}