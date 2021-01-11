define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    //编辑弹框页面fip (few-info-panel)
    var detailPanel = require("./detail");
    //编辑弹框页面bip (big-info-panel)
//	var detailPanel = require("./detail-xl");
    //导入
    var importProgress = require("componentsEx/importProgress/main");




	LIB.registerDataDic("ABC_level", [
		["A:关键设备","A:关键设备"],
		["B:主要设备","B:主要设备"],
		["C:一般设备","C:一般设备"],
	]);

	LIB.registerDataDic("equipment_speciality", [
		["电气专业","电气专业"],
		["防腐专业","防腐专业"],
		["固定消防专业","固定消防专业"],
		["机械设备专业","机械设备专业"],
		["通信专业","通信专业"],
		["信息专业","信息专业"],
		["仪表自动化专业","仪表自动化专业"],
		["移动消防专业","移动消防专业"],
		["站外管道专业","站外管道专业"],
		["其它专业","其它专业"],
	]);

	LIB.registerDataDic("common_state", [
		["0","否"],
		["1","是"],
	]);


    var initDataModel = function () {
        return {
            moduleCode: "equipment",
            //控制全部分类组件显示
            mainModel: {
                showHeaderTools: false,
                //当前grid所选中的行
                selectedRow: [],
                detailPanelClass : "middle-info-aside"
//				detailPanelClass : "large-info-aside"
            },
			isShowIdentificationButton:false,
            tableModel: LIB.Opts.extendMainTableOpt(
	            {
	                url: "equipment/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [{
	                    title: "",
	                    fieldName: "id",
	                    fieldType: "cb",
	                }, 
					{
						//设备编号
						title: this.$t("bd.hal.equipmentCode"),
						fieldName: "code",
						fieldType: "link",
						filterType: "text",
                        width: 160
					},
					{
						//设备设施名称
						title: this.$t("bd.hal.equipmentName"),
						fieldName: "name",
						filterType: "text",
						filterName: "criteria.strValue.equipmentName",
                        width: 200
					},
					{
						//工艺编号
						title: "工艺编号",
						fieldName: "technicsNo",
						filterType: "text",
						filterName: "technicsNo",
						width: 200
					},
					{
						title: this.$t("bd.hal.equipmentType"),
						fieldName: "equipmentType.name",
						filterType: "text",
						filterName: "criteria.strValue.equipmentTypeName",
						orderName : "ifnull(equipmenttype.attr4,equipmenttype.name)",
                        width: 160,
						'renderClass': "textarea",
						fieldType: "custom",
						render: function (data) {
							if(data && data.equipmentType){
								if(data.equipmentType.attr4){
									return data.equipmentType.attr4;
								}else {
									return data.equipmentType.name
								}
							}else{
								return "";
							}
						},
					},
					LIB.tableMgr.column.company,
					LIB.tableMgr.column.dept,
					{
						title: "属地",
						fieldName: "dominationArea.name",
            			filterName: "criteria.strValue.dominationAreaName",
						filterType: "text"
					},
					{
						title: this.$t("bd.hal.equipmentNumber"),
						fieldName: "version",
						filterType: "text",
                        width: 160
					},
					{
						title: "负责人",
						fieldName: "user.username",
						filterType: "text",
						filterName: "criteria.strValue.userName",
                        width: 100
					},
					{
						//设备登记日期
						title: "设备登记日期",
						fieldName: "createDate",
						filterType: "date",
                        width: 180
					},
					/*LIB.tableMgr.column.company,
					LIB.tableMgr.column.dept,*/

					/*{
						//是否禁用 0启用，1禁用
						//title: "是否禁用",
						title: this.$t("gb.common.state"),
						fieldName: "disable",
                        filterType: "enum",
                        filterName: "criteria.intsValue.disable"
					},*/
					{
						//保修期(月)
						title: "保修期(月)",
						fieldName: "warranty",
						filterType: "number",
                        width: 120
					},
					{
						//报废日期
						title: "报废日期",
						fieldName: "retirementDate",
						filterType: "date"
					},
					{
						//设备设施状态 0再用,1停用,2报废
						title: "设备状态",
						fieldName: "state",
						fieldType: "custom",
                        filterType: "enum",
	                    filterName: "criteria.strsValue.state",
                        popFilterEnum : LIB.getDataDicList("stateData"),
                        render: function (data) {
                            return LIB.getDataDic("stateData",data.state);
                        },
                        width: 100
					},
						{
							//设备设施状态 0再用,1停用,2报废
							title: "ABC分级",
							fieldName: "level",
							filterType: "enum",
							filterName: "level",
							filterName: "criteria.strsValue.level",
							popFilterEnum : LIB.getDataDicList("ABC_level"),
							width: 100
						},
						{
							//设备设施状态 0再用,1停用,2报废
							title: "专业",
							fieldName: "speciality",
							filterType: "enum",
							filterName: "speciality",
							filterName: "criteria.strsValue.speciality",
							popFilterEnum : LIB.getDataDicList("equipment_speciality"),
							width: 100
						},
					/*{
						//保修终止日期 根据保修期自动算出
						title: "保修终止日期",
						fieldName: "warrantyPeriod",
						filterType: "date"
					},*/
//					{
//						//设备更新日期
//						title: "设备更新日期",
//						fieldName: "modifyDate",
//						filterType: "date"
//					},
	                ]
	            }
            ),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/equipment/importExcel"
            },
            exportModel : {
            	 url: "/equipment/exportExcel"
            },
            templete : {
                url: "/equipment/file/down"
            },
            importProgress:{
                show: false
            },
			filterTabId:"all",
			isSuperadmin:LIB.user.id=="9999999999"
        };
    }

    var vm = LIB.VueEx.extend({
		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainPanel],
    	template: tpl,
        data: initDataModel,
        components: {
            "detailPanel": detailPanel,
            "importprogress":importProgress

        },
        methods: {
			doCheckScrap: function(){
				var _this = this;
				api.checkScrap().then(function(){
					_this.$refs.mainTable.doQueryByFilter([]);
				});
			},
			doFilterBySpecial: function (status) {
				this.filterTabId = status;
				this._normalizeFilterParam(status);
			},
			_normalizeFilterParam: function (status) {
				var params = [];
				params.push({
					value : {
						columnFilterName : "criteria.strValue.filterFlag",
						columnFilterValue : status
					},
					type : "save"
				});
				this.$refs.mainTable.doQueryByFilter(params);
			},
            doImport:function(){
                var _this=this;
                _this.importProgress.show = true;
            },
			initData: function () {
				var path = this.$route.path;
				//临时用这个区分西部管道
				if(path === '/riskAssessment/equip/equipment' || path === '/basicSetting/basicFile/xbgd/equipment'){
					this.templete.url = "/equipment/file/down?type=100";//西部管道
					this.uploadModel.url = "/equipment/importExcel?type=100";
					this.exportModel.url = "/equipment/xbgd/exportExcel";
				}else{
					this.templete.url = "/equipment/file/down";
					this.uploadModel.url = "/equipment/importExcel";
					this.exportModel.url = "/equipment/exportExcel";
				}
			}
        },
        events: {
        },
        init: function () {
            this.$api = api;
        },
		attached: function () {
			this.doFilterBySpecial('all');
        },
		ready: function () {
			var query = this.$route.query;
			if (query.expiring === '1') {
				this.doFilterBySpecial('expiring');
			}
			this.isShowIdentificationButton = LIB.getBusinessSetStateByNamePath('common.enableEquipIdent');
        }
    });

    return vm;
});
