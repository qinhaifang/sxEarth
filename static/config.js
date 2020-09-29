// const BaseIp = "220.181.130.171:19090";
// const serviceIp = "220.181.130.171:19090";
// const geoserviceIp = "220.181.130.171:19090";
// const layersIp = "220.181.130.171:9090";
// const tilesIp = "220.181.130.171:19090";

const BaseIp = "10.10.20.43:32771";
const serviceIp = "10.10.20.43:32771";
const geoserviceIp = "10.10.20.43:32771";
const layersIp = "10.10.20.43:32771";
const tilesIp = "10.10.20.43:32771";

window.UrlSetting = {
  baseUrl: `http://${BaseIp}`,
  SERVER_URL: `http://${serviceIp}`, //空间查询url
  GEOSERVER_URL: `http://${geoserviceIp}/geoserver/image/wms`, //geoserver图层url
  TILES_URL: `http://${layersIp}/manager/rest/tilesetmeta/tileset/11/tileset.json`, //倾斜摄影url
  DEM_URL: `http://${layersIp}/gisserver/tiles/mbtiles/DEM_Global_90M_MeshC/`, //地形url
  LAYERS_URL: `http://${layersIp}/gisserver/tiles/mbtiles/Global_Image/{z}/{x}/{y}.jpg` //底图url
};
