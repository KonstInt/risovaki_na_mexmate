function main() {
    const canvas = document.querySelector("#c");
    /** @type {WebGLRenderingContext} */
    const gl = canvas.getContext("webgl");

    if (!gl) {
        console.error("WebGL не поддерживается");
        return;
    }

    const vertexShaderSource = `
        attribute vec2 a_position;
        attribute vec3 a_color;
        varying vec3 v_color;
        void main() {
            gl_Position = vec4(a_position, 0, 1);
            v_color = a_color;
        }
    `;

    const fragmentShaderSource = `
        precision mediump float;
        uniform vec3 u_color;
        void main() {
            gl_FragColor = vec4(u_color, 1.0);
        }
    `;

    function createShader(gl, type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (success) {
            return shader;
        }
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
    }

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    function createProgram(gl, vertexShader, fragmentShader) {
        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        const success = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (success) {
            return program;
        }
        console.error(gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
    }

    const program = createProgram(gl, vertexShader, fragmentShader);

    const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    const colorAttributeLocation = gl.getAttribLocation(program, "a_color");

    const uColorLocation = gl.getUniformLocation(program, "u_color"); // uniform для цвета

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    const colorBuffer = gl.createBuffer();

    function drawShape(gl, program, shapeType, positions, colors, offset) {
        const adjustedPositions = positions.map((value, index) =>
            index % 2 === 0 ? value * 0.5 + offset[0] : value * 0.5 + offset[1]
        );

        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(adjustedPositions), gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

        gl.useProgram(program);

        gl.enableVertexAttribArray(positionAttributeLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

        gl.enableVertexAttribArray(colorAttributeLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.vertexAttribPointer(colorAttributeLocation, 3, gl.FLOAT, false, 0, 0);

        // Передаем цвет через uniform
        gl.uniform3fv(uColorLocation, colors.slice(0, 3)); // Передаем первый цвет

        gl.drawArrays(shapeType, 0, positions.length / 2);
    }

    resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Четырехугольник (два треугольника), цвет: красный
    drawShape(gl, program, gl.TRIANGLES, [
        -0.5, -0.5,
        0.5, -0.5,
        -0.5, 0.5,
        -0.5, 0.5,
        0.5, -0.5,
        0.5, 0.5
    ], [
        1, 0, 0,  0, 1, 0,  0, 0, 1,
        0, 0, 1,  0, 1, 0,  1, 1, 0
    ], [-0.7, 0]);

    // Веер, цвет: зеленый
    drawShape(gl, program, gl.TRIANGLE_FAN, [
        0, -0.5,        
        0.75, -0.5,     
        0.525, 0.025,   
        0, 0.25,        
        -0.525, 0.025,  
        -0.75, -0.5,    
        0, -0.5,        
        0, 0,
        0, 0,   
        0, 0
    ], [
        0, 1, 0,  0, 1, 0,  0, 0, 1,
        0, 1, 0,  0, 1, 0,  0, 1, 1,
        0, 1, 0,  0, 0, 1,  1, 0, 1,
        1, 0, 1
    ], [0, 0]);

    // Пятиугольник, цвет: синий
    drawShape(gl, program, gl.TRIANGLE_FAN, [
        0, 0.5,
        0.47, 0.15,
        0.29, -0.4,
        -0.29, -0.4,
        -0.47, 0.15
    ], [
        0, 0, 1,  0, 1, 1,  0, 0, 1,
        0, 0, 1,  0, 1, 1
    ], [0.7, 0]);

}

function resizeCanvasToDisplaySize(canvas) {
    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;
    const needResize = canvas.width !== displayWidth || canvas.height !== displayHeight;
    if (needResize) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
    }
    return needResize;
}

main();
