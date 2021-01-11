define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./tpaCheckRecordDetailFormModal.html");
	var tpaCheckRecordSelectModal = require("componentsEx/selectTableModal/tpaCheckRecordSelectModal");

	//初始化数据模型
	var newVO = function() {
		return {
			//id
			id : null,
			//编码
			code : null,
			//检查结果 0:不合格,1:合格,2:不涉及
			checkResult : null,
			//是否禁用 0启用,1禁用
			disable : null,
			//
			groupName : null,
			//组排序
			groupOrderNo : null,
			//是否现场立即整改 0否,1是
			isRectification : null,
			//是否被分享 0:未分享,1:已分享
			isShared : null,
			//项排序
			itemOrderNo : null,
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
			//检查记录
			tpaCheckRecord : {id:'', name:''},
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
				"checkResult" : [LIB.formRuleMgr.length()],
				"disable" : [LIB.formRuleMgr.length()],
				"groupName" : [LIB.formRuleMgr.length()],
				"groupOrderNo" : [LIB.formRuleMgr.length()],
				"isRectification" : [LIB.formRuleMgr.length()],
				"isShared" : [LIB.formRuleMgr.length()],
				"itemOrderNo" : [LIB.formRuleMgr.length()],
				"problem" : [LIB.formRuleMgr.length()],
				"reformType" : [LIB.formRuleMgr.length()],
				"remark" : [LIB.formRuleMgr.length()],
				"shareScope" : [LIB.formRuleMgr.length()],
				"shareType" : [LIB.formRuleMgr.length()],
				"modifyDate" : [LIB.formRuleMgr.length()],
				"createDate" : [LIB.formRuleMgr.length()],	
	        },
	        emptyRules:{}
		},
		selectModel : {
			tpaCheckRecordSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
		},

	};
	
	var detail = LIB.Vue.extend({
		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.formModal],
		template: tpl,
		components : {
			"tpacheckrecordSelectModal":tpaCheckRecordSelectModal,
			
		},
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			doShowTpaCheckRecordSelectModal : function() {
				this.selectModel.tpaCheckRecordSelectModel.visible = true;
				//this.selectModel.tpaCheckRecordSelectModel.filterData = {orgId : this.mainModel.vo.orgId};
			},
			doSaveTpaCheckRecord : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.tpaCheckRecord = selectedDatas[0];
				}
			},
			
		}
	});
	
	return detail;
});