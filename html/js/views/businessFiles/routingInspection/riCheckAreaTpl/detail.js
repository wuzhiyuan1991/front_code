define(function (require) {
    var LIB = require('lib');
    var api = require("./vuex/api");
    //右侧滑出详细页
    var tpl = require("text!./detail.html");
    var dominationAreaSelectModal = require("componentsEx/selectTableModal/dominationAreaSelectModal");
    LIB.registerDataDic("rfid_is_bind", [
        ["0", "未绑定"],
        ["1", "已绑定"]
    ]);
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
            riCheckAreaTplRfid: {id: null, code: null, name:'', isBind: '0'},
        }
    };


    //Vue数据
    var dataModel = {
        mainModel: {
            vo: newVO(),
            opType: 'view',
            isReadOnly: true,
            isRFIDReadOnly: true,
            title: "",
            //验证规则
            rules: {
                "code": [LIB.formRuleMgr.length()],
                "name": [
                    LIB.formRuleMgr.require("名称"),
                    LIB.formRuleMgr.length(100)
                ],
                "compId": [
                    LIB.formRuleMgr.require("所属公司")
                ],
                "orgId": [
                    LIB.formRuleMgr.require("所属部门")
                ],
                "dominationArea.id": [
                    LIB.formRuleMgr.require("属地")
                ],
                // "disable": LIB.formRuleMgr.require("状态"),
                "remarks": [
                    LIB.formRuleMgr.length(500)
                ],
                //"riCheckAreaTplRfid.name":[
                //    {
                //        validator: function (rule, value, callback) {
                //            if (value) {
                //                if (value.length != 12) {
                //                    return callback(new Error("RFID标签长度应为12位"))
                //                } else {
                //                    return callback();
                //                }
                //            }
                //            return callback();
                //        }
                //    },
                //]
            }
        },
        tableModel: {
            pointTable : LIB.Opts.extendDetailTableOpt({
                url : "richeckpointtpl/list/{curPage}/{pageSize}?type=1",
                columns : [
                    {
                        title: "序号",
                        fieldType: "sequence",
                        width: 70,
                    },
                    {
                        //巡检区域名称
                        title: "巡检点名称",
                        fieldName: "name",
                        width: 400
                    },
                    // LIB.tableMgr.column.company,
                    // LIB.tableMgr.column.dept,
                    // {
                    //     title: "属地",
                    //     fieldName: "dominationArea.name",
                    //     filterType: "text",
                    //     width: 200
                    // },
                    // {
                    //     title: "所属巡检区域",
                    //     fieldName: "riCheckAreaTpl.name",
                    //     width: 200
                    // },
                    {
                        title: '状态',
                        width: 80,
                        fieldName: "disable",
                        filterName: "criteria.intsValue.disable",
                        render: function (data) {
                            var text = LIB.getDataDic("disable", data.disable);
                            if(data.disable === '0') {
                                return '<i class="ivu-icon ivu-icon-checkmark-round" style="font-weight: bold;color: #aacd03;margin-right: 5px;"></i>' + text
                            } else {
                                return '<i class="ivu-icon ivu-icon-close-round" style="font-weight: bold;color: #f03;margin-right: 5px;"></i>' + text
                            }
                        },
                        width:90
                    },
                    // {
                    //     //备注
                    //     title: "备注",
                    //     fieldName: "remarks",
                    // }, //riCheckAreaTpl.id
                ]
            }),

        },
        formModel: {},
        selectModel: {
            dominationAreaSelectModel: {
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
        },
        computed: {
            showCancelBtn: function () {
                return (!this.mainModel.isReadOnly && this.isEditStatus) || !this.mainModel.isRFIDReadOnly;
            },
            isSuperAdmin: function () {
                return LIB.user.id === '9999999999';
            },
            rfidIsBindText: function () {
                var isBind = this.mainModel.vo.riCheckAreaTplRfid.isBind || 0;
                return this.getDataDic('rfid_is_bind', isBind)
            }
        },
        data: function () {
            return dataModel;
        },
        methods: {
            newVO: newVO,
            doShowDominationAreaSelectModal: function () {
                this.selectModel.dominationAreaSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
                this.selectModel.dominationAreaSelectModel.visible = true;
            },
            doSaveDominationArea: function (selectedDatas) {
                if (selectedDatas) {
                    this.mainModel.vo.dominationArea = selectedDatas[0];
                }
            },
            doUpdateRFID: function () {
                this.mainModel.isRFIDReadOnly = false;
                this.mainModel.opType = "update";
                this.mainModel.isReadOnly = false;
                this.changeView("update");
                this.storeBeforeEditVo();
                this.afterDoEdit && this.afterDoEdit();
            },
            doUnbind: function() {
                var _this = this;
                var ids = [this.mainModel.vo.id];
                LIB.Modal.confirm({
                    title: '确定解绑电子标签?',
                    onOk: function () {
                        api.unbind(null, ids).then(function (res) {
                            if(res.data && res.data > 0) {
                                _.extend(_this.mainModel.vo.riCheckAreaTplRfid, {id: null, code: null, name:'', isBind: '0'});
                                LIB.Msg.info("已经解绑电子标签");
                                _this.$dispatch("ev_dtUpdate");
                            }else{
                                LIB.Msg.info("尚未绑定电子标签");
                            }
                        });
                    }
                });

            },
            afterInit: function (_vo, obj) {
                this.mainModel.isRFIDReadOnly = true;
                if(obj.opType === "create") {
                    this.mainModel.vo.orgId = LIB.user.orgId;
                }
            },
            afterDoSave: function (obj, data) {
                this.mainModel.isRFIDReadOnly = true;
                if (obj.type === "C") {
                    this.mainModel.vo.id = data.id;
                }
                if (data.riCheckAreaTplRfid) {
                    this.mainModel.vo.riCheckAreaTplRfid = data.riCheckAreaTplRfid;
                }
            },
            doCancel: function() {
                this.recoverBeforeEditVo();
                this.changeView("view");
                this.afterDoCancel && this.afterDoCancel();
                this.mainModel.isRFIDReadOnly = true;
            },
            afterInitData:function () {
                this.$refs.pointTable.doQuery({"riCheckAreaTpl.id" : this.mainModel.vo.id});
            },
            beforeInit:function () {
                this.$refs.pointTable.doClearData();
            }
        },
        events: {},
        init: function () {
            this.$api = api;
        }
    });

    return detail;
});