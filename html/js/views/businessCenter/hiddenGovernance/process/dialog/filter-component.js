define(function (require) {
    var LIB = require('lib');
    var api = require("../vuex/api");
    var template = require("text!./filter-component.html");
    //弹窗选人
    var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");
    //选择条件组件
    var conditionComponent = require("./condition");
    var opts = LIB.Vue.extend({
        template: template,
        components: {
            "condition-component": conditionComponent,
            "user-select-modal": userSelectModal
        },
        props: {
            processId: String,
            personFilterData: Object,
            tableData: {
                type: Array,
                'default': function () {
                    return [];
                }
            },
            value: String,
            isReadOnly: {
                type: Boolean,
                'default': true
            }
        },
        data: function () {
            return {
                tableModel: {
                    url: "filterlookup/list/{curPage}/{pageSize}",
                    itemColumns: [
                        {
                            title: "编码",
                            fieldType: "custom",
                            render: function (data) {
                                return _.propertyOf(data.user)("code");
                            },
                            keywordFilterName: "criteria.strValue.keyWordValue_code"
                        },
                        {
                            title: "名称",
                            fieldType: "custom",
                            render: function (data) {
                                return _.propertyOf(data.user)("username");
                            },
                            keywordFilterName: "criteria.strValue.keyWordValue_name"
                        },
                        {
                            title: "所属部门",
                            fieldType: "custom",
                            render: function (data) {
                                return _.propertyOf(LIB.getDataDic("org", (_.propertyOf(data.user)("orgId"))))("deptName");
                            },
                            keywordFilterName: "criteria.strValue.keyWordValue_org"
                        },
                        {
                            title: "是否生效",
                            fieldType: "custom",
                            render: function (data) {
                                if (data.disable == 0) {
                                    return '<label class="ivu-checkbox-wrapper" style="margin-left: 12px;"><span class="ivu-checkbox ivu-checkbox-checked"><span class="ivu-checkbox-inner"></span></span><span></span></label>'
                                } else {
                                    return '<label class="ivu-checkbox-wrapper" style="margin-left: 12px;"><span class="ivu-checkbox"><span class="ivu-checkbox-inner"></span></span><span></span></label>';
                                }
                            },
                            width: 90
                        },
                        //{
                        //    title:"详情",
                        //    fieldType:"custom",
                        //    showTip:true,
                        //    render: function (data) {
                        //        if (data.filterConditions) {
                        //            var attr3 = "";
                        //            if (!_.isEmpty(data.filterConditions)) {
                        //                data.filterConditions.forEach(function (e) {
                        //                    if(e.attr3 ==null){
                        //                        return
                        //                    }
                        //                    attr3 += (e.attr3 + ",");
                        //                });
                        //                attr3 = attr3.substr(0, attr3.length - 1);
                        //            }
                        //            return attr3;
                        //        }
                        //    },
                        //    keywordFilterName: "criteria.strValue.keyWordValue_filtercondition_attr3"
                        //},
                        {
                            title: "",
                            fieldType: "custom",
                            render: function (data) {
                                var icon = _.isEmpty(data.filterConditions) ? '' : '<i class="ivu-icon ivu-icon-edit" style="margin-left: 3px;cursor: pointer;"></i>';
                                return '<span class="text-link">编辑条件</span>' + icon;
                            }
                        },
                        {
                            title: "",
                            fieldType: "tool",
                            toolType: "del"
                        }
                    ],
                    showPager: true,
                    defaultFilterValue: { "criteria.orderValue": { fieldName: "createDate", orderType: "1" } },
                    urlDelete: "filterlookup",
                    resetTriggerFlag: false
                },
                userModel: 
                    {
                        url: "pooldefaultapproval/list{/curPage}{/pageSize}?user.disable=0",
                        selectedDatas: [],
                        lazyLoad:true,
                        columns: [

                            _.extend(_.clone(LIB.tableMgr.column.code), { filterType: null }),
                            {
                                title: "名称",
                                fieldName: "user.name",
                                keywordFilterName: "criteria.strValue.keyWordValue_user_name",
                                width:150,
                            },
                            _.extend(_.clone(LIB.tableMgr.column.dept), { keywordFilterName: "criteria.strValue.dept" }),
                            _.extend(_.clone(LIB.tableMgr.column.disable), { filterType: null }),
                            {
                                title: '',
                                fieldType: 'tool',
                                toolType: "del"
                            }

                        ],
                        
                    }
                ,
                conditionModel: {
                    show: false,
                    title: '编辑条件',
                    model: [],
                    express: null
                },
                approval: {
                    show: false
                },
                personModel: {
                    show: false,
                    data: {
                        id: null,
                        code: null,
                        name: null,//人员名称
                        attr1: null,//人员ID
                        attr2: null,//人员组织机构ID
                        attr5: null,//流程阶段ID
                        filterConditions: []
                    }
                },
                opType:null,
                newLength:null
            }
        },
        watch: {
            "processId": function (v, o) {
                
                if (v != null) {
                    this.$refs.selectPersonTable.doQuery({ attr5: v });
                } else {
                    this.$refs.selectPersonTable.doClearData();
                }
            }
        },
        computed: {
            canChange: function () {
                return !this.isReadOnly && this.processId != null;
            }
        },
        methods: {
            // doFilter: function () {
            //     
            //     this.$refs.approval.doFilter();
            // },
            doShowApproval: function () {
                this.approval.show = true
                this.$refs.approval.doQuery();
            },
            doRemoveItems: function (item) {
                var _this = this;
                var data = item.entry.data;
                api.removeDefaultApproval(null, data).then(function () {
                    LIB.Msg.info("删除成功");
                    _this.$refs.approval.doRefresh();
                });
            },
            doAddPerson2: function () {
                this.opType = 'default2'
                this.personModel.show = true;
                //this.selectModal.userSelectModal.filterData ={compId:"eitlmcx1pl"};
            },
            doAddPerson: function () {
                this.opType = 'default'
                this.personModel.show = true;
                //this.selectModal.userSelectModal.filterData ={compId:"eitlmcx1pl"};
            },
            doSavePersonSelect: function (selectedDatas) {
                var _this = this;
                var rows = selectedDatas;
                if (rows.length < 1) {
                    LIB.Msg.warning("请选择人员");
                    return;
                }
                var formData = _.map(rows, function (row) {
                    var personData = {
                        attr1: row.id,
                        attr2: row.orgId,
                        attr5: _this.processId,
                        name: row.username,
                        code: row.code
                    };
                    return personData;
                });

                if(this.opType == 'default'){
                    api.saveBatchFilterLookup(formData).then(function () {
                            _this.$refs.selectPersonTable.doRefresh();
                            LIB.Msg.info("添加人员成功");
                    });
                }else{
                    var formData = _.map(rows, function (row) {
                        var user = {
                            code: row.code,
                            id: row.id,
                            name: row.username,
                            orgId: row.orgId
                        };
                        return {orgId: row.orgId,code: row.code,user:user};
                    });
                    api.saveDefaultApproval(formData).then(function () {
                        _this.$refs.approval.doRefresh();
                        LIB.Msg.info("添加人员成功");
                    });
                }

            },
            delItemRelRowHandler: function (data) {
                var _this = this;
                var ids = [];
                ids[0] = data.entry.data.id;
                LIB.Modal.confirm({
                    title: '删除当前数据?',
                    onOk: function () {
                        api.deleteFilterLookup(null, ids).then(function () {
                            _this.$refs.selectPersonTable.doRefresh();
                            LIB.Msg.success("删除成功");
                        })
                    }
                });

            },
            //修改生效状态
            doChangeDisable: function (data) {
                var _this = this;
                var disabled = 1 == data.disable;
                var formData = {
                    id: data.id,
                    disable: disabled ? 0 : 1
                };
                api.updateFilterLookup(formData).then(function () {
                    _this.$refs.selectPersonTable.doRefresh();
                    LIB.Msg.success("修改成功");
                });
            },
            //批量修改生效状态
            doChangeDisableBatch: function (disabled) {
                var _this = this;
                var formData = {
                    attr5: this.processId,
                    disable: disabled
                };
                api.updateFilterLookupDisableBatch(formData).then(function () {
                    _this.$refs.selectPersonTable.doRefresh();
                    LIB.Msg.success("修改成功");
                });
            },
            doTableCellClick: function (data) {
                var colId = data.cell.colId;
                var rowData = data.entry.data;
                if (colId == 3) {
                    this.doChangeDisable(rowData);
                } if (colId == 4) {
                    this.$broadcast('ev_conditionModel', rowData);
                    this.conditionModel.show = true;
                }
            },
            //点击关闭的时候 去触发保存按钮
            doClose: function () {
                this.$broadcast('ev_closeModel');
            }
        },
        events: {
            "ev_conditionSaved": function (conditions, express) {
                this.conditionModel.show = false;
                this.tableModel.resetTriggerFlag = !this.tableModel.resetTriggerFlag;
            },
            "ev_conditionDeleted": function () {
                this.tableModel.resetTriggerFlag = !this.tableModel.resetTriggerFlag;
            }
        }
    });
    return opts;
});