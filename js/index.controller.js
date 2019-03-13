function callIndex(){
	$("[modulo]").html(plantillas["index"]);
	setPanel();
}

function callLogout(){
	window.localStorage.removeItem("session_drunner");
	location.href = "index.html";
}