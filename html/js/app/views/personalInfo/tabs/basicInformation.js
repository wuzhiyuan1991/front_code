define(function (require) {
	var LIB = require('lib');

	//基本信息
	var tpl = require("text!./basicInformation.html");

	//初始化数据模型
	var newVO = function () {
		return {
			username: null,
            loginName: null,
			mobile: null,
			email: null,
			leaderId: null,
			orgId: null,
			compId:null,
			userDetail: {
				idcard: null,
				nativePlace: null,
				address: null,
				education: null,
				sex: null,
				maritalStatushuan: null,
				//emergencyTelephone: null,//紧急联系电话
				//emergencyPeople: null//紧急联系人
			},
			org: {
				name: null//机构部门
			},
			leader: {
				username: null//上级领导
			},
			remarks: null//备注
		}
	};
	//Vue数据
	var dataModel = {
		mainModel: {
			vo: newVO(),
			dosexlist:[{sex:"0",name:"女"},{sex:"1",name:"男"}],
			doMaritalStatushuan:[{maritalStatushuan:"0",name:"已婚"},{maritalStatushuan:"1",name:"未婚"}],
			education:[{edu:"0",name:"高中"},{edu:"1",name:"本科"},{edu:"2",name:"研究生"},{edu:"3",name:"博士"},{edu:"4",name:"其他"}],
			isReadOnly:true
		},
		isShowCardContent : true,
		disabled:true,
		compName:null
	};
	//Vue组件
	/**
	 *  请统一使用以下顺序配置Vue参数，方便codeview
	 *    el
	 template
	 components
	 componentName
	 props
	 data
	 computed
	 watch
	 methods
	 events
	 vue组件声明周期方法
	 created/beforeCompile/compiled/ready/attached/detached/beforeDestroy/destroyed
	 **/
	var detail = LIB.Vue.extend({
		template: tpl,
		props: ['baseData'],
		data: function () {
			return dataModel;
		},

		computed: {
			//性别
			doSex: function () {
				if (this.mainModel.vo.userDetail.sex == 0) {
					return "女";
				}else if(this.mainModel.vo.userDetail.sex == 1){
					return "男";
				}

			},
			//婚姻状况
			doMaritalStatushuan: function () {
				if (this.mainModel.vo.userDetail.maritalStatushuan == 1) {
					return "已婚";
				}else if(this.mainModel.vo.userDetail.maritalStatushuan == 0){
					return "未婚";
				}

			},
			//文化程度
			doEducation: function () {
				var edu = this.mainModel.vo.userDetail.education;
				if (edu == 0) {
					return "高中";
				} else if (edu == 1) {
					return "本科";
				}
				else if (edu == 2) {
					return "研究生";
				}
				else if (edu == 3) {
					return "博士";
				}
				else if (edu == 4) {
					return "其他";
				}
				else if (edu == 5) {
					return "初中";
				}
				else if (edu == 6) {
					return "大专";
				}
			}
		},
		methods: {
			initData: function () {
				if (this.baseData) {
					//封装数据
					this.mainModel.vo = this.baseData;
				}
			},
		},
		ready: function () {
			this.initData();
		},
		watch: {
			baseData: function () {
				this.initData();
			},
			"mainModel.vo.compId":function(){
				if(this.mainModel.vo.compId){
					dataModel.compName = LIB.getDataDic('org',this.mainModel.vo.compId)['compName'];
				}
			},
		},
		event: {
			"ev_detailevents": function (nVal) {
				this.mainModel.vo.operationType=false;

			}
		}
	});

	return detail;
});