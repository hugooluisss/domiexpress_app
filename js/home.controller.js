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