define(function (require) {
    var LIB = require('lib');
    var api = require("./vuex/api");
    //右侧滑出详细页
    var tpl = require("text!./detail-xl.html");
    var dominationAreaSelectModal = require("componentsEx/selectTableModal/dominationAreaSelectModal");
    var equipmentSelectModal = require("componentsEx/selectTableModal/equipmentSelectModal");
    var catalogSelect = require("./dialog/catalogSelect");

    //初始化数据模型
    var newVO = function () {
        return {
            //ID
            id: null,
            //编码
            code: null,
            //名称
            name: null,
            //禁用标识 0未禁用，1已禁用
            disable: "1",
            //公司id
            compId: null,
            //数据类型 1-重点危险化学工艺 2-重点危险化学品 3-一般危险化学品 4-重大危险源
            dataType: '1',
            //部门id
            orgId: null,
            //备注
            remark: null,
            //类型
            catalog: {id: '', name: ''},
            //属地
            dominationArea: {id: '', name: ''},
            dominationAreaId: ''
        }
    };


    //Vue数据
    var dataModel = {
        mainModel: {
            vo: newVO(),
            opType: 'view',
            isReadOnly: true,
            title: "",
            disableList: [{id: "0", name: "启用"}, {id: "1", name: "停用"}],
            rules: {
                "name": [LIB.formRuleMgr.require("名称"),
                    LIB.formRuleMgr.length()
                ],
                "dominationArea.id" : [LIB.formRuleMgr.require("属地")],
                "catalog.id" : [LIB.formRuleMgr.require("类型")],
                "compId": [{required: true, message: '请选择所属公司'}, LIB.formRuleMgr.length()],
                "orgId": [{required: true, message: '请选择所属部门'}, LIB.formRuleMgr.length()],
                "dataType": [LIB.formRuleMgr.require("数据类型"),
                    LIB.formRuleMgr.length()
                ],
                "remark": [LIB.formRuleMgr.length(500, 0)]
            }
        },
        tableModel: {
            equipmentModel: {
                url: 'majorchemicalprocess/equipments/list/{curPage}/{pageSize}',
                columns: [
                    {
                        title: "设备设施名称",
                        fieldName: 'name'
                    },
                    {
                        title: "设备设施分类",
                        fieldType : "custom",
                        render: function(data){
                            if(data.equipmentType){
                                return data.equipmentType.name;
                            }
                        }
                    },
                    {
                        title : "所属公司",
                        fieldType : "custom",
                        render: function(data){
                            if(data.compId){
                                return LIB.getDataDic("org", data.compId)["compName"];
                            }
                        }
                    },
                    {
                        title : "所属部门",
                        fieldType : "custom",
                        render: function(data){
                            if(data.orgId){
                                return LIB.getDataDic("org", data.orgId)["deptName"];
                            }
                        }
                    },
                    {
                        title: "属地",
                        fieldName: "dominationArea.name"
                    },
                    {
                        title: "",
                        fieldType: "tool",
                        toolType: "del"
                    }
                ]
            }
        },
        fileModel:{
            default : {
                cfg: {
                    params: {
                        recordId: null,
                        dataType: 'M4',//区域位置图、平面布置图、工艺流程图和主要设备一览表
                        fileType: 'M'
                    }
                },
                data : []
            }
        },
        selectModel: {
            checkObjectCatalogSelectModel: {
                visible: false,
                filterData: {orgId: null}
            },
            dominationAreaSelectModel: {
                visible: false,
                filterData: {orgId: null}
            },
            equipmentSelectModel: {
                visible: false,
                filterData: {'dominationArea.id': null}
            }

        },
        catalogs: []
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
     init/created/beforeCompile/compiled/ready/attached/detached/beforeDestroy/destroyed
     **/
    var detail = LIB.Vue.extend({
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.detailPanel],
        template: tpl,
        components: {
            catalogSelect: catalogSelect,
            "dominationareaSelectModal": dominationAreaSelectModal,
            equipmentSelectModal: equipmentSelectModal
        },
        computed: {
            disableLabel: function () {
                return this.mainModel.vo.disable === '1' ? '停用' : '启用';
            }
        },
        data: function () {
            return dataModel;
        },
        methods: {
            newVO: newVO,
            doShowCheckObjectCatalogSelectModal: function () {
                this.selectModel.checkObjectCatalogSelectModel.visible = true;
                //this.selectModel.checkObjectCatalogSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
            },
            doSaveCheckObjectCatalog: function (selectedDatas) {
                if (selectedDatas) {
                    this.mainModel.vo.catalog = selectedDatas[0];
                }
            },
            doShowDominationAreaSelectModal: function () {
                if(!this.mainModel.vo.orgId) {
                    return LIB.Msg.warning("请先选中所属部门");
                }
                this.selectModel.dominationAreaSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
                this.selectModel.dominationAreaSelectModel.visible = true;
            },
            doSaveDominationArea: function (selectedDatas) {
                this.mainModel.vo.dominationArea = selectedDatas[0];
            },

            onSelectCatalog: function (data) {
                this.mainModel.vo.catalog = {
                    id: data.id,
                    name: data.name,
                    parentId: data.parentId
                };
                this.mainModel.vo.name = data.name;
            },
            /**
             * 设备设施
             */
            getEquipments: function () {
                this.$refs.equipmentTable.doQuery({ id: this.mainModel.vo.id });
            },
            showEquipmentModal: function(){
                this.selectModel.equipmentSelectModel.filterData = {'dominationArea.id' : this.mainModel.vo.dominationArea.id};
                this.selectModel.equipmentSelectModel.visible = true;
            },
            doSaveEquipment: function(items){
                var _this = this;
                var params = _.map(items, function (item) {
                    return {
                        id: item.id
                    }
                });
                this.$api.addEquipment({id: this.mainModel.vo.id}, params).then(function () {
                    _this.getEquipments();
                })
            },
            doRemoveEquipment: function (item) {
                var _this = this;
                var params = [
                    {
                        id: item.entry.data.id
                    }
                ];
                this.$api.removeEquipment({id: this.mainModel.vo.id}, params).then(function () {
                    _this.getEquipments();
                })
            },
            displayCatalog: function (catalog) {
                var _arr = [],
                    _this = this;

                if(!catalog.id) {
                    return '';
                }

                var _join = function (item) {
                    _arr.unshift(item);
                    if(item.parentId) {
                        _join(_this.catalogGroup[item.parentId][0])
                    }
                };

                _join(catalog);
                return _.pluck(_arr, "name").join(" - ");
            },
            /**
             * 自定义钩子函数
             */
            beforeInit: function () {
                this.$refs.equipmentTable.doClearData();
            },
            afterInitData: function () {
                var id = this.mainModel.vo.id,
                    _this = this;
                if (id) {
                    this.getEquipments();  // 获取设备设施
                }
            },
            _getCatalogs: _.debounce(function () {
                var _this = this;
                //获取数据
                api.listCheckObjectCatalog().then(function (res) {
                    _this.catalogGroup = _.groupBy(res.data, "id");
                    _this.catalogs = res.data;
                });
            }, 100)
        },
        events: {},
        init: function () {
            this.$api = api;
        },
        attached: function () {
            this._getCatalogs();
        },
        ready: function () {
        }
    });

    return detail;
});