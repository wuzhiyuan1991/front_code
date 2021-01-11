define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./riCheckRecordDetailFormModal.html");
	var riCheckRecordSelectModal = require("componentsEx/selectTableModal/riCheckRecordSelectModal");

	//初始化数据模型
	var newVO = function() {
		return {
			//编码
			code : null,
			//禁用标识 0:未禁用,1:已禁用
			disable : null,
			//抄数
			checkParamResult : null,
			//检查结果 0:不合格,1:合格,2:不涉及
			checkResult : null,
			//是否现场立即整改 0否,1是
			isRectification : null,
			//是否被分享 0:未分享,1:已分享
			isShared : null,
			//项排序
			itemOrderNo : null,
			//潜在危害
			latentDefect : null,
			//问题描述
			problem : null,
			//是否立即整改 0-是,1-否
			reformType : null,
			//备注(临时控制措施)
			remark : null,
			//分享范围
			shareScope : null,
			//分享类型 文字:1006,图片:1007,视频:1008
			shareType : null,
			//修改日期
			modifyDate : null,
			//创建日期
			createDate : null,
			//巡检记录
			riCheckRecord : {id:'', name:''},
		}
	};

	//Vue数据
	var dataModel = {
		mainModel : {
			vo : newVO(),
			opType : 'create',
			isReadOnly : false,
			title:"添加",

			//验证规则
	        rules:{
	        	//"code":[LIB.formRuleMgr.require("编码")]
				"code" : [LIB.formRuleMgr.length()],
				"disable" : LIB.formRuleMgr.require("状态"),
				"checkParamResult" : [LIB.formRuleMgr.length()],
				"checkResult" : LIB.formRuleMgr.range(1, 100),
				"isRectification" : [LIB.formRuleMgr.length()],
				"isShared" : [LIB.formRuleMgr.length()],
				"itemOrderNo" : LIB.formRuleMgr.range(1, 100),
				"latentDefect" : [LIB.formRuleMgr.length()],
				"problem" : [LIB.formRuleMgr.length()],
				"reformType" : [LIB.formRuleMgr.length()],
				"remark" : [LIB.formRuleMgr.length()],
				"shareScope" : LIB.formRuleMgr.range(1, 100),
				"shareType" : LIB.formRuleMgr.range(1, 100),	
	        },
	        emptyRules:{}
		},
		selectModel : {
			riCheckRecordSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
		},

	};
	
	var detail = LIB.Vue.extend({
		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.formModal],
		template: tpl,
		components : {
			"richeckrecordSelectModal":riCheckRecordSelectModal,
			
		},
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			doShowRiCheckRecordSelectModal : function() {
				this.selectModel.riCheckRecordSelectModel.visible = true;
				//this.selectModel.riCheckRecordSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveRiCheckRecord : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.riCheckRecord = selectedDatas[0];
				}
			},
			
		}
	});
	
	return detail;
});