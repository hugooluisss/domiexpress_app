function callHome(){
	console.info("Llalmando a home");
	$("#modulo").attr("modulo", "home").html(plantillas["home"]);
	setPanel($("#modulo"));
	console.info("Carga de home finalizada");
	
	objUsuario.getData({
		fn: {
			after: function(datos){
				setDatos($(".bienvenida"), datos);
				
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
						allowEdit: false,
						saveToPhotoAlbum: true
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
						allowEdit: false,
						sourceType: navigator.camera.PictureSourceType.SAVEDPHOTOALBUM
					});
				});
			}
		}
	});
	
	getListaPublicadas();
	function getListaPublicadas(){
		$.post(server + "listaordenespublicadas", {
			"movil": true,
			"json": true
		}, function(ordenes){
			$("#dvDisponibles").find(".list-group").find("a").remove();
			$.each(ordenes, function(i, orden){
				pl = $(plantillas["itemOrden"]);
				setDatos(pl, orden);
				$("#dvDisponibles").find(".list-group").append(pl);
				pl.find("[campo=nombreEstado]").css("color", orden.colorEstado);
				
				pl.attr("idOrden", orden.idOrden);
				pl.click(function(){
					callOrdenVista($(this).attr("idOrden"));
				});
			});
		}, "json");
	}
	
	getListaOrdenesUsuario();
	function getListaOrdenesUsuario(){
		$.post(server + "listaordenesrunner", {
			"runner": objUsuario.idUsuario,
			"movil": true,
			"json": true
		}, function(ordenes){
			$("#dvAdjudicadas").find(".list-group").find("a").remove();
			$.each(ordenes, function(i, orden){
				pl = $(plantillas["itemOrden"]);
				setDatos(pl, orden);
				$("#dvAdjudicadas").find(".list-group").append(pl);
				
				pl.attr("idOrden", orden.idOrden);
				pl.click(function(){
					callOrdenTrabajo($(this).attr("idOrden"));
				});
				
				pl.find("[campo=nombreEstado]").css("color", orden.colorEstado);
			});
		}, "json");
	}
	
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
		var img = $("<img />");
		$("#fotoPerfil").attr("src", "data:image/jpeg;base64," + imageURI)
		$("#lstImg").append(img);
		img.attr("src", );
		img.attr("src2", imageURI);

		img.click(function(){
			var foto = $(this);
			alertify.confirm("Se eliminará la fotografía del reporte ¿seguro?", function (e) {
				if (e) {
					foto.remove();
					alertify.success("Fotografía eliminada");
				}
			});
		});
	}
}