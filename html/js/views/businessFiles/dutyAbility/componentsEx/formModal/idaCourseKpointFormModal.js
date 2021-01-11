define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./idaCourseKpointFormModal.html");

	//初始化数据模型
	var newVO = function() {
		return {
			//唯一标识
			code : null,
			//节点名称
			name : null,
			//禁用标识 0未禁用，1已禁用
			disable : "0",
			//文本
			content : null,
			//课件类型 1视频 2图片 3word 4excel 5ppt 6pdf
			fileType : null,
			//是否可以试听 1免费,2收费
			isFree : null,
			//节点类型 0章,1节
			kpointType : null,
			//直播开始时间
			liveBeginTime : null,
			//直播结束时间
			liveEndTime : null,
			//直播地址
			liveUrl : null,
			//页数
			pageCount : null,
			//课后作业版本号 更新次数
			paperVersion : null,
			//播放次数
			playCount : null,
			//播放时间
			playTime : null,
			//视频类型
			videoType : null,
			//视频地址
			videoUrl : null,
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
				"code" : [LIB.formRuleMgr.length(100)],
				"name" : [LIB.formRuleMgr.length(255)],
				"disable" :LIB.formRuleMgr.require("状态"),
				"content" : [LIB.formRuleMgr.length(2147483647)],
				"fileType" : [LIB.formRuleMgr.length(20)],
				"isFree" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
				"kpointType" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
				"liveBeginTime" : [LIB.formRuleMgr.allowStrEmpty],
				"liveEndTime" : [LIB.formRuleMgr.allowStrEmpty],
				"liveUrl" : [LIB.formRuleMgr.length(200)],
				"pageCount" : LIB.formRuleMgr.range(0, 100).concat(LIB.formRuleMgr.allowIntEmpty),
				"paperVersion" : LIB.formRuleMgr.range(0, 100).concat(LIB.formRuleMgr.allowIntEmpty),
				"playCount" : LIB.formRuleMgr.range(0, 100).concat(LIB.formRuleMgr.allowIntEmpty),
				"playTime" : [LIB.formRuleMgr.length(100)],
				"videoType" : [LIB.formRuleMgr.length(30)],
				"videoUrl" : [LIB.formRuleMgr.length(500)],
	        },
	        emptyRules:{}
		},

	};
	
	var detail = LIB.Vue.extend({
		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.formModal],
		template: tpl,
		components : {
			
		},
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			
		}
	});
	
	return detail;
});