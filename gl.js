function initWebGL(canvas) {
	var gl = null;

	try {
		gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
	}
	catch ( e ) {
	}

	// Wenn wir keinen WebGl Kontext haben

	if ( !gl ) {
		console.log("WebGL konnte nicht initialisiert werden.");
		gl = null;
	}

	return gl;
}

function getShader(gl, id) {
	var shaderScript = document.getElementById(id);

	if ( !shaderScript ) {
		return null;
	}

	var theSource = "";
	var currentChild = shaderScript.firstChild;

	while ( currentChild ) {
		if ( currentChild.nodeType == 3 ) {
			theSource += currentChild.textContent;
		}

		currentChild = currentChild.nextSibling;
	}
	var shader;

	if ( shaderScript.type == "x-shader/x-fragment" ) {
		shader = gl.createShader(gl.FRAGMENT_SHADER);
	} else if ( shaderScript.type == "x-shader/x-vertex" ) {
		shader = gl.createShader(gl.VERTEX_SHADER);
	} else {
		return null;  // Unbekannter Shadertyp
	}

	gl.shaderSource(shader, theSource);

	// Kompiliere das Shaderprogramm
	gl.compileShader(shader);

	// Überprüfe, ob die Kompilierung erfolgreich war
	if ( !gl.getShaderParameter(shader, gl.COMPILE_STATUS) ) {
		console.log("Es ist ein Fehler beim Kompilieren der Shader aufgetaucht: " + gl.getShaderInfoLog(shader));
		return null;
	}

	return shader;
}


function start(elementId, initialize, render) {
	var canvas = document.getElementById(elementId);

	var gl = initWebGL(canvas);      // Initialisierung des WebGL Kontextes
	if ( !gl ) return;

	// Es geht nur weiter, wenn WebGl verfügbar ist.

	initialize(gl);
	render(gl);
}
