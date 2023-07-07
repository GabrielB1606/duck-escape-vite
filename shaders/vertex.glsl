attribute vec3 a_position;
attribute vec2 a_texCoord;

uniform mat4 u_model;
uniform mat4 u_view;
uniform mat4 u_proj;

varying vec2 v_texCoord;

void main() {
    v_texCoord = a_texCoord;
    gl_Position = u_proj * u_view * u_model * vec4(a_position, 1.0);
}