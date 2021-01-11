define(function(require){
    var LIB = require('lib');
    var api = require("./vuex/api");
    //右侧滑出详细页
    var tpl = require("text!./detail-xl.html");
    var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");
    var exerciseSchemeSelectModal = require("componentsEx/selectTableModal/exerciseSchemeSelectModal");
    var selfEvaluationDetailFormModal = require("componentsEx/formModal/selfEvaluationDetailFormModal");

    //初始化数据模型
    var newVO = function() {
        return {
            id : null,
            //编码
            code : null,
            //状态 0:未提交,1:已提交
            status : null,
            //禁用标识 0:启用,1:禁用
            disable : "0",
            //所属公司id
            compId : null,
            //所属部门id
            orgId : null,
            //提交时间
            submitTime : null,
            //自评人
            user : {id:'', name:''},
            //演练方案
            exerciseScheme : {id:'', code:null, name:''},
            //自评详情
            selfEvaluationDetails : [],
        }
    };
    //Vue数据
    var dataModel = {
        mainModel : {
            vo : newVO(),
            opType : 'view',
            isReadOnly : true,
            title:"",
            selfEvaluationQuestions:null,
            selfEvaluationDetails:null,
            //验证规则
            rules:{
                // "code" : [LIB.formRuleMgr.length(100)],
                // "status" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.require("状态")),
                // "disable" :LIB.formRuleMgr.require("状态"),
                // "compId" : [LIB.formRuleMgr.require("所属公司")],
                // "orgId" : [LIB.formRuleMgr.length(10)],
                // "submitTime" : [LIB.formRuleMgr.allowStrEmpty],
                // "user.id" : [LIB.formRuleMgr.require("自评人")],
                // "exerciseScheme.id" : [LIB.formRuleMgr.require("演练方案")],
                text:[LIB.formRuleMgr.length(2000),LIB.formRuleMgr.require("")],
                checkBox:[{required: true, type:"array", message: '请选择'}],
                radio:[LIB.formRuleMgr.require("")],
                "operators" : [
                    {	required: true,
                        validator: function (rule, value, callback) {
                            var vo = dataModel.mainModel.selfEvaluationQuestions;
                            if (vo.operationType == 2 && _.isEmpty(vo.operators)) {
                                return callback(new Error('请填写作业操作人员'))
                            }else if (vo.operationType == 1 && _.isEmpty(vo.users)) {
                                return callback(new Error('请选择作业操作人员'))
                            }
                            return callback();
                        }
                    }
                ],
            }
        },
        tableModel : {
            selfEvaluationDetailTableModel : LIB.Opts.extendDetailTableOpt({
                url : "selfevaluationtask/selfevaluationdetails/list/{curPage}/{pageSize}",
                columns : [
                    LIB.tableMgr.ksColumn.code,
                    {
                        title : "名称",
                        fieldName : "name",
                        keywordFilterName: "criteria.strValue.keyWordValue_name"
                    },{
                        title : "",
                        fieldType : "tool",
                        toolType : "edit,del"
                    }]
            }),
        },
        formModel : {
            selfEvaluationDetailFormModel : {
                show : false,
                hiddenFields : ["taskId"],
                queryUrl : "selfevaluationtask/{id}/selfevaluationdetail/{selfEvaluationDetailId}"
            },
        },
        selectModel : {
            userSelectModel : {
                visible : false,
                filterData : {orgId : null}
            },
            exerciseSchemeSelectModel : {
                visible : false,
                filterData : {orgId : null}
            },
        },

    };
    //Vue组件
    /**
     *  请统一使用以下顺序配置Vue参数，方便codeview
     *	 el
     template
     components
     componentName
     props
     data
     computed
     watch
     methods
     _XXX    			//内部方法
     doXXX 				//事件响应方法
     beforeInit 		//初始化之前回调
     afterInit			//初始化之后回调
     afterInitData		//请求 查询 接口后回调
     afterInitFileData  //请求 查询文件列表 接口后回调
     beforeDoSave		//请求 新增/更新 接口前回调，返回false时不进行保存操作
     afterFormValidate	//表单rule的校验通过后回调，，返回false时不进行保存操作
     buildSaveData		//请求 新增/更新 接口前回调，重新构造接口的参数
     afterDoSave		//请求 新增/更新 接口后回调
     beforeDoDelete		//请求 删除 接口前回调
     afterDoDelete		//请求 删除 接口后回调
     events
     vue组件声明周期方法
     init/created/beforeCompile/compiled/ready/attached/detached/beforeDestroy/destroyed
     **/
    var detail = LIB.Vue.extend({
        mixins : [LIB.VueMixin.dataDic,LIB.VueMixin.auth,LIB.VueMixin.detailPanel],
        template: tpl,
        components : {
            "userSelectModal":userSelectModal,
            "exerciseschemeSelectModal":exerciseSchemeSelectModal,
            "selfevaluationdetailFormModal":selfEvaluationDetailFormModal,

        },
        data:function(){
            return dataModel;
        },
        methods:{
            newVO : newVO,
            doVeiwScheme: function() {
                var router = LIB.ctxPath("/html/main.html#!");
                var routerPart = "/emer/businessCenter/exerciseScheme?method=detail&id=" + this.mainModel.vo.exerciseScheme.id + "&code=" + this.mainModel.vo.exerciseScheme.code;
                window.open(router + routerPart);
            },
            getTime:function(val){
                if(val){
                    return val.substr(0,16);
                }
                return '';
            },

            getProp:function (item) {
                if(item.type == '3') return "text";
                else if(item.type == '2') return "checkBox";
                else if(item.type == '1') return "radio";

            },
            doShowUserSelectModal : function() {
                this.selectModel.userSelectModel.visible = true;
                //this.selectModel.userSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
            },
            doSaveUser : function(selectedDatas) {
                if (selectedDatas) {
                    this.mainModel.vo.user = selectedDatas[0];
                }
            },
            doShowExerciseSchemeSelectModal : function() {
                this.selectModel.exerciseSchemeSelectModel.visible = true;
                //this.selectModel.exerciseSchemeSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
            },
            doSaveExerciseScheme : function(selectedDatas) {
                if (selectedDatas) {
                    this.mainModel.vo.exerciseScheme = selectedDatas[0];
                }
            },
            doShowSelfEvaluationDetailFormModal4Update : function(param) {
                this.formModel.selfEvaluationDetailFormModel.show = true;
                this.$refs.selfevaluationdetailFormModal.init("update", {id: this.mainModel.vo.id, selfEvaluationDetailId: param.entry.data.id});
            },
            doShowSelfEvaluationDetailFormModal4Create : function(param) {
                this.formModel.selfEvaluationDetailFormModel.show = true;
                this.$refs.selfevaluationdetailFormModal.init("create");
            },
            doSaveSelfEvaluationDetail : function(data) {
                if (data) {
                    var _this = this;
                    this.data.orgId =  LIB.user.orgId;
                    api.saveSelfEvaluationDetail({id : this.mainModel.vo.id}, data).then(function() {
                        _this.refreshTableData(_this.$refs.selfevaluationdetailTable);
                    });
                }
            },
            doUpdateSelfEvaluationDetail : function(data) {
                if (data) {
                    var _this = this;
                    api.updateSelfEvaluationDetail({id : this.mainModel.vo.id}, data).then(function() {
                        _this.refreshTableData(_this.$refs.selfevaluationdetailTable);
                    });
                }
            },
            doRemoveSelfEvaluationDetail : function(item) {
                var _this = this;
                var data = item.entry.data;
                LIB.Modal.confirm({
                    title: '删除当前数据?',
                    onOk: function () {
                        api.removeSelfEvaluationDetails({id : _this.mainModel.vo.id}, [{id : data.id}]).then(function() {
                            _this.$refs.selfevaluationdetailTable.doRefresh();
                        });
                    }
                });
            },
            getBgColor:function (index) {
                  if(!isNaN(index) && parseInt(index)%2==0){
                      return "bgf9"
                  }
                  return "bgff"
            },
            doSubmitDetail:function (val) {

                var _this = this;


                var temp = true;
                _.each(this.mainModel.selfEvaluationQuestions, function (item) {
                    if(_.isEmpty(item.values)){
                        temp = false;
                    }
                });
                if(!temp){
                    LIB.Msg.info("信息未填写完成");
                    return ;
                }

                // {
                //     //自评答案(选择题为选项id，问答题手填)
                //     answer : null,
                //         //自评任务
                //         selfEvaluationTask : {id:''},
                //     //自评问卷问题
                //     selfEvaluationQuestion : {id:''},
                // }

                var params  = {
                    id:this.mainModel.vo.id,
                    orgId:this.mainModel.vo.orgId,
                    selfEvaluationDetails:[]
                };
                _.each(this.mainModel.selfEvaluationQuestions, function (item) {
                    if(item.type == '1' || item.type == '3'){
                        params.selfEvaluationDetails.push({
                            //自评答案(选择题为选项id，问答题手填)
                            answer : item.values,
                            // //自评任务
                            // selfEvaluationTask : {id:_this.mainModel.vo.id},
                            //自评问卷问题
                            selfEvaluationQuestion : {id:item.id},
                        });
                    }else{
                        params.selfEvaluationDetails.push({
                            //自评答案(选择题为选项id，问答题手填)
                            answer : item.values.join(","),
                            // //自评任务
                            // selfEvaluationTask : {id: _this.mainModel.vo.id},
                            //自评问卷问题
                            selfEvaluationQuestion : {id:item.id},
                        });
                    }
                });
                // 0 提交
                if(val == 0){
                    api.submitTask(params).then(function (res) {
                        LIB.Msg.info("提交成功,请到app进行签名确认");
                        _this.afterDoSave({ type: "U" }, res.body);
                        _this.changeView("view");
                        _this.$dispatch("ev_dtUpdate");
                        _this.storeBeforeEditVo();
                        _this.doClose();
                    });
                }else {
                    // 1 保存
                    api.saveTask(params).then(function (res) {
                        LIB.Msg.info("保存成功");
                        _this.afterDoSave({ type: "U" }, res.body);
                        _this.changeView("view");
                        _this.$dispatch("ev_dtUpdate");
                        _this.storeBeforeEditVo();
                    });
                }
            },



            getLabelName:function (item, index) {
                return (index+1 + '、') + item.content
            },
            afterInitData : function() {
                // this.$refs.selfevaluationdetailTable.doQuery({id : this.mainModel.vo.id});
                // 获取值 问题选择答案的值
                this.getSelfEvaluationDetails()
            },

            getSelfEvaluationDetails:function () {
                // 获取值
                var _this = this;
                _.each(this.mainModel.vo.selfEvaluationQuestions,function (item) {
                    if(item.type == "1"){
                        item.values = null;
                    }else if(item.type == '2'){
                        item.values = [];
                    }else{
                        item.values = '';
                    }
                });
                this.mainModel.selfEvaluationQuestions = this.mainModel.vo.selfEvaluationQuestions;
                this.mainModel.selfEvaluationDetails = this.mainModel.vo.selfEvaluationDetails;

                this.mainModel.selfEvaluationQuestions = [].concat(this.mainModel.vo.selfEvaluationQuestions);

                if(this.mainModel.selfEvaluationDetails && this.mainModel.selfEvaluationDetails.length>0){
                    _.each(_this.mainModel.selfEvaluationDetails, function (item) {
                        _.each(_this.mainModel.selfEvaluationQuestions, function (opt) {
                            if(opt.id == item.questionId){
                                if(opt.type == '2'){
                                    opt.values = item.answer.split(",")
                                }else{
                                    opt.values = item.answer;
                                }
                            }
                        });
                    });
                }
            },

            beforeInit : function() {
                // this.$refs.selfevaluationdetailTable.doClearData();
                this.mainModel.selfEvaluationQuestions = null;
                this.mainModel.selfEvaluationDetails = null;
            },
            getTaskDetail:function () {
                api.getTask({id : this.mainModel.vo.id}).then(function (res) {

                });
            },

        },
        events : {
        },
        init: function(){
            this.$api = api;
        }
    });

    return detail;
});