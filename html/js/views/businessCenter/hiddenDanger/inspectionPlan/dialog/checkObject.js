define(function (require) {

    var LIB = require('lib');
    var template = require("text!./checkObject.html");
    var api = require("../vuex/api");

    var newVO = {
        compId: '',
        orgId: '',
        dominationArea: {
            id: '',
            name: ''
        }
    };

    var defaultModel = {
        mainModel: {
            title: '选择下发属地',
            vo: newVO,
            selectedDatas: []
        },
        orgKey: '',
        areaKey: '',
        organizationModel:{
            url: 'organization/list{/curPage}{/pageSize}',
            columns: [
                {
                    title: "",
                    fieldName: "id",
                    fieldType: "cb"
                },
                {
                    //名称
                    title: "下发部门",
                    fieldName: "name",
                    keywordFilterName: "criteria.strValue.keyWordValue_org"
                },
            ],
            filterColumn: ["criteria.strValue.name"],
            selectedDatas: [],
            defaultFilterValue: ''
        },
        dominationAreaModel: {
            url: 'dominationarea/list/{curPage}/{pageSize}',
            columns: [
                {
                    title: "",
                    fieldName: "id",
                    fieldType: "cb",
                },
                {
                    title: "下发属地",
                    fieldName: "name"
                }
            ],
            filterColumn: ["criteria.strValue.name"],
            selectedDatas: [],
            defaultFilterValue: ''
        },
        orgIds:[]
    };

    var opts = {
        template: template,
        components: {

        },
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            compId: {
                type: String,
                default: ''
            },
            orgId: {
                type: String,
                default: ''
            },
            tableType: {
                type: String,
                default: ''
            },
            isCompDisable: {
                type: Boolean,
                default: true
            },
            //是否启用全选功能
            isSingleCheck: {
                type: Boolean,
                default: false
            },
        },
        computed: {

        },
        data: function () {
            return defaultModel;
        },
        watch: {
            visible: function (nVal) {
                if (nVal) {
                    this.init();
                } else {
                    this.reset();
                }
            },
            "organizationModel.selectedDatas":function (val) {
                if(val && val.length>0){
                    var _this = this;
                    _this.orgIds = [];
                    _.each(val, function (item) {
                        _this.orgIds.push(item.id)
                    });
                    this.doQueryArea();
                }
            }

        },
        methods: {
            doQueryOrg: function () {
                var queryArr = [],
                    vo = this.mainModel.vo;
                var conditions = {
                    compId: {
                        type: "save",
                        value: {
                            columnFilterName: "compId",
                            columnFilterValue: vo.compId
                        }
                    },
                    type: {
                        type: "save",
                        value: {
                            columnFilterName: "type",
                            columnFilterValue: '2'
                        }
                    },
                    kw: {
                        type: "save",
                        value: {
                            columnFilterName: "criteria.strValue",
                            columnFilterValue: {
                                'keyWordValue_join_': 'or',
                                'keyWordValue_code': this.orgKey,
                                'keyWordValue_comp': this.orgKey,
                                'keyWordValue_org': this.orgKey,
                                'keyWordValue_name': this.orgKey,
                                'keyWordValue_dominationArea': this.orgKey,
                                'keyWordValue': this.orgKey
                            }
                        }
                    }
                };
                if (vo.compId) {
                    queryArr.push(conditions.compId);
                }
                if (this.orgKey) {
                    queryArr.push(conditions.kw);
                }
                queryArr.push(conditions.type);
                this.$refs.organizationTable.doCleanRefresh(queryArr);
            },
            doQueryArea: function () {
                var queryArr = [],
                    vo = this.mainModel.vo,
                    orgIds = this.orgIds;

                var conditions = {
                    compId: {
                        type: "save",
                        value: {
                            columnFilterName: "compId",
                            columnFilterValue: vo.compId
                        }
                    },
                    orgIds: {
                        type: "save",
                        value: {
                            columnFilterName: "criteria.strsValue",
                            columnFilterValue: {'orgIds':orgIds}
                        }
                    },
                    kw: {
                        type: "save",
                        value: {
                            columnFilterName: "criteria.strValue",
                            columnFilterValue: {
                                'keyWordValue_join_': 'or',
                                'keyWordValue_code': this.areaKey,
                                'keyWordValue_comp': this.areaKey,
                                'keyWordValue_org': this.areaKey,
                                'keyWordValue_name': this.areaKey,
                                'keyWordValue_dominationArea': this.areaKey,
                                'keyWordValue': this.areaKey
                            }
                        }
                    },
                };

                if (vo.compId) {
                    queryArr.push(conditions.compId);
                }
                if (orgIds) {
                    queryArr.push(conditions.orgIds);
                }
                if (this.areaKey) {
                    queryArr.push(conditions.kw);
                }
                this.$refs.dominationareaTable.doCleanRefresh(queryArr);
            },

            selectAll: function(list){
                // if(list.length == 0)
                //     this.$refs.dominationareaTable.setAllCheckBoxValues(false);
                // else
                //     this.$refs.dominationareaTable.checkAll(true);
            },
            selectedOrg: function(list){
                // var _this = this;
                // list.forEach(function(item){
                //     if(item.id === LIB.user.orgId){
                //         _this.organizationModel.selectedDatas.push(item);
                //     }
                // });
            },

            doSave: function () {
                if (this.dominationAreaModel.selectedDatas.length === 0) {
                    return LIB.Msg.warning("请选择检查对象");
                }
                this.$emit("do-save", {
                    checkObj: this.dominationAreaModel.selectedDatas,
                })
            },

            doClose: function () {
                this.visible = false;
            },
            reset: function () {
                this.orgKey = "";
                this.areaKey = "";
                this.$refs.organizationTable.doClearData();
                this.$refs.dominationareaTable.doClearData();
            },
            init: function () {
                this.mainModel.vo = newVO;
                this.mainModel.vo.compId = this.compId;
                this.mainModel.vo.orgId = this.orgId;
                this.doQueryOrg();
            }
        },
        ready: function () {

        }
    };

    var component = LIB.Vue.extend(opts);
    return component;
});