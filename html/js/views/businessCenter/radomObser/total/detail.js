define(function (require) {
    var LIB = require('lib');
    var api = require("../vuex/api");
    //右侧滑出详细页
    var tpl = require("text!./detail.html");

    //初始化数据模型
    var newVO = function () {
        return {
            //id
            id: null,
            //
            code: null,
            //内容
            content: null,
            //来源 0:手机检查  1：web录入 2 其他
            checkSource: 1,
            //状态   1:待审核 2:已转隐患 3:被否决
            status: 1,
            //
            compId: null,
            //组织id
            orgId: null,
            //审核时间
            auditDate: null,
            //检查时间
            checkDate: null,
            //关闭时间
            closeDate: null,
            //是否禁用，0启用，1禁用
            disable: null,
            //点赞数
            praises: null,
            //发布者姓名
            publisherName: null,
            //备注
            remarks: null,
            //评论数
            reviews: null,
            //修改日期
            modifyDate: null,
            //创建日期
            createDate: null,
            //受检对象
            checkObj: {id: '', name: '', checkType: ''},
            //检查人
            user: {id: null, name: null},
            dominationAreaId: '',
            dominationArea: {id: '', name: ''},
            //问题类型, 0:行为类, 1:状态类, 2:管理类
            checkItemType:null,
            //整改类型 0-立即整改,1-正常整改
            reformType:null,
            //1.随机观察 2.领导力分享 3.随机观察分享
            type: null,
            //操作类型 1隐患问题-现场整改 2隐患问题-上报属地 3行为事件-分享
            operationType:null,
            checkLevel : null,
            hseType:null,
//            legalRegulationId: null,
//            legalRegulation: {id: '', name: ''}
        }
    };

    //Vue数据
    var dataModel = {
        mainModel: {
            enableCheckLevel: false,
            enableHSEType: false,
            vo: newVO(),
            opType: 'view',
            isReadOnly: true,
            title: "",
            //验证规则
            rules: {
            },
            emptyRules: {}
        },
        tableModel: {},
        formModel: {},
        selectModel: {
        },
        fileModel: {
            pic: {
                cfg: {
                    params: {
                        recordId: null,
                        dataType: 'B1',
                        fileType: 'B',
                    },
                    filters: {
                        max_file_size: '10mb',
                        mime_types: [{title: "files", extensions: "png,jpg,jpeg"}]
                    },
                },
                data: []
            },
            video: {
                cfg: {
                    params: {
                        recordId: null,
                        dataType: 'B2',
                        fileType: 'B',
                    },
                    filters: {
                        max_file_size: '10mb',
                        mime_types: [{title: "video", extensions: "mp4"}]
                    },
                },
                data: []
            },
        },
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
                var id = this.mainModel.vo.id,
                    _vo = this.mainModel.vo;
                var type = this.mainModel.vo.type;
                var reformType = this.mainModel.vo.reformType;
                var operationType = null;
                if(type == 1) {
                    if(reformType == 1) {
                        operationType = "2";
                    }else if(reformType == 0) {
                        operationType = "1";
                    }
                }else if(type == 3) {
                    operationType = "3";
                }
                this.mainModel.vo.operationType = operationType;
            },
        },
        init: function () {
            this.$api = api;
        },
        ready: function () {
            this.mainModel.enableCheckLevel = LIB.getBusinessSetByNamePath('common.enableCheckLevel').result === '2';
            this.mainModel.enableHSEType = LIB.getBusinessSetByNamePath('radomObserSet.enableHSEType').result === '2';
        }
    });

    return detail;
});