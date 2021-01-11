define(function(require) {

	var LIB = require('lib');
	
	var initDataModel = function () {
        return {
        	mainModel:{
				title:"选择",
				selectedDatas:[]
			},
            tableModel: (
	            {
	                url: "user/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
					 LIB.tableMgr.ksColumn.cb,
					 LIB.tableMgr.ksColumn.code,
					{
						//手机号
						title: "手机号",
						fieldName: "mobile",
						keywordFilterName: "criteria.strValue.keyWordValue_mobile"
					},
					{
						//
						title: "",
						fieldName: "serialNumber",
						keywordFilterName: "criteria.strValue.keyWordValue_serialNumber"
					},
//					 LIB.tableMgr.ksColumn.company,
//					 LIB.tableMgr.ksColumn.dept,
////					{
//						//邮箱
//						title: "邮箱",
//						fieldName: "email",
//						keywordFilterName: "criteria.strValue.keyWordValue_email"
//					},
//					{
//						//头像编码
//						title: "头像编码",
//						fieldName: "face",
//						keywordFilterName: "criteria.strValue.keyWordValue_face"
//					},
//					{
//						//头像标识 标明头像是否更新
//						title: "头像标识",
//						fieldName: "faceFlag",
//						keywordFilterName: "criteria.strValue.keyWordValue_faceFlag"
//					},
//					{
//						//用户头像id
//						title: "用户头像",
//						fieldName: "faceid",
//						keywordFilterName: "criteria.strValue.keyWordValue_faceid"
//					},
//					{
//						//首页菜单
//						title: "首页菜单",
//						fieldName: "homeMenu",
//						keywordFilterName: "criteria.strValue.keyWordValue_homeMenu"
//					},
//					{
//						//是否抽检人 0:否(默认) 1：是
//						title: "是否抽检人",
//						fieldName: "isRandomPeople",
//						keywordFilterName: "criteria.strValue.keyWordValue_isRandomPeople"
//					},
//					{
//						//加密盐
//						title: "加密盐",
//						fieldName: "keysata",
//						keywordFilterName: "criteria.strValue.keyWordValue_keysata"
//					},
//					{
//						//最近登陆时间
//						title: "最近登陆时间",
//						fieldName: "lastLoginDate",
//						keywordFilterName: "criteria.strValue.keyWordValue_lastLoginDate"
//					},
//					{
//						//最后登录的手机Imei
//						title: "最后登录的手机Imei",
//						fieldName: "lastLoginImei",
//						keywordFilterName: "criteria.strValue.keyWordValue_lastLoginImei"
//					},
//					{
//						//最近登陆ip
//						title: "最近登陆ip",
//						fieldName: "lastLoginIp",
//						keywordFilterName: "criteria.strValue.keyWordValue_lastLoginIp"
//					},
//					{
//						//最后登录地理位置
//						title: "最后登录地理位置",
//						fieldName: "lastLoginQth",
//						keywordFilterName: "criteria.strValue.keyWordValue_lastLoginQth"
//					},
//					{
//						//登录名
//						title: "登录名",
//						fieldName: "loginName",
//						keywordFilterName: "criteria.strValue.keyWordValue_loginName"
//					},
//					{
//						//登陆方式
//						title: "登陆方式",
//						fieldName: "loginType",
//						keywordFilterName: "criteria.strValue.keyWordValue_loginType"
//					},
//					{
//						//备用手机
//						title: "备用手机",
//						fieldName: "mobile2",
//						keywordFilterName: "criteria.strValue.keyWordValue_mobile2"
//					},
//					{
//						//用户昵称
//						title: "用户昵称",
//						fieldName: "nickname",
//						keywordFilterName: "criteria.strValue.keyWordValue_nickname"
//					},
//					{
//						//用户密码
//						title: "用户密码",
//						fieldName: "password",
//						keywordFilterName: "criteria.strValue.keyWordValue_password"
//					},
//					{
//						//备注
//						title: "备注",
//						fieldName: "remarks",
//						keywordFilterName: "criteria.strValue.keyWordValue_remarks"
//					},
//					{
//						//状态 0:离职,1:在职,2.其他
//						title: "状态",
//						fieldName: "status",
//						fieldType: "custom",
//						popFilterEnum: LIB.getDataDicList("top_user_status"),
//						render: function (data) {
//							return LIB.getDataDic("top_user_status", data.status);
//						},
//						keywordFilterName: "criteria.strValue.keyWordValue_status"
//					},
//					{
//						//用户类型 0:非正式用户,1:正式用户
//						title: "用户类型",
//						fieldName: "type",
//						fieldType: "custom",
//						popFilterEnum: LIB.getDataDicList("top_user_type"),
//						render: function (data) {
//							return LIB.getDataDic("top_user_type", data.type);
//						},
//						keywordFilterName: "criteria.strValue.keyWordValue_type"
//					},
//					{
//						//用户姓名
//						title: "用户姓名",
//						fieldName: "username",
//						keywordFilterName: "criteria.strValue.keyWordValue_username"
//					},
//					 LIB.tableMgr.ksColumn.modifyDate,
////					 LIB.tableMgr.ksColumn.createDate,
//
	                ],

	                defaultFilterValue : {
	                	"criteria.orderValue" : {fieldName : "modifyDate", orderType : "1"},
						"disable" : 0
	                },
	                resetTriggerFlag:false
	            }
            )
        };
    }
	
	var opts = {
		mixins : [LIB.VueMixin.selectorTableModal],
		data:function(){
			var data = initDataModel();
			return data;
		},
		name:"userSelectTableModal"
	};
	
	var component = LIB.Vue.extend(opts);
	return component;
});