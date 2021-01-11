define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));

    var importProgress = require("componentsEx/importProgress/main");

    LIB.registerDataDic("iem_emer_resource_period_unit", [
        ["1","天"],
        ["2","月"],
        ["3","年"]
    ]);

    LIB.registerDataDic("iem_emer_resource_notice_time_unit", [
        ["1","天"],
        ["2","月"]
    ]);

    //编辑弹框页面fip (few-info-panel)
    var detailPanel = require("./detail");      //修改 detailPanelClass : "middle-info-aside"

	var configDetail = require("./dialog/configDetail");
    var configInfo = require("./dialog/configInfo");

    var initDataModel = function () {
        return {
            moduleCode: "emerResource",
            orgId:'',
            //控制全部分类组件显示
            mainModel: {
                showHeaderTools: false,
                //当前grid所选中的行
                selectedRow: [],
                detailPanelClass : "middle-info-aside"
//				detailPanelClass : "large-info-aside"
            },
			// doFilterBySpecial
            tableModel: LIB.Opts.extendMainTableOpt(
	            {
	                url: "emerresource/list{/curPage}{/pageSize}",
	                selectedDatas: [],
                    defaultFilterValue : {"criteria.intsValue.type":["1"]},
                    columns: [
	                 LIB.tableMgr.column.cb,
					 LIB.tableMgr.column.code,
                    {
                        //存储地点
                        title: "存储地点",
                        fieldName: "location",
                        filterType: "text"
                    },
					{
						//名称
						title: "名称",
						fieldName: "name",
                        filterType: "text"
					},
					{
						//技术要求或功能要求
						title: "技术要求或功能要求",
						fieldName: "reqirement",
						filterType: "text",
						width:190
					},
					{
						//规格型号
						title: "规格型号",
						fieldName: "specification",
						filterType: "text"
					},
					{
						//数量
						title: "数量",
						fieldName: "quantity",
						filterType: "text",
                        render:function (data) {
                            return parseInt(data.quantity)
                        }
					},
					{
						//单位
						title: "单位",
						fieldName: "unit",
						filterType: "text"
					},
					{
                        //属地
                        title: "属地",
                        fieldName: "dominationArea.name",
                        filterType: "text"
					},
					 // LIB.tableMgr.column.disable,
					{
						//状态 0:在用,1:停用,2:报废
						title: "状态",
						fieldName: "status",
						orderName: "status",
						filterName: "criteria.intsValue.status",
						filterType: "enum",
						fieldType: "custom",
						popFilterEnum: LIB.getDataDicList("iem_emer_resource_status"),
						render: function (data) {
							return LIB.getDataDic("iem_emer_resource_status", data.status);
						}
					},
					{
						title: "现场负责人",
						fieldName: "user.name",
						orderName: "user.username",
						filterType: "text",
					},
					{
						//联系电话
						title: "联系电话",
						fieldName: "contactNumber",
						filterType: "text"
					},
                    {
                        title: "车间负责人",
                        fieldName: "workshopLeader.name",
                        orderName: "workshopLeader.username",
                        filterType: "text",
                    },
                    {
                        //联系电话
                        title: "联系电话",
                        fieldName: "workshopLeaderNumber",
                        filterType: "text"
                    },

					 LIB.tableMgr.column.remark,

//					{
//						//抢险救援物资种类 1:侦检,2:警戒,3:灭火,4:通信,5:救生,6:破拆,7:堵漏,8:输转,9:洗消,10:排烟,11:照明,12:其他
//						title: "抢险救援物资种类",
//						fieldName: "rescueSupplyCategory",
//						orderName: "rescueSupplyCategory",
//						filterName: "criteria.intsValue.rescueSupplyCategory",
//						filterType: "enum",
//						fieldType: "custom",
//						popFilterEnum: LIB.getDataDicList("iem_emer_resource_rescue_supply_category"),
//						render: function (data) {
//							return LIB.getDataDic("iem_emer_resource_rescue_supply_category", data.rescueSupplyCategory);
//						}
//					},
//					{
//						//抢险救援车辆种类 1:灭火抢险救援车,2:举高抢险救援车,3:专勤抢险救援车,4:后勤抢险救援车
//						title: "抢险救援车辆种类",
//						fieldName: "rescueVehicleCategory",
//						orderName: "rescueVehicleCategory",
//						filterName: "criteria.intsValue.rescueVehicleCategory",
//						filterType: "enum",
//						fieldType: "custom",
//						popFilterEnum: LIB.getDataDicList("iem_emer_resource_rescue_vehicle_category"),
//						render: function (data) {
//							return LIB.getDataDic("iem_emer_resource_rescue_vehicle_category", data.rescueVehicleCategory);
//						}
//					},

//					 LIB.tableMgr.column.modifyDate,
////					 LIB.tableMgr.column.createDate,
//
	                ]
	            }
            ),
            detailModel: {
                show: false
            },
            uploadModel: {
                initUrl: "/emerresource/importExcel",
                url:"/emerresource/importExcel?type=1"
            },
            exportModel : {
                //initUrl: "/emerresource/exportExcel",
                url:"/emerresource/exportExcel",
                withColumnCfgParam: true
            },
            templete : {
                initUrl: "/emerresource/file/down",
                url:"/emerresource/file/down?type=1"
            },
            importProgress:{
                show: false
            },
			dialogModel:{
            	configDetail:{
            		visible:false
				},
                configInfo:{
            		visible:false
				}
			},
            emerGroups:[
				{name:"作业场所配备",id:'1'},
                {name:"个人防护装备",id:'2'},
                {name:"救援车辆配备",id:'3'},
                {name:"救援物资配备",id:'4'},
			],

            checkedGroupIndex:1,
            isCheckKind:false,


            levelGrade:'3',//获取公司危险化学品企业级别，属性为grade 1:第一类危险化学品单位,2:第二类危险化学品单位,3:第三类危险化学品单位


            //Legacy模式
//			formModel : {
//				emerResourceFormModel : {
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
			"configDetail":configDetail,
			"configInfo":configInfo,
            "importprogress":importProgress
			//Legacy模式
//			"emerresourceFormModal":emerResourceFormModal,
            
        },
        watch: {
            'checkedGroupIndex': function(val) {
                this.templete.url = this.templete.initUrl + "?type=" + val;
                this.uploadModel.url = this.uploadModel.initUrl + "?type=" + val;
            }
        },
        methods: {
            rowClass: function(data){
               
                if(data.attr1 === '1'&&data.status == '0') {
                    return 'bgcolor-red';
                }
                return "";
            },
            doImport:function(){
                var _this=this;
                _this.importProgress.show = true;
            },
            doExportExcel: function() {
                var _this = this;
                LIB.Modal.confirm({
                    title: '导出数据?',
                    onOk: function() {
                        window.open(_this._getExportURL() + "&type=" + _this.checkedGroupIndex);
                    }
                });
            },
            checkSelect:function (val) {
                this.tableModel.isSingleCheck = !this.isCheckKind;
                if(!this.isCheckKind){
                    this.tableModel.selectedDatas = [];
                    this.$refs.mainTable.doClearData();
                    this.$refs.mainTable.doQuery();
                }
                this.$refs.mainTable.isSingleCheck = this.tableModel.isSingleCheck;
            },
            doShowDep:function () {
                this.dialogModel.configDetail.visible = true;
            },
            doShowLevel:function () {
                this.getOrgId();
                this.dialogModel.configInfo.visible = true;

            },
			getOrgId:function () {
                var topCategory = this.$refs.categorySelector.topCategory;
                if(topCategory.id){
                    this.orgId = topCategory.id;
                    this.dialogModel.configInfo.visible = true;

                    return ;
                }
                var model = this.$refs.categorySelector.model;
                var index =  this.$refs.categorySelector.tempTopCategory.index;
                var d = _.find(model[index].data, function (item) {
                    return item.name === topCategory.title;
                });
                this.orgId = d.id;
            },

            getLevel:function () {
                var _this = this;
                api.getEnterpriseGradeByCompId({compId:this.orgId}).then(function (res) {
                    if(res.data){
                        _this.levelGrade = res.data.grade;
                    }else{
                        _this.levelGrade = '3'
                    }
                });
            },

            doFilterBySpecial: function (val) {
                this.checkedGroupIndex =  val;

				// 改变主列表的 种类属性显示
				var obj = _.find(this.tableModel.columns, function (item) {
					return item.fieldName == 'rescueVehicleCategory' || item.fieldName == 'rescueSupplyCategory';
                });
				if(this.checkedGroupIndex > 2){
					if(obj) {
                        this.tableModel.columns.splice(2,1);
                    }
					if(this.checkedGroupIndex == 3){
                        this.tableModel.columns.splice(2,0,{
                            //分类 1:作业场所配备,2:个人防护装备,3:救援车辆配备,4:救援物资配备
                            title: "种类",
                            fieldName: "rescueVehicleCategory",
                            orderName: "rescueVehicleCategory",
                            filterName: "criteria.intsValue.rescueVehicleCategory",
                            filterType: "enum",
                            fieldType: "custom",
                            popFilterEnum: LIB.getDataDicList("iem_emer_resource_rescue_vehicle_category"),
                            render: function (data) {
                                return LIB.getDataDic("iem_emer_resource_rescue_vehicle_category", data.rescueVehicleCategory);
                            },
                            width:170
                        })
					}else if(this.checkedGroupIndex == 4){
                        this.tableModel.columns.splice(2,0,{
                            //分类 1:作业场所配备,2:个人防护装备,3:救援车辆配备,4:救援物资配备
                            title: "种类",
                            fieldName: "rescueSupplyCategory",
                            orderName: "rescueSupplyCategory",
                            filterName: "criteria.intsValue.rescueSupplyCategory",
                            filterType: "enum",
                            fieldType: "custom",
                            popFilterEnum: LIB.getDataDicList("iem_emer_resource_rescue_supply_category"),
                            render: function (data) {
                                return LIB.getDataDic("iem_emer_resource_rescue_supply_category", data.rescueSupplyCategory);
                            },
                            width:170
                        })
					}
				}else{
					if(obj){
                        this.tableModel.columns.splice(2,1)
					}
				}
                this._normalizeFilterParam(val);
            },
            _normalizeFilterParam: function (val) {
                var params = [
                    {
                        value : {
                            columnFilterName : "criteria.intsValue.type",
                            columnFilterValue :  [val]
                        },
                        type : "save"
                    }
                ];
                this.$refs.mainTable.columns = this.tableModel.columns.concat([]);
                this.$refs.mainTable.refreshColumns();
                this.$refs.mainTable.doQueryByFilter(params);
            },

            doDeleteAll:function () {
                var _this = this;

                var arr = [];
                _.each(_this.tableModel.selectedDatas, function (item) {
                    arr.push({id:item.id, orgId:LIB.user.orgId});
                });

                LIB.Modal.confirm({
                    title: "是否删除选中的"+_this.tableModel.selectedDatas.length+"项？",
                    onOk: function () {
                        api.deleteBatch(null,arr).then(function (res) {
                            LIB.Msg.info("删除成功");
                            _this.$refs.mainTable.doClearData();
                            _this.$refs.mainTable.doQuery();
                        })
                    }
                });

            },

            // doSelectGroup: function (index) {
            //     this.checkedGroupIndex = index;
            //     // this.checkedGroup = this.emerGroups[index];
            //     // this.emerGroupId = _.get(this.checkedGroup, "id");
            //     // this._getPositions();
            // },

			//Legacy模式
//			doAdd : function(data) {
//				this.formModel.emerResourceFormModel.show = true;
//				this.$refs.emerresourceFormModal.init("create");
//			},
//			doSaveEmerResource : function(data) {
//				this.doSave(data);
//			}

        },
        events: {
        },
        init: function(){
        	this.$api = api;
        },
        attached: function () {
            this.getOrgId();
            this.getLevel();
        }
    });

    return vm;
});
