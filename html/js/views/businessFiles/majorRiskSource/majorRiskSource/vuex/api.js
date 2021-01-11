define(function(require){

    var Vue = require("vue");
    var apiCfg = require("apiCfg");

    var customActions = {
        updateDisable: {method: 'PUT', url: 'majorrisksource/updateDisable'},
        //addEquipment: {method: 'POST', url: 'majorrisksource/{id}/equipments'},
        //removeEquipment: {method: 'DELETE', url: 'majorrisksource/{id}/equipments'},

        //安全评价报告API
        queryMrsSafetyEvaluations : {method: 'GET', url: 'majorrisksource/mrssafetyevaluations/list'},
        saveMrsSafetyEvaluation : {method: 'POST', url: 'majorrisksource/{id}/mrssafetyevaluation'},
        removeMrsSafetyEvaluations : _.extend({method: 'DELETE', url: 'majorrisksource/{id}/mrssafetyevaluations'}, apiCfg.delCfg),
        updateMrsSafetyEvaluation : {method: 'PUT', url: 'majorrisksource/{id}/mrssafetyevaluation'},

               //设备/管道/监控系统API
        queryMrsEquipments : {method: 'GET', url: 'majorrisksource/mrsequipments/list'},
        saveMrsEquipment : {method: 'POST', url: 'majorrisksource/{id}/mrsequipment'},
        removeMrsEquipments : _.extend({method: 'DELETE', url: 'majorrisksource/{id}/mrsequipments'}, apiCfg.delCfg),
        updateMrsEquipment : {method: 'PUT', url: 'majorrisksource/{id}/mrsequipment'},
        moveMrsEquipments : {method: 'PUT', url: 'majorrisksource/{id}/mrsequipments/order'},

        //安全附件API
        saveEquipmentItem : {method: 'POST', url: 'mrsequipment/{id}/equipmentitem'},
        removeEquipmentItems : _.extend({method: 'DELETE', url: 'mrsequipment/{id}/equipmentitems'}, apiCfg.delCfg),
        updateEquipmentItem : {method: 'PUT', url: 'mrsequipment/{id}/equipmentitem'},
        moveEquipmentItems : {method: 'PUT', url: 'mrsequipment/{id}/equipmentitems/order'},

        //设备/管道/监控系统维护记录API
        queryMrsEquipMaintRecord : {method: 'GET', url: 'majorrisksource/{id}/mrsequipmaintrecord/{mrsequipmaintrecordId}'},
        queryMrsEquipMaintRecords : {method: 'GET', url: 'majorrisksource/mrsequipmaintrecords/list/{pageNo}/{pageSize}'},
        saveMrsEquipMaintRecord : {method: 'POST', url: 'majorrisksource/{id}/mrsequipmaintrecord'},
        removeMrsEquipMaintRecords : _.extend({method: 'DELETE', url: 'majorrisksource/{id}/mrsequipmaintrecords'}, apiCfg.delCfg),
        updateMrsEquipMaintRecord : {method: 'PUT', url: 'majorrisksource/{id}/mrsequipmaintrecord'},
        getUUID: {method: 'GET', url: 'helper/getUUID'},

        //主要设备/安全附件/管道/监控设备属性说明
        mrsEquipment:{
            //编码
            code : null,
            //名称
            name : null,
            //数量
            quantity : null,
            //类型 1:设备,2:管道,3:监控系统,4:设备子件
            type : null,
            //生产厂家
            manufacturer : null,
            //公称直径
            nominalDiameter : null,
            //管道材质
            pipingMaterial : null,
            //出厂日期
            productionDate : null,
            //规格型号
            specification : null,
            //储存介质
            storageMedium : null,
            //工程壁厚
            wallThickness : null,
            //重大危险源
            majorRiskSource : {id:'', name:''},
            //父设备id
            parentId: null,
            //安全附件
            equipmentItems: []//也是mrsEquipment对象
        },
        //维护记录属性说明
        mrsEquipMaintRecord:{
            //检测结果 1:合格,2:不合格
            attr1 : null,
            //编码
            code : null,
            //作业类别 1:内部,2:外部
            operationType : null,
            //启用/禁用 0:启用,1:禁用
            disable : "0",
            //检验/检测机构
            inspectOrgan : null,
            //设备类型 1:设备,2:管道,3:监控系统
            mrsEquipmentType : null,
            //维护/保养/检验/检测数量
            quantity : null,
            //作业阶段 1:检修抢修,2:维护保养,3:检验检测
            phase : null,
            //操作/检验/检测内容
            operationContent : null,
            //维护/保养/检验/检测时间
            operateTime : null,
            //所属公司id
            compId : null,
            //所属部门id
            orgId : null,
            //作业/检验/检测操作人员
            operators : null,
            //重大危险源
            mrsEquipment : {id:'', name:''},
            //重大危险源
            majorRiskSource : {id:'', name:''},
            //作业操作人员
            users : [],
        },
        //安全评价报告属性说明
        mrsSafetyEvaluation :{
            //编码
            code : null,
            //安全评价单位
            evaluateUnit : null,
            //委托单位
            trusteeUnit : null,
            //评价时间
            evaluateDate : null,
            //重大危险源名称
            mrsName : null,
            //编制日期
            compileDate : null,
            //危险源控制程序
            controlProcedure : null,
            //评价原因 1:重大危险源安全评估已满三年的,2:构成重大危险源的装置、设施或者场所进行新建、改建、扩建的,3:危险化学品种类、数量、生产、使用工艺或者储存方式及重要设备、设施等发生变化，影响重大危险源级别或者风险程度的,4:外界生产安全环境因素发生变化，影响重大危险源级别和风险程度的,5:发生危险化学品事故造成人员死亡，或者10人以上受伤，或者影响到公共安全的
            evaluateReason : null,
            //重大危险源级别
            mrsRiskLevel : null,
            //备注
            remark : null,
            //安全评价报告编号
            reportNumber : null,
            //委托单位法人
            trusteeCorp : null,
            //委托单位法人电话
            trusteeCorpMobile : null,
            //委托单位联系人
            trusteeLinkman : null,
            //委托单位联系人电话
            trusteeLinkmanMobile : null,
            //重大危险源
            majorRiskSource : {id:'', name:''},
            files:[]
        }

    };

    customActions = _.defaults(customActions, apiCfg.buildDefaultApi("majorrisksource"));
    var resource = Vue.resource(null,{}, customActions);
    resource.__auth__ = {
        'create': '2010009001',
        'edit': '2010009002',
        'delete': '2010009003',
        'enable': '2010009006',
        // 'import': '2010009004'
         'export': '2010009005',
    };
    return _.extend({},resource,{
        queryMrsEquipments:function (id,type) {
            var pms={
                'id':id,
            };
            if(type&&!Array.isArray(type)){
                pms['criteria.intsValue']=JSON.stringify({type:[type]});
            }
            else if(type){
                pms['criteria.intsValue']=JSON.stringify({type:type});
            }
            return resource.queryMrsEquipments(pms);
        }
    });
});