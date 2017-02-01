function main_init(){
  var source_terms = {
    depth: 1774,
    width: 2000,
    height: 2000,
    experiment: "root",
    sample: "root",
    dataset: "iarpa2016_12",
    base_channel: "images_2kx2k.h5",
    over_channel: "8x_downsampled_segmentation.h5",
    server: 'http://viper.krash.net:2016'
  };
  load = new Loader(source_terms);

  function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
  }

  async function loadall(level){
    base = load.getTile('base',level);
    view = new Viewer(base);
    await sleep(500);
    if (level+1 < load.rlen){
      loadall(level+1);
    }
  }
  load.r = 0;
  loadall(0)
}
