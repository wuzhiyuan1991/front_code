define(function(require){
    var LIB = require('lib');
    var api = require("./vuex/api");
    //数据模型
    var detail = {
        // mixins : [LIB.VueMixin.dataDic],
        methods:{
            doSave:function(){
                var _this = this;
                this.mainModel.vo.riskLevel=this.riskModel.result;
                this.mainModel.vo.residualRiskEvaluationRank=this.residualRiskModel.result;
                this.mainModel.vo.riskModelId=this.riskModel.id;
                this.mainModel.vo.residualRiskModelId=this.residualRiskModel.id;
                if(!_this.isCreated) {
                    if (_this.mainModel.vo.checkItem.name != null && _this.mainModel.vo.checkItem.type != null) {
                        if (_this.selectedDataRisk && _this.selectedDataRisk.length > 0) {
                            if (this.selectedDataRisk[0]) {
                                // this.mainModel.vo.riskTypeId = this.selectedDataRisk[0].id;
                                this.mainModel.vo.riskType = this.selectedDataRisk[0];
                                this.mainModel.vo.checkItem.riskTypeId = this.selectedDataRisk[0].id;
                            }
                        }
                    }
                }
                if(_this.emergencyPlanYes){
                    _this.mainModel.vo.emergencyPlan = 1;
                }else if(_this.emergencyPlanNo){
                    _this.mainModel.vo.emergencyPlan = 0;
                }else{
                    _this.mainModel.vo.emergencyPlan = null;
                }
                //获取选择的检查项数据  下拉选择的数据

                if (_this.isCreated){
                    //获取检查项的id
                    if (_this.selectedCheckItem && _this.selectedCheckItem.length>0){
                        var _checkItem = this.mainModel.vo.checkItem;
                        _checkItem.id = this.selectedCheckItem[0].id;
                        _checkItem.name = this.selectedCheckItem[0].name;
                        _checkItem.type = null;
                        _checkItem.riskTypeId = null;
                    }else{
                        var _checkItem  = this.mainModel.vo.checkItem;
                        _checkItem.id = null;
                        _checkItem.name = null;
                        _checkItem.type = null;
                        _checkItem.riskTypeId = null;

                    }
                }else {
                    this.mainModel.vo.checkItem.id = null;
                    this.mainModel.vo.checkItem.code = null;
                }
                this.$refs.ruleform.validate(function (valid) {
                    if (valid) {

                        // var resultState = _.pick(_this.mainModel.vo,"id","emergencyPlan","residualRiskEvaluationRank","preventionPerson","preventionDepartment","riskAnalysis","activityContent","activityName","activityType","devicePart","deviceName","hazard","hazardousElementsContent","introducer","subIntroducer","areas","areaType","hazardousElementsSenior","hazardousElementsJunior","scene","riskLevel","controlMeasures","checkItem","riskTypeId","state","orgId","riskModelId","residualRiskModelId","checkFrequency","markup");
                        var resultState = _this.mainModel.vo;
                        if(_this.mainModel.opType == "create") {
                            api.create(_.extend(resultState,{riskModel:JSON.stringify(_this.riskModel)},{residualRiskModel:JSON.stringify(_this.residualRiskModel)})).then(function(res){
                                // _this.$dispatch("ev_dtCreate");
                                _this.$emit("do-save", res,'create');
                                LIB.Msg.info("保存成功");
                            });
                        } else {
                            var resultModel = _this.mainModel.vo;
                            resultModel.compId = resultModel.orgId;
                            // var resultModel = _.pick(_this.mainModel.vo,"id","emergencyPlan","residualRiskEvaluationRank","preventionPerson","preventionDepartment","riskAnalysis","activityContent","activityName","activityType","devicePart","deviceName","hazard","hazardousElementsContent","introducer","subIntroducer","areas","areaType","hazardousElementsSenior","hazardousElementsJunior","scene","riskLevel","controlMeasures","checkItem","riskTypeId","state","orgId","riskModelId","residualRiskModelId","checkFrequency","markup");
                            if(_this.isCreated){
                                if(!_this.selectedCheckItem || !_this.selectedCheckItem.length>0){
                                    resultModel.checkItem = null;
                                }
                            } else{
                            }
                            // var resultModel = _.pick(_this.mainModel.vo,"id","scene","riskLevel","controlMeasures","checkItem","riskTypeId","hazardFactorId","orgId","riskModelId","riskModelId","checkFrequency","positionId","controlHierarchy","markup");
                            api.update(_.extend(resultModel,{riskModel:JSON.stringify(_this.riskModel)},{residualRiskModel:JSON.stringify(_this.residualRiskModel)})).then(function(res){
                                // _this.$dispatch("ev_dtUpdate", dataModel.mainModel.vo);

                                _this.$emit("do-save",resultModel,'update');
                                LIB.Msg.info("修改成功");
                            });
                        }
                    }else{
                        return false;
                    }
                });
            },
            doCreate:function(){
                var _this = this;
                this.isCreated=false;
                _.each(_this.rules,function(value,name){
                    if(name == 'checkItem.name'){
                        value.push( { required: true, message: '请输入检查项内容'})
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
            convertPicPath:LIB.convertPicPath
        },
        events : {
            //edit框数据加载
        }
    };
    return detail;
});