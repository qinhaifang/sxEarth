import axios from 'axios';

const baseUrl = window.UrlSetting.SERVER_URL;

/**
 * 点点通视
 * @param param
 * @return {[Promise]}
 * @author yangs
 * @date 2019-04-24
 */
export function pointToPointView(params) {
  return axios.get(`${baseUrl}/spatialanalysis/ppv.json`,{
    params
  });
}
/**
 * 遮蔽分析
 * @param param
 * @return {[Promise]}
 * @author yangs
 * @date 2019-05-10
 */
export function hideVeilService(params) {
  return axios.get(`${baseUrl}/spatialanalysis/hideVeilService.json`,{
    params
  });
}
/**
 * 路径分析
 * @param param
 * @return {[Promise]}
 * @author yangs
 * @date 2019-04-25
 */
export function ShortestPathService(params) {
  return axios.get(`${baseUrl}/spatialanalysis/ShortestPathService.json`,{
    params
  });
}
/**
 * 点面通视
 * @param param
 * @return {[Promise]}
 * @author yangs
 * @date 2019-04-25
 */
export function visibility2(params) {
  return axios.get(`${baseUrl}/spatialanalysis/visibility2.json`,{
    params
  });
}
/**
 * 剖面分析
 * @param param
 * @return {[Promise]}
 * @author yangs
 * @date 2019-04-25
 */
export function section(params) {
  return axios.get(`${baseUrl}/spatialanalysis/section.json`,{
    params
  });
}
/**
 * 缓冲区
 * @param param
 * @return {[Promise]}
 * @author yangs
 * @date 2019-04-25
 */
export function buffer(params) {
  return axios.get(`${baseUrl}/spatialanalysis/buffer.json`,{
    params
  });
}
/**
 * 挖填方
 * @param param
 * @return {[Promise]}
 * @author yangs
 * @date 2019-04-25
 */
export function wafang(params) {
  return axios.get(`${baseUrl}/spatialanalysis/wafang.json`,{
    params
  });
}
/**
 * 高程统计
 * @param param
 * @return {[Promise]}
 * @author yangs
 * @date 2019-04-25
 */
export function heightAreaService(params) {
  return axios.get(`${baseUrl}/spatialanalysis/heightAreaService.json`,{
    params
  });
}
/**
 * 坡度坡向
 * @param param
 * @return {[Promise]}
 * @author yangs
 * @date 2019-04-25
 */
export function slope(params) {
  return axios.get(`${baseUrl}/spatialanalysis/slope.json`,{
    params
  });
}
/**
 * 单点高程分析
 * @param param
 * @return {[Promise]}
 * @author yangs
 * @date 2019-05-13
 */
export function singlept(params) {
  return axios.get(`${baseUrl}/spatialanalysis/singlept.json`,{
    params
  });
}
/**
 * 点高程坡度坡向
 * @param param
 * @return {[Promise]}
 * @author yangs
 * @date 2019-05-13
 */
export function singleSlopeAspect(params) {
  return axios.get(`${baseUrl}/spatialanalysis/singleSlopeAspect.json`,{
    params
  });
}
/**
 * 空间距离/沿线距离
 * @param param
 * @return {[Promise]}
 * @author yangs
 * @date 2019-05-08
 */
export function distance(params) {
  return axios.get(`${baseUrl}/spatialanalysis/distance.json`,{
    params
  });
}
/**
 * 球面距离
 * @param param
 * @return {[Promise]}
 * @author yangs
 * @date 2019-05-08
 */
export function grounddistance(params) {
  return axios.get(`${baseUrl}/spatialanalysis/grounddistance.json`,{
    params
  });
}
/**
 * 贴地距离
 * @param param
 * @return {[Promise]}
 * @author yangs
 * @date 2019-05-08
 */
export function neargrounddistance(params) {
  return axios.get(`${baseUrl}/spatialanalysis/neargrounddistance.json`,{
    params
  });
}
/**
 * 投影距离
 * @param param
 * @return {[Promise]}
 * @author yangs
 * @date 2019-05-08
 */
export function projectDisdistance(params) {
  return axios.get(`${baseUrl}/spatialanalysis/projectDisdistance.json`,{
    params
  });
}
/**
 * 空间面积
 * @param param
 * @return {[Promise]}
 * @author yangs
 * @date 2019-05-08
 */
export function spaArea(params) {
  return axios.get(`${baseUrl}/spatialanalysis/spaArea.json`,{
    params
  });
}
/**
 * 球面面积
 * @param param
 * @return {[Promise]}
 * @author yangs
 * @date 2019-05-08
 */
export function area(params) {
  return axios.get(`${baseUrl}/spatialanalysis/area.json`,{
    params
  });
}
/**
 * 贴地面积
 * @param param
 * @return {[Promise]}
 * @author yangs
 * @date 2019-05-08
 */
export function groundArea(params) {
  return axios.get(`${baseUrl}/spatialanalysis/groundArea.json`,{
    params
  });
}
/**
 * 投影面积
 * @param param
 * @return {[Promise]}
 * @author yangs
 * @date 2019-05-08
 */
export function projArea(params) {
  return axios.get(`${baseUrl}/spatialanalysis/projArea.json`,{
    params
  });
}
/**
 * 道路机动
 * @param param
 * @return {[Promise]}
 * @author yangs
 * @date 2019-05-08
 */
export function RouterService(params) {
  return axios.post(`${baseUrl}/spatialanalysis/RouterService.json`,params);
}
/**
 * 淹没
 * @param param
 * @return {[Promise]}
 * @author yangs
 * @date 2019-05-13
 */
export function headFlood(params) {
  return axios.get(`${baseUrl}/spatialanalysis/headFlood.json`,{
    params
  });
}
/**
 * 两点方位角
 * @param param
 * @return {[Promise]}
 * @author yangs
 * @date 2019-05-13
 */
export function azimuthService(params) {
  return axios.get(`${baseUrl}/spatialanalysis/azimuthService.json`,{
    params
  });
}
/**
 * 点预测
 * @param param
 * @return {[Promise]}
 * @author yangs
 * @date 2019-05-13
 */
export function azimuthDistanceService(params) {
  return axios.get(`${baseUrl}/spatialanalysis/azimuthDistanceService.json`,{
    params
  });
}
/**
 * 等高线提取
 * @param param
 * @return {[Promise]}
 * @author yangs
 * @date 2019-05-13
 */
export function contour(params) {
  return axios.get(`${baseUrl}/spatialanalysis/contour.json`,{
    params
  });
}
/**
 * 阴影分析
 * @param param
 * @return {[Promise]}
 * @author yangs
 * @date 2019-05-13
 */
export function shadowService(params) {
  return axios.get(`${baseUrl}/spatialanalysis/shadowService.json`,{
    params
  });
}
/**
 * 观察所分析
 * @param param
 * @return {[Promise]}
 * @author yangs
 * @date 2019-05-13
 */
export function watchHouse(params) {
  return axios.get(`${baseUrl}/spatialanalysis/watchHouse.json`,{
    params
  });
}
/**
 * 观察所通视
 * @param param
 * @return {[Promise]}
 * @author yangs
 * @date 2019-05-13
 */
export function gcsVisiblity(params) {
  return axios.get(`${baseUrl}/spatialanalysis/gcsVisiblity.json`,{
    params
  });
}
/**
 * 直瞄分析
 * @param param
 * @return {[Promise]}
 * @author yangs
 * @date 2019-05-14
 */
export function directAim(params) {
  return axios.get(`${baseUrl}/spatialanalysis/directAim.json`,{
    params
  });
}
/**
 * 间瞄分析
 * @param param
 * @return {[Promise]}
 * @author yangs
 * @date 2019-05-14
 */
export function indirectAim(params) {
  return axios.get(`${baseUrl}/spatialanalysis/indirectAim.json`,{
    params
  });
}
/**
 * 空降场选址分析
 * @param param
 * @return {[Promise]}
 * @author yangs
 * @date 2019-05-14
 */
export function kjcxz(params) {
  return axios.get(`${baseUrl}/spatialanalysis/kjcxz.json`,{
    params
  });
}
/**
 * 核防护分析
 * @param param
 * @return {[Promise]}
 * @author yangs
 * @date 2019-05-14
 */
export function nuclearProtection(params) {
  return axios.get(`${baseUrl}/spatialanalysis/nuclearProtection.json`,{
    params
  });
}
/**
 * 叠置分析
 * @param param
 * @return {[Promise]}
 * @author yangs
 * @date 2019-05-14
 */
export function overlay(params) {
  return axios.get(`${baseUrl}/spatialanalysis/overlay.json`,{
    params
  });
}
/**
 * 叠置分析图层
 * @param param
 * @return {[Promise]}
 * @author yangs
 * @date 2019-05-14
 */
export function getvectornames() {
  return axios.get(`${baseUrl}/spatialanalysis/getvectornames.json`);
}
/**
 * 地貌分析-取山顶点
 * @param param
 * @return {[Promise]}
 * @author niul
 * @date 2019-08-19
 */
export function getmountainTop(params) {
  return axios.get(`${baseUrl}/spatialanalysis/mountaintop.json`,{params});
}
/**
 * 地貌分析-取鞍部点
 * @param param
 * @return {[Promise]}
 * @author niul
 * @date 2019-08-19
 */
export function getsaddlepoint(params) {
  return axios.get(`${baseUrl}/spatialanalysis/saddle.json`,{params});
}
/**
 * 地貌分析-取山脚线
 * @param param
 * @return {[Promise]}
 * @author niul
 * @date 2019-08-19
 */
export function getbottomline(params) {
  return axios.get(`${baseUrl}/spatialanalysis/hillfoot.json`,{params});
}
/**
 * 地貌分析-取山谷线
 * @param param
 * @return {[Promise]}
 * @author niul
 * @date 2019-08-19
 */
export function getvalleyline(params) {
  return axios.get(`${baseUrl}/spatialanalysis/valley.json`,{params});
}
/**
 * 地貌分析-取山脊线
 * @param param
 * @return {[Promise]}
 * @author niul
 * @date 2019-08-19
 */
export function getridgeline(params) {
  return axios.get(`${baseUrl}/spatialanalysis/ridge.json`,{params});
}
/**
 * 地貌分析-取地貌类型
 * @param param
 * @return {[Promise]}
 * @author niul
 * @date 2019-08-19
 */
export function getterrainType(params) {
  return axios.get(`${baseUrl}/spatialanalysis/terrainType.json`,{params});
}
