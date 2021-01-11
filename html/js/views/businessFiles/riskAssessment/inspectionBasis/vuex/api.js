define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
        //list : {method: 'GET', url: 'checkbasis/list/{pageNo}/{pageSize}'},
        //get : {method: 'GET', url: 'checkbasis/{id}'},
        //create : {method: 'POST', url: 'checkbasis'},
        //update : {method: 'PUT', url: 'checkbasis'},
        //remove : _.extend({method: 'DELETE', url: 'checkbasis'}, apiCfg.delCfg),
        //exportExcel : {method: 'GET', url: 'checkbasis/exportExcel'},
        //importExcel : {method: 'POST', url: 'checkbasis/importExcel'},
        //获取业务对象关联的文件信息
        //listFile: {method: 'GET', url: 'file/list'},
        //deleteFile:{method:"DELETE",url:'file',contentType:"application/json;charset=UTF-8"},
        getCheckBasisType:{method:'GET',url:'checkbasistype/list'}
    };
    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("checkbasis"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        'create': '3020003001',
        'edit': '3020003002',
        'delete': '3020003003',
        'export':'3020003005',
        'import':'3020003004'
    };
    return resource;
});