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

function initProgram({ gl }) {
  const vertexShaderSource = document.querySelector("#vertex-shader").text;
  const fragmentShaderSource = document.querySelector("#fragment-shader").text;
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = createShader(
    gl,
    gl.FRAGMENT_SHADER,
    fragmentShaderSource
  );
  const program = createProgram(gl, vertexShader, fragmentShader);
  return program;
}

function initBuffers(
  gl,
  { positions, colors, indices, textureCoords, normal }
) {
  const positionBuffer = initPositionBuffer(gl, positions);
  const colorBuffer = initColorBuffer(gl, colors);
  const indicesBuffer = initIndexBuffer(gl, indices);
  const textureCoordBuffer = initTextureBuffer(gl, textureCoords);
  const normalBuffer = initNormalBuffer(gl, normal);
  return {
    position: positionBuffer,
    color: colorBuffer,
    indices: indicesBuffer,
    textureCoord: textureCoordBuffer,
    normal: normalBuffer,
  };
}

function initPositionBuffer(gl, positions) {
  if (!positions) return null;
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
  return positionBuffer;
}

function initNormalBuffer(gl, normal) {
  if (!normal) return null;
  const normalBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normal), gl.STATIC_DRAW);
  return normalBuffer;
}

function initColorBuffer(gl, colors) {
  if (!colors) return null;
  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
  return colorBuffer;
}

function initIndexBuffer(gl, indices) {
  if (!indices) return null;
  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(indices),
    gl.STATIC_DRAW
  );
  return indexBuffer;
}

function initTextureBuffer(gl, textureCoordinates) {
  if (!textureCoordinates) return null;
  const textureCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(textureCoordinates),
    gl.STATIC_DRAW
  );
  return textureCoordBuffer;
}

function setPositionAttribute(gl, buffers, programInfo) {
  const numComponents = 3;
  const type = gl.FLOAT;
  const normalize = false;
  const stride = 0;
  const offset = 0;
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
  gl.vertexAttribPointer(
    programInfo.attribLocations.vertexPosition,
    numComponents,
    type,
    normalize,
    stride,
    offset
  );
  gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
}

function setNormalAttribute(gl, buffers, programInfo) {
  const numComponents = 3;
  const type = gl.FLOAT;
  const normalize = false;
  const stride = 0;
  const offset = 0;
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normal);
  gl.vertexAttribPointer(
    programInfo.attribLocations.normal,
    numComponents,
    type,
    normalize,
    stride,
    offset
  );
  gl.enableVertexAttribArray(programInfo.attribLocations.normal);
}

function setColorAttribute(gl, buffers, programInfo) {
  const numComponents = 4;
  const type = gl.FLOAT;
  const normalize = false;
  const stride = 0;
  const offset = 0;
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
  gl.vertexAttribPointer(
    programInfo.attribLocations.vertexColor,
    numComponents,
    type,
    normalize,
    stride,
    offset
  );
  gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor);
}

function setTextureAttribute(gl, buffers, programInfo) {
  const num = 3;
  const type = gl.FLOAT;
  const normalize = false;
  const stride = 0;
  const offset = 0;
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoord);
  gl.vertexAttribPointer(
    programInfo.attribLocations.textureCoord,
    num,
    type,
    normalize,
    stride,
    offset
  );
  gl.enableVertexAttribArray(programInfo.attribLocations.textureCoord);
}

function parseOBJ(text) {
  const objPositions = [[0, 0, 0]];
  const objTexcoords = [[0, 0]];
  const objNormals = [[0, 0, 0]];
  const objVertexData = [objPositions, objTexcoords, objNormals];
  let webglVertexData = [
    [], // positions
    [], // texcoords
    [], // normals
  ];

  function addVertex(vert) {
    const ptn = vert.split("/");
    ptn.forEach((objIndexStr, i) => {
      if (!objIndexStr) {
        return;
      }
      const objIndex = parseInt(objIndexStr);
      const index = objIndex + (objIndex >= 0 ? 0 : objVertexData[i].length);
      webglVertexData[i].push(...objVertexData[i][index]);
    });
  }

  const keywords = {
    v(parts) {
      objPositions.push(parts.map(parseFloat));
    },
    vn(parts) {
      objNormals.push(parts.map(parseFloat));
    },
    vt(parts) {
      if (parts.length === 2) {
        parts.push("0");
      }

      objTexcoords.push(parts.map(parseFloat));
    },
    f(parts) {
      const numTriangles = parts.length - 2;

      for (let tri = 0; tri < numTriangles; ++tri) {
        addVertex(parts[0]);
        addVertex(parts[tri + 1]);
        addVertex(parts[tri + 2]);
      }
    },
  };

  const keywordRE = /(\w*) *(.*)/;
  const lines = text.split("\n");

  for (let lineNo = 0; lineNo < lines.length; ++lineNo) {
    const line = lines[lineNo].trim();
    if (line === "" || line.startsWith("#")) {
      continue;
    }
    const m = keywordRE.exec(line);
    if (!m) {
      continue;
    }
    const [, keyword, unparsedArgs] = m;
    const parts = line.split(/\s+/).slice(1);
    const handler = keywords[keyword];
    if (!handler) {
      console.warn("unhandled keyword:", keyword);
      continue;
    }
    handler(parts, unparsedArgs);
  }
  return {
    positions: webglVertexData[0],
    textureCoords: webglVertexData[1],
    normals: webglVertexData[2],
  };
}

function loadTexture({ gl, url, render }) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  const level = 0;
  const internalFormat = gl.RGBA;
  const width = 1;
  const height = 1;
  const border = 0;
  const srcFormat = gl.RGBA;
  const srcType = gl.UNSIGNED_BYTE;
  const pixel = new Uint8Array([0, 0, 255, 255]);
  gl.texImage2D(
    gl.TEXTURE_2D,
    level,
    internalFormat,
    width,
    height,
    border,
    srcFormat,
    srcType,
    pixel
  );
  const image = new Image();
  image.onload = () => {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(
      gl.TEXTURE_2D,
      level,
      internalFormat,
      srcFormat,
      srcType,
      image
    );
    if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
      gl.generateMipmap(gl.TEXTURE_2D);
    } else {
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }
    requestAnimationFrame(render);
  };
  image.src = url;
  return texture;
}

function isPowerOf2(value) {
  return (value & (value - 1)) === 0;
}

function copy(obj) {
  return JSON.parse(JSON.stringify(obj));
}

const mat4 = window.mat4;

class Planet {
  transforms = {
    translate: [0, 0, 0],
    rotate: [0, 0, 0],
    scale: [1, 1, 1],
  };
  vertices = [];

  constructor({
    vertices,
    transforms = null,
    planet = null,
    speedRotation = 0.01,
    camera,
    radius,
    speed,
    angle,
  }) {
    this.speedRotation = speedRotation;
    this.camera = camera;
    this.radius = radius;
    this.speed = speed;
    this.angle = angle;
    if (planet) {
      this.camera = planet.camera;
      this.vertices = copy(planet.vertices);
      this.transforms = copy(planet.transforms);

      return;
    }
    this.vertices = copy(vertices);
    transforms && (this.transforms = copy(transforms));
  }

  translate(x, y, z) {
    this.transforms.translate[0] += x;
    this.transforms.translate[1] += y;
    this.transforms.translate[2] += z;
  }

  rotate(x, y, z) {
    this.transforms.rotate[0] += x;
    this.transforms.rotate[1] += y;
    this.transforms.rotate[2] += z;
  }

  scale(x, y, z) {
    this.transforms.scale[0] *= x;
    this.transforms.scale[1] *= y;
    this.transforms.scale[2] *= z;
  }

  getMatrix() {
    const matrix = mat4.clone(this.camera.getViewMatrix());
    const projectionMatrix = mat4.clone(this.camera.getProjectionMatrix());

    mat4.translate(matrix, matrix, this.transforms.translate);
    mat4.rotateX(matrix, matrix, this.transforms.rotate[0]);
    mat4.rotateY(matrix, matrix, this.transforms.rotate[1]);
    mat4.rotateZ(matrix, matrix, this.transforms.rotate[2]);
    mat4.scale(matrix, matrix, this.transforms.scale);
    mat4.multiply(matrix, projectionMatrix, matrix);

    return matrix;
  }
}

const draw = ({
  gl,
  ext,
  buffers,
  programInfo,
  matrixBuffer,
  matrixData,
  matrices,
  planets,
  countVertices,
  numInstances,
}) => {
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clearDepth(1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  setPositionAttribute(gl, buffers, programInfo);
  setTextureAttribute(gl, buffers, programInfo);
  gl.useProgram(programInfo.program);

  matrices.forEach((mat, index) => {
    mat4.copy(mat, planets[index].getMatrix());
  });

  gl.bindBuffer(gl.ARRAY_BUFFER, matrixBuffer);
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, matrixData);

  const bytesPerMatrix = 4 * 16;

  for (let i = 0; i < 4; ++i) {
    const loc = programInfo.attribLocations.instanceMatrix + i;
    gl.enableVertexAttribArray(loc);
    const offset = i * 16;
    gl.vertexAttribPointer(loc, 4, gl.FLOAT, false, bytesPerMatrix, offset);
    ext.vertexAttribDivisorANGLE(loc, 1);
  }
  ext.drawArraysInstancedANGLE(gl.TRIANGLES, 0, countVertices, numInstances);
};

function degToRadian(degrees) {
  return (degrees * Math.PI) / 180.0;
}

function isVectorEqual(v1, v2) {
  return v1[0] === v2[0] && v1[1] === v2[1] && v1[2] === v2[2];
}

class Camera {
  constructor() {
    this.left = vec3.fromValues(1.0, 0.0, 0.0);
    this.up = vec3.fromValues(0.0, 1.0, 0.0);
    this.pos = vec3.fromValues(0.0, 0.0, 0.0);
    this.projectionTransform = null;
    this.projMatrix;
    this.viewMatrix;
    this.fieldOfView = 55;
    this.nearClippingPlane = 0.1;
    this.farClippingPlane = 1000.0;
    this.dir = vec3.fromValues(0.0, 0.0, 1.0);
    this.linVel = vec3.fromValues(0.0, 0.0, 0.0);
    this.angVel = vec3.fromValues(0.0, 0.0, 0.0);
  }
  getLeft() {
    return vec3.clone(this.left);
  }
  getPosition() {
    return vec3.clone(this.pos);
  }
  getProjectionMatrix() {
    return mat4.clone(this.projMatrix);
  }
  getViewMatrix() {
    return mat4.clone(this.viewMatrix);
  }
  getUp() {
    return vec3.clone(this.up);
  }
  getNearClippingPlane() {
    return this.nearClippingPlane;
  }
  getFieldOfView() {
    return this.fieldOfView;
  }
  setFarClippingPlane(fcp) {
    if (fcp > 0) {
      this.farClippingPlane = fcp;
    }
  }
  setFieldOfView(fov) {
    if (fov > 0 && fov < 180) {
      this.fieldOfView = fov;
    }
  }
  setNearClippingPlane(ncp) {
    if (ncp > 0) {
      this.nearClippingPlane = ncp;
    }
  }
  setPosition(newVec) {
    this.pos = vec3.fromValues(newVec[0], newVec[1], newVec[2]);
  }
  apply(aspectRatio) {
    let matView = mat4.create();
    let lookAtPosition = vec3.create();
    vec3.add(lookAtPosition, this.pos, this.dir);
    mat4.lookAt(matView, this.pos, lookAtPosition, this.up);
    mat4.translate(
      matView,
      matView,
      vec3.fromValues(-this.pos[0], -this.pos[1], -this.pos[2])
    );
    this.viewMatrix = matView;
    this.projMatrix = mat4.create();
    mat4.perspective(
      this.projMatrix,
      degToRadian(this.fieldOfView),
      aspectRatio,
      this.nearClippingPlane,
      this.farClippingPlace
    );
  }
  setLookAtPoint(newVec) {
    if (isVectorEqual(this.pos, [0, 0, 0]) && isVectorEqual(newVec, [0, 0, 0]))
      return;
    vec3.subtract(this.dir, newVec, this.pos);
    vec3.normalize(this.dir, this.dir);
    vec3.cross(this.left, vec3.fromValues(0, 1, 0), this.dir);
    vec3.normalize(this.left, this.left);
    vec3.cross(this.up, this.dir, this.left);
    vec3.normalize(this.up, this.up);
  }
  rotateOnAxis(axisVec, angle) {
    let quate = quat.create();
    quat.setAxisAngle(quate, axisVec, angle);
    vec3.transformQuat(this.dir, this.dir, quate);
    vec3.transformQuat(this.left, this.left, quate);
    vec3.transformQuat(this.up, this.up, quate);
    vec3.normalize(this.up, this.up);
    vec3.normalize(this.left, this.left);
    vec3.normalize(this.dir, this.dir);
  }
  yaw(angle) {
    this.rotateOnAxis(this.up, angle);
  }
  pitch(angle) {
    this.rotateOnAxis(this.left, angle);
  }
  roll(angle) {
    this.rotateOnAxis(this.dir, angle);
  }
  moveForward = function (s) {
    let newPosition = [
      this.pos[0] - s * this.dir[0],
      this.pos[1] - s * this.dir[1],
      this.pos[2] - s * this.dir[2],
    ];
    this.setPosition(newPosition);
  };
  setAngularVel(newVec) {
    this.angVel[0] = newVec[0];
    this.angVel[1] = newVec[1];
    this.angVel[2] = newVec[2];
  }
  getAngularVel() {
    return vec3.clone(this.angVel);
  }
  getLinearVel() {
    return vec3.clone(this.linVel);
  }
  setLinearVel(newVec) {
    this.linVel[0] = newVec[0];
    this.linVel[1] = newVec[1];
    this.linVel[2] = newVec[2];
  }
  update(timeStep) {
    if (
      vec3.squaredLength(this.linVel) === 0 &&
      vec3.squaredLength(this.angularVel) === 0
    )
      return false;
    if (vec3.squaredLength(this.linVel) > 0.0) {
      vec3.scale(this.velVec, this.velVec, timeStep);
      vec3.add(this.pos, this.velVec, this.pos);
    }
    if (vec3.squaredLength(this.angVel) > 0.0) {
      this.pitch(this.angVel[0] * timeStep);
      this.yaw(this.angVel[1] * timeStep);
      this.roll(this.angVel[2] * timeStep);
    }
    return true;
  }
}

class CameraLookAt {
  constructor({ canvas }) {
    this.viewMatrix = mat4.create();
    this.projectionMatrix = mat4.create();
    this.cameraPosition = vec3.fromValues(0, 1, 0);
    this.cameraFront = vec3.fromValues(0, 0, -1);
    this.cameraUp = vec3.fromValues(0, 1, 0);
    this.cameraSpeed = 0.1;
    this.cameraRotationSpeed = 0.025;
    this.pitch = 0.0;
    this.yaw = 0.0;
    mat4.perspective(
      this.projectionMatrix,
      Math.PI / 4,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      100.0
    );
  }

  getProjectionMatrix() {
    return this.projectionMatrix;
  }

  getViewMatrix() {
    const rotationYMatrix = mat4.create();
    const rotationXMatrix = mat4.create();
    mat4.fromYRotation(rotationYMatrix, this.yaw);
    mat4.fromXRotation(rotationXMatrix, this.pitch);
    const rotationMatrix = mat4.create();
    mat4.multiply(rotationMatrix, rotationYMatrix, rotationXMatrix);
    vec3.transformMat4(
      this.cameraFront,
      vec3.fromValues(0, 0, -1),
      rotationMatrix
    );
    mat4.lookAt(
      this.viewMatrix,
      this.cameraPosition,
      vec3.add(vec3.create(), this.cameraPosition, this.cameraFront),
      this.cameraUp
    );
    return this.viewMatrix;
  }

  forward() {
    vec3.scaleAndAdd(
      this.cameraPosition,
      this.cameraPosition,
      this.cameraFront,
      this.cameraSpeed
    );
  }

  backward() {
    vec3.scaleAndAdd(
      this.cameraPosition,
      this.cameraPosition,
      this.cameraFront,
      -this.cameraSpeed
    );
  }

  left() {
    this.cameraRight = vec3.create();
    vec3.cross(this.cameraRight, this.cameraFront, this.cameraUp);
    vec3.scaleAndAdd(
      this.cameraPosition,
      this.cameraPosition,
      this.cameraRight,
      -this.cameraSpeed
    );
  }

  right() {
    this.cameraRight = vec3.create();
    vec3.cross(this.cameraRight, this.cameraFront, this.cameraUp);
    vec3.scaleAndAdd(
      this.cameraPosition,
      this.cameraPosition,
      this.cameraRight,
      this.cameraSpeed
    );
  }

  up() {
    vec3.scaleAndAdd(
      this.cameraPosition,
      this.cameraPosition,
      this.cameraUp,
      this.cameraSpeed
    );
  }

  down() {
    vec3.scaleAndAdd(
      this.cameraPosition,
      this.cameraPosition,
      this.cameraUp,
      -this.cameraSpeed
    );
  }

  rotateUp() {
    this.pitch += this.cameraRotationSpeed;
  }

  rotateDown(steps = 1) {
    while (steps > 0) {
      this.pitch -= this.cameraRotationSpeed;
      steps--;
    }
  }

  rotateLeft() {
    this.yaw += this.cameraRotationSpeed;
  }

  rotateRight() {
    this.yaw -= this.cameraRotationSpeed;
  }
}

async function main() {
  const canvas = document.querySelector("#c");
  const gl = canvas.getContext("webgl");
  const ext = gl.getExtension("ANGLE_instanced_arrays");
  if (!ext) {
    return alert("need ANGLE_instanced_arrays");
  }
  const program = initProgram({ gl });

  canvas.width = 1280;
  canvas.height = 650;
  resizeCanvasToDisplaySize(gl.canvas);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  const programInfo = {
    program,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(program, "a_position"),
      textureCoord: gl.getAttribLocation(program, "a_texture_coord"),
      instanceMatrix: gl.getAttribLocation(program, "a_instance_matrix"),
    },
    uniformLocations: {
      modelViewMatrix: gl.getUniformLocation(program, "u_model_view_matrix"),
      uSampler1: gl.getUniformLocation(program, "u_sampler1"),
    },
  };

  const response = await fetch("./textures/hawk.obj");
  const text = await response.text();
  const data = parseOBJ(text);
  const texture = loadTexture({ gl, url: "./textures/hawk.jpg", render });

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

  const buffers = initBuffers(gl, {
    positions: data.positions,
    textureCoords: data.textureCoords,
  });

  const camera = new CameraLookAt({ canvas: gl.canvas });

  const planet1 = new Planet({
    vertices: data.positions,
    camera,
  });

  planet1.translate(0, 0, -10);
  planet1.rotate(-Math.PI / 2, 0, 0);
  planet1.scale(0.1, 0.1, 0.1);

  const planets = [planet1];

  for (let i = 0; i < 8; i++) {
    const smallPlanet = new Planet({
      planet: planet1,
      camera,
      radius: (i + 2) * 1.5,
      angle: 0,
      speed: Math.random() / 30,
    });

    const scaleCoeff = (Math.random() + 0.5) / 2;
    const speedCoeff = Math.random() / 50 + 0.01;

    smallPlanet.scale(scaleCoeff, scaleCoeff, scaleCoeff);
    smallPlanet.speedRotation = speedCoeff;

    planets.push(smallPlanet);
  }

  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);

  const numInstances = planets.length;
  const matrixData = new Float32Array(numInstances * 16);
  const matrices = [];

  for (let i = 0; i < numInstances; ++i) {
    const byteOffsetToMatrix = i * 16 * 4;
    const numFloatsForView = 16;

    matrices.push(
      new Float32Array(matrixData.buffer, byteOffsetToMatrix, numFloatsForView)
    );
  }

  const matrixBuffer = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, matrixBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, matrixData.byteLength, gl.DYNAMIC_DRAW);

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.uniform1i(programInfo.uniformLocations.uSampler1, 0);

  function render() {
    for (let i = 0; i < planets.length; i++) {
      if (i > 0) {
        const radius = planets[i].radius;
        const angle = (i * Math.PI * 2) / (planets.length - 1);
        const x = Math.cos(angle + planets[i].angle) * radius;
        const y = Math.sin(angle + planets[i].angle) * radius;

        planets[i].translate(x, 0, y);
      }

      planets[i].rotate(0, 0, planets[i].speedRotation);
    }

    draw({
      gl,
      ext,
      buffers,
      programInfo,
      matrixBuffer,
      matrixData,
      matrices,
      planets,
      countVertices: planets[0].vertices.length / 3,
      numInstances: planets.length,
    });

    for (let i = 1; i < planets.length; i++) {
      const radius = planets[i].radius;
      const angle = (i * Math.PI * 2) / (planets.length - 1);
      const x = Math.cos(angle + planets[i].angle) * radius;
      const y = Math.sin(angle + planets[i].angle) * radius;

      planets[i].translate(-x, 0, -y);

      planets[i].angle += planets[i].speed;
    }
    handleCameraMovement();
  }

  setInterval(() => {
    requestAnimationFrame(render);
  }, 1000 / 60);

  const CAMERA_ACTIONS = {
    dolly: 0,
    pan: 0,
    elevate: 0,
    ["w"]() {
      camera.forward();
    },
    ["s"]() {
      camera.backward();
    },
    ["a"]() {
      camera.left();
    },
    ["d"]() {
      camera.right();
    },
    ["Shift"]() {
      camera.up();
    },
    ["Control"]() {
      camera.down();
    },
    ["ArrowUp"]() {
      camera.rotateUp();
    },
    ["ArrowDown"]() {
      camera.rotateDown();
    },
    ["ArrowLeft"]() {
      camera.rotateLeft();
    },
    ["ArrowRight"]() {
      camera.rotateRight();
    },
  };

  const keysPressed = {};

  window.addEventListener("keydown", (e) => {
    keysPressed[e.key] = true;
  });

  window.addEventListener("keyup", (e) => {
    keysPressed[e.key] = false;
  });

  function handleCameraMovement() {
    Object.keys(keysPressed).forEach((key) => {
      if (keysPressed[key] && CAMERA_ACTIONS[key]) {
        CAMERA_ACTIONS[key]();
      }
    });
  }
}

main();