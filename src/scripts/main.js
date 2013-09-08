require.config({

	paths: {
		"engine": "engine/engine",
	}

});

require(["config","engine"], function(config, Engine) {

	var ox = config.display.origin[0],
		oy = config.display.origin[1],
		sx = config.display.scale[0],
		sy = config.display.scale[1];

	var simulation = new Engine();

	
	simulation.addListener("tick",function(data){
		//document.getElementsByTagName("body")[0].innerHTML = JSON.stringify(data, null, 4).replace(/\n/g,"<br />");
		if (!document.getElementById("out")) return;
		document.getElementById("out").style.left = (ox + sx*data.loc[0]) + "px";
		document.getElementById("out").style.top = (oy - sx*data.loc[1]) + "px";
		document.getElementById("out").innerHTML = simulation.fps;
	});
	simulation.start();

	window.simulation = simulation;

});

