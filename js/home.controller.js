function callHome(){
	console.info("Llalmando a home");
	$("#modulo").attr("modulo", "home").html(plantillas["home"]);
	setPanel($("#modulo"));
	console.info("Carga de home finalizada");
	
	objUsuario.getData({
		fn: {
			after: function(datos){
				setDatos($(".bienvenida"), datos);
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
}