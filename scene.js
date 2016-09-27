/**
 * Created by maluramichael on 27/09/16.
 */
var squareVerticesBuffer;
var vertexPositionAttribute;
var vertexColorAttribute;

var worldMatrixUniformLocation;

var shaderProgram;

function initBuffers(gl) {
	squareVerticesBuffer = gl.createBuffer();

	gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesBuffer);

	gl.vertexAttribPointer(vertexPositionAttribute, 2, gl.FLOAT, false, 5 * 4, 0);
	gl.vertexAttribPointer(vertexColorAttribute, 3, gl.FLOAT, false, 5 * 4, 2 * 4);

	// x, y, z, r, g, b
	const vertices = [
		1.0, 1.0, 1, 0, 0,
		-1.0, 1.0, 0, 1, 0,
		1.0, -1.0, 0, 0, 1,
		-1.0, -1.0, 1, 1, 1
	];

	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

	gl.bindBuffer(gl.ARRAY_BUFFER, null);
}

function loadShader(gl) {
	var fragmentShader = getShader(gl, 'shader-fs');
	var vertexShader = getShader(gl, 'shader-vs');

	shaderProgram = gl.createProgram();

	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);

	gl.linkProgram(shaderProgram);

	if ( !gl.getProgramParameter(shaderProgram, gl.LINK_STATUS) ) {
		console.log("Initialisierung des Shaderprogramms nicht möglich.");
	}

	gl.useProgram(shaderProgram);

	vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
	vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");

	worldMatrixUniformLocation = gl.getUniformLocation(shaderProgram, "u_matrix");

	gl.enableVertexAttribArray(vertexPositionAttribute);
	gl.enableVertexAttribArray(vertexColorAttribute);

	gl.useProgram(null);
}

function engine_initialize(gl) {
	loadShader(gl);
	initBuffers(gl);
}

function engine_render(gl) {
	gl.clearColor(0.2, 0.2, 0.2, 1);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesBuffer);
	gl.useProgram(shaderProgram);

	// Compute the matrices
	var translationMatrix = makeTranslation(0, 0);
	var rotationMatrix = makeRotation(0);
	var scaleMatrix = makeScale(0.1, 0.1);

	console.log('translation');
	printMatrix(translationMatrix);

	console.log('rotation');
	printMatrix(rotationMatrix);

	console.log('scale');
	printMatrix(scaleMatrix);

	// Multiply the matrices.
	var matrix = matrixMultiply(scaleMatrix, rotationMatrix);
	matrix = matrixMultiply(matrix, translationMatrix);

	console.log('matrix');
	printMatrix(matrix);

	gl.uniformMatrix3fv(worldMatrixUniformLocation, false, matrix);

	gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

	gl.useProgram(null);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);
}

start('glcanvas', engine_initialize, engine_render);