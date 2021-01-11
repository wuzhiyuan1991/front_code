define(function(require){
    var LIB = require('lib');
    //数据模型
    var api = require("../../vuex/api");

    var detail = {
        // mixins : [LIB.VueMixin.dataDic],
        // template: tpl,
        // components:{
        //     'riskModel':riskModel
        // },
        methods:{
            doSave:function(){
                var _this = this;
                _this.mainModel.vo.isRotationRisk=1;
                this.mainModel.vo.riskLevel=this.riskModel.result;
                this.mainModel.vo.residualRiskEvaluationRank=this.residualRiskModel.result;
                this.mainModel.vo.riskModelId=this.riskModel.id;
                this.mainModel.vo.residualRiskModelId=this.residualRiskModel.id;
                // if(_this.selectedDataRisk && _this.selectedDataRisk.length>0){
                //     this.mainModel.vo.riskTypeId=this.selectedDataRisk[0].id;
                //     if (_this.mainModel.vo.checkItem.name != null && _this.mainModel.vo.checkItem.type != null){
                //         this.mainModel.vo.checkItem.riskTypeId=this.selectedDataRisk[0].id;
                //     }
                // }

                if(!_this.isCreated) {
                    // if(this.mainModel.vo.checkItem.name || this.mainModel.vo.checkItem.type){
                    //     if(!this.mainModel.vo.checkItem.type){
                    //         LIB.Msg.info("请选择检查项类型");
                    //         return;
                    //     }else if(!this.mainModel.vo.checkItem.name){
                    //         LIB.Msg.info("请输入检查项名称");
                    //         return ;
                    //     }
                    // }else{
                    //     LIB.Msg.info("请输入检查项名称");
                    //     return ;
                    // };
                    if (_this.mainModel.vo.checkItem.name != null && _this.mainModel.vo.checkItem.type != null) {
                        if (_this.selectedDataRisk && _this.selectedDataRisk.length > 0) {
                            if (_this.selectedDataRisk[0]) {
                                this.mainModel.vo.riskTypeId = this.selectedDataRisk[0].id;
                                // this.mainModel.vo.riskType = this.selectedDataRisk[0];
                                this.mainModel.vo.checkItem.riskTypeId = this.selectedDataRisk[0].id;
                            }
                        }
                        // else {
                        //     LIB.Msg.info("请选择检查项分类");
                        //     return false;
                        // }
                    }
                }
                // if(_this.selectedDataHazard && _this.selectedDataHazard.length>0){
                //     this.mainModel.vo.hazardFactorId=this.selectedDataHazard[0].id;
                // }
                if(_this.emergencyPlanYes){
                    _this.mainModel.vo.emergencyPlan = 1;
                }else if(_this.emergencyPlanNo){
                    _this.mainModel.vo.emergencyPlan = 0;
                }else{
                    _this.mainModel.vo.emergencyPlan = null;
                }
                if (_this.isCreated){
                    //获取检查项的id
                    if (_this.selectedCheckItem && _this.selectedCheckItem.length>0){
                        this.mainModel.vo.checkItem.id=this.selectedCheckItem[0].id;

                    }
                    this.mainModel.vo.checkItem.name = null;
                    this.mainModel.vo.checkItem.riskTypeId = null;
                    this.mainModel.vo.checkItem.type = null;
                }else{
                    this.mainModel.vo.checkItem.id = null;
                }
                // else {
                //     // this.mainModel.vo.checkItem.id=this.mainModel.checkItemId;
                // }
                // if(_this.selectedOrg && _this.selectedOrg.length >0){
                //     dataModel.mainModel.vo.orgId = _this.selectedOrg[0].id;
                // }
                this.$refs.ruleform.validate(function (valid) {
                    if (valid) {
                        var resultState = _.pick(_this.mainModel.vo,"id","emergencyPlan","residualRiskEvaluationRank","preventionPerson","preventionDepartment","riskAnalysis","activityContent","activityName","activityType","devicePart","deviceName","hazard","hazardousElementsContent","introducer","subIntroducer","areas","areaType","hazardousElementsSenior","hazardousElementsJunior","scene","riskLevel","controlMeasures","checkItem","riskTypeId","hazardFactorId","state","orgId","riskModelId","residualRiskModelId","checkFrequency","positionId","controlHierarchy","markup","poolId","isRotationRisk");

                        // if(!_this.mainModel.vo.checkItem.id){
                        //     resultState.checkItem = null;
                        // }
                        // else{
                        //     if(dataModel.isCreated){
                        //         resultState.checkItem.name = null;
                        //         resultState.checkItem.type = null;
                        //         resultState.checkItem.riskTypeId = null;
                        //     }
                        // }
                        api.createRisk(_.extend(resultState,{riskModel:JSON.stringify(_this.riskModel)},{residualRiskModel:JSON.stringify(_this.residualRiskModel)})).then(function(res){
                            // if (!res.data || res.data.error == "0") {
                            //修改数据为已回转状态
                            _this.$dispatch("ev_riskFinshed");
                            LIB.Msg.info("回转成功");
                            // }
                        });
                    }else{
                        return false;
                    }
                });
            },
            doCancel:function(){
                this.$dispatch("ev_editCanceled");
            },
            doCreate:function(){
                var _this = this;
                this.isCreated=false;
                _.each(_this.rules,function(value,name){
                    if(name == 'checkItem.name'){
                        value.push( { required: true, message: '请输入检查项名称'})
                    };
                    if(name == 'checkItem.type'){
                        value.push( { required: true, message: '请选择检查项分类'})
                    }
                });
            },
            doSelect:function(){
                var _this = this;
                this.isCreated=true;
                _.each(_this.rules,function(value,name){
                    if(name == 'checkItem.name'){
                        value.splice(0,value.length);
                    };
                    if(name == 'checkItem.type'){
                        value.splice(0,value.length);
                    }
                });
            },
            doYes:function(){
                var _this = this;
                _this.emergencyPlanYes = true;
                _this.emergencyPlanNo = false;
            },
            doNo:function(){
                var _this = this;
                _this.emergencyPlanYes = false;
                _this.emergencyPlanNo = true;
            },
            doSaveItemTable : function(obj){
                this.mainModel.showItemSelectModal = false;
                var _this = this;
                _this.selectedCheckItem = [];
                _this.selectedCheckItem.push(obj[0]);
                _this.mainModel.checkItem.id = obj[0].id;
                _this.mainModel.checkItem.name = obj[0].name;
            },
        },

    };
    return detail;
});