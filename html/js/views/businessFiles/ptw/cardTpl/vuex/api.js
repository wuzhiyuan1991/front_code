define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
		updateDisable : {method: 'PUT', url: 'ptwcardtpl/disable'},
		queryPtwCardStuffs : {method: 'GET', url: 'ptwcardtpl/ptwcardstuffs/list'},
		savePtwCardStuff : {method: 'POST', url: 'ptwcardtpl/{id}/ptwcardstuff'},
        savePtwCardStuffs : {method: 'POST', url: 'ptwcardtpl/{id}/ptwcardstuffs'},
		removePtwCardStuffs : _.extend({method: 'DELETE', url: 'ptwcardtpl/{id}/ptwcardstuffs'}, apiCfg.delCfg),
		updatePtwCardStuff : {method: 'PUT', url: 'ptwcardtpl/{id}/ptwcardstuff'},

        /*作业签发API*/
        getSignCatalogs: {method: 'GET', url: 'ptwcatalog/list?type=5'},//获取签发角色类型列表
        queryPtwCardSignRoles : {method: 'GET', url: 'ptwcardtpl/ptwcardsignroles/list'},//获取作业票模板的作业签发角色列表
        savePtwCardSignRole : {method: 'POST', url: 'ptwcardtpl/{id}/ptwcardsignrole'},//保存签发角色
        removePtwCardSignRoles : _.extend({method: 'DELETE', url: 'ptwcardtpl/{id}/ptwcardsignroles'}, apiCfg.delCfg),//删除签发角色
        updatePtwCardSignRole : {method: 'PUT', url: 'ptwcardtpl/{id}/ptwcardsignrole'},
        listCatalogs : {method: 'GET', url: 'ptwcatalog/list'},// type:1:获取作业类型 type:3 ：个人防护设备,
        queryDefaultSetting: {method: 'GET', url:'ptwcardtpl/defaultcolumnsettings/list'}, // 获取默认字符串


        getUUID: {method: 'GET', url: 'helper/getUUID'},
        saveWorkStuff: {method: 'POST', url: 'ptwstuff'},
        updateWorkStuff: {method: 'PUT', url: 'ptwstuff'},

        saveCopyTpl:{method: 'POST', url: 'ptwcardtpl/{id}/copy'}
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("ptwcardtpl"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
         //'create': '7050003001',
         //'edit':   '7050003002',
         //'delete': '7050003003',
         //'enable': '7050003006',
         //'copy': '7050003007',
    };
    return _.extend({},resource,{
        getEnableSignCatalogs:function(){
            //2分钟缓存
            var cacheKey="c_enablesigncatalogs";
            var noupdateKey="c_enablesigncatalogs_noupdate";
            var cacheVal=window.sessionStorage.getItem(noupdateKey);
            // if(!cacheVal||(new Date().getTime()-parseInt(cacheVal))>1000*120) {
            if(true) {

                window.sessionStorage.setItem(noupdateKey,new Date().getTime());
                return this.getSignCatalogs({disable: "0"}).then(function (res) {
                    var data={data:res.body};
                    window.sessionStorage.setItem(cacheKey,JSON.stringify(data));
                    window.sessionStorage.setItem(noupdateKey,new Date().getTime());
                    return data;
                })
            }
            else{
                //这里没办法，同一时刻访问，结果还没出来，必须等结果出来 ,
                // 最好的方法是缓存请求，或者后端缓存请求
                return new Promise(function (resolve) {
                    setTimeout(function () {
                        var data=JSON.parse(window.sessionStorage.getItem(cacheKey));
                        resolve(data);
                    },2000)
                })
            }
        },
        queryPtwCardSignRoles:function (pms) {
            return  resource.queryPtwCardSignRoles(pms).then(function (res) {//todo 按照signStep 顺序排序，当然也可以传固定参数后端排序 现在不知道
                if(res.data&&res.data.length>0){
                    return res.data.sort(function (a,b) {
                        return  a.signStep-b.signStep;
                    })
                }
                else{
                    return [];
                }
            })
        }
    });
});