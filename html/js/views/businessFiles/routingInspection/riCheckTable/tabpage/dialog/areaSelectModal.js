define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require('../../vuex/api');
    var tpl = require("text!./areaSelectModal.html");
    // var dominationAreaSelectModal = require("componentsEx/selectTableModal/dominationAreaSelectModal");

    var newVO = function () {
        return {
            compId: '',
            orgId: '',
            dominationArea: {id: '', name: ''}
        }
    };
    var initDataModel = function () {
        return {
            //控制全部分类组件显示
            mainModel: {
                title: "选择巡检区域",
                selectedDatas: []
            },
            vo: newVO(),
            dominationAreaSelectModel: {
                visible: false,
                filterData: {orgId: null}
            },
            tableModel: {
                url: 'richeckareatpl/list/{curPage}/{pageSize}?disable=0',
                columns: [
                    {
                        title: "",
                        fieldName: "id",
                        fieldType: "radio"
                    },
                    {
                        title: "巡检区域",
                        fieldName: "name",
                        keywordFilterName: "criteria.strValue.keyWordValue_name"
                    },
                    {
                        title: "属地",
                        fieldName: "dominationArea.name",
                        keywordFilterName: "criteria.strValue.keyWordValue_dominationArea_name"
                    },
                    LIB.tableMgr.ksColumn.dept,
                    LIB.tableMgr.ksColumn.company
                ]
            }
        }
    };

    var vm = LIB.VueEx.extend({
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth],
        template: tpl,
        components: {
            // "dominationareaSelectModal": dominationAreaSelectModal
        },
        data: initDataModel,
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            filterData: {
                type:Object
            },
        },
        watch: {
            visible: function (nVal) {
                if (nVal) {
                    this.init();
                }
            },
            "vo.compId": function () {
                this.vo.orgId = '';
                this.vo.dominationArea= {id: '', name: ''};
                this.$nextTick(function () {
                    this._refreshTable()
                })
            },
            "vo.orgId": function () {
                this.vo.dominationArea= {id: '', name: ''};
                this.$nextTick(function () {
                    this._refreshTable()
                })
            },
        },
        methods: {
            _refreshTable: function () {
                var filterData = [];
                if(this.vo.compId) {
                    filterData.push({
                        type :　"save",
                        value : {
                            columnFilterName : "compId",
                            columnFilterValue : this.vo.compId
                        }
                    })
                }
                if(this.vo.orgId) {
                    filterData.push({
                        type :　"save",
                        value : {
                            columnFilterName : "orgId",
                            columnFilterValue : this.vo.compId
                        }
                    })
                }
                var dominationAreaId = _.get(this.vo.dominationArea, "id");
                if(dominationAreaId) {
                    filterData.push({
                        type :　"save",
                        value : {
                            columnFilterName : "dominationAreaId",
                            columnFilterValue : dominationAreaId
                        }
                    })
                }
                this.$refs.table.doCleanRefresh(filterData);
            },
            init: function () {
                this.mainModel.selectedDatas = [];
                this.vo = newVO();
                var tableFilterDatas = [];
                var filterData = this.filterData;
                if(filterData) {
                    for(key in filterData) {
                        var value = filterData[key];
                        if(value != undefined && value != null && value.toString().trim() != "" ) {
                            var tableFilterData = {
                                type :　"save",
                                value : {
                                    columnFilterName : key,
                                    columnFilterValue : value
                                }
                            };
                            tableFilterDatas.push(tableFilterData);
                        }
                    }
                }
                this.$refs.table.doCleanRefresh(tableFilterDatas)
            },
            doShowSelectModal: function () {
                if(!this.vo.orgId) {
                    return LIB.Msg.warning("请先选择部门");
                }
                this.dominationAreaSelectModel.filterData = {orgId: this.vo.orgId};
                this.dominationAreaSelectModel.visible = true;
            },
            onDbClickCell: function () {
                this.doSave();
            },
            doSave: function () {
                var _this = this;
                if (this.mainModel.selectedDatas.length === 0) {
                    LIB.Msg.warning("请选择数据");
                    return
                }
                var id = this.mainModel.selectedDatas[0].id;
                var params = [{id: id}];
                api.saveRiCheckAreaTpls({id: this.$route.query.id}, params).then(function () {
                    LIB.Msg.success("保存成功");
                    _this.visible = false;
                    _this.$emit("do-save", true)
                })

            },
            doSaveDominationArea: function (selectDatas) {
                var area = selectDatas[0];
                this.vo.dominationArea = {
                    id: area.id,
                    name: area.name
                };
                this._refreshTable();
            },
            doClearDominationArea: function(){
                this._refreshTable();
            },
            doAddArea: function () {
                this.$emit("do-create")
            }
        }
    });

    return vm;
});
