define(function(require) {
    var LIB = require('lib');
    var template = require("text!./boatSelectModal.html");

    var initDataModel = function() {
        return {
            mainModel: {
                model: {
                    type: [Array, Object],
                    default: ''
                },
                title: '选择'
            },
            treeModel: {
                data: [],
                selectedData: [],
                keyword: '',
                filterData: { id: '' },
                showLoading: false,
            },
            tableModel: {
                url: "tpacheckrecord/list{/curPage}{/pageSize}?disable=0",
                selectedDatas: [],
                keyword: '',
                lazyLoad:true,
                columns: [{
                        title :this.$t("gb.common.checkUser"),
                        fieldName:"checkUser.username",
                    },
                    {
                        title : this.$t("gb.common.checkTime"),
                        fieldName : "checkDate",
                    },
                    {
                        title : this.$t("gb.common.CheckTableName"),
                        fieldName:"tpaCheckTable.name",
                    },
                    {
                        title :this.$t("bd.ria.result"),
                        fieldName : "checkResult",
                        render: function(data){
                            return LIB.getDataDic("checkResult",data.checkResult);
                        }
                    },
                    {
                        title : this.$t("gb.common.inspectTask"),
                        fieldName:"checktask.num",
                        render: function(data){
                            if(data.tpaCheckPlan){
                                var  str = data.tpaCheckPlan.name;
                                if(data.tpaCheckTask && data.tpaCheckTask.num){
                                    str += '-';
                                    str += data.tpaCheckTask.num;
                                }
                                return str ;
                            }
                        }
                    }
                ],
                defaultFilterValue: { "criteria.orderValue": { fieldName: "modifyDate", orderType: "1" } }
            }
        }
    };

    var opts = {
        template: template,
        name: "boatSelectModal",
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            filterData: {
                type: Object,
            }
        },
        data: initDataModel,
        methods: {
            doTreeNodeClick: function(obj) {
                var params = null;
                if (obj.data.id === this.treeModel.filterData.id) return;
                this.treeModel.filterData.id = obj.data.id;
                this.filterTreeType = obj.data.type;
                    params = [{
                        type: 'save',
                        value: {
                            columnFilterName: 'tpaCheckPlan.boatEquipmentId',
                            columnFilterValue: this.treeModel.filterData.id
                        }
                    }, {
                        type: 'save',
                        value: {
                            columnFilterName: 'criteria.strValue',
                            columnFilterValue: { keyWordValue: this.tableModel.keyword }
                        }
                    }];

                this.$refs.table.doCleanRefresh(params);
            },
            // onDbClickCell: function(data) {
            //     this.$emit('do-save', data.entry.data);
            //     this.visible = false;
            // },
            doSave: function() {
                if (this.treeModel.selectedData.length === 0) {
                    LIB.Msg.warning("请选择数据");
                    return;
                }
                var retirementDate = _.get(this.treeModel.selectedData, "[0].retirementDate");
                if (retirementDate) {
                    var now = new Date().Format("yyyy-MM-dd 00:00:00");
                    if (now >= retirementDate) {
                        return LIB.Msg.error("该设备已过期，请维护设备报废日期", 5);
                    }
                }
                this.visible = false;
                this.$emit('do-save', this.treeModel.selectedData);
            },
            doFilterLeft: function(val) {
                this.treeModel.keyword = val;
            },
            doFilterRight: function() {
            	if (this.treeModel.selectedData.length === 0) {
                    return;
                }
                var params = null;
                    params = [{
                        type: 'save',
                        value: {
                            columnFilterName: 'tpaCheckPlan.boatEquipmentId',
                            columnFilterValue: this.treeModel.filterData.id
                        }
                    }, {
                        type: 'save',
                        value: {
                            columnFilterName: 'criteria.strValue',
                            columnFilterValue: { keyWordValue: this.tableModel.keyword }
                        }
                    }];
                this.$refs.table.doCleanRefresh(params);
            },
            init: function() {
                    //触发treeModel.data数据变化的事件， 必需先设置为空数据组
            	var _this = this;
                    this.treeModel.data = [];
                    var resource = this.$resource('tpaboatequipment/list');
                    resource.get(this.filterData).then(function (res) {
                    	_this.treeModel.data = res.data;
                    })
                    
            }
        },
        watch: {
            visible: function(val) {
                if (val) {
                    this.init();
                } else {
                    this.treeModel.keyword = "";
                    this.tableModel.keyword = "";
                }
            }
        },
        created: function() {
            this.orgListVersion = 1;
        },
    };
    var component = LIB.Vue.extend(opts);
    LIB.Vue.component('boat-select-modal', component);
})
