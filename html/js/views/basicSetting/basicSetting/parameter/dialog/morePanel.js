define(function (require) {
    var template = require("text!./morePanel.html");
    var LIB = require('lib');
    var api = require("../vuex/api");
    var checkItemSelectModal = require("./checkItemSelect");
    var positionSelectModal = require("componentsEx/selectTableModal/positionSelectModal");
    var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");


    var component = {
        template: template,
        mixins: [LIB.VueMixin.dataDic],
        components: {
            'checkItemSelectModal': checkItemSelectModal,
            "positionSelectModal": positionSelectModal,
            "userSelectModal": userSelectModal,
        },
        data: function () {
            return {
                mainModel: {
                    description: '',
                    vo: {
                        description: '',
                        result: '3',
                        positions: [],
                        users: [],
                    },
                    detailCompId: null,
                },
                tableModel: {
                    checkItemTableModel: {
                        url: 'systembusinesssetdetail/list/{curPage}/{pageSize}',
                        columns: [
                            _.extend(_.omit(LIB.tableMgr.column.company, 'filterType'), { width: 120 }),
                            {
                                title: LIB.lang('gb.common.check'),
                                fieldName: 'checkTableName',
                                width: 160,
                                keywordFilterName: "criteria.strValue.keyWordValue"
                            },
                            {
                                title: LIB.lang('bd.hal.checkItem'),
                                fieldName: 'checkItemName',
                                width: 238,
                                keywordFilterName: "criteria.strValue.keyWordValue"
                            },
                            {
                                title: '',
                                render: function () {
                                    return '<span class="tableCustomIco_Del"><i class="ivu-icon ivu-icon-trash-a"></i></span>';
                                },
                                width: 60
                            }
                        ]
                    },
                    positionTableModel: LIB.Opts.extendDetailTableOpt({
                        url: "systembusinessset/positions/list/{curPage}/{pageSize}",
                        lazyLoad: true,
                        columns: [
                            LIB.tableMgr.ksColumn.code,
                            {
                                title: LIB.lang('gb.common.name'),
                                fieldName: "name",
                                keywordFilterName: "criteria.strValue.keyWordValue_name"
                            }, {
                                title: "",
                                fieldType: "tool",
                                toolType: "del"
                            }]
                    }),
                    userTableModel: LIB.Opts.extendDetailTableOpt({
                        url: "systembusinessset/users/list/{curPage}/{pageSize}",
                        columns: [
                            LIB.tableMgr.ksColumn.code,
                            _.extend(_.omit(LIB.tableMgr.column.dept, 'filterType'), { width: 120 }),
                            {
                                title: LIB.lang('gb.common.name'),
                                fieldName: "name",
                                keywordFilterName: "criteria.strValue.keyWordValue_name"
                            }, {
                                title: "",
                                fieldType: "tool",
                                toolType: "del"
                            }]
                    }),

                },
                selectModel: {
                    checkItemSelectModal: {
                        visible: false,
                    },
                    positionSelectModel: {
                        visible: false,
                        filterData: { orgId: null }
                    },
                    userSelectModel: {
                        visible: false,
                        filterData: { orgId: null }
                    },
                },
                morePanelType: null
            }
        },
        watch: {
            "mainModel.detailCompId": function (nval, oval) {
                if (this.morePanelType === 'incentiveMechanism') {
                    if (nval != oval && nval) {
                        this.$nextTick(function () {
                            this.$refs.positionTable.doClearData();
                            this.$refs.positionTable.doQuery({ id: this.mainModel.vo.id, "criteria.strValue.compId": this.mainModel.detailCompId });
                            this.$refs.userTable.doClearData();
                            this.$refs.userTable.doQuery({ id: this.mainModel.vo.id, "criteria.strValue.compId": this.mainModel.detailCompId });
                        })
                    }
                }
            }
        },
        methods: {
            refreshTableData: function () {
                var _this = this;
                _.each(arguments, function (ref) {
                    ref.doQuery({ id: _this.mainModel.vo.id });
                })
            },
            doShowPositionSelectModal: function () {
                if (!this.mainModel.detailCompId) {
                    LIB.Msg.info(LIB.lang('bs.bac.psacf'));
                    return;
                }
                this.selectModel.positionSelectModel.visible = true;
                this.selectModel.positionSelectModel.filterData = { orgId: this.mainModel.detailCompId };
            },
            doSavePositions: function (selectedDatas) {
                if (selectedDatas) {
                    this.mainModel.vo.positions = selectedDatas;
                    var param = _.map(selectedDatas, function (data) { return { id: data.id } });
                    var _this = this;
                    api.savePositions({ id: this.mainModel.vo.id, compId: this.mainModel.detailCompId }, param).then(function () {
                        _this.refreshTableData(_this.$refs.positionTable);
                    });
                }
            },
            doRemovePosition: function (item) {
                var _this = this;
                var data = item.entry.data;
                LIB.Modal.confirm({
                    title: LIB.lang('bs.bac.dcd') + '?',
                    onOk: function () {
                        api.removePositions({ id: _this.mainModel.vo.id }, [{ id: data.id }]).then(function () {
                            _this.$refs.positionTable.doRefresh();
                        });
                    }
                });
            },
            doShowUserSelectModal: function () {
                if (!this.mainModel.detailCompId) {
                    LIB.Msg.info(LIB.lang('bs.bac.psacf'));
                    return;
                }
                this.selectModel.userSelectModel.visible = true;
                this.selectModel.userSelectModel.filterData = { orgId: this.mainModel.detailCompId };
            },
            doSaveUsers: function (selectedDatas) {
                if (selectedDatas) {
                    this.mainModel.vo.users = selectedDatas;
                    var param = _.map(selectedDatas, function (data) { return { id: data.id } });
                    var _this = this;
                    api.saveUsers({ id: this.mainModel.vo.id, compId: this.mainModel.detailCompId }, param).then(function () {
                        _this.refreshTableData(_this.$refs.userTable);
                    });
                }
            },
            doRemoveUser: function (item) {
                var _this = this;
                var data = item.entry.data;
                LIB.Modal.confirm({
                    title: LIB.lang('bs.bac.dcd') + '?',
                    onOk: function () {
                        api.removeUsers({ id: _this.mainModel.vo.id }, [{ id: data.id }]).then(function () {
                            _this.$refs.userTable.doRefresh();
                        });
                    }
                });
            },
            doTableCellClick: function (data) {
                if (data.event.target.parentNode.classList.contains("tableCustomIco_Del")) {
                    this.delItemRelRowHandler(data.entry.data.id);
                }
            },
            doAddClick: function () {
                this.selectModel.checkItemSelectModal.visible = true;
            },
            doSaveCheckItem: function (items, checkTableId) {
                var _this = this;
                var params = _.map(items, function (item) {
                    return {
                        result: item.id,
                        compId: _this.mainModel.vo.compId,
                        orgId: _this.mainModel.vo.orgId,
                        attr1: checkTableId,
                        businessSetId: _this.mainModel.vo.id
                    };
                });
                api.addParameterDetail(params).then(function () {
                    _this.getCheckItems();
                    LIB.Msg.info(LIB.lang('gb.common.addedsuf'));
                })
            },
            delItemRelRowHandler: function (id) {
                var params = { id: id };
                var _this = this;
                api.deleteParameterDetail(null, params).then(function () {
                    _this.getCheckItems();
                    LIB.Msg.info(LIB.lang('gb.common.sd'));
                })
            },
            doSave: function () {
                api.saveBusinessSet(this.mainModel.vo).then(function () {
                    LIB.Msg.info(LIB.lang('gb.common.saveds'));
                });
            },
            doClose: function () {
                this.$dispatch("ev_dtClose");
            },
            init: function (description, item) {
                this.mainModel.description = description;
                this.mainModel.vo = item;
                this.morePanelType = null;
                if (item.attr1.startsWith('incentiveMechanism')) {
                    this.morePanelType = "incentiveMechanism";
                    return
                } else if (item.attr1.startsWith('checkResult')) {
                    this.$broadcast('init-card-filter');
                    this.morePanelType = "checkResult";
                    this.getCheckItems();
                }

            },
            getCheckItems: function (keyword) {
                var params = {
                    compId: this.mainModel.vo.compId,
                    'systemBusinessSet.id': this.mainModel.vo.id,
                    'criteria.strValue.keyWordValue': keyword
                };
                this.$nextTick(function () {
                    this.$refs.itemTable.doQuery(params);
                })

            }
        },
        events: {
            //edit框数据加载
            "ev_dtReload": function () {
                this.init.apply(this, arguments);
            }

        }
    };

    return component;
});