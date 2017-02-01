/*
 * Make a loader to interact with Butterfly
 */
Loader = function(terms){
  // Write all layers to path formats
  this._path_forms = this._getPathForms(terms);
  // Store all resolution tile offsets
  this._tile_lists = this._makeTileLists(terms);
  // Save resolution and depth constraints
  this._res = this._tile_lists.length-1;
  this._max_zed = terms.depth;
  this._max_res = this._res; 
}

Loader.prototype = {
  /*
   * Private Properties
   */
  _api: '/api/data?experiment=<e>&sample=<s>&dataset=<d>&channel=<c>',
  _tile: '&width=<hw>&height=<hw>&x=<x>&y=<y>&z=<z>&resolution=<r>',
  _tileSize: 512,
  _max_res: -1,
  _max_zed: -1,
  _res: 0,
  _zed: 0,
  /*
   * Private Methods
   */
  // Write path formats for two layers
  _getPathForms: function(a){
    var path = this._api.replace('<e>', a.experiment);
    var tile = this._tile.replace(/<hw>/g, this._tileSize);
    path = path.replace('<s>', a.sample);
    path = path.replace('<d>', a.dataset);
    path = a.server+path+tile;
    return {
      base: path.replace('<c>', a.base_channel),
      over: path.replace('<c>', a.over_channel)
    };
  },
  // Compute XY offsets for all resolutions
  _makeTileLists: function(a){
    var minside = Math.min(a.width,a.height);
    var ratio = Math.max(minside/this._tileSize,0);
    var levels = Math.ceil(Math.log2(ratio + 1));
    var levelList = Array.apply(0, Array(levels));
    return levelList.map(this._makeTileList).reverse();
  },
  _makeTileList: function(x0,order){
    var n = 2**order;
    var tileList = Array.apply(0, Array(n**2));
    return tileList.map(function(x1,c){
      return [Math.floor(c/n), c%n]; 
    });
  },
  // Build path from position information
  _getTilePath: function(path, tile){
    var r_list = this._tile_lists[this._res];
    var side = Math.sqrt(r_list.length);
    var tile_path = path.replace('<z>', this._zed);
    tile_path = tile_path.replace('<r>', this._res);    
    tile_path = tile_path.replace('<x>', tile.x*side*this._tileSize);    
    tile_path = tile_path.replace('<y>', tile.y*side*this._tileSize);    
    return tile_path;
  },
  // Return tile object from size and position
  _formatTile: function(size,xy){
    return {
      height: 1/size,
      width: 1/size,
      x: xy[0]/size,
      y: xy[1]/size
    };
  },
  /*
   * Public Safeguard Methods
   */
  // return path if path name exists
  checkPath: function(path_name){
    var paths = this._path_forms;
    if (path_name in paths) {
      return paths[path_name];
    }
    var path_keys = Object.keys(paths);
    var warn = '\'%s\' not in channels \'%s\'';
    console.log(warn, path_name, path_keys.join('\', \''));
    return paths[path_keys[0]].split('&channel')[0];
  },
  // return tile facts if tile exists
  checkTile: function(tile_i){
    var r_list = this._tile_lists[this._res];
    var side = Math.sqrt(r_list.length);
    if (tile_i in r_list){
      return this._formatTile(side, r_list[tile_i]);
    }
    var warn = 'No tile #%i for resolution %i of %ix%i!';
    console.log(warn, tile_i, this._res, side, side);
    return this._formatTile(side, r_list[0]);
  },
  /*
   * Public Methods
   */
  // Get all tile info from name and number
  getTile: function(path_name, tile_i){
    var pathForm = this.checkPath(path_name);
    var tileForm = this.checkTile(tile_i);
    tileForm.src = this._getTilePath(pathForm, tileForm);
    return tileForm;
  },
  /*
   * Public Properties
   */
  set z(z){
    if (0 <= z && z <= this._max_zed){
      this._zed = z;
    }
  },
  set r(r){
    if (0 <= r && r <= this._max_res){
      this._res = r;
    }
  },
  get rlen(){
    return this._tile_lists[this._res].length;
  },
  get z(){
    return this._zed;
  }, 
  get r(){
    return this._res;
  }
}
