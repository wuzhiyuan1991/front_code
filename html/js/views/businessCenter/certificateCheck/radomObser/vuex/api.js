define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
        //list : {method: 'GET', url: 'radomobser/list/{pageNo}/{pageSize}'},
        //get : {method: 'GET', url: 'radomobser/{id}'},
        //create : {method: 'POST', url: 'radomobser'},
        //update : {method: 'PUT', url: 'radomobser'},
        //remove : _.extend({method: 'DELETE', url: 'radomobser'}, apiCfg.delCfg),
        //exportExcel : {method: 'GET', url: 'radomobser/exportExcel'},
        //importExcel : {method: 'POST', url: 'radomobser/importExcel'},
        //deleteFile:{method:'DELETE',url:'file'},
        convert: {method: 'PUT', url: 'tparadomobser/convert'},
        vedo: {method: 'PUT', url: 'tparadomobser/vedo'}
};
    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("tparadomobser"));
    var resource = Vue.resource(null,{}, customActions);
    return resource;
});