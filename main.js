import {mat4} from 'gl-matrix'

const vertexShaderText = `
    attribute vec3 a_position;
  
    uniform mat4 u_model;
    uniform mat4 u_view;
    uniform mat4 u_proj;

    void main() {
        gl_Position = vec4(a_position, 1.0);
    }
`;

const fragmentShaderText = `
    precision mediump float;
  
    void main() {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
`;

const InitDemo = () =>{
    console.log("loading");

    const canvas = document.getElementById("game");
    const gl = canvas.getContext('webgl');

    if(!gl){
        gl = canvas.getContext('experimental-webgl');
    }

    if(!gl){
        console.log("browser not compatible");
    }

    gl.clearColor(0.2, 0.6, 0.2, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

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

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		console.error('ERROR linking program!', gl.getProgramInfoLog(shaderProgram));
		return;
	}

    gl.validateProgram(shaderProgram);
	if (!gl.getProgramParameter(shaderProgram, gl.VALIDATE_STATUS)) {
		console.error('ERROR validating program!', gl.getProgramInfoLog(shaderProgram));
		return;
	}

    gl.useProgram(shaderProgram);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    const vertices = [
       -1.0,  1.0, 0.0,
        1.0,  1.0, 0.0,
       -1.0, -1.0, 0.0,
        // 1.0, -1.0, 0.0,
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    const positionAttributeLocation = gl.getAttribLocation(shaderProgram, "a_position");
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);


    gl.useProgram(shaderProgram);

    const u_model_loc = gl.getUniformLocation(shaderProgram, "u_model");
    const u_view_loc = gl.getUniformLocation(shaderProgram, "u_view");
    const u_proj_loc = gl.getUniformLocation(shaderProgram, "u_proj");

    let modelMatrix = new Float32Array(16);
    let viewMatrix = new Float32Array(16);
    let projMatrix = new Float32Array(16);

    mat4.identity(modelMatrix);
    mat4.identity(viewMatrix);
    mat4.identity(projMatrix);

    gl.uniformMatrix4fv(u_model_loc, gl.FALSE, modelMatrix);
    gl.uniformMatrix4fv(u_view_loc,  gl.FALSE, viewMatrix);
    gl.uniformMatrix4fv(u_proj_loc,  gl.FALSE, projMatrix);

    gl.useProgram(shaderProgram);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertices.length/3);

}

document.getElementById("app").onload = InitDemo();