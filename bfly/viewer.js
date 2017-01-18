//-----------------------------------
//
// J.Viewer - test webGL overlay atop OpenSeaDragon
//
//-----------------------------------

Viewer = function(image_source) {
  this.img = new Image();
  this.viaGL = new ViaWebGL();
  this.img.onload = this.init.bind(this);
  this.viaGL.vShader = 'shaders/vertex/rect.glsl';
  this.viaGL.fShader = 'shaders/fragment/rect.glsl';
  this.viaGL.container = document.getElementById('view');
  this.img.height = this.viaGL.container.clientHeight;
  this.img.width = this.viaGL.container.clientWidth;
  this.img.crossOrigin = "anonymous";
  this.img.src = image_source;
  this.viaGL.bounds = {
    width: 1.0,
    height: 1.0,
    x: 0.0,
    y: 0.0
  }
}

Viewer.prototype = {
  init: function() {

    // Load for glsl
    this.viaGL['gl-loaded'] = function(program) {
      this.flip_y = 1 - (this.bounds.y + this.bounds.height); 
      this.wherer = this.gl.getUniformLocation(program, 'u_tile_where');
      this.shaper = this.gl.getUniformLocation(program, 'u_tile_shape');
    }

    // Draw for glsl
    this.viaGL['gl-drawing'] = function() {
      this.gl.uniform2f(this.wherer, this.bounds.x, this.bounds.y);
      this.gl.uniform2f(this.shaper, this.bounds.width, this.bounds.height);
    }

    this.viaGL.onclick = 'toggle';
    this.viaGL.init(this.img);
  }
}
