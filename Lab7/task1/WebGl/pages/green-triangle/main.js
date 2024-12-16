function main() {
    const canvas = document.querySelector("#c");
    /** @type {WebGLRenderingContext} */
    const gl = canvas.getContext("webgl");

    const vertexShaderSource = document.querySelector("#vertex-shader-2d").text;
    const fragmentShaderSource = document.querySelector(
        "#fragment-shader-2d",
    ).text;

    //1. Инициализировать шейдеры (вершинный и фрагментный)
    function createShader(gl, type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    
        if (success) {
            return shader;
        }
    
        console.log(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
    }

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(
        gl,
        gl.FRAGMENT_SHADER,
        fragmentShaderSource,
    );
    
    //2. Инициализировать шейдерную программу
    function createProgram(gl, vertexShader, fragmentShader) {
        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        const success = gl.getProgramParameter(program, gl.LINK_STATUS);
    
        if (success) {
            return program;
        }
    
        console.log(gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
    }

    const program = createProgram(gl, vertexShader, fragmentShader);

    //3. Получить id аттрибутов из шейдерной программы
    const positionAttributeLocation = gl.getAttribLocation(
        program,
        "a_position",
    );
    if (positionAttributeLocation === -1) {
        console.error("Attribute a_position not found in shader program.");
        return;
    }

    //4. Инициализировать VBO
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    //const positions = [-1, -1, 0, 1, 1, -1];
    //const positions = [-0.5, -0.5, 0.5, -0.5, 0.5,  0.5, -0.5,  0.5];
    const positions = [
        -0.5, -0.5, 
        0, -1,
        0.5, -0.5, 
        0.5,  0.5, 
        0, 1,
        -0.5,  0.5, 
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    
    function resizeCanvasToDisplaySize(canvas) {
        const displayWidth = canvas.clientWidth;
        const displayHeight = canvas.clientHeight;
        const needResize =
            canvas.width !== displayWidth || canvas.height !== displayHeight;
    
        if (needResize) {
            canvas.width = displayWidth;
            canvas.height = displayHeight;
        }
    
        return needResize;
    }

    resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    //5. Отрисовать сцену
    gl.useProgram(program);
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    const size = 2; 
    const type = gl.FLOAT; 
    const normalize = false; 
    const stride = 0; 
    let offset = 0;

    gl.vertexAttribPointer(
        positionAttributeLocation,
        size,
        type,
        normalize,
        stride,
        offset,
    );

    const primitiveType = gl.TRIANGLES;
    offset = 0;
    const count = 6;

    gl.drawArrays(primitiveType, offset, count);

    //6. Очистить ресурсы
    gl.deleteBuffer(positionBuffer);
    gl.deleteProgram(program);
}

main();