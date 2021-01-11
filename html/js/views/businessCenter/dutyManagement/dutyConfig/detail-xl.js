define(function (require) {
    var LIB = require('lib');
    var api = require("./vuex/api");
    //右侧滑出详细页
    var tpl = require("text!./detail-xl.html");

    var processModal = require('./dialog/processmodal')


    //初始化数据模型
    var newVO = function () {
        return {
            //id
            id: null,
            code: null,
            //计划名

            //类型 0执行一次 1重复执行
            // checkType : null,
            //是否禁用，0未发布，1发布
            disable: "0",
            //备注
            remarks: null,
            //创建人id
            type: null,
            name: null,
            source: '1',
            content: JSON.stringify({lines:[],nodes:[]}),
            img: null,
            compId: null,
            //组织id
            orgId: null,
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
                "code": [LIB.formRuleMgr.require(""),
                    LIB.formRuleMgr.length()
                ],
                "name": [LIB.formRuleMgr.require("模板名称"),
                    LIB.formRuleMgr.length(100)
                ],

                "startDate": [LIB.formRuleMgr.require("开始时间"),
                    LIB.formRuleMgr.length(),
                    {
                        validator: function (rule, value, callback) {
                            var currentDate = new Date().Format("yyyy-MM-dd 00:00:00");
                            return value < currentDate ? callback(new Error('开始时间必须大于当前时间')) : callback();
                        }
                    }
                ],
                "compId": [{required: true, message: '请选择所属公司'}, LIB.formRuleMgr.length()],
                "orgId": [{required: true, message: '请选择所属部门'}, LIB.formRuleMgr.length()],
                // "checkType": [LIB.formRuleMgr.require("类型"), LIB.formRuleMgr.length() ],
                "disable": [LIB.formRuleMgr.length()],
                "remarks": [LIB.formRuleMgr.length(500)],
                type: [LIB.formRuleMgr.require("巡检类型")]
            },
            //"0": "未到期", "1": "待执行", "2":"按期执行", "3":"超期执行","4":"未执行"};
            emptyRules: {},
            initialOrgId:null
        },
        processModel:{
            show: false
        }
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
            processModal: processModal
        },
        props: {
            'showInput' :{
                type: Boolean,
                default:false
            }
        },
        data: function () {
            return dataModel;
        },
        computed: {

        },
        watch: {

        },
        methods: {
            newVO: newVO,
            doSaveProcess: function (data, image) {
                // _.extend(this.mainModel.vo, data);
                this.mainModel.vo.content = data.content;
                this.mainModel.vo.img = data.img;
                this.doSave();
            },
            doSetProcess: function () {
                if(!this.mainModel.vo.content) this.mainModel.vo.content = JSON.stringify({lines:[],nodes:[]});
                // this.$refs.processModal.init(this.mainModel.vo);
                var _this = this
                this.processModel.show = true;
                this.$nextTick(function(){
					_this.$refs.processModal.init(_this.mainModel.vo);
				})
            },
            afterInit: function (_pass, obj) {

            },
            afterDoCancel: function () {
            },

        },
        init: function () {
            this.$api = api;
        },
        ready: function () {

        }
    });

    return detail;
});