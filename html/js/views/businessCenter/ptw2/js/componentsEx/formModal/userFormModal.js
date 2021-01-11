define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./userFormModal.html");

	//初始化数据模型
	var newVO = function() {
		return {
			//用户编码
			code : null,
			//禁用标识 0未禁用，1已禁用
			disable : "0",
			//手机号
			mobile : null,
			//
			serialNumber : null,
			//
			compId : null,
			//企业id
			orgId : null,
			//邮箱
			email : null,
			//头像编码
			face : null,
			//头像标识 标明头像是否更新
			faceFlag : null,
			//用户头像id
			faceid : null,
			//首页菜单
			homeMenu : null,
			//是否抽检人 0:否(默认) 1：是
			isRandomPeople : null,
			//加密盐
			keysata : null,
			//最近登陆时间
			lastLoginDate : null,
			//最后登录的手机Imei
			lastLoginImei : null,
			//最近登陆ip
			lastLoginIp : null,
			//最后登录地理位置
			lastLoginQth : null,
			//登录名
			loginName : null,
			//登陆方式
			loginType : null,
			//备用手机
			mobile2 : null,
			//用户昵称
			nickname : null,
			//用户密码
			password : null,
			//备注
			remarks : null,
			//状态 0:离职,1:在职,2.其他
			status : null,
			//用户类型 0:非正式用户,1:正式用户
			type : null,
			//用户姓名
			username : null,
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
				"code" : [LIB.formRuleMgr.require("用户编码"),
						  LIB.formRuleMgr.length(100)
				],
				"disable" :LIB.formRuleMgr.require("状态"),
				"mobile" : [LIB.formRuleMgr.require("手机号"),
						  LIB.formRuleMgr.length(15)
				],
				"serialNumber" : LIB.formRuleMgr.range(0, 100).concat(LIB.formRuleMgr.require("")),
				"compId" : [LIB.formRuleMgr.require("")],
				"orgId" : [LIB.formRuleMgr.length(10)],
				"email" : [LIB.formRuleMgr.length(50)],
				"face" : [LIB.formRuleMgr.length(65535)],
				"faceFlag" : [LIB.formRuleMgr.length(10)],
				"faceid" : [LIB.formRuleMgr.length(10)],
				"homeMenu" : [LIB.formRuleMgr.length(65535)],
				"isRandomPeople" : LIB.formRuleMgr.range(0, 100).concat(LIB.formRuleMgr.allowIntEmpty),
				"keysata" : [LIB.formRuleMgr.length(200)],
				"lastLoginDate" : [LIB.formRuleMgr.allowStrEmpty],
				"lastLoginImei" : [LIB.formRuleMgr.length(100)],
				"lastLoginIp" : [LIB.formRuleMgr.length(50)],
				"lastLoginQth" : [LIB.formRuleMgr.length(200)],
				"loginName" : [LIB.formRuleMgr.length(50)],
				"loginType" : LIB.formRuleMgr.range(0, 100).concat(LIB.formRuleMgr.allowIntEmpty),
				"mobile2" : [LIB.formRuleMgr.length(15)],
				"nickname" : [LIB.formRuleMgr.length(100)],
				"password" : [LIB.formRuleMgr.length(50)],
				"remarks" : [LIB.formRuleMgr.length(500)],
				"status" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
				"type" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
				"username" : [LIB.formRuleMgr.length(50)],
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