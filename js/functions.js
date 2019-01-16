server = "http://dashboard.domireparto.com/";
//server = "http://192.168.2.2/domiExp/";
//server = "http://192.168.0.8/domiExp/";

var nameSesion = "domi";
var idUsuario = undefined;
/*
*
* Centra verticalmente una ventana modal
*
*/
function reposition(modal, dialog) {
	modal.css('display', 'block');
	
	// Dividing by two centers the modal exactly, but dividing by three 
	// or four works better for larger screens.
	dialog.css("margin-top", Math.max(0, ($(window).height() - dialog.height()) / 2));
}

function checkConnection() {
	try{
		var networkState = navigator.connection.type;
	
		var states = {};
		states[Connection.UNKNOWN]  = 'Unknown connection';
		states[Connection.ETHERNET] = 'Ethernet connection';
		states[Connection.WIFI]     = 'WiFi connection';
		states[Connection.CELL_2G]  = 'Cell 2G connection';
		states[Connection.CELL_3G]  = 'Cell 3G connection';
		states[Connection.CELL_4G]  = 'Cell 4G connection';
		states[Connection.CELL]     = 'Cell generic connection';
		states[Connection.NONE]     = 'No network connection';
		
		switch(networkState){
			case Connection.NONE: 
				alertify.error("Verifica tu conexión, la aplicación necesita conexión a internet");
				return false;
			break;
			default:
				return true;
		}
	}catch(e){
		return true;
	}
}

function getDistancia(lat1, lon1, lat2, lon2){
	rad = function(x) {return x*Math.PI/180;}
	
	var R = 6378.137;
	var dLat = rad(lat2 - lat1);
	var dLong = rad(lon2 - lon1);
	
	var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLong/2) * Math.sin(dLong/2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
	var d = R * c;
	
	return d.toFixed(3); //Retorna tres decimales
}

var mensajes = {
	alert: function(data){
		if (data.funcion == undefined)
			data.funcion = function(){};
			
		if (data.titulo == undefined)
			data.titulo = " ";
		
		try{
			navigator.notification.alert(data.mensaje, data.funcion, data.titulo, data.boton);
		}catch(err){
			window.alert(data.mensaje);
		}

	},
	
	confirm: function(data){
		if (data.funcion == undefined)
			data.funcion = function(){};
			
		if (data.titulo == undefined)
			data.titulo = " ";
		
		
		try{
			navigator.notification.confirm(data.mensaje, data.funcion, data.titulo, data.botones);
		}catch(err){
			if (confirm(data.mensaje))
				data.funcion(1);
			else
				data.funcion(2);
		}
	},
	
	log: function(data){
		alertify.log(data.mensaje);
	},
	
	prompt: function(data){
		if (data.funcion == undefined)
			data.funcion = function(){};
			
		if (data.titulo == undefined)
			data.titulo = " ";
		
		
		try{
			navigator.notification.prompt(data.mensaje, data.funcion, data.titulo, data.botones);
		}catch(err){
			var result = prompt(data.mensaje);
			data.funcion({
				buttonIndex: 1,
				input1: result
			});
		}
	},
};

function setDatos(plantilla, datos, before){
	before = before == undefined?'':(before + "-");
	
	for(i in datos){
	//$.each(datos, function(i, valor){
		valor = datos[i];
		antes = plantilla.find("[campo=" + before + i + "]").attr("before") || ""; 
		despues = plantilla.find("[campo=" + before + i + "]").attr("after") || ""; 
		valor =  antes + valor + despues;
		plantilla.find("[campo=" + before + i + "]").html(valor);
		plantilla.find("[campo=" + before + i + "]").val(valor);
		
		if (typeof datos[i] == 'object')
			setDatos(plantilla, datos[i], i);
	};
}

function setPanel(el){
	if (el == undefined)
		el = $("body");
		
	el.find("[showpanel]").click(function(){
		callPanel($(this).attr("showpanel"));
	});
}

function getPlantillas(after){
	var cont = 0;
	$.each(plantillas, function(){
		cont++;
	});
	
	$.each(plantillas, function(pl, valor){
		$.get("vistas/" + pl + ".html", function(html){
			plantillas[pl] = html;
			
			cont--;
			if (cont == 0)
				after();
		});
	});
};


function activarNotificaciones(){
	window.plugins.PushbotsPlugin.initialize("5bd493e30540a359c506c9c7", {"android":{"sender_id":"88479654937"}});
	
	window.plugins.PushbotsPlugin.resetBadge();
	window.plugins.PushbotsPlugin.toggleNotifications(true);
	window.plugins.PushbotsPlugin.setAlias("runner_" + objUsuario.idUsuario);
}

function height100(el, menos){
	if (menos == undefined) menos = 0;
	var pos = el.offset();
	el.height($(window).height() - pos.top - menos);
	console.log($(window).height(), pos);
	el.css("overflow", "scroll");
}