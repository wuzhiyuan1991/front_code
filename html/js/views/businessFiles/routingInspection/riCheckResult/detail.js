define(function (require) {
    var LIB = require('lib');
    var api = require("./vuex/api");
    //右侧滑出详细页
    var tpl = require("text!./detail.html");

    LIB.registerDataDic("iri_check_result_is_right", [
        ["0", "错误"],
        ["1", "正确"]
    ]);

    LIB.registerDataDic("iri_check_result_is_right", [
        ["0", "否"],
        ["1", "是"]
    ]);

    //初始化数据模型
    var newVO = function () {
        return {
            id: null,
            //编码
            code: null,
            //巡检结果名称
            name: null,
            //禁用标识 0:未禁用,1:已禁用
            disable: '1',
            //是否正确 0:错误,1:正确
            isRight: null,
            //是否默认选项 0:否,1:是
            isDefault: '0',
            //序号
            orderNo: null,
            //修改日期
            modifyDate: null,
            //创建日期
            createDate: null,
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
                "code": [LIB.formRuleMgr.length()],
                "name": [
                    LIB.formRuleMgr.require("巡检结果名称"),
                    LIB.formRuleMgr.length(200)
                ],
                "disable": [LIB.formRuleMgr.require("状态")],
                "isRight": [LIB.formRuleMgr.require("是否正确")],
                "isDefault": [LIB.formRuleMgr.require("是否默认选项")],
                // "orderNo": [LIB.formRuleMgr.require("序号")].concat(LIB.formRuleMgr.range(1, 10000))
            }
        },

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
        components: {},
        data: function () {
            return dataModel;
        },
        methods: {
            newVO: newVO,
            afterDoSave: function (obj, data) {
                if(obj.type === "C") {
                    this.initData(data);
                }
            },
            afterInit: function (param, obj) {
                if(obj.opType === 'create') {
                    this.mainModel.vo.isRight = param.isRight;
                }
            }
        },
        events: {},
        init: function () {
            this.$api = api;
        }
    });

    return detail;
});