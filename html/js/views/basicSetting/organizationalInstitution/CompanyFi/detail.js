define(function(require){
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail.html");

	//初始化数据模型
	var newVO = function() {
		return {
			id:null,
			name: null,
			phone: null,
			parentId: null,
			address: null,
			remarks: null,
			attr5: null,
			attr3: null,
			type: 1,
			code: null,
			regionId: null,
			deptList: [],
			countryList: [],
			provinceList: [],
			cityList: [],
            disable:"0",
			organizationExt :{
				id:null,
				//企业类型
				// compGenre:null,
				genre:null,
				//企业法人
				legalPerson:null,
				//组织机构代码
				// organizationCode:null,
				orgCode:null,
				//注册号
				regno: null,
				//行业
				industry:null,
                //企业人数
                population:null,
                //企业产值
                production:null,
				//电子邮箱
				email: null,
				phone : null,
			},
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
			compDate:[{value:"1",name:"国有或国有控股"},{value:"2",name:"股份有限"},{value:"3",name:"有限责任"},{value:"4",name:"中外合资"},{value:"5",name:"外商独资"},
				{value:"6",name:"股份合作"},{value:"7",name:"集体"},{value:"8",name:"合伙"},{value:"9",name:"其他"}],
			rules:{
				// "code" : [LIB.formRuleMgr.require("组织编码"),
				// 	LIB.formRuleMgr.length()
				// ],
				name: [
					{required: true, message: '请输入公司名称'},
					LIB.formRuleMgr.length(50, 1)
				],
				attr5: [
					{required: true, message: '请输入公司简称'},
					LIB.formRuleMgr.length(10, 1)
				],
				parentId: [
					{required: true, message: '请选择所属公司'},
					LIB.formRuleMgr.length(10, 1)
				],
				"organizationExt.genre": [
					{required: true, message: '请选择企业类型'},
				],
                "organizationExt.population": [
                    LIB.formRuleMgr.length(10, 0),
                ],
                "organizationExt.production": [
                    LIB.formRuleMgr.length(30, 0),
                ],
			},
			emptyRules:{},
			queyCountry:null,
			queyProvince:null,
			queyCity:null,
			countryId: "",
			provinceId: "",
			countryIdName:null,
			provinceIdName:null,
			regionIdName:null,
			industryVal:null,
			industryValName:null
		},
        industryList: null
	};
	//Vue组件
	/**
	 *  请统一使用以下顺序配置Vue参数，方便codeview
	 *	el
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
		mixins : [LIB.VueMixin.dataDic,LIB.VueMixin.auth,LIB.VueMixin.detailPanel],
		template: tpl,
		components : {

		},
		data:function(){
			return dataModel;
		},
		computed: {
			//资源池
			genre: function () {
				var edu = this.mainModel.vo.organizationExt.genre;
				if (edu == "1") {
					return "国有或国有控股";
				}else if(edu == "2"){
					return "股份有限";
				}else if(edu == "3"){
					return "有限责任";
				}else if(edu == "4"){
					return "中外合资";
				}else if(edu == "5"){
					return "外商独资";
				}else if(edu == "6"){
					return "股份合作";
				}else if(edu == "7"){
					return "集体";
				}else if(edu == "8"){
					return "合伙";
				}else if(edu == "9"){
					return "其他";
				}
			},
			showComp:function(){
				if(this.mainModel.opType == 'create'){
					return true;
				}
				else if(this.mainModel.opType != 'create'){
					if(this.mainModel.vo.attr3 != null && this.mainModel.vo.attr3 != "" && this.mainModel.vo.parentId != null && this.mainModel.vo.parentId != ""){
						return true;
					}else{
						return false;
					}
				}else{
					return false;
				}
			},
            industryName: function () {
				var _this = this;
				var industry = _.find(this.industryList, function (item) {
					return item.id === _this.mainModel.vo.organizationExt.industry
                })
				return industry ? industry.name : ''
            }
		},
		watch:{
			'mainModel.countryId':function(val,oldVal){
				if (val) {
					api.listRegion({parentId: val}).then(function (res) {
						dataModel.mainModel.vo.provinceList = res.data;
						dataModel.mainModel.vo.cityList = [];
						if(oldVal){
							dataModel.mainModel.vo.regionId = null;
						}

					});
				}else{
					//6744
                    dataModel.mainModel.provinceId = ""
                    dataModel.mainModel.vo.regionId = "";
				}
			},
			'mainModel.provinceId':function(val,oldVal){
				if(val){
					api.listRegion({parentId: val}).then(function (res) {
						dataModel.mainModel.vo.cityList = res.data;
						if(oldVal){
							dataModel.mainModel.vo.regionId = null;
						}
					});

				}else{
					//6744
                    dataModel.mainModel.vo.regionId = "";
				}
			},
		},
		methods:{
			newVO : newVO,
			beforeInit : function(data,opType) {
				var _this = this;
				//清空区域的搜索内容跟省市Id
				_this.mainModel.queyCountry= null;
				_this.mainModel.queyProvince=null;
				_this.mainModel.queyCity=null;
				_this.mainModel.countryId= null;
				_this.mainModel.provinceId=null;
				if(opType.opType == 'create'){
					api.listRegion({regionLevel: 1}).then(function (res) {
						dataModel.mainModel.vo.countryList = res.data;
					});
				}

			},
			afterInitData : function() {
				var _vo = dataModel.mainModel.vo;
				var _data = dataModel.mainModel;
				var _this = this;
				api.listRegion({regionLevel: 1}).then(function (res) {
					_vo.countryList = res.data;
					_this.aftCity();
				});
                if (this.mainModel.action === 'copy') {
                    this.mainModel.vo.name += '（复制）';
                }
			},
			//判断行政区域是否选择完整 后端只接受一个regionId
			beforeDoSave:function(){
				if(this.mainModel.countryId){
					if(!this.mainModel.provinceId){
						LIB.Msg.warning("请选择市级区域");
							return false;
					}else if(!this.mainModel.vo.regionId){
						LIB.Msg.warning("请选择行政区域");
						return false;
					}
				}else{
						return true;
				}
			},
			afterDoCopy:function() {
				var _this = this;
				//因为顶级公司显示的问题 在保存的时候多刷新一遍数据 取的attr3
				api.get({id:_this.mainModel.vo.id}).then(function(res){
					_this.mainModel.vo.attr3 = res.data.attr3;
				});

				LIB.updateOrgCache(this.mainModel.vo);
				this.aftCity();
			},
			afterDoSave:function(type){
				if(type.type=="C"){
					var _this = this;
					//因为顶级公司显示的问题 在保存的时候多刷新一遍数据 取的attr3
					api.get({id:_this.mainModel.vo.id}).then(function(res){
						_this.mainModel.vo.attr3 = res.data.attr3;
					});

				}
				LIB.updateOrgCache(this.mainModel.vo);
				this.aftCity();
			},
            afterDoDelete: function(vo) {
                LIB.updateOrgCache(vo, {type : "delete"});
            },
			aftCity:function() {
				var _vo = dataModel.mainModel.vo;
				var _data = dataModel.mainModel;
				_data.countryIdName = null;
				_data.provinceIdName = null;
				_data.regionIdName = null;
				//初始化数据
				if (_vo.regionId) {
					api.getRegion({id: _vo.regionId}).then(function (res1) {
						_data.countryId = res1.data.country;
						_data.provinceId = res1.data.province;
						_.each(_vo.countryList, function (item) {
							if (_data.countryId == item.id) {
								_data.countryIdName = item.name;
							}
						})
						api.listRegion({parentId: _data.countryId}).then(function (data) {
							_vo.provinceList = data.data;
							_.each(_vo.provinceList, function (item1) {
								if (_data.provinceId == item1.id) {
									_data.provinceIdName = item1.name;
								}
							})
							api.listRegion({parentId: _data.provinceId}).then(function (data1) {
								_vo.cityList = data1.data;
								_.each(_vo.cityList, function (item2) {
									if (_vo.regionId == item2.id) {
										_data.regionIdName = item2.name;
									}
								})
							});
						});

					});
				}
			},

			doEnableDisable: function() {
				var _this = this;
				var data = _this.mainModel.vo;
				var params = {
					id: data.id,
					orgId: data.orgId,
					disable: data.disable === "0" ? "1" : "0"
				};
				var disable = (data.disable == "0") ? "1" : "0";

				if (disable == "1") {//停用判断
					api.countChildrenOrg({id:data.id}).then(function (res) {
						var val = res.data;
						if (val > 0) {
							LIB.Modal.confirm({
								title: data.name+'有子公司，请确认是否要停用？',
								onOk: function () {
									_this.updateDisable(params,data);
								}
							});
						} else {
							_this.updateDisable(params,data);
						}
					})
				} else {
					_this.updateDisable(params,data);
				}
			},

			updateDisable:function(params,data) {
				var _this = this;
				api.updateDisable(null, params).then(function (res) {
					data.disable = (data.disable === "0") ? "1" : "0";
					LIB.Msg.info((data.disable === "0") ? "启用成功" : "停用成功");
					_this.$dispatch("ev_dtUpdate");
				});
			}

		},
		events : {
		},
		init: function(){
			this.$api = api;
		},
		ready: function () {
			var _this = this;
			api.queryIndustryList().then(function (res) {
				_this.industryList = res.data;
            })
        }
	});

	return detail;
});