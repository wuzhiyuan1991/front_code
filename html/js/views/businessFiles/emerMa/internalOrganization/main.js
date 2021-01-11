define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var BASE = require("base")
    var tpl = LIB.renderHTML(require("text!./main.html"));
    //编辑弹框页面fip (few-info-panel)
    var detailPanel = require("./detail");
    var sumMixin = require("views/businessCenter/emerMa/mixin/sumMixin");

	var emerGroupFormModal = require("componentsEx/formModal/emerGroupFormModal");

    var importProgress = require("componentsEx/importProgress/main");

    var rebuildOrgName = function(id, type, name) {

        var spliteChar = " / ";

        var curOrgName = name || '';

        //if(type == 'comp') {
        //	return LIB.getDataDic("org", id)["compName"];
        //} else if(type == 'dept') {
        //	return LIB.getDataDic("org", id)["deptName"];
        //}

        //var orgFieldName = type == "comp" ? "compName" :"deptName";
        //使用公司简称csn(company short name)代替compName
        var orgFieldName = type == "comp" ? "csn" : "deptName";

        if (BASE.setting.orgMap[id]) {

            if (curOrgName != '') {
                var orgName = LIB.getDataDic("org", id)[orgFieldName]

                //如果渲染的组织结构是部门, 通过DataDic获取的值为undefine，则表示父级是公司了，则当前是顶级部门, 直接返回即可
                if (orgName != undefined) {
                    curOrgName = orgName + spliteChar + curOrgName;
                } else {
                    return curOrgName;
                }
            } else {
                curOrgName = LIB.getDataDic("org", id)[orgFieldName];
            }

            var parentId = BASE.setting.orgMap[id]["parentId"];

            //不存在父级组织机构了,则表示是顶级组织机构
            if (!!parentId) {

                //部门的 id==parentId 时表示是顶级部门
                if (id == parentId) {
                    return curOrgName;
                }
                curOrgName = rebuildOrgName(parentId, type, curOrgName);
            }
        }
        return curOrgName;
    };

    var initDataModel = function () {
        return {
            moduleCode: "emerGroupee",
            //控制全部分类组件显示
            mainModel: {
                showHeaderTools: false,
                //当前grid所选中的行
                selectedRow: [],
                detailPanelClass : "middle-info-aside",
                leftBorder:false,
                leftBorderObj:null,
//				detailPanelClass : "large-info-aside"
            },
            tableModel:
	            {
	                url: "emerposition/list{/curPage}{/pageSize}?hseType=1",
	                selectedDatas: [],
	                columns: [
	                 // LIB.tableMgr.column.cb,
                      //   {
                      //       title: '编码',
                      //       fieldName: "code",
                      //       width: 180,
                      //       // orderName: "code",
                      //       fieldType: "link",
                      //       // filterType: "text"
                      //   },
                        {
                            title: "应急职务",
                            fieldName: "name",
                            width:120,
                            fieldType: "link",
                            // filterType: "text"
                        },
                        {
                            title: "应急职责",
                            fieldName: "remarks",
                            width:400
                            // filterType: "text"
                        },
                        {
                            title: "人员组成",
                            fieldName: "userNames",
                            // filterName: "criteria.strValue.username",
                            // filterType: "text"
                        },
                        {
                            title: "应急组别",
                            fieldName: "emerGroup.name",
                            width:150
                            // filterType: "text"
                        },
                        {
                            title: '状态',
                            width: 100,
                            render: function (data) {
                                var text = LIB.getDataDic("disable", data.disable);
                                if(data.disable === '0') {
                                    return '<i class="ivu-icon ivu-icon-checkmark-round" style="font-weight: bold;color: #aacd03;margin-right: 5px;"></i>' + text
                                } else {
                                    return '<i class="ivu-icon ivu-icon-close-round" style="font-weight: bold;color: #f03;margin-right: 5px;"></i>' + text
                                }
                            }
                        }
	                ]
	            },
            tableModel1: LIB.Opts.extendMainTableOpt(
                {
                    orgId:null,
                    url: "/emergroup/emerusers/list{/curPage}{/pageSize}",
                    selectedDatas: [],
                    columns: [
                        // LIB.tableMgr.column.code,
                        // {
                        //     title: "应急组别",
                        //     fieldName: "emerGroup.name",
                        // },

                        {
                            title: "人员姓名",
                            fieldName: "username",
                            width:"120px"
                            // orderName: "user.id",
                            // filterName: "criteria.strValue.username",
                        },
                        {
                            title: "应急职务",
                            fieldName: "emerPositionName",
                            width:"120px"
                        },
                        {
                            title: "岗位",
                            fieldName: "normalPositionNames",
                        },
                        {
                            title: "联系电话",
                            fieldName: "mobile",
                        },
                        {
                            title: "所属公司",
                            fieldType: "custom",
                            render: function(data) {
                                if (data.compId) {
                                    return rebuildOrgName(data.compId, 'comp');
                                }
                            },
                        },
                        {
                            title: "所属部门",
                            fieldType: "custom",
                            render: function(data) {
                                if (data.orgId) {
                                    return rebuildOrgName(data.orgId, 'dept');
                                }
                            },
                        },

                        // {
                        //     title: "应急职责",
                        //     fieldName: "emerPositionDuty",
                        //     width:"180px"
                        // },
                    ]
                }
            ),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/emergroup/importExcel?type=1"
            },
            templete : {
                url: "/emergroup/file/down?type=1"
            },
            exportModel : {
                url: "/emerposition/exportExcel",
                withColumnCfgParam: true
            },
            importProgress:{
                show: false
            },
            formModel: {
                emerGroupFormModel: {
                    show: false,
                    queryUrl: "emergroup/{id}"
                }
            },
            emerGroupId: null,
            emerGroups:[],
            checkedGroup: null,
            checkedGroupIndex: -1,

        };
    }

    var vm = LIB.VueEx.extend({
		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainPanel, sumMixin],
    	template: tpl,
        data: initDataModel,
        components: {
            "detailPanel": detailPanel,
            "emergroupFormModal": emerGroupFormModal,
            "importprogress":importProgress
        },
        computed:{
		    getModalName: function () {
                if(this.mainModel.leftBorderObj && this.mainModel.leftBorderObj.name){
                    return this.mainModel.leftBorderObj.name;
                }else{
                    return "     ";
                }
            },
        },
        methods: {

            // doChangeOrgId: function (obj) {
            //     console.log(obj)
            //     var _this = this;
            //     this.tableModel1.orgId = obj.nodeId;
            //     if(this.emerGroupId){
            //         this.$nextTick(function () {
            //             _this.onTableDataLoaded();
            //         });
            //     }
            // },

            onTableDataLoaded: function(eventType, param) {
                var params1 = [
                    {
                        type: "save",
                        value: {
                            columnFilterName: "id",
                            columnFilterValue: this.emerGroupId
                        }
                    },
                    {
                        type: "save",
                        value: {
                            columnFilterName: "orgId",
                            columnFilterValue: this.tableModel1.orgId
                        }
                    }
                ];
                if(this.emerGroupId)
                    this.$refs.mainTable1.doCleanRefresh(params1);
            },

            doTableCellClick: function(data) {
                if (!!this.showDetail && data.cell.fieldName == "name") {
                    this.showDetail(data.entry.data);
                } else {
                    (!!this.detailModel) && (this.detailModel.show = false);
                }
            },
            doImport:function(){
                var _this=this;
                _this.importProgress.show = true;
            },
            doShowLeftModel:function (item, index) {
                  if(item){
                      this.mainModel.leftBorder = true;
                      this.mainModel.leftBorderObj = item;
                      this.$set("mainModel.leftBorderObj.name",item.name);
                  }
            },
            doAdd: function() {
                if (!this.emerGroupId) {
                    LIB.Msg.error("请选择应急组别");
                    return;
                }
                this.$broadcast('ev_dtReload', "create");
                this.detailModel.show = true;
            },
            doSelectGroup: function (index) {
                this.checkedGroupIndex = index;
                this.checkedGroup = this.emerGroups[index];
                this.emerGroupId = _.get(this.checkedGroup, "id");
                this._getPositions();
            },
            // 获取应急职务
            _getPositions: function () {
                var params = [
                    {
                        type: "save",
                        value: {
                            columnFilterName: "emerGroup.id",
                            columnFilterValue: this.emerGroupId
                        }
                    }
                ];
                if(this.emerGroupId)
                    this.$refs.mainTable.doCleanRefresh(params);
                else{
                    this.cleanTable();
                }
            },
            cleanTable:function () {
                this.$refs.mainTable.doClearData();
                this.$refs.mainTable1.doClearData();
            },
            doCreateGroup : function(data) {
				this.formModel.emerGroupFormModel.show = true;
				this.$refs.emergroupFormModal.init("create");
			},
            doUpdateGroup: function () {
                var data = this.checkedGroup;
                if (!data) {
                    return;
                }
                this.formModel.emerGroupFormModel.show = true;
                this.$refs.emergroupFormModal.init("update", data);
            },
            doSaveEmerGroup: function (data) {
                var _this = this;
                api.createEmerGroup(null, data).then(function (res) {
                    _this._getEmerGroups();
                    _this.formModel.emerGroupFormModel.show = false;

                });
            },
            doUpdateEmerGroup: function (data) {
                var _this = this;
                api.updateEmerGroup(null, data).then(function (res) {
                    _this._getEmerGroups();
                    _this.formModel.emerGroupFormModel.show = false;
                });
            },
            doDeleteGroup: function () {
                var _this = this;
                var id = this.emerGroupId;
                if(!id) {
                    return;
                }
                LIB.Modal.confirm({
                    title: '删除当前数据?',
                    onOk: function() {
                        api.removeEmerGroup(null, {id: id, orgId: _this.checkedGroup.orgId}).then(function () {
                            LIB.Msg.success("删除成功");
                            _this._getEmerGroups();
                            _this.$refs.mainTable.doCleanRefresh();
                            _this.checkedGroupIndex = null;
                            _this.checkedGroup = null;
                            _this.emerGroupId = null;
                        });
                    }
                });
            },
            doMoveGroup: function (offset) {
                if(!this.emerGroupId) {
                   return;
                }
                if(offset === -1 && this.checkedGroupIndex === 0) {
                    return;
                }
                if(offset === 1 && this.checkedGroupIndex === this.emerGroups.length - 1) {
                    return;
                }
                var _this = this;
                var param = {};
                _.set(param, 'id', this.emerGroupId);
                _.set(param, 'orgId', this.checkedGroup.orgId);
                _.set(param, "criteria.intValue.offset", offset);
                api.saveEmerGroupOrderNo(null, param).then(function() {
                    if(offset === -1) {
                        _this._doGroupUp();
                    } else if (offset === 1) {
                        _this._doGroupDown();
                    }
                });
            },

            // 应急组上移
            _doGroupUp: function () {
                var _arr = this.emerGroups.splice(this.checkedGroupIndex, 1);
                this.emerGroups.splice(this.checkedGroupIndex - 1, 0, _arr[0]);
                this.checkedGroupIndex = this.checkedGroupIndex - 1;
            },
            // 应急组下移
            _doGroupDown: function () {
                var _arr = this.emerGroups.splice(this.checkedGroupIndex, 1);
                this.emerGroups.splice(this.checkedGroupIndex + 1, 0, _arr[0]);
                this.checkedGroupIndex = this.checkedGroupIndex + 1;

            },
            _getEmerGroups: function (orgId) {
                var _this = this;
                api.queryEmerGroups({orgId: orgId}).then(function (res) {
                    _this.emerGroups = res.data.list;
                    _this.$nextTick(function () {
                        if(_this.emerGroups && _this.emerGroups.length>0)
                            _this.doSelectGroup(0);
                        else {
                            _this.emerGroupId = '';
                            _this.cleanTable()
                        }
                    })
                });
            },
            //通过组织结构过滤当前table的数据
            doOrgCategoryChange: function(obj) {
                LIB.setting;
                //obj.categoryType
                var data = {};
                //条件 标题
                data.displayTitle = "";
                //条件 内容
                data.displayValue = "";
                //条件 后台搜索的 属性
                data.columnFilterName = "orgId";
                //条件 后台搜索的 值
                if (obj.categoryType == "org" && obj.topNodeId == obj.nodeId) {
                    //如果是根据当前最大组织机构过滤时,则不传参数,后台默认处理
                    data.columnFilterValue = null;
                } else {
                    data.columnFilterValue = obj.nodeId;
                }
                this._getEmerGroups(obj.nodeId);

                this.emitMainTableEvent("do_query_by_filter", { type: "save", value: data });
            },
        },
        events: {
        },
        init: function(){
        	this.$api = api;
        },
        ready: function () {
            this._getEmerGroups();
        }
    });

    return vm;
});
