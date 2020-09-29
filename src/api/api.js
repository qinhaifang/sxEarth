import fetch from "./../utils/fetch";
const baseUrl = window.UrlSetting.baseUrl;

export function loginIn(params) {
  return fetch.post(`${baseUrl}/system/login3`, params);
}
export function getTreeByParent(id) {
  console.log('tree',id)
  const fid = id === 0 ? -1 : id;
  const userId = sessionStorage.getItem("userId");
  const username = sessionStorage.getItem("username");
  const token = sessionStorage.getItem("token");
  return fetch.get(`${baseUrl}/dispatcher/trans/folder/${userId}/1/${id}`, {
    headers: {
      Authorization: token,
      username: username,
      transAdress: `/manager/rest/filecatalog/getByParentId?id=${fid}`,
      serviceType: "DMS"
    }
  });
}
export function searchPoint(title) {
  const userId = sessionStorage.getItem("userId");
  const username = sessionStorage.getItem("username");
  const token = sessionStorage.getItem("token");
  return fetch.get(
    `${baseUrl}/dispatcher/trans/fileSearch/${userId}/1/${title}`,
    {
      headers: {
        Authorization: token,
        username: username,
        transAdress: `/manager/rest/filecatalog/searchByFileName?fileName=${title}`,
        serviceType: "DMS"
      }
    }
  );
}
export function searchData(param) {
  const username = sessionStorage.getItem("username");
  const token = sessionStorage.getItem("token");
  return fetch.post(`${baseUrl}/system/json/find`, param, {
    headers: {
      Authorization: token,
      username: username
    }
  });
}
export function searchResettlement(param) {
  const username = sessionStorage.getItem("username");
  const token = sessionStorage.getItem("token");
  return fetch.post(`${baseUrl}/system/json/resettlement`, param, {
    headers: {
      Authorization: token,
      username: username
    }
  });
}
export function searcVillage(param) {
  const username = sessionStorage.getItem("username");
  const token = sessionStorage.getItem("token");
  return fetch.post(`${baseUrl}/system/json/village`, param, {
    headers: {
      Authorization: token,
      username: username
    }
  });
}
export function upDateMessage(param) {
  const username = sessionStorage.getItem("username");
  const token = sessionStorage.getItem("token");
  return fetch.post(`${baseUrl}/system/json/update`, param, {
    headers: {
      Authorization: token,
      username: username
    }
  });
}
export function getfileMeta(id) {
  return fetch.get(`${baseUrl}/manager/rest/file/fileMeta?fileId=${id}`);
}
export function getlayermeta(id) {
  return fetch.get(
    `${baseUrl}/gisserver/rest/imageservice/meta?id=${id}&access`
  );
}
export function getJsonById(id) {
  return fetch.get(`${baseUrl}/manager/rest/json/getJsonById?id=${id}`);
}
export function getStatisticData() {
  return fetch.get("static/data/statistics.json");
}
export function getStatisticData2() {
  return fetch.get("static/data/statistics2.json");
}
export function getLayerMessage() {
  return fetch.get("static/data/layer.json");
}
export function getRegionBoundary() {
  return fetch.get("static/data/regionBoundary.json");
}
export function getFootPrint() {
  return fetch.get("static/data/footPrint.json");
}
export function getChaYuanMessage() {
  return fetch.get("static/data/yhg.json");
}
