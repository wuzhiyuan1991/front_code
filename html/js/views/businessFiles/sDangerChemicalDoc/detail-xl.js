define(function (require) {
    var LIB = require('lib');
    var api = require("./vuex/api");
    //右侧滑出详细页
    var tpl = require("text!./detail-xl.html");
    var checkObjectCatalogSelectModal = require("componentsEx/selectTableModal/checkObjectCatalogSelectModal");
    var dominationAreaSelectModal = require("componentsEx/selectTableModal/dominationAreaSelectModal");

    //初始化数据模型
    var newVO = function () {
        return {
            id: null,
            //编码
            code: null,
            //一般化学品名称
            name: null,
            //禁用标识 0未禁用，1已禁用
            disable: "0",
            //所属公司
            // compId: null,
            // //所属部门
            // orgId: null,
            //别名
            alias: null,
            //类别
            category: null,
            //CAS编码
            ccode: null,
            //是否选中易制爆 1 表示选中 0表示没有选中
            explosive: 0,
            //单位
            monad: null,
            //是否选中易制毒的 1 表示选中 0表示没有选中
            precursor: null,
            //主要用途
            purpose: 0,
            //备注
            remark: null,
            //核定/最大储量
            storage: null,
            //UN编号
            uncode: null,
            // uncodeObj: {}
        }
    };


    //Vue数据
    var dataModel = {
        mainModel: {
            vo: newVO(),
            opType: 'view',
            isReadOnly: true,
            title: "",
            rules: {
                "code": [LIB.formRuleMgr.require("编码"),
                LIB.formRuleMgr.length(100)
                ],
                "name": [LIB.formRuleMgr.require("一般化学品名称"),
                LIB.formRuleMgr.length(100)
                ],
                "disable": LIB.formRuleMgr.require("状态"),
                // "compId": [LIB.formRuleMgr.require("所属公司")],
                // "orgId": [LIB.formRuleMgr.length(10),LIB.formRuleMgr.require("部门")],
                "alias": [LIB.formRuleMgr.length(100)],
                "category": [LIB.formRuleMgr.length(100), LIB.formRuleMgr.require("类别")],
                "ccode": [LIB.formRuleMgr.length(100),LIB.formRuleMgr.require("CAS编码")],

                "monad": [LIB.formRuleMgr.length(100)],

                "purpose": [LIB.formRuleMgr.length(100)],
                "remark": [LIB.formRuleMgr.length(65535)],
                "storage": [LIB.formRuleMgr.range(0,99999999,5), 
                {
                    validator: function (rule, value, callback) {
                        var vo = dataModel.mainModel.vo;

                        if (_.isEmpty(vo.monad)  ) {
                            callback(new Error("单位"))
                        } else {
                            callback()
                        }
                    }
                }],
                "uncode": [LIB.formRuleMgr.length(100), ],
            }
        },
        selectModel: {
            checkObjectCatalogSelectModel: {
                visible: false,
                filterData: { dataType: '3' }
            },
            dominationAreaSelectModel: {
                visible: false,
                filterData: { orgId: null }
            }
        },
        fileModel: {
            M3: {
                cfg: {
                    params: {
                        recordId: null,
                        dataType: 'MSDS3',//涉及的所有化学品安全技术说明书（MSDS）
                        fileType: 'MSDS'
                    }
                },
                data: []
            },
            M5: {
                cfg: {
                    params: {
                        recordId: null,
                        dataType: 'MSDS5',//安全管理规章制度及安全操作规程
                        fileType: 'MSDS'
                    }
                },
                data: []
            },
            M7: {
                cfg: {
                    params: {
                        recordId: null,
                        dataType: 'MSDS7',//事故应急预案、评审意见、演练计划和评估报告
                        fileType: 'MSDS'
                    }
                },
                data: []
            },
            M10: {
                cfg: {
                    params: {
                        recordId: null,
                        dataType: 'MSDS10',//场所安全警示标志的设置情况
                        fileType: 'MSDS'
                    }
                },
                data: []
            }
        }
    };
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
     init/created/beforeCompile/compiled/ready/attached/detached/beforeDestroy/destroyed
     **/
    var detail = LIB.Vue.extend({
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.detailPanel],
        template: tpl,
        components: {
            "checkobjectcatalogSelectModal": checkObjectCatalogSelectModal,
            "dominationareaSelectModal": dominationAreaSelectModal,

        },
        computed: {
            limitStyle: function () {
                if (!this.mainModel.vo.actualReserves ||
                    !this.mainModel.vo.catalog ||
                    !this.mainModel.vo.catalog.maxReserves) {
                    return {}
                }
                if (parseFloat(this.mainModel.vo.actualReserves) > parseFloat(this.mainModel.vo.catalog.maxReserves)) {
                    return {
                        color: '#f00',
                        fontWeight: 'bold'
                    }
                }
                return {};
            }
        },
        data: function () {
            return dataModel;
        },
        methods: {
            newVO: newVO,
            changePrecursor: function (val) {

                val ? this.mainModel.vo.precursor = 1 : this.mainModel.vo.precursor = 0
            },
            changeExplosive: function (val) {
                val ? this.mainModel.vo.explosive = 1 : this.mainModel.vo.explosive = 0
            },
            doShowCheckObjectCatalogSelectModal: function () {
                if (this.mainModel.isReadOnly) {
                    return;
                }
                this.selectModel.checkObjectCatalogSelectModel.visible = true;
                //this.selectModel.checkObjectCatalogSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
            },
            doSaveCheckObjectCatalog: function (items) {
                this.mainModel.vo.uncodeObj = items[0];
                this.mainModel.vo.attr1 = items[0].name;
                this.mainModel.vo.uncode = items[0].id;
            },
            doShowDominationAreaSelectModal: function () {
                if (!this.mainModel.vo.orgId) {
                    return LIB.Msg.warning("请先选中所属部门");
                }
                this.selectModel.dominationAreaSelectModel.visible = true;
                this.selectModel.dominationAreaSelectModel.filterData = { orgId: this.mainModel.vo.orgId };
            },
            doSaveDominationArea: function (selectedDatas) {
                if (selectedDatas) {
                    this.mainModel.vo.dominationArea = selectedDatas[0];
                }
            },
            afterInit: function () {
                this.mainModel.vo.precursor = 0
                this.mainModel.vo.explosive = 0
            },
            afterInitData: function () {
                // this.mainModel.vo.uncodeObj = {
                //     name: this.mainModel.vo.attr1,
                //     id: this.mainModel.vo.uncode
                // }
                this.fileModel['M3'].cfg.params.recordId = this.mainModel.vo.id
                this.fileModel['M5'].cfg.params.recordId = this.mainModel.vo.id
                this.fileModel['M7'].cfg.params.recordId = this.mainModel.vo.id
                this.fileModel['M10'].cfg.params.recordId = this.mainModel.vo.id
            },

            // afterInitFileData: function (data) {
            //     var fileModel = this.fileModel;
            //     _.each(data, function (d) {
            //         var fileData = _.property("data")(_.propertyOf(fileModel)(d.dataType));
            //         if (_.isArray(fileData)) {
            //             fileData.push(d);
            //         }
            //     });
            // },
            buildSaveData: function () {
                var _intValue = {};
                if (!this.mainModel.vo.actualReserves) {
                    _intValue.actualReserves_empty = 1;
                }
                if (!_.isEmpty(_intValue)) {
                    this.mainModel.vo["criteria"] = {
                        intValue: _intValue
                    };
                }
                return this.mainModel.vo;
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