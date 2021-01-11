define(function (require) {
    var LIB = require('lib');
    var api = require("./vuex/api");
    //右侧滑出详细页
    var tpl = require("text!./detail.html");
    var filterComponent = require("./dialog/filter-component");

    //初始化数据模型
    var newVO = function () {
        return {
            //
            id: null,
            //编码
            code: null,
            //仅限本部门员工
            attr1: null,
            //允许修改下一环节操作人
            attr2: null,
            //流程阶段名称
            name: null,
            //公司id
            compId: null,
            //部门id
            orgId: null,
            //禁用标识
            disable: null,
            //流程阶段id
            value: null,
            //处理时限
            deadlineDay: 0,
            //处理时限单位 1:天,2:小时
            deadlineUnit:'1',
            //修改时间
            modifyDate: null,
            //创建时间
            createDate: null,
            //工作流程
            activitiModeler: {id: '', name: ''}
        }
    };
    //Vue数据
    var dataModel = {
        mainModel: {
            vo: newVO(),
            //仅限本部门员工
            dataLimit: null,
            //允许修改下一环节操作人
            enableUpdate: null,
            opType: 'view',
            isReadOnly: true,
            title: "",
            //验证规则
            rules: {
                //"code":[LIB.formRuleMgr.require("编码")]
                "code": [LIB.formRuleMgr.length()],
                "name": [LIB.formRuleMgr.require("名称"),
                    LIB.formRuleMgr.length()],
                "activitiModeler.id": [LIB.formRuleMgr.require("所属流程"),
                    LIB.formRuleMgr.length()],
                "value": [LIB.formRuleMgr.require("阶段值"),
                    LIB.formRuleMgr.length()],
                "disable": [LIB.formRuleMgr.length()],
                "deadlineDay": [
                    {
                        validator: function (rule, value, callback) {
                            var error = [];
                            if(_.isEmpty(value)) {
                                dataModel.mainModel.vo.deadlineDay = 0;
                            }
                            else if(value < 0) {
                                error.push("处理时限不能小于0");
                            }else if (value.indexOf('.') > -1) {
                                error.push("请输入整数");
                            }
                            else if (dataModel.mainModel.vo.deadlineUnit == 1 && value > 3650) {
                                error.push("处理时限不能超过3650天");
                            }
                            else if (dataModel.mainModel.vo.deadlineUnit == 2 && value > 87600) {
                                error.push("处理时限不能超过87600小时");
                            }
                            callback(error);
                        }
                    }
                ],
                "deadlineUnit":[{required: true, message: '请选择处理时限单位'}],
            },
            emptyRules: {}
        },
        personDataFilter: {compId: null},
        unitList:[{value:"1",name:"天"},{value:"2",name:"小时"}],
    };
    //Vue组件
    /**
     *  请统一使用以下顺序配置Vue参数，方便codeview
     *    el
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
    var detail = LIB.Vue.extend({
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.detailPanel],
        template: tpl,
        components: {
            'filter-component': filterComponent
        },
        data: function () {
            return dataModel;
        },
        computed: {
            //personDataFilter: function () {
            //    return {compId: this.mainModel.vo.compId};
            //}
        },
        methods: {
            newVO: newVO,
            beforeInit: function () {
                this.mainModel.dataLimit = false;
                this.mainModel.enableUpdate = false;
                this.isProcessRoleCrossComp = false;
            },
            afterInitData: function () {
                this.mainModel.dataLimit = (this.mainModel.vo.attr1 === "1");
                this.mainModel.enableUpdate = (this.mainModel.vo.attr2 === "1");
            },
            beforeDoSave: function () {
                this.mainModel.vo.attr1 = (this.mainModel.dataLimit ? "1" : "0");
                this.mainModel.vo.attr2 = (this.mainModel.enableUpdate ? "1" : "0");
            },
            afterInit: function () {
                var _this = this;
                if(this.mainModel.opType === 'create') {
                    this.mainModel.vo.activitiModeler = {
                        id: this.$route.query.id,
                        name: this.$route.query.name
                    };
                    this.mainModel.vo.compId = this.$route.query.compId;
                }
                this.personDataFilter = {compId: this.$route.query.compId};
                api.checkIsProcessRoleCrossComp().then(function(res){
                    if(res.data && res.data.result == '2') {
                        _this.personDataFilter = {doOrgLimit:false};
                    }
                });
            }
        },
        ready: function () {
            this.$api = api;
        }
    });

    return detail;
});