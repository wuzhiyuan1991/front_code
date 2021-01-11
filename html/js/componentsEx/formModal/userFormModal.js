define(function(require){
	var LIB = require('lib');
	var api = require("views/basicSetting/organizationalInstitution/DepartmentalFi/vuex/api");
 	//数据模型
	var tpl = require("text!./userFormModal.html");

	//初始化数据模型
	var newVO = function() {
		return {
			//用户id
			id : null,
			//用户编码
			code : null,
			//手机号
			mobile : null,
			//
			compId : null,
			//企业id
			orgId : null,
			//是否禁用 0启用,1禁用
			disable : null,
			//邮箱
			email : null,
			//头像编码
			face : null,
			//头像标识 标明头像是否更新
			faceFlag : null,
			//用户头像id
			faceid : null,
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
			//更新日期
			modifyDate : null,
			//创建日期
			createDate : null,
			leaderId:null
		}
	};

	//Vue数据
	var dataModel = {
		mainModel : {
			vo : newVO(),
			opType : 'create',
			isReadOnly : false,
			title:"添加",
			userList:[],
			selectedDatas:[],
			//验证规则
	        rules:{
	        	//"code":[LIB.formRuleMgr.require("编码")]
				"code" : [LIB.formRuleMgr.require("用户编码"),
						  LIB.formRuleMgr.length()
				],
				"mobile" : [LIB.formRuleMgr.require("手机号"),
						  LIB.formRuleMgr.length()
				],
				"username":[LIB.formRuleMgr.require("姓名"),
					LIB.formRuleMgr.length()
				],
				"email":[LIB.formRuleMgr.require("姓名"),
					LIB.formRuleMgr.length()
				],
	        },
	        emptyRules:{}
		}
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
			init:function(opType, nVal){
				var _data = this.mainModel;
				_data.opType = opType;
				var _vo = _data.vo;
				//清空数据
				_.deepExtend(_vo, this.newVO());
				console.log(_vo);
				_data.selectedDatas = [];
				_vo.compId = nVal.compId;
				_vo.orgId = nVal.parentId;
			},
		},
		ready:function(){
			var _this = this;
			_this.mainModel.selectedDatas = [];
			api.listTree().then(function (res) {
				_this.mainModel.userList = res.data;
			});
		}
	});
	
	return detail;
});