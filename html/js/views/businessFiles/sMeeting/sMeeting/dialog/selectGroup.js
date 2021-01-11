define(function (require) {
    var api = require('../vuex/api')
    var template = require("text!./selectGroup.html");
    var LIB = require('lib');
    var component = {
        template: template,
        props: {

            visible: {
                type: Boolean,
                default: false
            },


        },
        data: function () {
            return {
                tableModel: LIB.Opts.extendDetailTableOpt({
                    url : "peoplegroup/groupuserrels/list/{curPage}/{pageSize}",
                    columns : [
                        LIB.tableMgr.column.cb,
                        {
                            title : "名称",
                            fieldName : "user.name",
                            keywordFilterName: "criteria.strValue.name"
                        },
                        {
                            title: "所属公司",
                            fieldType: "custom",
                            render: function(data) {
                                if (data.user) {
                                    return LIB.tableMgr.rebuildOrgName(data.user.compId, 'comp');
                                }
                            },
                          
                          
                        },
                        {
                            title: "所属部门",
                            fieldType: "custom",
                            render: function(data) {
                                if (data.user) {
                                    return LIB.tableMgr.rebuildOrgName(data.user.orgId, 'dept');
                                }
                            },
                          
                          
                        },]
                }),
                legalTypes: [],
                treeSelectData: []
            }
        },
        watch: {
            visible: function (val) {
                val && this.initData();
            },

            treeSelectData: function (val) {
                if (val.length > 0) {
                    this.$refs.table.doQuery({ 'id': val[0].id })
                  
                } else {
                    this.$refs.table.doClearData()
                   
                }
            }

        },
        methods: {
            initData: function () {
                var _this = this
                api.queryLegalTypes().then(function (res) {
                    
                    if (res.data.length > 0) {
                        _this.legalTypes = res.data;
                        _this.treeSelectData = [res.data[0]]
                    } else {
                        _this.legalTypes = []
                        _this.treeSelectData = []
                    }
                });

            },
            doTreeNodeClick: function () {

            },
            doSave: function () {
                if (this.mainModel.selectedDatas.length == 0) {
                    LIB.Msg.warning("请选择数据");
                    return
                }
                this.visible = false;
                // this.resetTriggerFlag=!this.resetTriggerFlag;
                this.$emit('do-save', this.mainModel.selectedDatas);
            }
        },


    }

    return component;
});