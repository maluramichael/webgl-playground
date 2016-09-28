/**
 * Created by maluramichael on 27/09/16.
 */
var squareVerticesBuffer;
var vertexPositionAttribute;
var vertexColorAttribute;

var worldMatrixUniformLocation;

var shaderProgram;
var projectionMatrix;

var timestamp = new Date().getTime();

function initBuffers(gl) {
	squareVerticesBuffer = gl.createBuffer();

	gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesBuffer);

	gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 6 * 4, 0);
	gl.vertexAttribPointer(vertexColorAttribute, 3, gl.FLOAT, false, 6 * 4, 3 * 4);

	// x, y, z, r, g, b
	var vertices = [
		1.0, 1.0, 0.0, 1, 0, 0,
		0.0, 1.0, 0.0, 0, 1, 0,
		1.0, 0.0, 0.0, 0, 0, 1,
		0.0, 0.0, 0.0, 1, 1, 1
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

	vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "a_position");
	vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");

	worldMatrixUniformLocation = gl.getUniformLocation(shaderProgram, "u_matrix");

	gl.enableVertexAttribArray(vertexPositionAttribute);
	gl.enableVertexAttribArray(vertexColorAttribute);

	gl.useProgram(null);
}

function drawRect(gl, x, y, w, h) {
	// Compute the matrices
	var translationMatrix = makeTranslation(x, y, 0);
	var rotationXMatrix = makeXRotation(0);
	var rotationYMatrix = makeYRotation(0);
	var rotationZMatrix = makeZRotation(0);
	var scaleMatrix = makeScale(w, h, 1);

	// Multiply the matrices.
	var matrix = matrixMultiply(scaleMatrix, rotationXMatrix);
	matrix = matrixMultiply(matrix, rotationYMatrix);
	matrix = matrixMultiply(matrix, rotationZMatrix);
	matrix = matrixMultiply(matrix, translationMatrix);
	matrix = matrixMultiply(matrix, projectionMatrix);

	gl.uniformMatrix4fv(worldMatrixUniformLocation, false, matrix);

	gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

function render(gl) {
	gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesBuffer);
	gl.useProgram(shaderProgram);

	drawRect(gl, 0, 0, 100, 100);
	drawRect(gl, 200, 200, 100, 100);

	gl.useProgram(null);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);
}

function update(delta) {
}

function engine_initialize(gl, canvas) {
	projectionMatrix = make2DProjection(canvas.clientWidth, canvas.clientHeight, 400);

	loadShader(gl);
	initBuffers(gl);
}

function engine_frame(gl, canvas) {
	gl.clearColor(0.2, 0.2, 0.2, 1);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	var now = new Date().getTime();
	var delta = now - timestamp;
	timestamp = now;

	update(delta);
	render(gl);

	requestAnimationFrame(engine_frame.bind(engine_frame, gl, canvas));
}

start('glcanvas', engine_initialize, engine_frame);