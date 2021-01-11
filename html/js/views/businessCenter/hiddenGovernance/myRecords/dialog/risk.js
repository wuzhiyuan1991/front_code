define(function(require){
    var LIB = require('lib');
    //数据模型
    var api = require("../../vuex/api");
    var tpl = require("text!./risk.html");
    var riskOpt = require("./risk-opt");
    // var itemComponent = require("./selectCheckItem");
    var checkItemSelectModal = require("componentsEx/selectTableModal/checkItemSelectModal")
    var riskModel = require("views/basicSetting/basicFile/evaluationModel/dialog/riskModel");
    var columsCfg = LIB.setting.fieldSetting["BC_RiA_HazI"] ? LIB.setting.fieldSetting["BC_RiA_HazI"] : [];
    var columsCfg1 = columsCfg;
    columsCfg = _.groupBy(columsCfg,"formItemGroup");
    var customTpl = '';
    var map = {
        "enum" : require("text!componentsEx/template/enum.html"),
        "string" :require('text!componentsEx/template/string.html'),
        'risk': require('text!componentsEx/template/riskModel.html'),
        'checkRadio': require('text!componentsEx/template/radioModel.html'),
        'text':require('text!componentsEx/template/string-areatext.html')
    };
    _.each(columsCfg1,function(data){
        if(data.fieldName == 'emergencyPlan'){//制定紧急预定方案渲染是checkRadio
            data.fieldType = 'checkRadio';
        }
    });
    var renderTpl = function(type){
        if(type == 'checkRadio'){
            return map.checkRadio;
        }else if(type == 'refer'){
            return map.risk;
        }
    }
    customTpl = LIB.formRenderMgr.renderHtml(map,columsCfg,renderTpl);
    tpl = tpl.replace('$hook', customTpl);
    var newCheckItem = function(){
        return {
            id:null,
            name:null,
            type:null,
            riskTypeId:null,
        }
    }
    var newVO = function() {
        return LIB.dataRenderMgr.renderVO({
            id:null,
            scene:null,
            riskLevel:null,
            controlMeasures:null,
            riskTypeId:null,
            riskModelId:null,
            checkFrequency:null,
            positionId:null,
            controlHierarchy:null,
            residualRiskModelId:null,
            residualRiskEvaluationRank:null,//残余风险评估-风险等级
            code:null,
            // riskType:{
            //     id:null
            // },
            hazardFactor:{},
            state:1,
            orgId:null,

            isRotationRisk:null,
            markup:0,
            checkItem:newCheckItem(),
            poolId:null,
			typeOfCtrlMeas:null,//控制措施-类型
			hierOfCtrlMeas:null,//控制措施-层级
			scoreOfCtrlMeas:null,//控制措施-分值
			levelOfControl:null,//管控等级
            // introducer:null,//引导词
            // subIntroducer:null,//分类引导词
            // areas:null,//部门区域
            // areaType:null,//地域类型
            // hazardousElementsSenior:null,//大分类
            // hazardousElementsJunior:null,//小分类
            // hazard:null,//危险源
            // hazardousElementsContent:null,//危害因素-内容
            // deviceName:null,//设备设施-名称
            // devicePart:null,//部件
            // activityType:null,//分类
            // activityName:null,//活动（操作/作业/任务）-名称
            // activityContent:null,//活动（操作/作业/任务）-内容
            // riskAnalysis:null,//风险分析
            // preventionDepartment:null,//责任部门
            // preventionPerson:null,//责任人
            // emergencyPlan:null,
        },columsCfg1)
    };

    //数据模型
    var dataModel = {
        mainModel : {
            vo : newVO(),
            isReadOnly : true,
            checkItem : {
                id:null,
                name : null
            },
            showItemSelectModal : false,
            opType : "",
            typeList:[{id:"0",name:"行为类"},{id:"1",name:"状态类"},{id:"2",name:"管理类"}],
            introducerList:LIB.getDataDicList("introducer"),
            subIntroducerList:LIB.getDataDicList("sub_introducer"),
            hazardousElementsSeniorList:LIB.getDataDicList("hazardous_elements_senior"),
            hazardousElementsJuniorList:LIB.getDataDicList("hazardous_elements_junior"),
            hazardList:LIB.getDataDicList("hazard"),
            checkFrequencyList:LIB.getDataDicList("check_frequency"),
            preventionDepartmentList:LIB.getDataDicList("prevention_department"),
            preventionPersonList:LIB.getDataDicList("prevention_person")
        },
        riskModel:{
            id:null,
            opts:[],
            result:null
        },
        residualRiskModel:{
            id:null,
            opts:[],
            result:null
        },
        // itemModel:{
        //     //显示弹框
        //     show : false,
        //     title:"选择检查项",
        //     id: null
        // },
        selectedDataRisk:[],
        selectedDataHazard:[],
        orgList:[],
        positionList:[],
        selectedOrg:[],
        selectedCheckItem:[],
        checkItemRiskTypeList:[],
        riskTypeList:[],
        hazardFactorList:[],
        isCreated:true,
        emergencyPlanYes:true,
        emergencyPlanNo:false,
        rules: {
            // orgId: [
            //     { required: true, message: '请选择所属公司'},
            // ],
            // // riskTypeId: [
            // //     { required: true, message: '请选择风险分类'},
            // // ],
            // introducer:[
            //     { required: true, message: '请选择引导词'},
            // ],
            // subIntroducer:[
            //     { required: true, message: '请选择分类引导词'},
            // ],
            // hazardousElementsSenior:[
            //     { required: true, message: '请选择大分类'},
            // ],
            // hazardousElementsJunior:[
            //     { required: true, message: '请选择小分类'},
            // ],
            // hazard:[
            //     { required: true, message: '请选择危险源'},
            // ],
            // preventionDepartment:[
            //     { required: true, message: '请选择责任部门'},
            // ],
            // preventionPerson:[
            //     { required: true, message: '请选择责任人'},
            // ],
            // // hazardFactorId: [
            // //     { required: true, message: '请选择危害因素'},
            // // ],
            // scene: [
            //     { required: true, message: '请输入场景'},
            //     LIB.formRuleMgr.length(1000)
            //     //{ max: 1000, message: '长度在 0 到 1000 个字符'},
            // ],
            // riskLevel: [
            //     { required: true, message: '请选择风险等级'},
            // ],
            // controlMeasures:[
            //     LIB.formRuleMgr.length(1000)
            //     //{max: 1000, message: '长度在 0 到 1000 个字符'},
            // ],
            // positionId:[
            //     {required: true, message: '请选择岗位'}
            // ],
            // checkFrequency:[
            //     {required: true, message: '请输入排查频次'},
            //     {max: 100, message: '长度在 0 到 100 个字符'}
            // ],
            // controlHierarchy:[
            //     {required: true, message: '请输入管控层级'},
            //     {max: 10, message: '长度在 0 到 10 个字符'}
            // ],
            // checkItem:[//自定义校验规则
            //     {validator:function(rule, value, callback){
            //         if(value){
            //             return callback();
            //         }else if(dataModel.mainModel.vo.checkItem.code ||dataModel.mainModel.vo.checkItem.name || dataModel.mainModel.vo.checkItem.type){
            //             var label = rule.field === "checkItem.name" ? "名称" : "分类";
            //             return callback(new Error("请输入"+label));
            //         }else{
            //             return callback();
            //         }
            //     }}
            // ]
        },
        orgIdDate:null
    };

    var detail = LIB.Vue.extend({
        mixins : [LIB.VueMixin.dataDic,riskOpt],
        template: tpl,
        components:{
            'riskModel':riskModel,
            // "itemComponent":itemComponent
            'checkitemSelectModal' : checkItemSelectModal
        },
        data:function(){
            var columsCfg = LIB.setting.fieldSetting["BC_RiA_HazI"] ? LIB.setting.fieldSetting["BC_RiA_HazI"] : []
            var renderRules = _.bind(LIB.dataRenderMgr.renderRules, this,columsCfg);
			var _this = this;
            var rules = renderRules({
                orgId: [
                    { required: true, message: '请选择所属公司'},
                ],
                riskLevel: [
                    { required: true, message: '请选择风险等级'},
                ],
                controlMeasures:[
                    LIB.formRuleMgr.length(1000)
                ],
                riskTypeId: [
                    { required: true, message: '请选择风险分类'},
                ],
                'hazardFactor.id': [
                    { required: true, message: '请选择危害因素分类'},
                ],
                scene: [
                    { required: true, message: '请输入场景'},
                    LIB.formRuleMgr.length(1000)
                    //{ max: 1000, message: '长度在 0 到 1000 个字符'},
                ],
                'levelOfControl' :[
                    { required: true, message: '请选择管控等级'},
                ],
                typeOfCtrlMeas:[{
                    validator: function(rule, value, callback) {
                        var hierOfCtrlMeas = _this.mainModel.vo.hierOfCtrlMeas;
                        var error = [];
                        if(!_.isEmpty(hierOfCtrlMeas)){
                            if(_.isEmpty(value)){
                                error.push("请选择控制措施类型");
                            }
                        }
                        callback(error);
                    }
                }],
                hierOfCtrlMeas:[{
                    validator: function(rule, value, callback) {
                        var typeOfCtrlMeas = _this.mainModel.vo.typeOfCtrlMeas;
                        var error = [];
                        if(!_.isEmpty(typeOfCtrlMeas)){
                            if(_.isEmpty(value)){
                                error.push("请选择控制措施层级");
                            }
                        }
                        callback(error);
                    }
                }],
                'checkItem.name' : [],
                'checkItem.type' : [],
                // checkItem:[//自定义校验规则
                //     {
                //         required: true, message: '请选择检查项',
                //         validator:function(rule, value, callback){
                //             if(value){
                //                 return callback();
                //             }else if(dataModel.mainModel.vo.checkItem.code  || dataModel.mainModel.vo.checkItem.type){
                //                 var label = rule.field === "checkItem.name" ? "名称" : "分类";
                //                 return callback(new Error("请输入"+label));
                //             }else{
                //                 return callback();
                //             }
                //         }}
                // ]
            });
            dataModel.rules = _.extend(rules,dataModel.rules);
            return dataModel;
        },
        methods:{
            // doSave:function(){
            //     var _this = this;
            //     _this.mainModel.vo.isRotationRisk=1;
            //     this.mainModel.vo.riskLevel=this.riskModel.result;
            //     this.mainModel.vo.residualRiskEvaluationRank=this.residualRiskModel.result;
            //     this.mainModel.vo.riskModelId=this.riskModel.id;
            //     this.mainModel.vo.residualRiskModelId=this.residualRiskModel.id;
            //     // if(_this.selectedDataRisk && _this.selectedDataRisk.length>0){
            //     //     this.mainModel.vo.riskTypeId=this.selectedDataRisk[0].id;
            //     //     if (_this.mainModel.vo.checkItem.name != null && _this.mainModel.vo.checkItem.type != null){
            //     //         this.mainModel.vo.checkItem.riskTypeId=this.selectedDataRisk[0].id;
            //     //     }
            //     // }
            //
            //     if(!dataModel.isCreated) {
            //         if (_this.mainModel.vo.checkItem.name != null && _this.mainModel.vo.checkItem.type != null) {
            //             if (_this.selectedDataRisk && _this.selectedDataRisk.length > 0) {
            //                 if (_this.selectedDataRisk[0]) {
            //                     this.mainModel.vo.riskTypeId = this.selectedDataRisk[0].id;
            //                     // this.mainModel.vo.riskType = this.selectedDataRisk[0];
            //                     this.mainModel.vo.checkItem.riskTypeId = this.selectedDataRisk[0].id;
            //                 }
            //             } else {
            //                 LIB.Msg.info("请选择检查项分类");
            //                 return false;
            //             }
            //         }
            //     }
            //     // if(_this.selectedDataHazard && _this.selectedDataHazard.length>0){
            //     //     this.mainModel.vo.hazardFactorId=this.selectedDataHazard[0].id;
            //     // }
            //     if(_this.emergencyPlanYes){
            //         _this.mainModel.vo.emergencyPlan = 1;
            //     }else if(_this.emergencyPlanNo){
            //         _this.mainModel.vo.emergencyPlan = 0;
            //     }else{
            //         _this.mainModel.vo.emergencyPlan = null;
            //     }
            //     if (dataModel.isCreated){
            //         //获取检查项的id
            //         if (_this.selectedCheckItem && _this.selectedCheckItem.length>0){
            //             this.mainModel.vo.checkItem.id=this.selectedCheckItem[0].id;
            //
            //         }
            //     }
            //     // else {
            //     //     // this.mainModel.vo.checkItem.id=this.mainModel.checkItemId;
            //     // }
            //     // if(_this.selectedOrg && _this.selectedOrg.length >0){
            //     //     dataModel.mainModel.vo.orgId = _this.selectedOrg[0].id;
            //     // }
            //     this.$refs.ruleform.validate(function (valid) {
            //         if (valid) {
            //             var resultState = _.pick(_this.mainModel.vo,"id","emergencyPlan","residualRiskEvaluationRank","preventionPerson","preventionDepartment","riskAnalysis","activityContent","activityName","activityType","devicePart","deviceName","hazard","hazardousElementsContent","introducer","subIntroducer","areas","areaType","hazardousElementsSenior","hazardousElementsJunior","scene","riskLevel","controlMeasures","checkItem","riskTypeId","hazardFactorId","state","orgId","riskModelId","residualRiskModelId","checkFrequency","positionId","controlHierarchy","markup","poolId","isRotationRisk");
            //
            //             // if(!_this.mainModel.vo.checkItem.id){
            //             //     resultState.checkItem = null;
            //             // }
            //             // else{
            //             //     if(dataModel.isCreated){
            //             //         resultState.checkItem.name = null;
            //             //         resultState.checkItem.type = null;
            //             //         resultState.checkItem.riskTypeId = null;
            //             //     }
            //             // }
            //                 api.createRisk(_.extend(resultState,{riskModel:JSON.stringify(_this.riskModel)},{residualRiskModel:JSON.stringify(_this.residualRiskModel)})).then(function(res){
            //                     // if (!res.data || res.data.error == "0") {
            //                         //修改数据为已回转状态
            //                             _this.$dispatch("ev_riskFinshed");
            //                             LIB.Msg.info("回转成功");
            //                     // }
            //                 });
            //         }else{
            //             return false;
            //         }
            //     });
            // },
            // doCancel:function(){
            //     this.$dispatch("ev_editCanceled");
            // },
            // doCreate:function(){
            //     dataModel.isCreated=false;
            // },
            // doSelect:function(){
            //     dataModel.isCreated=true;
            // },
            // doYes:function(){
            //     var _this = this;
            //     _this.emergencyPlanYes = true;
            //     _this.emergencyPlanNo = false;
            // },
            // doNo:function(){
            //     var _this = this;
            //     _this.emergencyPlanYes = false;
            //     _this.emergencyPlanNo = true;
            // },
        },
        events : {
            //edit框数据加载
            "ev_riskReload" : function(nVal){
                this.$refs.ruleform.resetFields();
                var _data = dataModel.mainModel;
                var _vo = _data.vo,
                    _this = this;
                //清空数据
                _.extend(_vo,newVO());
                _data.isReadOnly = false;
                _.each(_this.rules,function(value,name){
                    if(name == 'checkItem.name'){
                        // value = [] ;
                        value.splice(0,value.length);
                    };
                    if(name == 'checkItem.type'){
                        // value = [];
                        value.splice(0,value.length);
                    }
                });
                this.selectedOrg=new Array();
                this.selectedDataRisk=new Array();
                this.selectedDataHazard=new Array();
                this.selectedCheckItem=new Array();
                // dataModel.selectedDataRisk.push({"id":null});
                // dataModel.selectedDataHazard.push({"id":null});
                dataModel.selectedCheckItem.push({"id":null});
                dataModel.mainModel.checkItem = {
                    id : null,
                    name : null
                }
                //初始化 风险等级
                dataModel.riskModel ={
                    id:null,
                    opts:[],
                    result:null
                };
                dataModel.residualRiskModel ={
                    id:null,
                    opts:[],
                    result:null
                };
                //存在nVal则是update
                if(nVal != null) {
                    dataModel.mainModel.vo.poolId=nVal;

                    api.get({id:nVal}).then(function(res){
                        _vo.orgId=res.data.compId;
                        //this.orgIdDate = _vo.orgId;
                        //dataModel.riskModel= JSON.parse(res.data.riskLevel);
                        //dataModel.selectedOrg.push({"id":res.data.checkObject.orgId});
                        // _.deepExtend(_vo, res.data);

                        if (res.data.checkItem){
                            // if(res.data.checkItem.name){
                            //    _vo.riskType=res.data.riskType;
                            //    _vo.riskTypeId=res.data.riskType.id;
                            // }
                            _data.checkItemId=res.data.checkItem.id;
                            _.extend(_vo.checkItem,res.data.checkItem);
                        }else {
                            _.extend(_vo.checkItem,null);
                        };
                        if(res.data.emergencyPlan){
                            dataModel.emergencyPlanYes = true;
                            dataModel.emergencyPlanNo = false;
                        }else{
                            dataModel.emergencyPlanYes = false;
                            dataModel.emergencyPlanNo = true;
                        }
                        if(res.data !=null && res.data.riskLevel!=null ){
                            dataModel.riskModel= JSON.parse(res.data.riskLevel);

                        }
                        if(res.data !=null && res.data.residualRiskModel!=null ){
                            dataModel.residualRiskModel= JSON.parse(res.data.residualRiskModel);
                        };

                        // dataModel.selectedDataRisk.push(res.data.riskType);
                        // dataModel.selectedDataHazard.push(res.data.hazardFactor);

                        if(res.data.checkItem){
                            dataModel.selectedCheckItem.push(res.data.checkItem);
                        }
                    });

                    api.getUUID().then(function(res){
                        _vo.id = res.data;
                    });
                    //岗位
                    api.listPosition().then(function(res){
                        dataModel.positionList=res.data;
                    });
                    //初始化风险类型
                    api.getRiskType().then(function(res){
                        dataModel.riskTypeList=res.data;
                    });
                    api.getHazardFactor().then(function(res){
                        dataModel.hazardFactorList=res.data;
                    });
                    //初始化机构下拉数据
                    api.listOrganization().then(function(res){
                        dataModel.orgList = res.data;
                    });
                    //初始化检查项树
                    // api.checkItemVOList().then(function (res) {
                    //     dataModel.checkItemRiskTypeList=res.data;
                    // })
                }
            },
            // "ev_selectItemFinshed" : function(data) {
            //     this.itemModel.show = false;
            //     var _this = this;
            //     _this.selectedCheckItem.push(data.selectedDatas[0]);
            //     _this.mainModel.vo.checkItem.id = data.selectedDatas[0].id;
            //     _this.mainModel.vo.checkItem.name = data.selectedDatas[0].name;
            // },
        }
    });
    return detail;
});