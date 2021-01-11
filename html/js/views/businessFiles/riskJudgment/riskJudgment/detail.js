define(function(require){
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail.html");
	var riskJudgmentLevelFormModal = require("componentsEx/formModal/riskJudgmentLevelFormModal");
	var myTable = require("./dialog/mytable");
	//初始化数据模型
	var newVO = function() {
		return {
			id : null,
			//
			code : null,
			//禁用标识 0未禁用，1已禁用
			disable : "1",
			//所属公司id
			compId : null,
			//所属部门id
			orgId : null,
			//制定时间
			formulateDate : null,
			//备注
			remark : null,
			//管控层级
			riskJudgmentLevels : [],
            // ratedCompleteDate:null
		}
	};
	//Vue数据
	var dataModel = {
		mainModel : {
			vo : newVO(),
			opType : 'view',
			isReadOnly : true,
			title:"",
			
			//验证规则
	        rules:{
				"code" : [LIB.formRuleMgr.require(""),
						  LIB.formRuleMgr.length(100)
				],
				"disable" :LIB.formRuleMgr.require("状态"),
				"compId" : [LIB.formRuleMgr.require("所属公司"),{required: true}],
				"orgId" : [LIB.formRuleMgr.length(10)],
				"formulateDate" : [LIB.formRuleMgr.require("制定时间"),{required: true}],
				"remark" : [LIB.formRuleMgr.length(200)],
				// "remark": [LIB.formRuleMgr.length(255)]
	        }
		},
		tableModel : {
			riskJudgmentLevelTableModel : LIB.Opts.extendDetailTableOpt({
				url:"riskjudgment/riskjudgmentlevels/list/{curPage}/{pageSize}?criteria.orderValue.fieldName=orderNo&criteria.orderValue.orderType=0",
				columns : [
					// LIB.tableMgr.ksColumn.sequence,
                    {
                        title: "层级",
                        fieldType:"sequence",
                        width:'80px'
                    },
				// {
				// 	title : "层级",
				// 	fieldName : "orderNo",
				// 	// keywordFilterName: "criteria.strValue.keyWordValue_name"
				// },
					{
						title : "研判层级名称",
						fieldName : "name",
						// keywordFilterName: "criteria.strValue.keyWordValue_name"
					},
					{
						title : "",
						fieldType : "tool",
						toolType : "move,del,edit"
					}]
			}),
		},
		formModel : {
			riskJudgmentLevelFormModel : {
				show : false,
				hiddenFields : ["riskJudgmentId"],
				queryUrl : "riskjudgment/{id}/riskjudgmentlevel/{riskJudgmentLevelId}"
			},
		},
		selectModel : {
		},
        riskJudgLevelSetTingModel:{
			show : false,
            title : '研判层级',
		},
        tir:{groupName:"研判层级"},
        isShowCheckItem:true
	};
	//Vue组件
	/**
	 *  请统一使用以下顺序配置Vue参数，方便codeview
	 *	 el
		 template
		 components
		 componentName
		 props
		 data
		 computed
		 watch
		 methods
			 _XXX    			//内部方法
			 doXXX 				//事件响应方法
			 beforeInit 		//初始化之前回调
			 afterInit			//初始化之后回调
			 afterInitData		//请求 查询 接口后回调
			 afterInitFileData  //请求 查询文件列表 接口后回调
			 beforeDoSave		//请求 新增/更新 接口前回调，返回false时不进行保存操作
			 afterFormValidate	//表单rule的校验通过后回调，，返回false时不进行保存操作
			 buildSaveData		//请求 新增/更新 接口前回调，重新构造接口的参数
			 afterDoSave		//请求 新增/更新 接口后回调
			 beforeDoDelete		//请求 删除 接口前回调
			 afterDoDelete		//请求 删除 接口后回调
		 events
		 vue组件声明周期方法
		 init/created/beforeCompile/compiled/ready/attached/detached/beforeDestroy/destroyed
	 **/
	var detail = LIB.Vue.extend({
		mixins : [LIB.VueMixin.dataDic,LIB.VueMixin.auth,LIB.VueMixin.detailPanel],
		template: tpl,
		components : {
			"riskjudgmentlevelFormModal":riskJudgmentLevelFormModal,
			"myTable":myTable
        },
        computed : {
            displayFormulateDateText: function () {
                return this.mainModel.vo.formulateDate.substr(0, 10);
            }
        },
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			doShowRiskJudgmentLevelFormModal4Update : function(param) {
				this.formModel.riskJudgmentLevelFormModel.show = true;
				this.$refs.riskjudgmentlevelFormModal.init("update", {id: this.mainModel.vo.id, riskJudgmentLevelId: param.entry.data.id});
			},
			doShowRiskJudgmentLevelFormModal4Create : function(param) {
				this.formModel.riskJudgmentLevelFormModel.show = true;
				this.$refs.riskjudgmentlevelFormModal.init("create");
			},
			doSaveRiskJudgmentLevel : function(data) {
				if (data) {
					var isExit = false;
					_.each(this.$refs.riskjudgmentlevelTable.values, function (item) {
							if(data.name == item.name){
								isExit = true;
								return true;
							}
                        })
					if(isExit){
                        LIB.Msg.info("层级名称重复");
                        this.refreshTableData(this.$refs.riskjudgmentlevelTable);
                        this.formModel.riskJudgmentLevelFormModel.show = true;
                        return;
					}

					var _this = this;
                    // data.ratedCompleteDate = "10:00:00";
					api.saveRiskJudgmentLevel({id : this.mainModel.vo.id}, data).then(function() {
						_this.refreshTableData(_this.$refs.riskjudgmentlevelTable);
					});
				}
			},
			doUpdateRiskJudgmentLevel : function(data) {
				if (data) {
					var _this = this;
					var isExit = 0;
                    _.each(this.$refs.riskjudgmentlevelTable.values, function (item) {
                    	if(item.orderNo == data.orderNo){

                    		return;
						}
                        if(data.name == item.name){
                            isExit +=1;
                            return true;
                        }
                    })
                    if(isExit>0){
                        this.formModel.riskJudgmentLevelFormModel.show = true;
                        this.refreshTableData(this.$refs.riskjudgmentlevelTable);

                        LIB.Msg.info("层级名称重复");
                        return;
                    }

					api.updateRiskJudgmentLevel({id : this.mainModel.vo.id}, data).then(function() {
						_this.refreshTableData(_this.$refs.riskjudgmentlevelTable);
					});
				}
			},
			doRemoveRiskJudgmentLevels : function(item) {
                var _this = this;
                var str = this.getToastMgs(item, -1);
                LIB.Modal.confirm({
                    title: str,
                    onOk: function () {
                        var data = item.entry.data;
                        api.removeRiskJudgmentLevels({id : _this.mainModel.vo.id}, [{id : data.id,orderNo : data.orderNo}]).then(function() {
                            _this.$refs.riskjudgmentlevelTable.doRefresh();
                        });
                    }
                });
			},

			getToastMgs:function (item, val) {
                // 获取原数组
                var oldList = this.$refs.riskjudgmentlevelTable.filteredValues;
                var nowIndex = item.cell.rowId;
                var affectIndex = -1;
                _.each(oldList,function (item1, index) {
                    if(val &&  index == item.cell.rowId + val){
                    	affectIndex = index;
					}
                });
                var str = "【" + oldList[nowIndex].data.name + "】";
                if(val && affectIndex > -1){
                	str += "和【"+ oldList[affectIndex].data.name + "】";
				}
				str+="设置的下辖单位会自动清除"
				return str;
            },

			doMoveRiskJudgmentLevels : function(item) {
                var _this = this;
                var str = this.getToastMgs(item, item.offset);
                LIB.Modal.confirm({
                    title: str,
                    onOk: function () {
                        var data = item.entry.data;
                        var param = {
                            id : data.id,
                            riskJudgmentId : dataModel.mainModel.vo.id
                        };
                        _.set(param, "criteria.intValue.offset", item.offset);
                        api.moveRiskJudgmentLevels({id : _this.mainModel.vo.id}, param).then(function() {
                            _this.$refs.riskjudgmentlevelTable.doRefresh();
                        });
                    }
                });
			},
            doShowRiskJudgmentLevelSetting:function () {
                this.riskJudgLevelSetTingModel.show = true;

                this.$refs.mytable.isEdit = this.mainModel.vo.disable;
                this.$refs.mytable.compId = this.mainModel.vo.compId;
            },
			afterInitData : function() {
                var num = this.tableModel.riskJudgmentLevelTableModel.columns.length;
				if (this.mainModel.vo.disable === '0' && num === 3) {
                    this.tableModel.riskJudgmentLevelTableModel.columns.pop();
				}
                if (this.mainModel.vo.disable === '1' && num === 2) {
                    var column = {
                        title: "",
                        fieldType: "tool",
                        toolType: "move,del,edit"
                    }
                    this.tableModel.riskJudgmentLevelTableModel.columns.push(column);
                }
				this.$refs.riskjudgmentlevelTable.doQuery({id : this.mainModel.vo.id});
			},
			beforeInit : function() {
				this.$refs.riskjudgmentlevelTable.doClearData();
			},
            beforeDoSave: function() {
                this.mainModel.vo.orgId = this.mainModel.vo.compId;
            },
            afterInit: function () {
                var vo = this.mainModel.vo;
                var _this = this;
                if (this.mainModel.opType === 'create') {
                    vo.formulateDate = new Date().Format("yyyy-MM-dd");
                }
            },
            buildSaveData: function () {
                var params = _.cloneDeep(this.mainModel.vo);
                if (params.formulateDate.length === 10) {
                    params.formulateDate += ' 00:00:00';
                }
                return params
            },
            beforeDoDelete:function () {
                this.mainModel.vo.formulateDate = null;
            }
		},
		events : {
		},
    	init: function(){
        	this.$api = api;
        }
	});

	return detail;
});