define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");
    var customActions = {
        list : {method: 'GET', url: 'ptwstuff/list'},
        //获取基础库列表，入参：workCatalogId（作业类型id），type（基础库类型 1:作业工具/设备,2:作业资格证书,3:危害辨识,4
        // :控制措施,5:工艺隔离-方法,6:个人防护设备,7:作业取消原因） ppeCatalogId:
        listCatalogs : {method: 'GET', url: 'ptwcatalog/list'},// type:1:获取作业类型 type:3 ：个人防护设备,
        ptwstuffCopy :{method: 'POST', url: 'ptwstuff/copy/{srcCatalogId}/{srcType}'}

    };
var resource = Vue.resource(null,{}, customActions);
    return  _.extend({}, {
        getWorkCatalogLevelList:function(){
            return    this.getWorkCatalogs().then(function (data) {
                return   resource.listCatalogs({type:2}).then(function (levelListRes) {
                    levelListRes.data.forEach(function (level) {
                        var item=_.findWhere(data,{id:level.parentId});
                        if(item){
                            if(!item.levelList){item.levelList=[]}
                            item.levelList.push(level);
                        }
                    });
                    return data;
                })
            })
        },

        ptwstuffCopy:function (pms1, pms2) {
            return resource.ptwstuffCopy(pms1, pms2).then(function (res) {
                return res.data;
            })
        },

        getCatalogList:function(pms){
            return resource.listCatalogs(pms).then(function (res) {
                   return res.data;
            })
        },
        getCatalogDetail:function (pms) {
            return resource.list(pms).then(function(res){
                return res.data;
            })
        },
        getWorkCatalogs:function () {
            return resource.listCatalogs({type:1}).then(function (res) {
                return  res.data;
            })
        },
        getPPETypes:function(){
            return resource.listCatalogs({type:3}).then(function (res) {
                return  res.data;
            })
        }
    });

});