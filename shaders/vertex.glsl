attribute vec3 a_position;
attribute vec2 a_texCoord;

uniform mat4 u_model;
uniform mat4 u_view;
uniform mat4 u_proj;

varying vec2 v_texCoord;

void main() {
    v_texCoord = vec2((a_texCoord.x/375.0)*39.0, (112.0/267.0)+(a_texCoord.y/267.0)*40.0);
    gl_Position = u_proj * u_view * u_model * vec4(a_position, 1.0);
}