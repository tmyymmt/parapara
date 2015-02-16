var directionsService = new google.maps.DirectionsService();
//var directionsDisplay;
//var map;
var R_EARTH = 6378137; // 地球の赤道半径
var RAD = Math.PI / 180; // 1°あたりのラジアン
var D = 10; // unit is meter

function initialize() {
/*
  directionsDisplay = new google.maps.DirectionsRenderer();
  var latlon = new google.maps.LatLng(35.673343,139.710388,11);
  var mapOptions = {
    zoom:7,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    center: latlon
  }
  map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
  directionsDisplay.setMap(map);
*/
}

function calcRoute() {
  var start = document.getElementById("start").value;
  var end = document.getElementById("end").value;
  var request = {
    origin:start,
    destination:end,
    travelMode: google.maps.TravelMode.DRIVING
  };
  directionsService.route(request, function(result, status) {
    if (status == google.maps.DirectionsStatus.OK) {
//      directionsDisplay.setDirections(result);
      var path = getPathWithDirection(result.routes[0].overview_path);
      
    }
  });
}

function printResult(id, path) {
  var html = "";
  for (var i = 0; i < path.length; i++) {
//    html += i + "," + path[i].lon + "," + path[i].lat + "," + path[i].heading +"<br/>";
    html += "wget -O "
      + i
      + ".jpg --header=\"User-Agent: Mozilla/5.0 (Windows NT 6.0) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.127\" \"http://maps.googleapis.com/maps/api/streetview?size=640x360&location="
      + path[i].lon
      + ","
      + path[i].lat
      + "&heading="
      + path[i].heading
      + "&sensor=false\"<br/>"
    if (i % 1 == 0) {
      html += "sleep 2<br/>"
    }
  }
  document.getElementById(id).innerHTML = html;
}

function getPathWithDirection(path) {
  var path2 = [];
  for (var i = 0; i < path.length; i++) {
    var pos = {lat:path[i].D, lon:path[i].k};
    path2.push(pos);
  }

  // 間隔を調整
  var path3 = [];
  for (var i = 0; i < path2.length; i++) {
    if (i+1 < path2.length) {
      path3.push(path2[i]);
      var dis = calcDistance(path2[i].lat, path2[i].lon, path2[i+1].lat, path2[i+1].lon);
      if (D < dis) {
        var howmany = Math.floor(dis / D);
        var oneLat = (path2[i+1].lat - path2[i].lat) / howmany;
        var oneLon = (path2[i+1].lon - path2[i].lon) / howmany;
        for (var j = 1; j <= D; j++) {
          var pos = {lat:(path2[i].lat + oneLat * j), lon:(path2[i].lon + oneLon * j)}
          path3.push(pos);
        }
      }
    }
  }

  // 方向を追加
  for (var i = 0; i < path3.length; i++) {
    var heading = 0;
    if (i+1 < path3.length) {
      heading = azimuth(path3[i].lat, path3[i].lon, path3[i+1].lat, path3[i+1].lon);
    } else {
      heading = azimuth(path3[i-1].lat, path3[i-1].lon, path3[i].lat, path3[i].lon);
    }
    path3[i].heading = -1 * Math.floor(heading - 180);
  }
  printResult("r3", path3);
}

// return unit is meter
function calcDistance(lat1, lon1, lat2, lon2){
  //ラジアンに変換
  var a_lat = lat1 * RAD;
  var a_lon = lon1 * RAD;
  var b_lat = lat2 * RAD;
  var b_lon = lon2 * RAD;
  
  // 緯度の平均、緯度間の差、経度間の差
  var latave = (a_lat + b_lat) / 2;
  var latidiff = a_lat - b_lat;
  var longdiff = a_lon - b_lon;
  
  //子午線曲率半径
  //半径を6335439m、離心率を0.006694で設定してます
  var meridian = 6335439 / Math.sqrt(Math.pow(1 - 0.006694 * Math.sin(latave) * Math.sin(latave), 3));    
  
  //卯酉線曲率半径
  //半径を6378137m、離心率を0.006694で設定してます
  var primevertical = 6378137 / Math.sqrt(1 - 0.006694 * Math.sin(latave) * Math.sin(latave));     
  
  //Hubenyの簡易式
  var x = meridian * latidiff;
  var y = primevertical * Math.cos(latave) * longdiff;
  
  return Math.sqrt(Math.pow(x,2) + Math.pow(y,2));
}

function azimuth(lat1, lon1, lat2, lon2) {
  // 度をラジアンに変換
  lat1 *= RAD;
  lon1 *= RAD;
  lat2 *= RAD;
  lon2 *= RAD;
  
  var lat_c = (lat1 + lat2) / 2;					// 緯度の中心値
  var dx = R_EARTH * (lon2 - lon1) * Math.cos(lat_c);
  var dy = R_EARTH * (lat2 - lat1);
  
  if (dx == 0 && dy == 0) {
	return 0;	// dx, dyともに0のときは強制的に0とする。
  } else {
	return Math.atan2(dy, dx) / RAD;	// 結果は度単位で返す
  }
}
