define(function (require) {
    var LIB = require('lib');
    var api = require("./vuex/api");
    //右侧滑出详细页
    var tpl = require("text!./detail.html");
    var dominationAreaSelectModal = require("componentsEx/selectTableModal/dominationAreaSelectModal");
    var riCheckAreaTplSelectModal = require("componentsEx/selectTableModal/riCheckAreaTplSelectModal");

    //初始化数据模型
    var newVO = function () {
        return {
            id: null,
            //编码
            code: null,
            //巡检区域名称
            name: null,
            //禁用标识 0:未禁用,1:已禁用
            disable: '0',
            //所属公司id
            compId: null,
            //所属部门id
            orgId: null,
            //备注
            remarks: null,
            //修改日期
            modifyDate: null,
            //创建日期
            createDate: null,
            //属地
            dominationArea: {id: '', name: ''},
            //巡检区域
            riCheckAreaTpl: {id: '', name: ''}
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
                "code": [LIB.formRuleMgr.length(100)],
                "name": [
                    LIB.formRuleMgr.require("名称"),
                    LIB.formRuleMgr.length(100)
                ],
                "riCheckAreaTpl.id": [
                    LIB.formRuleMgr.require("巡检区域")
                ],
                // "disable": LIB.formRuleMgr.require("状态"),
                "remarks": [
                    LIB.formRuleMgr.length(500)
                ]
            }
        },
        selectModel: {
            dominationAreaSelectModel: {
                visible: false,
                filterData: {orgId: null}
            },
            riCheckAreaTplSelectModel: {
                visible: false,
                filterData: {orgId: null}
            },
        }
    };
    //Vue组件
    /**
     *  请统一使用以下顺序配置Vue参数，方便codeview
     *     el
     template
     components
     componentName
     props
     data
     computed
     watch
     methods
     _XXX                //内部方法
     doXXX                //事件响应方法
     beforeInit        //初始化之前回调
     afterInit            //初始化之后回调
     afterInitData        //请求 查询 接口后回调
     afterInitFileData  //请求 查询文件列表 接口后回调
     beforeDoSave        //请求 新增/更新 接口前回调，返回false时不进行保存操作
     afterFormValidate    //表单rule的校验通过后回调，，返回false时不进行保存操作
     buildSaveData        //请求 新增/更新 接口前回调，重新构造接口的参数
     afterDoSave        //请求 新增/更新 接口后回调
     beforeDoDelete        //请求 删除 接口前回调
     afterDoDelete        //请求 删除 接口后回调
     events
     vue组件声明周期方法
     init/created/beforeCompile/compiled/ready/attached/detached/beforeDestroy/destroyed
     **/
    var detail = LIB.Vue.extend({
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.detailPanel],
        template: tpl,
        components: {
            "dominationareaSelectModal": dominationAreaSelectModal,
            "richeckareatplSelectModal": riCheckAreaTplSelectModal
        },
        data: function () {
            return dataModel;
        },
        methods: {
            newVO: newVO,
            doShowDominationAreaSelectModal: function () {
                this.selectModel.dominationAreaSelectModel.visible = true;
                this.selectModel.dominationAreaSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
            },
            doSaveDominationArea: function (selectedDatas) {
                if (selectedDatas) {
                    this.mainModel.vo.dominationArea = selectedDatas[0];
                }
            },
            doShowRiCheckAreaTplSelectModal: function () {
                this.selectModel.riCheckAreaTplSelectModel.visible = true;
                //if(this.mainModel.opType == "update") {
                //    this.selectModel.riCheckAreaTplSelectModel.filterData = {orgId : this.mainModel.vo.orgId, 'dominationArea.id': this.mainModel.vo.dominationArea.id};
                //}else{
                //    this.selectModel.riCheckAreaTplSelectModel.filterData = {};
                //}
            },
            doSaveRiCheckAreaTpl: function (selectedDatas) {
                if(!_.isArray(selectedDatas) || selectedDatas.length < 1) {
                    return;
                }
                var row = selectedDatas[0];
                var vo = this.mainModel.vo;
                vo.riCheckAreaTpl.id = row.id;
                vo.riCheckAreaTpl.name = row.name;
                vo.compId = row.compId;
                vo.orgId = row.orgId;
                vo.dominationArea.id = row.dominationArea.id;
                vo.dominationArea.name = row.dominationArea.name;
            }
        },
        events: {},
        init: function () {
            this.$api = api;
        }
    });

    return detail;
});