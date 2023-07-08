import { glMatrix, mat4 } from 'gl-matrix'

import { initBuffers } from './src/InitBuffers.js';

import vertexShaderText from './shaders/vertex.glsl'
import fragmentShaderText from './shaders/fragment.glsl'

const DELTA_TIME = 1000 / 24;
const canvas = document.getElementById("game");

const PX_WIDTH = 1 / 640;
const PX_HEIGHT = 1 / 480;

const InitDemo = () => {

  // get openGL context
  var gl = canvas.getContext('webgl');

  if (!gl) {
    gl = canvas.getContext('experimental-webgl');
  }

  if (!gl) {
    console.log("browser not compatible");
  }

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);


  // shader program
  const shaderProgram = initShaderProgram(gl, vertexShaderText, fragmentShaderText);

  // initialize attributes
  gl.useProgram(shaderProgram);

  // collect all the info needed to use the shader program.
  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, "a_position"),
      textureCoord: gl.getAttribLocation(shaderProgram, "a_texCoord"),
    },
    uniformLocations: {
      modelMatrix: gl.getUniformLocation(shaderProgram, "u_model"),
      viewMatrix: gl.getUniformLocation(shaderProgram, "u_view"),
      projectionMatrix: gl.getUniformLocation(shaderProgram, "u_proj"),
      texSampler: gl.getUniformLocation(shaderProgram, "u_texture"),
    },
  };

  // initialize all the buffers
  const buffers = initBuffers(gl);

  // enable all the buffers
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
  gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
  gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, 3, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoord);
  gl.enableVertexAttribArray(programInfo.attribLocations.textureCoord);
  gl.vertexAttribPointer(programInfo.attribLocations.textureCoord, 2, gl.FLOAT, false, 0, 0);

  // matrices
  let modelMatrix = new Float32Array(16);
  let viewMatrix = new Float32Array(16);
  let projMatrix = new Float32Array(16);

  mat4.identity(modelMatrix);
  mat4.scale(modelMatrix, modelMatrix, [1, 1, 1.0]);
  mat4.identity(viewMatrix);
  mat4.identity(projMatrix);
  mat4.ortho(projMatrix, -1.0, 1.0, -0.75, 0.75, 0.1, 100.0);
  // mat4.perspective(projMatrix, glMatrix.toRadian(45), 4 / 3, 0.1, 100.0);

  // send uniforms
  gl.uniformMatrix4fv(programInfo.uniformLocations.modelMatrix, gl.FALSE, modelMatrix);
  gl.uniformMatrix4fv(programInfo.uniformLocations.viewMatrix, gl.FALSE, viewMatrix);
  gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix, gl.FALSE, projMatrix);
  gl.uniform1i(programInfo.uniformLocations.texSampler, 0);

  // textures
  const texture = loadTexture(gl, './img/characters.png');


  // Bind and activate the texture before rendering
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.activeTexture(gl.TEXTURE0);

  const gameLoop = () => {

    gl.useProgram(shaderProgram);

    // mat4.translate(modelMatrix, modelMatrix, [ 0.001* performance.now()/1000, 0.0, 0.0]);
    // gl.uniformMatrix4fv(u_model_loc, gl.FALSE, modelMatrix);

    gl.clearColor(0.22, 0.74, 1, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

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

//
// creates a shader of the given type, uploads the source and
// compiles it.
//
function loadShader(gl, type, source) {
  const shader = gl.createShader(type);

  // Send the source to the shader object
  gl.shaderSource(shader, source);

  // Compile the shader program
  gl.compileShader(shader);

  // See if it compiled successfully
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(
      `An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`
    );
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

//
// Initialize a texture and load an image.
// When the image finished loading copy it into the texture.
//
function loadTexture(gl, url) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  const level = 0;
  const internalFormat = gl.RGBA;
  const width = 1;
  const height = 1;
  const border = 0;
  const srcFormat = gl.RGBA;
  const srcType = gl.UNSIGNED_BYTE;
  const pixel = new Uint8Array([0, 0, 255, 255]); // opaque blue
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

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    
  };
  image.src = url;

  return texture;
}

document.getElementById("app").onload = InitDemo();