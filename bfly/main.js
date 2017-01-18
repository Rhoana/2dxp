function main_init(){
  var source_terms = {
    depth: 1774,
    width: 2000,
    height: 2000,
    experiment: "root",
    sample: "root",
    dataset: "jan_push",
    base_channel: "images_2kx2k.h5",
    over_channel: "8x_downsampled_segmentation.h5",
    server: 'viper.krash.net:2016'
  };
  load = new Loader(source_terms);
  view = new Viewer();
}
