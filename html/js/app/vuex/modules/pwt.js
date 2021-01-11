define(function (require) {
    var Vue=require('vue');
    var types = require("../mutation-types");
    var customActions={
        listCatalogs : {method: 'GET', url: 'ptwcatalog/list'},// type:1:获取作业类型 type:3 ：个人防护设备,
    };
    var resource = Vue.resource(null,{},customActions);
    resource= _.extend({},resource,{
        getWorkCatalogs:function () {
            return Promise.resolve([
                {id:1,name:"动火作业"},
                {id:2,name:"动土作业"},
                {id:3,name:"高空作业"},
                {id:4,name:"短路作业"},
                {id:5,name:"临时用电作业"},
            ]);

        },
    });

    return {
        modal: {
            state: {
                workCatalogList: [],
            },
            mutations: {
                setWorkCatalogList: function (store, data) {
                    store.pwt.workCatalogList = data;
                }
            }
        },
        actions:{
            getWorkCatalogList:function (store){
                resource.getWorkCatalogs().then(function (data) {
                    store.dispatch(types.PWT_GET_CATALOGLIST,data);
                })

            }
        }
    }

})