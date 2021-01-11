define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
    //编辑弹框页面fip (few-info-panel)
    var detailPanel = require("./detail");
	//转隐患弹框页面
	var convertComponent = require("./convert");
    
	//Legacy模式
//	var radomObserFormModal = require("componentsEx/formModal/radomObserFormModal");

    
    var initDataModel = function () {
        return {
			moduleCode : LIB.ModuleCode.BC_Hal_RanO,
            //控制全部分类组件显示
            mainModel: {
                showHeaderTools: false,
                //当前grid所选中的行
                selectedRow: [],
                detailPanelClass : "middle-info-aside"
//				detailPanelClass : "large-info-aside"
            },
            tableModel: LIB.Opts.extendMainTableOpt(
	            {
	                url: "tparadomobser/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [{
						title : "",
						fieldName : "id",
						fieldType : "cb",
					}, {
						title : this.$t("gb.common.code"),
						fieldName : "code",
						width:'240px',
						orderName:"code",
						fieldType : "link",
						filterType : "text"
					},
						{
						title : this.$t("gb.common.checkUser"),
						orderName : "user.username",
						fieldName : "user.username",
						filterType : "text",
						filterName : "criteria.strValue.username"
					},
						LIB.tableMgr.column.company,
						LIB.tableMgr.column.dept,
						{
							title : "设备设施",
							orderName : "equipment.name",
							fieldName : "equipment.name",
							filterType : "text",
							filterName : "criteria.strValue.equipmentName"
						},
					//	{
					//	title : this.$t("gb.common.subjectObj"),
					//	orderName:"checkobject.name",
					//	fieldName : "checkObject.name",
					//	//fieldType:"custom",
					//	//render: function(data){
					//	//	if(data.checkObject){
					//	//		return data.checkObject.name;
					//	//	}
					//	//},
					//	filterType : "text",
					//	filterName : "criteria.strValue.checkobjectName"
					//},
						{
						title : this.$t("gb.common.checkTime"),
						fieldName : "checkDate",
						filterType : "date"
					}, {
						title : this.$t("gb.common.content"),
						orderName : "content",
						fieldName : "content",
						filterType : "text"
					}, {
						title :this.$t("bc.hal.source"),
						orderName : "checkSource",
						fieldName : "checkSource",
						filterType : "enum",
						filterName : "criteria.intsValue.checkSource",
					}, {
						title : this.$t("gb.common.state"),
						orderName:"status",
						fieldType:"custom",
						render: function(data){
							return LIB.getDataDic("randomObservation_status",data.status);
						},
						popFilterEnum : LIB.getDataDicList("randomObservation_status"),
						filterType : "enum",
						filterName : "criteria.intsValue.status"
					}, {
						title : this.$t("gb.common.createTime"),
						fieldName : "createDate",
						filterType : "date"
					}, {
						title : this.$t("gb.common.modifyTime"),
						fieldName : "modifyDate",
						filterType : "date"
					}],
	                //defaultFilterValue : {"criteria.orderValue" : {fieldName : "createDate", orderType : "1"}}
	            }
            ),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/tparadomobser/importExcel"
            },
            exportModel : {
            	 url: "/tparadomobser/exportExcel"
            },
			convertModel : {
				//控制转隐患组件显示
				title : "转隐患",
				//显示转隐患弹框
				show : false,
				id: null
			}
            
        };
    }

    var vm = LIB.VueEx.extend({
		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainPanel],
    	template: tpl,
        data: initDataModel,
        components: {
            "detailPanel": detailPanel,
			"convertComponent":convertComponent

        },
        methods: {
			//转隐患
			doConvert:function(){
				var rows = this.tableModel.selectedDatas;
				if(rows.length > 1){
					LIB.Msg.warning("无法批量操作数据");
					return;
				}
				var row = rows[0];
				//判断是否已转隐患
				if(row.status != 1){
					LIB.Msg.warning("请选择【待审核】状态的数据!");
					return;
				}
				this.convertModel.show = true;
				this.convertModel.title = "审核";
				this.convertModel.id = row.id;
				this.$broadcast('ev_convertReload',row);
			},
			//否决
			doVedo:function(){
				var _this = this;
                var rows = _this.tableModel.selectedDatas;
                if(rows.length > 1){
                    LIB.Msg.warning("无法批量操作数据!");
                    return;
                }
				if(rows[0].status != 1){
					LIB.Msg.warning("请选择【待审核】状态的数据!");
					return;
				}
				api.vedo(null,rows[0]).then(function(res){
					_.each(rows, function(row){
						row.status = 3;
					});
					_this.emitMainTableEvent("do_update_row_data", {opType:"update", value: rows});
					LIB.Msg.info("否决成功!");
				});

			},
			doConvertFinshed:function(){
				this.convertModel.show = false;
				this.refreshMainTable();
			},
            beforeDoDelete:function(){
                if (this.tableModel.selectedDatas[0].status == 2 || this.tableModel.selectedDatas[0].status == 3){
                    LIB.Msg.warning("已转隐患/被否决的记录不可以删除!");
                    return false;
                }
            },
        },
        ready: function(){
        	this.$api = api;
        }
    });

    return vm;
});
