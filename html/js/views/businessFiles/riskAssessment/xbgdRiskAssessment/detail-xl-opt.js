define(function(require){
    var LIB = require('lib');
    var api = require("./vuex/api");
    // //右侧滑出详细页
    // var tpl = require("text!./detail-xl.html");
    // var risktypeSelectModal = require("componentsEx/selectTableModal/risktypeSelectModal");
    // var checkMethodSelectModal = require("componentsEx/selectTableModal/checkMethodSelectModal");
    // var accidentCaseSelectModal = require("componentsEx/selectTableModal/accidentCaseSelectModal");
    // var checkBasisSelectModal = require("componentsEx/selectTableModal/checkBasisSelectModal");
    // var riskModel = require("views/businessFiles/riskAssessment/evaluationModel/dialog/riskModel");
    // //初始化数据模型
    // var newVO = function() {
    //     return {
    //         //ID
    //         id : null,
    //         //
    //         code : null,
    //         //
    //         compId : null,
    //         //组织id
    //         orgId : null,
    //         //检查频次
    //         checkFrequency : null,
    //         //管控层级
    //         controlHierarchy : null,
    //         //控制措施
    //         controlMeasures : null,
    //         //是否禁用，0启用，1禁用
    //         disable : null,
    //         //'危害辨识来源标识 0 隐患回转 1 自建记录
    //         markup : null,
    //         //风险等级
    //         riskLevel : null,
    //         //风险等级模型
    //         riskTypeId:null,
    //         riskModelId:null,
    //         residualRiskModelId:null,
    //         residualRiskEvaluationRank:null,//残余风险评估-风险等级
    //         //场景
    //         scene : null,
    //         //状态（0已评估，1未评估,2未通过）
    //         state : null,
    //         //修改日期
    //         modifyDate : null,
    //         //创建日期
    //         createDate : null,
    //         //危害分类
    //         riskType : {id:'', name:''},
    //         //检查项
    //         checkItem : {id:'', name:'',type:''},
    //         introducer:null,//引导词
    //         subIntroducer:null,//分类引导词
    //         areas:null,//部门区域
    //         areaType:null,//地域类型
    //         hazardousElementsSenior:null,//大分类
    //         hazardousElementsJunior:null,//小分类
    //         hazard:null,//危险源
    //         hazardousElementsContent:null,//危害因素-内容
    //         deviceName:null,//设备设施-名称
    //         devicePart:null,//部件
    //         activityType:null,//分类
    //         activityName:null,//活动（操作/作业/任务）-名称
    //         activityContent:null,//活动（操作/作业/任务）-内容
    //         riskAnalysis:null,//风险分析
    //         preventionDepartment:null,//责任部门
    //         preventionPerson:null,//责任人
    //         emergencyPlan:null,
    //         emergencyPlanYes:true,
    //         emergencyPlanNo:null,
    //
    //     }
    // };
    // //Vue数据
    // var dataModel = {
    //     mainModel : {
    //         vo : newVO(),
    //         opType : 'view',
    //         isReadOnly : true,
    //         title:"",
    //         showRisktypeSelectModal : false,
    //         showCheckMethodSelectModal:false,
    //         showAccidentCaseSelectModal:false,
    //         showCheckBasisSelectModal:false,
    //         typeList:[{id:"0",name:"行为类"},{id:"1",name:"状态类"},{id:"2",name:"管理类"}],
    //         //验证规则
    //         rules:{
    //             //"code":[LIB.formRuleMgr.require("编码")]
    //             "code" : [LIB.formRuleMgr.require(""),
    //                 LIB.formRuleMgr.length()
    //             ],
    //             "checkFrequency" : [LIB.formRuleMgr.length()],
    //             "controlHierarchy" : [LIB.formRuleMgr.length()],
    //             "controlMeasures" : [LIB.formRuleMgr.length()],
    //             "disable" : [LIB.formRuleMgr.length()],
    //             "markup" : [LIB.formRuleMgr.length()],
    //             "riskLevel" : [LIB.formRuleMgr.length()],
    //             "riskModel" : [LIB.formRuleMgr.length()],
    //             "scene" : [LIB.formRuleMgr.length()],
    //             "state" : [LIB.formRuleMgr.length()],
    //             "modifyDate" : [LIB.formRuleMgr.length()],
    //             "createDate" : [LIB.formRuleMgr.length()],
    //         },
    //         emptyRules:{}
    //     },
    //     tableModel : {
    //         checkMethodTableModel : {
    //             url : "checkitem/checkmethods/list/{curPage}/{pageSize}",
    //             columns : [{
    //                 title : "编码",
    //                 fieldName : "code"
    //             },{
    //                 title : "名称",
    //                 fieldName : "name",
    //             },{
    //                 title : "",
    //                 fieldType : "tool",
    //                 toolType : "del"
    //             }]
    //         },
    //         checkBasisTableModel:{
    //             url : "checkitem/checkbases/list/{curPage}/{pageSize}",
    //             columns :[
    //                 {
    //                     title:"法律法规",
    //                     fieldName:"name"
    //                 },
    //                 {
    //                     title:"章节条款",
    //                     fieldType:"custom",
    //                     render: function(data){
    //                         if(data.checkBasisType){
    //                             return data.checkBasisType.name;
    //                         }
    //
    //                     }
    //                 },
    //                 {
    //                     title:"内容",
    //                     fieldName:"content",
    //                 },
    //                 {
    //                     title:"",
    //                     fieldType:"tool",
    //                     toolType:"del"
    //                 }
    //             ],
    //         },
    //         checkAccidentcaseTableModel:{
    //             url : "checkitem/accidentcases/list/{curPage}/{pageSize}",
    //         }
    //     },
    //     cardModel : {
    //         checkMethodCardModel : {
    //             showContent : true
    //         },
    //     },
    //     cardMode2 : {
    //         checkMethodCardModel : {
    //             showContent : true
    //         },
    //     },
    //     cardMode3 : {
    //         checkMethodCardModel : {
    //             showContent : true
    //         },
    //     },
    //     formModel : {
    //     },
    //     riskTypeList:null,
    //     selectedDatas:[],
    //     riskModel : {
    //         id:null,
    //         opts:[],
    //         result:null
    //     },
    //
    // };
    //Vue组件
    /**
     *  请统一使用以下顺序配置Vue参数，方便codeview
     *	el
     template
     components
     componentName
     props
     data
     computed
     watch
     methods
     events
     vue组件声明周期方法
     created/beforeCompile/compiled/ready/attached/detached/beforeDestroy/destroyed
     **/
    var detail = {
        // mixins : [LIB.VueMixin.dataDic,LIB.VueMixin.auth,LIB.VueMixin.detailPanel],
        // template: tpl,
        // components : {
        //     "risktypeSelectModal":risktypeSelectModal,
        //     "checkmethodSelectModal":checkMethodSelectModal,
        //     "accidentCaseSelectModal":accidentCaseSelectModal,
        //     "checkBasisSelectModal":checkBasisSelectModal,
        //     "riskModel":riskModel
        //
        // },
        // data:function(){
        //     return dataModel;
        // },
        methods:{
            // newVO : newVO,
            doSaveCheckItem : function(selectedDatas) {
                if (selectedDatas) {
                    this.mainModel.vo.checkItem = selectedDatas[0];
                }
            },
            doSaveRiskType : function(selectedDatas) {
                if (selectedDatas) {
                    this.mainModel.vo.riskType = selectedDatas[0];
                }
            },
            doSaveCheckMethods : function(selectedDatas) {
                if (selectedDatas) {
                    this.mainModel.vo.checkMethods = selectedDatas;
                    var _this = this;
                    api.saveCheckMethods({id : this.mainModel.vo.checkItem.id}, selectedDatas).then(function() {
                        _this.$refs.checkmethodTable.doQuery({id : _this.mainModel.vo.checkItem.id});
                    });
                }
            },
            doSaveCheckBasis:function(selectedDatas){
                if (selectedDatas) {
                    this.mainModel.vo.checkBasiss = selectedDatas;
                    var _this = this;
                    api.saveCheckBasis({id : this.mainModel.vo.checkItem.id}, selectedDatas).then(function() {
                        _this.$refs.checkbasisTable.doQuery({id : _this.mainModel.vo.checkItem.id});
                    });
                }
            },
            doSaveLegalRegulations: function (selectedDatas) {
                if (selectedDatas) {
                    var param = _.map(selectedDatas, function(data){return {id: data.id}});
                    var _this = this;
                    api.saveLegalregulations({id: this.mainModel.vo.checkItem.id}, param).then(function () {
                        _this.$refs.checkbasisTable.doQuery({id : _this.mainModel.vo.checkItem.id});
                    });
                }
            },

            delCheckBasis: function (item) {
                var _this = this;
                var data = item.entry.data;
                LIB.Modal.confirm({
                    title: '确定删除数据?',
                    onOk: function() {
                        api.removeLegalregulation({id: _this.mainModel.vo.checkItem.id}, [{id: data.id}]).then(function (res2) {
                            _this.$refs.checkbasisTable.doRefresh();
                        });
                    }
                });
            },

            doSaveAccident:function(selectedDatas){
                if (selectedDatas) {
                    this.mainModel.vo.accidentCases = selectedDatas;
                    var _this = this;
                    api.saveAccident({id : this.mainModel.vo.checkItem.id}, selectedDatas).then(function() {
                        _this.$refs.checkaccidentcaseTable.doQuery({id : _this.mainModel.vo.checkItem.id});
                    });
                }
            },
            doRemoveCheckMethods : function(item) {
                var _this = this;
                var data = item.entry.data;
                api.removeCheckMethods({id : this.mainModel.vo.checkItem.id}, [{id : data.id}]).then(function() {
                    _this.$refs.checkmethodTable.doRefresh();
                });
            },
            afterInitData : function() {
                var _this = this;
                if(this.mainModel.vo.checkItem.id){
                    this.$refs.checkmethodTable.doQuery({id : this.mainModel.vo.checkItem.id});
                    this.$refs.checkbasisTable.doQuery({id : this.mainModel.vo.checkItem.id});
                    this.$refs.checkaccidentcaseTable.doQuery({id : this.mainModel.vo.checkItem.id});
                }
                api.listTableType().then(function(res){
                    _this.riskTypeList = res.data;
                });
            },
            beforeInit : function() {
                this.$refs.checkmethodTable.doClearData();
                this.$refs.checkbasisTable.doClearData();
                this.$refs.checkaccidentcaseTable.doClearData();
            },
            delCheckMethod: function(item) {
                var _this = this;
                var data = item.entry.data;
                LIB.Modal.confirm({
                    title: '删除当前数据?',
                    onOk: function() {
                        api.removeCheckMethods({id : _this.mainModel.vo.checkItem.id}, [{id : data.id}]).then(function (res) {
                            _this.$refs.checkmethodTable.doRefresh();
                            LIB.Msg.info("删除成功！");
                        });
                    }
                });

            },
            // delCheckBasis: function(item) {
            //     var _this = this;
            //     var data = item.entry.data;
            //     LIB.Modal.confirm({
            //         title: '删除当前数据?',
            //         onOk: function() {
            //             api.removeCheckBasis({id : _this.mainModel.vo.checkItem.id}, [{id : data.id}]).then(function (res1) {
            //                 LIB.Msg.info("删除成功！");
            //                 _this.$refs.checkbasisTable.doRefresh();
            //             });
            //         }
            //     });
            //
            // },
            delAccidentCase: function(item) {
                var _this = this;
                var data = item.entry.data;
                LIB.Modal.confirm({
                    title: '删除当前数据?',
                    onOk: function() {
                        api.removeAccidentCase({id : _this.mainModel.vo.checkItem.id}, [{id : data.id}]).then(function (res2) {
                            LIB.Msg.info("删除成功！");
                            _this.$refs.checkaccidentcaseTable.doRefresh();
                        });
                    }
                });

            },
            doEdit :function(){
                var _this = this;
                _this.$emit("do-show-edit-modal",_this.mainModel.vo.id);
                // this.findAuth({pojoName: "riskAssessment", commandType: 0, orgId:row.orgId}, function () {
                //     this.editModel.show = true;
                //     this.editModel.title = "修改";
                //     this.editModel.type = "update";
                //     this.editModel.id = this.mainModel.vo.id;
                //     this.$broadcast('ev_editReload', this.mainModel.vo.id);
                // })
            },
            // doSaveRiskAssessment : function(obj) {
            //     // this.mainModel.vo
            //     var _this = this;
            //     // _this.mainModel.vo.scene = obj.scene;
            //     // _this.mainModel.vo.riskLevel = obj.riskLevel;
            //     // _this.mainModel.vo.controlMeasures = obj.controlMeasures;
            //     // _this.mainModel.vo.checkItem.name = obj.checkItem ? obj.checkItem.name : null;
            //     // _this.mainModel.vo.orgId = obj.checkItem.orgId;
            //     // this.doUpdate(obj);
            //     _.extend(_this.mainModel.vo, obj);
            //     _this.$dispatch("ev_dtUpdate");
            //     //orgId
            //     // this.$dispatch("ev_dtUpdate");
            //     // _this.$refs.checkaccidentcaseTable.doRefresh();
            //     this.editModel.show = false;
            // },
        },
        events : {

        },
        ready: function(){
            this.$api = api;

        }
    };

    return detail;
});