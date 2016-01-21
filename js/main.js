
//获取url参数
function getUrlParams(name, many, decode) {
    var r = window.location.search.substr(1).split('&'),
        ret = [],
        many = many ? many : false;
    for (var p in r) {
        var index = r[p].split('=');
        if (index[0] == name) {
            if (many) {
                decode ? ret.push(decodeURIComponent(index[1])) : ret.push(index[1]);
            } else {
                return decode ? decodeURIComponent(index[1]) : index[1];
            }
        }
    }
    return ret[0] ? ret : false;
}
