define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
        removeSingle : _.extend({method: 'DELETE', url: 'ptwstuff'}, apiCfg.delCfg),
        createBatch : {method: 'POST', url: 'ptwstuff/batch'},//入参为ptwstuff对象数组
        updateDisable : {method: 'PUT', url: 'ptwstuff/disable'},
        order : {method: 'PUT', url: 'ptwstuff/order'},
        removeAll : {method: 'DELETE', url: 'ptwstuff/{workCatalogId}/{type}'},
        list : {method: 'GET', url: 'ptwstuff/list'},//获取基础库列表，入参：workCatalog.id（作业类型id），type（基础库类型 1:作业工具/设备,2:作业资格证书,3:危害辨识,4:控制措施,5:工艺隔离-方法,6:个人防护设备,7:作业取消原因） ppeCatalogId:
        listCatalogs : {method: 'GET', url: 'ptwcatalog/list'},// type:1:获取作业类型 type:3 ：个人防护设备,
    };
    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("ptwstuff"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
         'create': '7050002001',
         'edit':   '7050002002',
         'delete': '7050002003',
    };
    return  _.extend({},resource,{
        getCatalogDetail:function (pms) {
            return resource.list(pms).then(function(res){
                return res.data;
            })
        },
        getWorkCatalogs:function (data) {
            var obj = data || {};
            _.extend(obj, {type:1});
            return resource.listCatalogs(obj).then(function (res) {
                return  res.data;
            })
        },
        getPPETypes:function(data){
            var obj = data || {};
            _.extend(obj, {type:1});
            return resource.listCatalogs(obj).then(function (res) {
                return  res.data;
            })
        }
    });

});