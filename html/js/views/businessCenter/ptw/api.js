define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");
    var customActions = {
        tplList:{method:'GET',url:'ptwcardtpl/list'},//?workCatalog.id=xxx&workLevelId=xxx'
        list : {method: 'GET', url: 'ptwstuff/list'},
        //获取基础库列表，入参：workCatalogId（作业类型id），type（基础库类型 1:作业工具/设备,2:作业资格证书,3:危害辨识,4
        // :控制措施,5:工艺隔离-方法,6:个人防护设备,7:作业取消原因） ppeCatalogId:
        listCatalogs : {method: 'GET', url: 'ptwcatalog/list'},// type:1:获取作业类型 type:3 ：个人防护设备,2:作业类型等级
        deleteFile:{method:"DELETE", url:'file', contentType:"application/json;charset=UTF-8"}

};
var resource = Vue.resource(null,{}, customActions);
    return  _.extend({},resource,{
        getWorkCarTplList:function(pms){
            return  resource.tplList(pms).then(function (data) {
                return data.data;
            })
        },
        getWorkCatalogLevelList:function(){
            //2分钟缓存
            var cacheKey="c_workcatalogs_type2";
            var noupdateKey="c_workcatalogs_type2_noupdate";
            var cacheVal=window.sessionStorage.getItem(noupdateKey);
            if(!cacheVal||(new Date().getTime()-parseInt(cacheVal))>1000*120)  {
                window.sessionStorage.setItem(noupdateKey,new Date().getTime());
                return this.getWorkCatalogs().then(function (data) {
                    return resource.listCatalogs({type: 2}).then(function (levelListRes) {
                        levelListRes.data.forEach(function (level) {
                            var item = _.findWhere(data, {id: level.parentId});
                            if (item) {
                                if (!item.levelList) {
                                    item.levelList = []
                                }
                                item.levelList.push(level);
                            }
                        });
                        window.sessionStorage.setItem(cacheKey,JSON.stringify(data));
                        window.sessionStorage.setItem(noupdateKey,new Date().getTime())
                        return data;
                    })
                })
            }
            else{
                //这里没办法，同一时刻访问，结果还没出来，必须等结果出来
                return new Promise(function (resolve) {
                    setTimeout(function () {
                        var data=JSON.parse(window.sessionStorage.getItem(cacheKey));
                        resolve(data);
                    },2000)
                })
            }

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
        getWorkCatalogs:function (pms) {
            return resource.listCatalogs(_.extend({type:1},pms||{})).then(function (res) {
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