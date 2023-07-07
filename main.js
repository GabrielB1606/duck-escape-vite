import { glMatrix, mat4 } from 'gl-matrix'

import vertexShaderText from './shaders/vertex.glsl'
import fragmentShaderText from './shaders/fragment.glsl'

const DELTA_TIME = 1000 / 24;
const canvas = document.getElementById("game");

const PX_WIDTH = 1 / 640;
const PX_HEIGHT = 1 / 480;

const vertices = [
  -1.0, 1.0, -1.0,
  1.0, 1.0, -1.0,
  -1.0, -1.0, -1.0,
  1.0, -1.0, -1.0,
];

const InitDemo = () => {

  // get openGL context
  var gl = canvas.getContext('webgl');

  if (!gl) {
    gl = canvas.getContext('experimental-webgl');
  }

  if (!gl) {
    console.log("browser not compatible");
  }

  // initialize shaders
  const vertexShader = gl.createShader(gl.VERTEX_SHADER);
  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

  // get shader source
  gl.shaderSource(vertexShader, vertexShaderText);
  gl.shaderSource(fragmentShader, fragmentShaderText);

  // compile shaders
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

  // create shader program
  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  // validate shader program
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    console.error('ERROR linking program!', gl.getProgramInfoLog(shaderProgram));
    return;
  }

  gl.validateProgram(shaderProgram);
  if (!gl.getProgramParameter(shaderProgram, gl.VALIDATE_STATUS)) {
    console.error('ERROR validating program!', gl.getProgramInfoLog(shaderProgram));
    return;
  }

  // initialize attributes
  gl.useProgram(shaderProgram);

  // position buffer
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  const positionAttributeLocation = gl.getAttribLocation(shaderProgram, "a_position");
  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

  // initialize uniforms
  const u_model_loc = gl.getUniformLocation(shaderProgram, "u_model");
  const u_view_loc = gl.getUniformLocation(shaderProgram, "u_view");
  const u_proj_loc = gl.getUniformLocation(shaderProgram, "u_proj");

  // matrices
  let modelMatrix = new Float32Array(16);
  let viewMatrix = new Float32Array(16);
  let projMatrix = new Float32Array(16);

  mat4.identity(modelMatrix);
  mat4.scale(modelMatrix, modelMatrix, [0.2, 0.2, 1.0]);
  mat4.identity(viewMatrix);
  mat4.identity(projMatrix);
  mat4.perspective(projMatrix, glMatrix.toRadian(45), 4 / 3, 0.1, 100.0);

  // send uniforms
  gl.uniformMatrix4fv(u_model_loc, gl.FALSE, modelMatrix);
  gl.uniformMatrix4fv(u_view_loc, gl.FALSE, viewMatrix);
  gl.uniformMatrix4fv(u_proj_loc, gl.FALSE, projMatrix);

  const gameLoop = () => {

    gl.useProgram(shaderProgram);

    // mat4.translate(modelMatrix, modelMatrix, [ 0.001* performance.now()/1000, 0.0, 0.0]);
    // gl.uniformMatrix4fv(u_model_loc, gl.FALSE, modelMatrix);

    gl.clearColor(0.2, 0.6, 0.2, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertices.length / 3);

  }

  setInterval(gameLoop, DELTA_TIME);

}

document.getElementById("app").onload = InitDemo();