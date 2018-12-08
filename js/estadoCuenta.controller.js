function callEstadoCuenta(){
	console.info("Llamando a vista previa de la orden");
	$("#modulo").attr("modulo", "estadoCuenta").html(plantillas["estadoCuenta"]);
	setPanel($("#modulo"));
	console.info("Carga de la vista previa finalizada");
	
	objUsuario.getData({
		fn: {
			after: function(resp){
				setDatos($("#modulo"), resp);
				height100($(".movimientos"), 50);
			}
		}
	});
	
	objUsuario.getMovimientos({
		"inicio": $("#txtInicio").val(),
		"fin": $("#txtFin").val(),
		"fn": {
			after: function(movimientos){
				for (i in movimientos){
					pl = movimientos[i].tipo == 'C'?$(plantillas["cargo"]):$(plantillas["abono"]);
					setDatos(pl, movimientos[i]);
					$(".movimientos").append(pl);
				}
			}
		}
	});
}