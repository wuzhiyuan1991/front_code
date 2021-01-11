define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("../vuex/api");
    var tpl = LIB.renderHTML(require("text!./outOrganization.html"));


    var initDataModel = function () {
        return {
            moduleCode: "emerGroup",
            //控制全部分类组件显示
            mainModel: {
                bannerKeyWord:'',
                showHeaderTools: false,
                //当前grid所选中的行
                selectedRow: [],
                detailPanelClass : "middle-info-aside",
                leftBorder:false,
                leftBorderObj:null,
                filterKey:''
//				detailPanelClass : "large-info-aside"
            },
            tableModel: LIB.Opts.extendMainTableOpt(
                {
                    url: "emergroup/emerlinkmen/list{/curPage}{/pageSize}",
                    selectedDatas: [],
                    columns : [
                        LIB.tableMgr.column.cb,
                        {
                            title : "联系人",
                            fieldName : "name",
                        },{
                            title : "手机号码",
                            fieldName : "mobile",
                        },{
                            title : "办公电话",
                            fieldName : "officePhone",
                        },{
                            title : "职务",
                            fieldName : "duty",
                        },{
                            title : "备注",
                            fieldName : "remarks",
                        }
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
            onremoveSearch: function () {
                this.mainModel.bannerKeyWord = null;
                this.searchLabel();
            },
            searchLabel: function () {
                var id = LIB.user.orgId;
                if(9999999999 == LIB.user.orgId){
                    id = ''
                }
               this._getEmerGroups(id);
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
                var key = this.mainModel.filterKey;
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
                            columnFilterValue:   {"keyWordValue":this.mainModel.filterKey
                            }

                        }
                    }

                ];
                this.$refs.mainTable.doCleanRefresh(params);
            },

            _getEmerGroups: function (orgId) {
                if(orgId == 9999999999){
                    orgId = '';
                }
                var _this = this;
                var params = {
                    // orgId: orgId,
                    disable:0,
                    "criteria.strValue": JSON.stringify({"keyWordValue":this.mainModel.bannerKeyWord,
                        "keyWordValue_name":this.mainModel.bannerKeyWord,
                        "keyWordValue_join_":"or",})
                }
                api.queryEmerGroups2(params).then(function (res) {
                    _this.emerGroups = res.data.list;
                    _this.checkedGroupIndex = 0;
                    if(_this.emerGroups.length == 0){
                        this.$refs.mainTable.doClearData();
                        return;
                    }
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
            doSave:function () {
                if(this.tableModel.selectedDatas && this.tableModel.selectedDatas.length==0){
                    LIB.Msg.info("请选择人员");
                    return false;
                }
                this.visible = false;
                this.$emit("do-save", this.tableModel.selectedDatas);
            },
            doSelectGroup: function (index) {
                this.checkedGroupIndex = index;
                this.checkedGroup = this.emerGroups[index];
                this.emerGroupId = _.get(this.checkedGroup, "id");
                this._getPositions();
            },
            doFilter:function () {
                this._getPositions();
            },
            init:function () {
                this.mainModel.keyWordValue = null;
                this.mainModel.bannerKeyWord = null;
                this._getEmerGroups(LIB.user.orgId);
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
