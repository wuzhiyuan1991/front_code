define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    //编辑弹框页面fip (few-info-panel)
    // var detailPanel = require("./detail");
    //编辑弹框页面bip (big-info-panel)
    var detailPanel = require("./detail-xl");
    //导入
    var importProgress = require("componentsEx/importProgress/main");
    //编辑弹框页面bip (big-info-panel) Legacy模式
//  var detailPanel = require("./detail-tab-xl");

    //Legacy模式
//	var checkItemFormModal = require("componentsEx/formModal/checkItemFormModal");


    var initDataModel = function () {
        return {
            moduleCode : LIB.ModuleCode.BD_HaI_CheI,
            categoryModel : {
                config:[{
                    NodeEdit:true,
                    title:"业务分类",
                    url:"risktype/list",
                    type:"business"
                }]
            },
            //控制全部分类组件显示
            mainModel: {
                showHeaderTools: false,
                //当前grid所选中的行
                selectedRow: [],
                //  detailPanelClass : "middle-info-aside"
                detailPanelClass : "large-info-aside"
            },
            tableModel: LIB.Opts.extendMainTableOpt(
                {
                    url: "tpacheckitem/list{/curPage}{/pageSize}?itemType=30",
                    selectedDatas: [],
                    columns: [ {
                        title : "",
                        fieldName : "id",
                        fieldType : "cb",
                    }, {
                        //title : "编码",
                        title: this.$t("gb.common.code"),
                        fieldName : "code",
                        width:'200px',
                        orderName:"code",
                        fieldType : "link",
                        filterType : "text"
                    }, {
                        //title : "名称",
                        title: this.$t("gb.common.checkItemContent"),
                        fieldName : "name",
                        orderName:"name",
                        filterType : "text"
                    }, {
                        //title : "风险分类",
                        title: this.$t("gb.common.checkItemClass"),
                        //fieldType : "custom",
                        orderName:"risktype.name",
                        fieldName : "riskType.name",
                        //render: function(data){
                        //	if(data.riskType){
                        //		return data.riskType.name;
                        //	}
                        //},
                        filterType : "text",
                        filterName:"criteria.strValue.riskTypeName"
                    }, {
                        //title : "描述",
                        title: this.$t("gb.common.describe"),
                        fieldName : "remarks",
                        orderName:"remarks",
                        filterType : "text"
                    }, {
                        //title : "类型",
                        title: this.$t("gb.common.type"),
                        fieldName : "type",
                        fieldType : "custom",
                        orderName:"type",
                        filterType : "enum",
                        render: function(data){
                            return LIB.getDataDic("pool_type",[data.type]);
                        },
                        popFilterEnum : LIB.getDataDicList("pool_type"),
                        filterName :"criteria.intsValue.type",
                    },{
                        //title : "状态",
                        title: this.$t("gb.common.state"),
                        fieldName : "disable",
                        fieldType : "custom",
                        orderName:"disable",
                        filterType : "enum",
                        render: function(data){
                            return LIB.getDataDic("disable",[data.disable]);
                        },
                        popFilterEnum : LIB.getDataDicList("disable"),
                        filterName :"criteria.intsValue.disable",
                    },
                        //	{
                        //	//title : "所属公司",
                        //	title: this.$t("gb.common.ownedComp"),
                        //	orderName:"org.name",
                        //	fieldName : "org.name",
                        //	//fieldType:"custom",
                        //	//render: function(data){
                        //	//	if(data.org){
                        //	//		return data.org.name;
                        //	//	}
                        //	//},
                        //	filterType : "text",
                        //	filterName : "criteria.strValue.orgName"
                        //},
                        LIB.tableMgr.column.company,
                        {
                            //title : "创建时间",
                            title: this.$t("gb.common.createTime"),
                            fieldName : "createDate",
                            filterType : "date"
                        }, {
                            //title : this.$t("gb.common.modifyTime"),
                            //title : "修改时间",
                            title: this.$t("gb.common.modifyTime"),
                            fieldName : "modifyDate",
                            filterType : "date"
                        }
                    ],
                    //defaultFilterValue : {"criteria.orderValue" : {fieldName : "createDate", orderType : "1"}}
                }
            ),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/tpacheckitem/importExcel?type=1"
            },
            exportModel : {
                url: "/tpacheckitem/exportExcel?type=1"
            },
            templete : {
                url: "/tpacheckitem/file/down?type=1"
            },
            importProgress:{
                show: false
            }
            //Legacy模式
//			formModel : {
//				checkItemFormModel : {
//					show : false,
//				}
//			}

        };
    }

    var vm = LIB.VueEx.extend({
        mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainPanel],
        //Legacy模式
//		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainLegacyPanel],
        template: tpl,
        data: initDataModel,
        components: {
            "detailPanel": detailPanel,
            //Legacy模式
//			"checkitemFormModal":checkItemFormModal,

        },
        methods: {
            //Legacy模式
//			doAdd : function(data) {
//				this.formModel.checkItemFormModel.show = true;
//				this.$refs.checkitemFormModal.init("create");
//			},
//			doSaveCheckItem : function(data) {
//				this.doSave(data);
//			}
            doImport:function(){
                var _this=this;
                this.importProgress.show = true;
            },
            doCategoryChange : function(obj) {
                var data = {};
                //条件 后台搜索的 属性
                data.columnFilterName = "riskType.id";
                //条件 后台搜索的 值
                data.columnFilterValue = obj.nodeId;
                this.emitMainTableEvent("do_query_by_filter", {type:"save", value: data});
            },
//启用停用
//			doOpen:function(){
//				//执行启用
//				var _this = this;
//				var rows = this.tableModel.selectedDatas;
//				if(rows.length>1){
//					LIB.Msg.warning("不支持多个启用！");
//					return
//				}
//				var checkObject = rows[0];
//				checkObject.disable = "0";
//				api.update(null,checkObject).then(function(data){
//					if(data.data && data.error != '0'){
//						return;
//					}else{
//						LIB.Msg.info("已启用");
//						_this.refreshMainTable();
//					}
//				});
//			},
//			doClose:function(){
//				//执行停用
//				var _this = this;
//				var rows = this.tableModel.selectedDatas;
//				if(rows.length>1){
//					LIB.Msg.warning("不支持多个停用！");
//					return
//				}
//				var checkObject = rows[0];
//				checkObject.disable = "1";
//				api.update(null,checkObject).then(function(data){
//					if(data.data && data.error != '0'){
//						return;
//					}else{
//						LIB.Msg.info("已停用");
//						_this.refreshMainTable();
//					}
//				});
//			},
            //启用停用
            doEnableDisable:function(){
                var _this = this;
                var rows = _this.tableModel.selectedDatas;
                if(rows.length>1){
                    LIB.Msg.warning("无法批量修改启用停用");
                    return
                }
                var checkObject = rows[0];
                //0启用，1禁用
                if(checkObject.disable=='0'){
                    checkObject.disable="1"
                    api.update(null,checkObject).then(function (res) {
                        _this.refreshMainTable();
                        LIB.Msg.info("停用成功!");
                    });
                }else{
                    checkObject.disable ="0"
                    api.update(null,checkObject).then(function (res) {
                        _this.refreshMainTable();
                        LIB.Msg.info("启用成功!");
                    });
                }
            },
            doDetailFinshed:function(){
                this.refreshMainTable();
            },
            //doAdd : function(data) {
            //	this.detailModel.show = true;
            //	this.$broadcast('ev_detailReload', null);
            //},
        },
        //events: {
        //"ev_detailFinshed" : function() {
        //	this.refreshMainTable();
        //},
        //},
        ready: function(){
            this.$api = api;
        }
    });

    return vm;
});
