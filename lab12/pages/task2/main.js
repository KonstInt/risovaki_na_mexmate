var vertexShaderText =
	[
		'precision mediump float;',
		'',
		'attribute vec3 vertPosition;',
		'attribute vec2 vertTexCoord;',
		'attribute vec3 vertColor;', // Новый атрибут для цвета
		'varying vec2 fragTexCoord;',
		'varying vec3 fragColor;',   // Передаем цвет во фрагментный шейдер
		'uniform mat4 mWorld;',
		'uniform mat4 mView;',
		'uniform mat4 mProj;',
		'',
		'void main()',
		'{',
		'  fragTexCoord = vertTexCoord;',
		'  fragColor = vertColor;', // Присваиваем цвет вершины фрагменту
		'  gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);',
		'}'
	].join('\n');



var fragmentShaderText =
	[
		'precision mediump float;',
		'',
		'varying vec2 fragTexCoord;',
		'varying vec3 fragColor;',   // Получаем цвет из вершин
		'uniform sampler2D sampler;',
		'uniform float mixFactor;', // Коэффициент смешивания
		'',
		'void main()',
		'{',
		'  vec4 textureColor = texture2D(sampler, fragTexCoord);', // Цвет из текстуры
		'  gl_FragColor = mix(textureColor, vec4(fragColor, 1.0), mixFactor);', // Смешиваем текстуру с цветом
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
		[
			// X, Y, Z            U, V            R, G, B (Color)
			// Top
			-1.0, 1.0, -1.0, 0, 0, 1.0, 0.0, 0.0,
			-1.0, 1.0, 1.0, 0, 1, 0.0, 1.0, 0.0,
			1.0, 1.0, 1.0, 1, 1, 0.0, 0.0, 1.0,
			1.0, 1.0, -1.0, 1, 0, 1.0, 1.0, 0.0,

			// Left
			-1.0, 1.0, 1.0, 0, 0, 1.0, 0.0, 0.0,
			-1.0, -1.0, 1.0, 1, 0, 0.0, 1.0, 0.0,
			-1.0, -1.0, -1.0, 1, 1, 0.0, 0.0, 1.0,
			-1.0, 1.0, -1.0, 0, 1, 1.0, 1.0, 0.0,

			// Right
			1.0, 1.0, 1.0, 1, 1, 1.0, 0.0, 0.0,
			1.0, -1.0, 1.0, 0, 1, 0.0, 1.0, 0.0,
			1.0, -1.0, -1.0, 0, 0, 0.0, 0.0, 1.0,
			1.0, 1.0, -1.0, 1, 0, 1.0, 1.0, 0.0,

			// Front
			1.0, 1.0, 1.0, 1, 1, 1.0, 0.0, 0.0,
			1.0, -1.0, 1.0, 1, 0, 0.0, 1.0, 0.0,
			-1.0, -1.0, 1.0, 0, 0, 0.0, 0.0, 1.0,
			-1.0, 1.0, 1.0, 0, 1, 1.0, 1.0, 0.0,

			// Back
			1.0, 1.0, -1.0, 0, 0, 1.0, 0.0, 0.0,
			1.0, -1.0, -1.0, 0, 1, 0.0, 1.0, 0.0,
			-1.0, -1.0, -1.0, 1, 1, 0.0, 0.0, 1.0,
			-1.0, 1.0, -1.0, 1, 0, 1.0, 1.0, 0.0,

			// Bottom
			-1.0, -1.0, -1.0, 1, 1, 1.0, 0.0, 0.0,
			-1.0, -1.0, 1.0, 1, 0, 0.0, 1.0, 0.0,
			1.0, -1.0, 1.0, 0, 0, 0.0, 0.0, 1.0,
			1.0, -1.0, -1.0, 0, 1, 1.0, 1.0, 0.0,
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


	var mixFactor = 0.5;  // Начальный коэффициент смешивания
	document.addEventListener('keydown', function (event) {
		if (event.key === 'ArrowUp') {
			// Увеличиваем коэффициент смешивания
			mixFactor = Math.min(1.0, mixFactor + 0.1);  // Ограничиваем значением 1.0
			console.log("Mix Factor: " + mixFactor);
		} else if (event.key === 'ArrowDown') {
			// Уменьшаем коэффициент смешивания
			mixFactor = Math.max(0.0, mixFactor - 0.1);  // Ограничиваем значением 0.0
			console.log("Mix Factor: " + mixFactor);
		}
	});


	var boxIndexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBufferObject);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(boxIndices), gl.STATIC_DRAW);

	var boxVertexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, boxVertexBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boxVertices), gl.STATIC_DRAW);

	var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
	var texCoordAttribLocation = gl.getAttribLocation(program, 'vertTexCoord');
	var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');  // Новый атрибут для цвета

	gl.vertexAttribPointer(positionAttribLocation, 3, gl.FLOAT, gl.FALSE, 8 * Float32Array.BYTES_PER_ELEMENT, 0);
	gl.vertexAttribPointer(texCoordAttribLocation, 2, gl.FLOAT, gl.FALSE, 8 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT);
	gl.vertexAttribPointer(colorAttribLocation, 3, gl.FLOAT, gl.FALSE, 8 * Float32Array.BYTES_PER_ELEMENT, 5 * Float32Array.BYTES_PER_ELEMENT);

	gl.enableVertexAttribArray(positionAttribLocation);
	gl.enableVertexAttribArray(texCoordAttribLocation);
	gl.enableVertexAttribArray(colorAttribLocation);






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

	// Tell OpenGL state machine which program should be active.
	gl.useProgram(program);

	var matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld');
	var matViewUniformLocation = gl.getUniformLocation(program, 'mView');
	var matProjUniformLocation = gl.getUniformLocation(program, 'mProj');

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

	var mixFactorUniformLocation = gl.getUniformLocation(program, 'mixFactor');

	var loop = function () {
		// Set the angle of rotation (45 degrees, i.e., π/4 radians)
		var angle = Math.PI / 4;  // 45 degrees in radians

		// Create rotation matrices for Y and Z axes
		var yRotationMatrix = new Float32Array(16);
		var zRotationMatrix = new Float32Array(16);

		mat4.rotate(yRotationMatrix, identityMatrix, angle, [0, 1, 0]);
		mat4.rotate(zRotationMatrix, identityMatrix, angle, [0, 0, 1]);

		mat4.mul(worldMatrix, yRotationMatrix, zRotationMatrix);

		// Apply the world matrix to the shader
		gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);

		// Передаем значение коэффициента смешивания в шейдер
		gl.uniform1f(mixFactorUniformLocation, mixFactor);

		// Clear the screen and draw the cube
		gl.clearColor(0.0, 0.0, 0.0, 1.0);
		gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

		// Bind texture and render the cube
		gl.bindTexture(gl.TEXTURE_2D, boxTexture);
		gl.activeTexture(gl.TEXTURE0);

		gl.drawElements(gl.TRIANGLES, boxIndices.length, gl.UNSIGNED_SHORT, 0);

		// Request the next frame
		requestAnimationFrame(loop);
	};


	requestAnimationFrame(loop);
};
