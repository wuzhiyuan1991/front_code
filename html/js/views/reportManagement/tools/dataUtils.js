/**
 * Created by Thinkpad on 2017/2/21.
 */
define(function(require){
   var sliceStr = function(val,len){
       var le= len == null ? 4 : len;
       return val == null ? "" : val.length > le ? val.slice(0,le).concat("..") : val;
   };
    /**
     * 转换id数组参数为使用","拼接的字符串
     * @param ranges
     * @returns {string}
     */
    var getIdsRange = function(ranges){
        var array = _.map(ranges,function(r){return r.key;});
        return array.join(",");
    };
    var formatPercent = function(num){
        return new Number(num * 100).toFixed(1);
    };
    return {
        sliceStr:sliceStr,
        getIdsRange:getIdsRange,
        formatPercent:formatPercent
    };
});