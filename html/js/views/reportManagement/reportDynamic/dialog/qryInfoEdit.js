/**
 * 查询方案保存、修改
 */
define(function(require) {
	var LIB = require('lib');
	var api = require("../../tools/vuex/qryInfoApi");
    var template = require("text!./qryInfoEdit.html");
    var newMainModel = function(){
    	return {
			id:null,
			name:null,
			type:null,
			accessPermission:null,
			details:{
				item:null,
				typeOfRange:null,
				indicators:null,
				objRange:null,
				beginDate:null,
				endDate:null
			}
		}
    }
    var dataModel = {
    		mainModel:newMainModel(),
    		qryInfoList:[],
			_details:{},
			rules: {
				type: [
					{required: true, message: '	请选择方案分类'}
				],
				name: [
					{required: true, message: '	请输入新建方案名称'},
					{ min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
				]
			}
    };
    var opts = {
    		template:template,
    		props:{
    			show:{
    				type:Boolean,
    				'default':false
    			},
				enableChangeQueryType:{
					type:Boolean,
					'default':false
				},
				queryInfoTypes:{
					type:Array,
					'default':function(){
						return [
							{'id':'person','name':'个人检查'},
							{'id':'equip','name':'区域 / 设施'},
							{'id':'checkItem','name':'检查项受检'},
							{'id':'rectification','name':'整改情况'},
							{'id':'taskPlan','name':'计划执行'},
						];
					}
				},
				queryInfoType:String,
    			qryInfoId:String,
    			accessPermission:{//私有、公有
					type:String,
					required:true
				},
    			details:{
    				type:Object,
    				required:true
    			}
    		},
    		data:function(){
    			return dataModel;
    		},
    		computed:{
				displayType:function(){
					var _this = this;
					return _.propertyOf(_.find(this.queryInfoTypes, function(type){
						return type.id === _this._details.item;
					}))("name");
				},
				displayDoSave:function(){
					var _this = this;
					return _.some(this.qryInfoList,function(d,i){
						return d.id === _this.mainModel.id
					});
				}
    		},
    		methods:{
				onISelectChange:function(val){
					this.loadQryInfoList(val);
				},
				loadQryInfoList:function(type){
					var _this = this;
    				var param = {
    						type:type,
							homeType:"1",
							accessPermission:this.accessPermission
    				}
    				this.qryInfoList = [];
    				api.list(param).then(function(res){
    					_this.qryInfoList = res.data;
    				});
				},
				buildMainModel:function(){
					//获取查询方案相关配置
					var details = {};
					_.forEach(this._details, function(value, key) {
						details[key] = value;
					});
					if("containRandomData" in details) {
                        details.containRandomData = details.containRandomData ? '1' : '0';
					}
                    if("containResignedData" in details) {
                        details.containResignedData = details.containResignedData ? '1' : '0';
                    }
					_.extend(this.mainModel.details, details);
					this.mainModel.accessPermission = this.accessPermission;
				},
    			doSave:function(){
    				var _this = this;
					this.buildMainModel();
                     this.$refs.ruleform.validate(function(valid){
                                 if(valid){
									api.update(this.mainModel).then(function(res){
										_this.$emit("save-successed");
										_this.show = false;
									});
								 }

					 })
    			},
    			doSaveAs:function(){
    				var _this = this;
					this.buildMainModel();
    				var param = _.omit(this.mainModel,"id");
					this.$refs.ruleform.validate(function (valid) {
						if (valid) {
							api.save(param).then(function(res){
								_this.$emit("save-successed");
								_this.show = false;
							});
						}
					});
    			}
    		},
			created:function(){
				this.mainModel = newMainModel();
				this.mainModel.id = this.qryInfoId;
				this.mainModel.type = this.queryInfoType;
				this._details = _.deepExtend(this.details);
				this.loadQryInfoList(this.mainModel.type);
			}
    }
    var comp = LIB.Vue.extend(opts);
    return comp;
});