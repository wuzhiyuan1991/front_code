define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    var tpaCheckTableSelectModal = require("componentsEx/selectTableModal/tpaCheckTableSelectModal");

    var initDataModel = function () {
        return {
            moduleCode: "collect",
            //控制全部分类组件显示
            mainModel: {
                showHeaderTools: false,
                selectedRow: [],
                detailPanelClass: "middle-info-aside"
            },
            tableModel: {
                url: "collect/list{/curPage}{/pageSize}",
                selectedDatas: [],
                columns: [
                    {
                        title: "",
                        fieldName: "id",
                        fieldType: "cb",
                    },
                    {
                        //表名称
                        title: "检查表名称",
                        fieldName: "name",
                        filterType: "text",
                        width: 300
                    },
                    LIB.tableMgr.column.company,
                    LIB.tableMgr.column.company,
                    {
                        title: "创建时间",
                        fieldName: "createDate",
                        filterType: "date"
                    },
                ]
            },
            detailModel: {
                show: false
            },
            selectModel: {
                tpaCheckTableSelectModel: {
                    filterData: {
                        type: 1,
                        disable: 0,
                        "criteria.strValue.selectWithExistCheckItem": "true",
                        tableType: null
                    },
                    visible: false
                },
                userSelectModel: {
                    visible: false
                },
                tpaBoatEquipmentSelectModel: {
                    visible: false,
                    filterData: {orgId: null, disable: 0}
                },
            }
        };
    };
    var vm = LIB.VueEx.extend({
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainPanel],
        template: tpl,
        data: initDataModel,
        components: {
            "tpachecktableSelectModal": tpaCheckTableSelectModal
        },
        methods: {
            doShowCheckTableSelectModal: function () {
                this.selectModel.tpaCheckTableSelectModel.visible = true;
            },
            doTabs: function (data) {
                var _this = this;
                _this.key = data.key;
                if (this.key == 1) {
                    // api.collect().then(function(res) {
                    //     _this.listCollect.data = res.data;
                    // })
                }
            },
            doScroll: function () {
                setInterval(function () {
                    if (this.viewMenu) {
                        if (this.viewMenu.scrollTop > 0) {
                            this.viewScllow = true;
                            this.topSubMenu = this.viewMenu.scrollTop;
                        } else {
                            this.viewScllow = false;
                            this.topSubMenu = 0;
                        }
                    }
                }, 300)
            },
            // retrieveData:function(){
            //     var _this = this;
            //     api.collect().then(function(res2) {
            //         _this.listCollect.data = res2.data;
            //     })
            // },
            doSaveCheckTable: function (obj) {
                var _this = this;
                var params = _.map(obj, function (item) {
                    return {
                        tableId: item.id,
                        orgId: item.orgId,
                        compId: item.compId
                    };
                });
                api.createCollect(null, params).then(function (data) {
                    LIB.Msg.info("添加成功");
                    _this.refreshMainTable();
                })
            },
            doDelete: function () {
                var _this = this;
                var ids = _.pluck(this.tableModel.selectedDatas, 'id');
                LIB.Modal.confirm({
                    title: '确定删除数据?',
                    onOk: function() {
                        _this.$api.delCollect(null, ids).then(function() {
                            _this.refreshMainTable();
                            LIB.Msg.info("删除成功");
                        });
                    }
                });
            }
        },
        events: {},
        ready: function () {
            this.$api = api;
            //this.retrieveData();
            //监听滚动条
            this.viewMenu = this.$els.viewbox;
            this.viewMenu.addEventListener('scroll', this.doScroll)
        }
    });
    return vm;
})