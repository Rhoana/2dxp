precision mediump float;
uniform sampler2D u_tile;
uniform vec2 u_tile_size;
varying vec2 v_tile_pos;

//
// Sample the color at offset
//
vec4 rgba(vec2 find_here) {
    // calculate the color of sampler at an offset from position
    return texture2D(u_tile, find_here);
}


void main() {
    gl_FragColor = rgba(v_tile_pos);
}
