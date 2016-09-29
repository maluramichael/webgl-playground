/**
 * Created by maluramichael on 29/09/16.
 */

function attachAttribute(gl, programm, name) {
	var location = gl.getAttribLocation(programm, name);
	gl.enableVertexAttribArray(location);
	return location;
}

function attachUniform(gl, programm, name) {
	return gl.getUniformLocation(programm, name);
}

function loadShader(gl, fs, vs) {
	var fragmentShader = getShader(gl, fs);
	var vertexShader = getShader(gl, vs);

	var shaderProgram = gl.createProgram();

	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);

	gl.linkProgram(shaderProgram);

	if ( !gl.getProgramParameter(shaderProgram, gl.LINK_STATUS) ) {
		console.log("Initialisierung des Shaderprogramms nicht möglich.");
	}

	return shaderProgram;
}

function drawRect(gl, x, y, w, h, rx, ry, rz) {
	// Compute the matrices
	var translationMatrix = makeTranslation(x || 0, y || 0, 0);
	var rotationXMatrix = makeXRotation(rx || 0);
	var rotationYMatrix = makeYRotation(ry || 0);
	var rotationZMatrix = makeZRotation(rz || 0);
	var scaleMatrix = makeScale(w || 100, h || 100, 1);

	// Multiply the matrices.
	var matrix = matrixMultiply(scaleMatrix, rotationXMatrix);
	matrix = matrixMultiply(matrix, rotationYMatrix);
	matrix = matrixMultiply(matrix, rotationZMatrix);
	matrix = matrixMultiply(matrix, translationMatrix);
	matrix = matrixMultiply(matrix, projectionMatrix);

	gl.uniformMatrix4fv(worldMatrixUniformLocation, false, matrix);

	gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}