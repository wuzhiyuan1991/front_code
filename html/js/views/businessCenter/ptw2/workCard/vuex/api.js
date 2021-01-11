define(function (require) {

    var Vue = require("vue");
    var apiCfg = require("apiCfg");
    var model = require("../../model");
    var customActions = {
        getUUID: {method: 'GET', url: 'helper/getUUID'},
        tplDetail: {'method': 'GET', url: 'ptwcardtpl/{id}'},
        updateDisable: {method: 'PUT', url: 'ptwworkcard/disable'},
        getWorkPermit: {method: 'GET', url: 'ptwworkpermit/{id}'},//作业票详情
        saveWorkPermit: {method: 'PUT', url: 'ptwworkpermit/save'},//填报作业票-保存，入参为PtwWorkPermit对象，全部属性详见ptw/js/ptwWorkPermit/page/detail.js
        submitWorkPermit: {method: 'PUT', url: 'ptwworkpermit/submit'},//填报作业票-提交，入参为PtwWorkPermit对象:{id:workPermitId}

        //关联作业票API
        queryWorkCardRelations : {method: 'GET', url: 'ptwworkcard/workcardrelations/list'},
        saveWorkCardRelations : {method: 'POST', url: 'ptwworkcard/{id}/workcardrelations'},
        removeWorkCardRelations : _.extend({method: 'DELETE', url: 'ptwworkcard/{id}/workcardrelations'}, apiCfg.delCfg),
        updateWorkCardRelation : {method: 'PUT', url: 'ptwworkcard/{id}/workcardrelation'},

    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("ptwworkcard"));//预约create
    var resource = Vue.resource(null, {}, customActions);
    resource.__auth__ = {
        'apply': '7080001001',//发起作业
    };
    return _.extend({}, resource, {
        tplDetail: function (id) {
            return resource.tplDetail({id: id}).then(function (res) {
                var data = res.data;
                data.ptwCardStuffs = data.ptwCardStuffs.map(function (item) {
                    return {
                        id: item.stuffId,
                        type: item.gasCatalog ? "4" : item.stuffType,//4 是为了查询其气体的接口
                        ppeCatalogId: item.ppeCatalogId,
                        gasType: item.gasCatalog ? item.gasCatalog.gasType : undefined,
                        name: item.gasCatalog ? item.gasCatalog.name : item.ptwStuff.name,
                        attr1:item.attr1||"0"
                    }
                });
                //下面是添加其他项
                var types = [], ppeCatelogIds = [], gasTypes = [];
                data.ptwCardStuffs.forEach(function (item) {
                    if (types.indexOf(item.type) === -1 && !item.gasType) {
                        types.push(item.type);
                    }
                    if (ppeCatelogIds.indexOf(item.ppeCatalogId) === -1 && item.ppeCatalogId) {
                        ppeCatelogIds.push(item.ppeCatalogId);
                    }
                    if (gasTypes.indexOf(item.gasType) === -1 && item.gasType) {
                        gasTypes.push(item.gasType);
                    }
                });
                //类型 1:作业工具/设备,2:作业资格证书,3:危害辨识,4:控制措施,
                // 5:工艺隔离-方法,6:个人防护设备,7:作业取消原因,8:气体检测指标
                types.forEach(function (item) {
                    if ("6,7,8".indexOf(item) === -1) {
                        model.addOther(data.ptwCardStuffs, {type: item})
                    }
                });
                ppeCatelogIds.forEach(function (item) {
                    model.addOther(data.ptwCardStuffs, {type: "6", ppeCatalogId: item})
                });
                if(data.ptwCardSignRoles&&data.ptwCardSignRoles.length>0){
                    data.ptwCardSignRoles=data.ptwCardSignRoles.sort(function (a,b) {
                        return  a.signStep-b.signStep;
                    })
                }
                // gasTypes.forEach(function (item) {
                //     model.addOther(data.ptwCardStuffs, {type: "4", gasType: item})
                // });
                return data;
            })
        },
        /*
        *在作业票填报的时候需要过滤掉5,7，显示信息的时候不需要
        * @noFilter:是否不需要过滤
        * */
        getWorkPermit: function (id, noFilter) {//
            return resource.getWorkPermit({id: id}).then(function (res) {
                var data = _.extend({}, model.permitDetail(), res.data);
                // if (!noFilter) {
                //     data.workStuffs = data.workStuffs.filter(function (item) {
                //         return "5,7".indexOf(item.stuffType) === -1;
                //     });
                // }
                if(data.gasCheckPosition&&data.gasCheckPosition.length>0){
                    data.gasCheckPosition=data.gasCheckPosition.split(',');
                }
                data.workStuffs = data.workStuffs.map(function (item) {
                 return  _.extend(item,{
                        id: item.stuffId,
                        type: item.gasCatalog ? 4 : item.stuffType,//4 是为了查询其气体的接口 实际上是8 不应该变动
                        content: item.content || "",
                        gasType: item.gasCatalog ? item.gasCatalog.gasType : null,
                        name: item.isExtra == "1" ? '其他' : (item.gasCatalog ? item.gasCatalog.name : item.ptwStuff.name),
                        workStuffId:item.id,
                    })
                });

                return data;
            })
        }
    })
});