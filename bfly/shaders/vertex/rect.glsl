uniform vec2 u_tile_basis;
uniform vec2 u_tile_shape;
attribute vec2 a_tile_pos;
varying vec2 v_tile_pos;
attribute vec4 a_pos;

// Tile to Image
vec2 tile2image(vec2 tiled) {
    return u_tile_basis + u_tile_shape*tiled;
}

// Image to Tile
vec2 image2tile(vec2 imaged) {
    return (imaged - u_tile_basis)/u_tile_shape;
}


void main() {
  // Pass the overlay tiles
  v_tile_pos = image2tile(a_tile_pos);
  gl_Position = a_pos;
}
