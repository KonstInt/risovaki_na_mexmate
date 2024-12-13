var vertexShaderText = [
	'precision mediump float;',
	'',
	'attribute vec3 vertPosition;',
	'attribute vec2 vertTexCoord;',
	'varying vec2 fragTexCoord;',
	'uniform mat4 mWorld;',
	'uniform mat4 mView;',
	'uniform mat4 mProj;',
	'',
	'void main()',
	'{',
	'  fragTexCoord = vertTexCoord;',
	'  gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);',
	'}'
].join('\n');


var fragmentShaderText = [
	'precision mediump float;',
	'',
	'varying vec2 fragTexCoord;',
	'uniform sampler2D sampler1;',
	'uniform sampler2D sampler2;',
	'uniform float mixFactor;',
	'',
	'void main()',
	'{',
	'  vec4 color1 = texture2D(sampler1, fragTexCoord);',
	'  vec4 color2 = texture2D(sampler2, fragTexCoord);',
	'  gl_FragColor = mix(color1, color2, mixFactor);',
	'}'
].join('\n');


var main = function () {
	console.log('This is working');

	var canvas = document.getElementById('game-surface');
	var gl = canvas.getContext('webgl');

	if (!gl) {
		console.log('WebGL not supported, falling back on experimental-webgl');
		gl = canvas.getContext('experimental-webgl');
	}

	if (!gl) {
		alert('Your browser does not support WebGL');
	}

	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.enable(gl.DEPTH_TEST);
	gl.enable(gl.CULL_FACE);
	gl.frontFace(gl.CCW);
	gl.cullFace(gl.BACK);

	//
	// Create shaders
	// 
	var vertexShader = gl.createShader(gl.VERTEX_SHADER);
	var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

	gl.shaderSource(vertexShader, vertexShaderText);
	gl.shaderSource(fragmentShader, fragmentShaderText);

	gl.compileShader(vertexShader);
	if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
		console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertexShader));
		return;
	}

	gl.compileShader(fragmentShader);
	if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
		console.error('ERROR compiling fragment shader!', gl.getShaderInfoLog(fragmentShader));
		return;
	}

	var program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);
	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		console.error('ERROR linking program!', gl.getProgramInfoLog(program));
		return;
	}
	gl.validateProgram(program);
	if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
		console.error('ERROR validating program!', gl.getProgramInfoLog(program));
		return;
	}

	//
	// Create buffer
	//
	var boxVertices =
		[ // X, Y, Z           U, V
			// Top
			-1.0, 1.0, -1.0, 0, 0,
			-1.0, 1.0, 1.0, 0, 1,
			1.0, 1.0, 1.0, 1, 1,
			1.0, 1.0, -1.0, 1, 0,

			// Left
			-1.0, 1.0, 1.0, 0, 0,
			-1.0, -1.0, 1.0, 1, 0,
			-1.0, -1.0, -1.0, 1, 1,
			-1.0, 1.0, -1.0, 0, 1,

			// Right
			1.0, 1.0, 1.0, 1, 1,
			1.0, -1.0, 1.0, 0, 1,
			1.0, -1.0, -1.0, 0, 0,
			1.0, 1.0, -1.0, 1, 0,

			// Front
			1.0, 1.0, 1.0, 1, 1,
			1.0, -1.0, 1.0, 1, 0,
			-1.0, -1.0, 1.0, 0, 0,
			-1.0, 1.0, 1.0, 0, 1,

			// Back
			1.0, 1.0, -1.0, 0, 0,
			1.0, -1.0, -1.0, 0, 1,
			-1.0, -1.0, -1.0, 1, 1,
			-1.0, 1.0, -1.0, 1, 0,

			// Bottom
			-1.0, -1.0, -1.0, 1, 1,
			-1.0, -1.0, 1.0, 1, 0,
			1.0, -1.0, 1.0, 0, 0,
			1.0, -1.0, -1.0, 0, 1,
		];

	var boxIndices =
		[
			// Top
			0, 1, 2,
			0, 2, 3,

			// Left
			5, 4, 6,
			6, 4, 7,

			// Right
			8, 9, 10,
			8, 10, 11,

			// Front
			13, 12, 14,
			15, 14, 12,

			// Back
			16, 17, 18,
			16, 18, 19,

			// Bottom
			21, 20, 22,
			22, 20, 23
		];

	var boxVertexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, boxVertexBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boxVertices), gl.STATIC_DRAW);

	var boxIndexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBufferObject);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(boxIndices), gl.STATIC_DRAW);

	var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
	var texCoordAttribLocation = gl.getAttribLocation(program, 'vertTexCoord');
	gl.vertexAttribPointer(
		positionAttribLocation, // Attribute location
		3, // Number of elements per attribute
		gl.FLOAT, // Type of elements
		gl.FALSE,
		5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
		0 // Offset from the beginning of a single vertex to this attribute
	);
	gl.vertexAttribPointer(
		texCoordAttribLocation, // Attribute location
		2, // Number of elements per attribute
		gl.FLOAT, // Type of elements
		gl.FALSE,
		5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
		3 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
	);

	gl.enableVertexAttribArray(positionAttribLocation);
	gl.enableVertexAttribArray(texCoordAttribLocation);

	//
	// Create texture
	//
	var boxTexture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, boxTexture);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texImage2D(
		gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
		gl.UNSIGNED_BYTE,
		document.getElementById('crate-image')
	);
	gl.bindTexture(gl.TEXTURE_2D, null);


	var boxTexture2 = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, boxTexture2);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texImage2D(
		gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
		gl.UNSIGNED_BYTE,
		document.getElementById('cobblestone') // Верно для второй текстуры
	);
	gl.bindTexture(gl.TEXTURE_2D, null);

	// Tell OpenGL state machine which program should be active.
	gl.useProgram(program);




	var matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld');
	var matViewUniformLocation = gl.getUniformLocation(program, 'mView');
	var matProjUniformLocation = gl.getUniformLocation(program, 'mProj');

	var sampler1Location = gl.getUniformLocation(program, 'sampler1');
	var sampler2Location = gl.getUniformLocation(program, 'sampler2');
	var mixFactorLocation = gl.getUniformLocation(program, 'mixFactor');


	var worldMatrix = new Float32Array(16);
	var viewMatrix = new Float32Array(16);
	var projMatrix = new Float32Array(16);
	mat4.identity(worldMatrix);
	mat4.lookAt(viewMatrix, [0, 0, -8], [0, 0, 0], [0, 1, 0]);
	mat4.perspective(projMatrix, glMatrix.toRadian(45), canvas.clientWidth / canvas.clientHeight, 0.1, 1000.0);

	gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
	gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
	gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);

	var xRotationMatrix = new Float32Array(16);
	var yRotationMatrix = new Float32Array(16);

	//
	// Main render loop
	//
	var identityMatrix = new Float32Array(16);
	mat4.identity(identityMatrix);
	var angle = 0;
	var mixFactor = 0.5; // Коэффициент смешивания (0 - первая текстура, 1 - вторая)
	window.addEventListener('keydown', function (event) {
		if (event.key === 'ArrowUp') {
			// Увеличиваем коэффициент смешивания (до 1)
			mixFactor = Math.min(mixFactor + 0.05, 1.0);
		} else if (event.key === 'ArrowDown') {
			// Уменьшаем коэффициент смешивания (до 0)
			mixFactor = Math.max(mixFactor - 0.05, 0.0);
		}
	});
	var loop = function () {
		var angle = Math.PI / 4;
		var yRotationMatrix = new Float32Array(16);
		var zRotationMatrix = new Float32Array(16);
		mat4.rotate(yRotationMatrix, identityMatrix, angle, [0, 1, 0]);
		mat4.rotate(zRotationMatrix, identityMatrix, angle, [0, 0, 1]);
		mat4.mul(worldMatrix, yRotationMatrix, zRotationMatrix);
		gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
		gl.clearColor(0.0, 0.0, 0.0, 1.0);
		gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, boxTexture);
		gl.uniform1i(sampler1Location, 0);
		gl.activeTexture(gl.TEXTURE1);
		gl.bindTexture(gl.TEXTURE_2D, boxTexture2);
		gl.uniform1i(sampler2Location, 1);
		gl.uniform1f(mixFactorLocation, mixFactor);
		gl.drawElements(gl.TRIANGLES, boxIndices.length, gl.UNSIGNED_SHORT, 0);
		requestAnimationFrame(loop);
	};


	requestAnimationFrame(loop);
};
