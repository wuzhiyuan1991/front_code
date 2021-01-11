define(function (require) {
    var LIB = require('lib');
    var api = require("./vuex/api");
    var Vue = require("vue");
    //右侧滑出详细页
    var tpl = require("text!./detail-xl.html");
    //查看不合格检查项弹框页面
    var viewDetailComponent = require("./dialog/viewDetail");
    //编辑检查结果弹框
    var viewEditComponent = require("./dialog/editCheckResult");
    var picDetail = require("./dialog/picDetail");

    var defaltEnvConfig = '{"error":"0","content":{"id":"f13tevk45x","createDate":"2018-05-17 09:12:58","createBy":"f13tdueto6","modifyBy":"9999999999","modifyDate":"2018-11-06 20:46:18","deleteFlag":"0","attr1":"checkResult","orgId":"f13tafbx19","compId":"f13tafbx19","code":"F13TEVK45Y","name":"checkResult","isDefault":"1","description":"检查记录","children":[{"id":"f13tevkeyw","createDate":"2018-05-17 09:12:58","createBy":"f13tdueto6","modifyBy":"9999999999","modifyDate":"2018-11-06 20:46:18","deleteFlag":"0","attr1":"checkResult.notRefer","orgId":"f13tafbx19","compId":"f13tafbx19","code":"F13TEVKEYX","name":"notRefer","parentId":"f13tevk45x","result":"3","isDefault":"1","description":"不涉及","children":[]},{"id":"f13tevkhab","createDate":"2018-05-17 09:12:58","createBy":"f13tdueto6","modifyBy":"9999999999","modifyDate":"2018-11-06 20:46:18","deleteFlag":"0","attr1":"checkResult.legal","orgId":"f13tafbx19","compId":"f13tafbx19","code":"F13TEVKHAC","name":"legal","parentId":"f13tevk45x","result":"3","isDefault":"1","unmodified":"1","description":"合格","children":[{"id":"f13tevkjlq","createDate":"2018-05-17 09:12:58","createBy":"f13tdueto6","modifyBy":"9999999999","modifyDate":"2018-11-06 20:46:18","deleteFlag":"0","attr1":"checkResult.legal.description","orgId":"f13tafbx19","compId":"f13tafbx19","code":"F13TEVKJLR","name":"description","parentId":"f13tevkhab","result":"1","isDefault":"1","description":"文字描述","children":[]},{"id":"f13tevkl5d","createDate":"2018-05-17 09:12:58","createBy":"f13tdueto6","modifyBy":"9999999999","modifyDate":"2018-11-06 20:46:18","deleteFlag":"0","attr1":"checkResult.legal.photoForce","orgId":"f13tafbx19","compId":"f13tafbx19","code":"F13TEVKLX6","name":"photoForce","parentId":"f13tevkhab","result":"1","isDefault":"1","description":"拍照","children":[]},{"id":"f13tevkmp0","createDate":"2018-05-17 09:12:58","createBy":"f13tdueto6","modifyBy":"9999999999","modifyDate":"2018-11-06 20:46:18","deleteFlag":"0","attr1":"checkResult.legal.videoForce","orgId":"f13tafbx19","compId":"f13tafbx19","code":"F13TEVKMP1","name":"videoForce","parentId":"f13tevkhab","result":"1","isDefault":"1","description":"视频","children":[]}]},{"id":"f13tevko8m","createDate":"2018-05-17 09:12:58","createBy":"f13tdueto6","modifyBy":"9999999999","modifyDate":"2018-11-06 20:46:18","deleteFlag":"0","attr1":"checkResult.illegal","orgId":"f13tafbx19","compId":"f13tafbx19","code":"F13TEVKO8N","name":"illegal","parentId":"f13tevk45x","result":"3","isDefault":"1","unmodified":"1","description":"不合格","children":[{"id":"f13tevkp0g","createDate":"2018-05-17 09:12:58","createBy":"f13tdueto6","modifyBy":"9999999999","modifyDate":"2018-11-06 20:46:18","deleteFlag":"0","attr1":"checkResult.illegal.description","orgId":"f13tafbx19","compId":"f13tafbx19","code":"F13TEVKPS9","name":"description","parentId":"f13tevko8m","result":"3","isDefault":"1","unmodified":"1","description":"文字描述","children":[]},{"id":"f13tevkqk2","createDate":"2018-05-17 09:12:58","createBy":"f13tdueto6","modifyBy":"9999999999","modifyDate":"2018-11-06 20:46:18","deleteFlag":"0","attr1":"checkResult.illegal.photoForce","orgId":"f13tafbx19","compId":"f13tafbx19","code":"F13TEVKQK3","name":"photoForce","parentId":"f13tevko8m","result":"1","isDefault":"1","description":"拍照","children":[]},{"id":"f13tevks3o","createDate":"2018-05-17 09:12:58","createBy":"f13tdueto6","modifyBy":"9999999999","modifyDate":"2018-11-06 20:46:18","deleteFlag":"0","attr1":"checkResult.illegal.videoForce","orgId":"f13tafbx19","compId":"f13tafbx19","code":"F13TEVKS3P","name":"videoForce","parentId":"f13tevko8m","result":"1","isDefault":"1","description":"视频","children":[]}]}]}}';
    var defaltCheckTaskConfig = '{"error":"0","content":{"id":"exnm3wz0gi","createDate":"2018-01-24 17:35:22","createBy":"evdrnjo55p","modifyBy":"9999999999","modifyDate":"2018-05-18 09:56:17","deleteFlag":"0","attr1":"checkTaskSet.isLateCheckAllowed","orgId":"evdyayfoks","compId":"9999999999","code":"EXNM3WZ0GJ","name":"isLateCheckAllowed","parentId":"exnm3wyyww","result":"2","isDefault":"1","description":"检查任务过期可补做"}}';
    var getNowDateStr = function () {
        return new Date().Format("yyyy-MM-dd hh:mm:ss");
    };
    //初始化数据模型
    var newVO = function () {
        return {
            id: null,
            orgId: null,
            compId: null,
            checkDate: null,
            checkSource: null,
            checkResultDetail: null,
            checkResult: "1",
            checkerId: null,
            checkObjectId: null,
            checkTableId: null,
            checkPlanId: null,
            checkUser: {name: null},
            checkPlan: {
                name: null,
                compId: '',
                orgId: ''
            },
            behaviorCommList: [],
            detailList: [],
            type: '1',
            checkTaskId: null,
            //检查任务
            checkTask: {id: '', name: '',startDate:'',endDate:'', status: ''},
            startDate: null,
            endDate: null,
            checkBeginDate: null,
            checkEndDate: null,
            code: null,
            checkObj: {},
            groupName: '',
            num: ''
        }
    };
    //Vue数据
    var dataModel = {
        defaltEnvConfig:defaltEnvConfig,
        defaltCheckTaskConfig:defaltCheckTaskConfig,
        mainModel: {
            vo: newVO(),
            opType: '',
            // checkItemIds: [],
            typeList: [{id: '0', name: "非计划检查"}, {id: '1', name: "计划检查"}],
            isReadOnly: true//是否只读
        },

        itemColumns: [
            {
                title: "工作内容",
                fieldName: "name"
            },
            {
                title: "结果",
                fieldType: "custom",
                width: 100,
                render: function (data) {
                    if (data.checkResult === '1') {
                        return '<a style="color:#33a6ff;">合格</a>';
                    } else if (data.checkResult === '0') {
                        return '<a style="color:#f00;">不合格</a>';
                    } else if (data.checkResult === '2') {
                        return '<span style="color:#cecece;">不涉及</span>';
                    } else {
                        return '<a style="color:red;">选择</a>';
                    }
                },
                tipRender: function (data) {
                    if (data.checkResult === '1') {
                        return "合格";
                    } else if (data.checkResult === '0') {
                        return "不合格";
                    } else if (data.checkResult === '2') {
                        return "不涉及";
                    } else {
                        return "选择";
                    }
                }
            }
        ],
        viewDetailModel: {
            //控制编辑组件显示
            title: "详情",
            //显示编辑弹框
            show: false,
            id: null
        },
        viewDetailModel1: {
            //控制编辑组件显示
            title: "详情",
            //显示编辑弹框
            show: false,
            id: null
        },
        detailModel: {
            //控制编辑组件显示
            title: "新增",
            //显示编辑弹框
            show: true,
            //编辑模式操作类型
            type: "create",
            id: null
        },
        //控制检查表
        showModal: false,
        opType: null,
        //验证规则
        rules: {
            "checkUser.username": [{required: true, message: '请选择检查人名称'}],
            "checkTable.name": [{required: true, message: '请选择检查表'}],
            'checkDate': [{required: true, message: '请选择检查时间'}],
            "checkObject.name": [{required: true, message: '请选择受检对象'}],
            "orgId": [{required: true, message: '请选择所属部门'}],
            "compId": [{required: true, message: '请选择所属公司'}],
            "checkTask.name": [{required: true, message: '请选择检查任务'}]
        },
        emptyRules: {},
        //选择计划类型的时候 禁用公司部门
        isDisabled: false,
        envConfig: {},
        checkObjModel: {
            index: 0,
            checkObjects: [],
            firstIndex: 0,
            items: []
        },
        picDetailModel: {
			show: false,
			title:"现场"
		},
        items:null
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
            "viewdetailcomponent": viewDetailComponent,
            "viewEditComponent": viewEditComponent,
            "picdetail": picDetail
        },
        computed: {},
        data: function () {
            return dataModel;
        },
        methods: {
            newVO: newVO,
            convertPicPath: LIB.convertPicPath,

            /**
             * 判断检查项是否有必填项
             * 不合格： 必有必填项
             * 不涉及： 没有必填项
             * 合格： 可能有必填项
             * => 只判断合格的情况
             * @param checkItemId 检查项id
             * @return {Boolean} 是否有必填项
             */
            isCheckItemHasRequired: function (checkItemId) {
                var legals = this.envConfig.legal.children,
                    result = false;

                for(var i = 0, item; item = legals[i++];) {
                    if(item.result === '3') {
                        result = true;
                        break;
                    }
                    if(item.result === '2' && _.includes(_.pluck(item.systemBusinessSetDetails, 'result'), checkItemId)) {
                        result = true;
                        break;
                    }
                }

                return result;
            },
            // 查看检查项结果详情
            doViewDetail: function (obj) {
                var _vo = obj.entry.data;
                this.viewDetailModel.show = true;
                this.viewDetailModel.title = "工作内容";
                this.viewDetailModel.id = null;
                this.$broadcast('ev_viewDetailReload', _vo);
            },
            displayInspectTask: function () {
                var data = this.mainModel.vo;
                var str = '';
                if(data.checkPlan && data.checkPlan.name) {
                    str += data.checkPlan.name;
                }
                if (data.checkTask && data.checkTask.num) {
                    str += "#";
                    str += data.checkTask.num
                }
                return str;
            },
            afterInitData: function () {
                this._getCheckDetails();
            },
            _getCheckDetails: function () {
                var _this = this;
                this.checkObjModel.index = -1;
                api.getDoneCheckTable({checkTaskId: this.mainModel.vo.checkTaskId}).then(function (res) {
                    _this.items = _.get(res.data, "checkRecordDetailVoList");
                })
            }
        },
        events: {
            //detail框点击关闭后事件处理
            "ev_viewDetailClose": function () {
                this.viewDetailModel.show = false;
            }
        },
        init: function () {
            this.$api = api;
        },
        ready: function () {
        }
    });
    return detail;
});