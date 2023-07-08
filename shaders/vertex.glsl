attribute vec3 a_position;
attribute vec2 a_texCoord;

uniform mat4 u_model;
uniform mat4 u_view;
uniform mat4 u_proj;

uniform vec2 u_texOffset;
uniform vec2 u_texSize;

uniform float u_xflip;

varying vec2 v_texCoord;

void main() {
    // v_texCoord = vec2((a_texCoord.x/375.0)*39.0, (112.0/267.0)+(a_texCoord.y/267.0)*40.0);
    if(u_xflip > 0.0){
        v_texCoord = vec2(
            u_texOffset.x + a_texCoord.x*u_texSize.x,
            u_texOffset.y+a_texCoord.y*u_texSize.y
        );
    }else{
        v_texCoord = vec2(
            u_texOffset.x + (u_texSize.x - a_texCoord.x*u_texSize.x),
            u_texOffset.y + a_texCoord.y*u_texSize.y
        );
    }
    gl_Position = u_proj * u_view * u_model * vec4(a_position, 1.0);
}