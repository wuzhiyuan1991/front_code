define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("../vuex/api");
    var tpl = LIB.renderHTML(require("text!./internalOrganization.html"));
    var rebuildOrgName = function(id, type, name) {
    var BASE = require('base'),
        CONST = require('const');

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
            moduleCode: "emerGroupxx",
            //控制全部分类组件显示
            mainModel: {
                showHeaderTools: false,
                //当前grid所选中的行
                selectedRow: [],
                detailPanelClass : "middle-info-aside",
                leftBorder:false,
                leftBorderObj:null,
                filterKey:null
//				detailPanelClass : "large-info-aside"
            },
            tableModel: LIB.Opts.extendMainTableOpt(
                {
                    url: "/emergroup/emerusers/list{/curPage}{/pageSize}",
                    selectedDatas: [],
                    columns: [
                        {
                            title: "cb",
                            fieldName: "id",
                            fieldType: "cb",
                            width:"30px"
                        },
                        // LIB.tableMgr.column.code,
                        // {
                        //     title: "应急组别",
                        //     fieldName: "emerGroup.name",
                        // },
                        // {
                        //     title: "应急职务",
                        //     fieldName: "emerPositionName",
                        //     width:"100px"
                        // },
                        {
                            title: "人员姓名",
                            fieldName: "username",
                            width:"90px"
                            // orderName: "user.id",
                            // filterName: "criteria.strValue.username",
                        },
                        {
                            title: "岗位",
                            fieldName: "normalPositionNames",
                            width:"130px"
                        },
                        {
                            title: "所属公司",
                            fieldType: "custom",
                            render: function(data) {
                                if (data.compId) {
                                    return rebuildOrgName(data.compId, 'comp');
                                }
                            },
                            width:"150px"
                        },
                        {
                            title: "所属部门",
                            fieldType: "custom",
                            render: function(data) {
                                if (data.orgId) {
                                    return rebuildOrgName(data.orgId, 'dept');
                                }
                            },
                            width:"160"
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
            emerGroupId: null,
            emerGroups:[],
            checkedGroup: null,
            checkedGroupIndex: -1,

        };
    }

    var vm = LIB.VueEx.extend({
        // mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainPanel, sumMixin],
        mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.auth],

        template: tpl,
        data: initDataModel,
        components: {

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
        props:{
            visible:{
                type:Boolean,
                default:false
            }
        },
        watch:{
            visible:function (val) {
                val && this.init();
            }
        },
        methods: {
            doClose:function () {
                this.visible = false;
            },
            doShowLeftModel:function (item, index) {
                if(item){
                    this.mainModel.leftBorder = true;
                    this.mainModel.leftBorderObj = item;
                    this.$set("mainModel.leftBorderObj.name",item.name);
                }
            },

            // 获取应急职务
            _getPositions: function () {
                var params = [
                    {
                        type: "save",
                        value: {
                            columnFilterName: "id",
                            columnFilterValue: this.emerGroupId
                        }
                    },
                    {
                        type:"save",
                        value:{
                            columnFilterName: "criteria.strValue",
                            columnFilterValue:   {"keyWordValue":this.mainModel.filterKey}
                        }
                    }

                ];
                this.$refs.mainTable.doCleanRefresh(params);
            },

            _getEmerGroups: function (orgId) {
                var _this = this;
                api.queryEmerGroups({orgId: orgId}).then(function (res) {
                    _this.emerGroups = res.data.list;
                    _this.checkedGroupIndex = 0;
                    _this.doSelectGroup(0);
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

                // this.emitMainTableEvent("do_query_by_filter", { type: "save", value: data });
            },
            doSelectGroup: function (index) {
                this.checkedGroupIndex = index;
                this.mainModel.filterKey = null; // 清空搜索
                this.checkedGroup = this.emerGroups[index];
                this.emerGroupId = _.get(this.checkedGroup, "id");
                this._getPositions();
            },
            doFilter:function () {
                this._getPositions();
            },
            doSave:function () {
                if(this.tableModel.selectedDatas && this.tableModel.selectedDatas.length==0){
                    LIB.Msg.info("请选择人员");
                    return false;
                }
                this.visible = false;
                this.$emit("do-save", this.tableModel.selectedDatas);
            },
            init:function () {
                this._getEmerGroups();
            }
        },
        events: {
        },
        init: function(){
            this.$api = api;
        },
        ready: function () {
        }
    });

    return vm;
});
