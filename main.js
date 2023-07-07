import { glMatrix, mat4 } from 'gl-matrix'

import { initBuffers } from './src/InitBuffers.js';

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

const texCoords = [
  0.0, 0.0,
  1.0, 0.0,
  0.0, 1.0,
  1.0, 1.0,
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

  // texcoords
  const texCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);

  const texCoordAttributeLocation = gl.getAttribLocation(shaderProgram, 'a_texCoord');
  gl.enableVertexAttribArray(texCoordAttributeLocation);
  gl.vertexAttribPointer(texCoordAttributeLocation, 2, gl.FLOAT, false, 0, 0);

  // initialize uniforms
  const u_model_loc = gl.getUniformLocation(shaderProgram, "u_model");
  const u_view_loc = gl.getUniformLocation(shaderProgram, "u_view");
  const u_proj_loc = gl.getUniformLocation(shaderProgram, "u_proj");
  const u_texture_loc = gl.getUniformLocation(shaderProgram, 'u_texture');

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

  // textures
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    1,
    1,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    new Uint8Array([0, 0, 255, 255])
  );

  const image = new Image();
  image.onload = function() {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      image
    );

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  
  };
  
  image.src = './img/characters.png';
  // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

  gl.uniform1i(u_texture_loc, 0);

  // Bind and activate the texture before rendering
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.activeTexture(gl.TEXTURE0);

  const gameLoop = () => {

    gl.useProgram(shaderProgram);

    // mat4.translate(modelMatrix, modelMatrix, [ 0.001* performance.now()/1000, 0.0, 0.0]);
    // gl.uniformMatrix4fv(u_model_loc, gl.FALSE, modelMatrix);

    gl.clearColor(0.22, 0.74, 1, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertices.length / 3);

  }

  setInterval(gameLoop, DELTA_TIME);

}

//
// Initialize a shader program
//
function initShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  // Create the shader program

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  // If creating the shader program failed, alert

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert(
      `Unable to initialize the shader program: ${gl.getProgramInfoLog(
        shaderProgram
      )}`
    );
    return null;
  }

  return shaderProgram;
}

document.getElementById("app").onload = InitDemo();