define(function(require) {

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
        getTreeData: { method: 'GET', url: 'isaaudittask/treeList/{id}?types={types}' },
        getChildren: { method: 'GET', url: 'isaaudittask/tree/{id}' },
        batchScore: { method: 'PUT', url: 'isaaudittask/score' },
        getSelfData: { method: 'GET', url: 'isaaudittask/loginUser/treeList?auditPlanId={planId}&types={types}' },
        getFiles: { method: 'GET', url: 'file/list/1/1000?criteria.strsValue={recordIds}&filetype=[S]' },
        safetyAuditConfig:{method:'get',url:'systembusinessset/root?compId=9999999999&name=safetyAudit'}
    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("isaauditelement"));
    var resource = Vue.resource(null, {}, customActions);
    return  _.extend(resource,{
        getSafetyAuditConfig:function () {
            return resource.safetyAuditConfig().then(function (data) {
                data=data.data;
                //todo commonfun   整合成公共方法
                var obj={};

                if(data.children&&data.children.length>0){
                    data.children.forEach(function (item) {
                        var key=item.attr1.split('.').slice(-1);
                        obj[key]=item.result==2;
                    })
                }
                return obj;
            })
        }
    });
});
