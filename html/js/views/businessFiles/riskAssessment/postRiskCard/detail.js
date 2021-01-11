define(function (require) {
    var LIB = require('lib');
    var api = require("./vuex/api");
    //右侧滑出详细页
    var tpl = require("text!./detail.html");
    //弹窗选人
    var newVO = function () {
        return {
            //权限ID
            id: null,
            //岗位编码
            code: null,
            //岗位名称
            name: null,
            orgId: null,
            //
            compId: null,
            //是否禁用，0启用，1禁用
            disable: null,
            //是否是领导岗位 0：否  1：是
            isLead: null,
            //排序
            orderNo: null,
            //岗位类型 0普通岗位 1hse岗位
            postType: 0,
            //备注
            remarks: null,
            //修改日期
            modifyDate: null,
            //创建日期
            createDate: null,
            //用户
            users: [],
            disable:"0",
        }
    };

    //Vue数据
    var dataModel = {
        mainModel: {
            vo: newVO(),
            opType: 'view',
            isReadOnly: true,
            title: "",

            //验证规则
            rules: {
                // "code": [LIB.formRuleMgr.require("岗位编码"),
                //     LIB.formRuleMgr.length()
                // ],
                name: [
                    {required: true, message: '请输入岗位名称'},
                    LIB.formRuleMgr.length(20, 1)
                    //{ min: 1, max: 20, message: '长度在 1 到 20 个字符'}
                ],
                compId: [
                    {required: true, message: '请选择所属公司'},
                ],
                orgId: [{required: true, message: '请选择所属部门'}]
            }
//	        emptyRules:{}
        },
        tableModel: {
            riskCardTableModel: {
                url: "riskcard/position/{positionId}/list/{curPage}/{pageSize}",
                columns: [
                    {
                        title: "风险点",
                        fieldName: "riskPoint",
                        fieldType: "custom",
                        // keywordFilterName: "criteria.strValue.keyWordValue_mobile",
                        render: function (data) {
                            var positionName = dataModel.mainModel.vo.name;
                            return "<a target='_blank' href='/html/main.html#!/riskAssessment/businessFiles/riskcard?method=check&riskPoint="+data.riskPoint+"&positionName="+positionName+"'>" + data.riskPoint+"</ a>";
                        }
                    },
                    {
                        title: "风险等级",
                        fieldName: "riskLevel",
                        fieldType: "custom",
                        showTip: false,
                        render: function (data) {
                            var resultColor = _.propertyOf(JSON.parse(data.riskModel))("resultColor");
                            if (resultColor) {
                                return "<span style='background:\#" + resultColor + ";color:\#" + resultColor + ";margin-right: 5px;padding-right: 13px;border-radius: 3px;'></span>" + data.riskLevel;
                            } else {
                                return "<span style='background:#F5F5F5;color:#F5F5F5;opacity: 1;margin-right: 5px;padding-right: 13px;'></span>" + data.riskLevel;
                            }
                        },
                    }
                ]
            }
        },
        formModel: {},
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
        },
        data: function () {
            return dataModel;
        },
        methods: {
            newVO: newVO,
            afterInitData: function () {
                this.$refs.riskCardTable.doQuery({positionId: this.mainModel.vo.id});
            },
            beforeInit: function () {
                this.$refs.riskCardTable.doClearData();
            },
        },
        events: {
        },
        init: function () {
            this.$api = api;
        }
    });

    return detail;
});