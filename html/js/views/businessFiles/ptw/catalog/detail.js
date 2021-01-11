define(function(require){
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail.html");

	//初始化数据模型
	var newVO = function() {
		var obj= {
			id : null,
			//编码
			code : null,
			//(级别/指标）名称/承诺岗位
			name : '',
			//启用/禁用 0:启用,1:禁用
			disable : "0",
			//字典类型 1:作业类型,2:作业分级,3:个人防护设备,4:气体检测指标,5:签发角色,6:作业取消声明,7:作业完成声明,8:作业监护人承诺,9:开工前-气体检测结论,10:安全教育人承诺
			type : null,
			//是否应用承诺 0:否,1:是
			enableCommitment : null,
			//分级依据/标准范围/承诺内容
			content : null,
			//标准范围与最大值关系 1:小于,2:小于等于
			gasMaxCase : null,
			//气体标准范围最大值
			gasMaxValue : null,
			//最小值与标准范围关系 1:小于,2:小于等于
			gasMinCase : 1,
			//气体标准范围最小值
			gasMinValue : null,
			//气体检测指标类型 1:有毒有害气体或蒸汽,2:可燃气体或蒸汽,3:氧气
			gasType : null,
			//作业级别
			level : null,
			//单位（气体检测指标）
			unit : null,
			// 启用标准范围精准匹配模式
			attr1:null,
		};
		return obj;
	};
	//Vue数据
	var dataModel = {
        orgId: null,
        isTop: false,
		mainModel : {
			vo : newVO(),
			opType : 'view',
			isReadOnly : true,
			title:"",
			initNewData:undefined,
			rules:{},
			levelRules:{
				"name" : [LIB.formRuleMgr.require("名称"),
					LIB.formRuleMgr.length(50)
				],
				"content" : [LIB.formRuleMgr.length(500)],
			},
			//验证规则
			rulespms:{
				"code" : [LIB.formRuleMgr.length(255)],
				"name" : [LIB.formRuleMgr.require("(级别/指标）名称/承诺岗位"),
					LIB.formRuleMgr.length(50)
				],
				"type" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.require("字典类型")),
				"commitmentType" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
				"content" : [LIB.formRuleMgr.length(500)],
				"gasType" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
				"level" : LIB.formRuleMgr.range(0, 100).concat(LIB.formRuleMgr.allowIntEmpty),
				"unit" : [LIB.formRuleMgr.require("单位"),LIB.formRuleMgr.length(50)],
				gasMinValue: [
					{	required: true,
						validator: function (rule, value, callback) {
							var isGasType = (dataModel.mainModel.vo.type == 4);
							var enableGasStandard = dataModel.enableGasStandard;
							var gasMinValue = value;
							var gasMaxValue = dataModel.mainModel.vo.gasMaxValue;
							var gasMinCase = dataModel.mainModel.vo.gasMinCase;
							var gasMaxCase = dataModel.mainModel.vo.gasMaxCase;

							if(!gasMinCase) gasMinCase=null;
                            if(!gasMaxCase) gasMaxCase=null;
                            if(!gasMinValue) gasMinValue=null;
                            if(!gasMaxValue) gasMaxValue=null;

							if (isGasType && dataModel.mainModel.vo.attr1=='1') {
								if (gasMinValue && gasMinValue.length>10) {
									return callback(new Error('最小值长度不能超过10'));
								}
								if (gasMinValue && gasMaxValue.length>10) {
									return callback(new Error('最大值长度不能超过10'));
								}
								if(gasMinValue && isNaN(gasMinValue)) {
									return callback(new Error('请输入数字'));
								}
								if(gasMaxValue && isNaN(gasMaxValue)) {
									return callback(new Error('请输入数字'));
								}
								if(gasMinValue == undefined && gasMaxValue == undefined) {
									return callback(new Error('最小值与最大值至少填写一个'))
								}
								if(parseFloat(gasMinValue)  > parseFloat(gasMaxValue)) {
									return callback(new Error('最小值不能大于最大值'))
								}
								if(parseFloat(gasMinValue) == parseFloat(gasMaxValue) && (gasMinCase != 2 || gasMaxCase != 2)) {
									return callback(new Error('取值范围不能为0'))
								}
								if(parseFloat(gasMinValue) < 0) {
									return callback(new Error('最小值不能小于0'))
								}
								if(parseFloat(gasMaxValue) <= 0) {
									return callback(new Error('最大必须大于0'))
								}
								if((gasMinValue!=null && gasMinCase==null) ){
                                    return callback(new Error('请填写“<”或者“<=”'))
								}
                                if((gasMaxValue!=null && gasMaxCase==null) ){
                                    return callback(new Error('请填写“<”或者“<=”'))
                                }
                                // if((gasMinValue==null && gasMinCase!=null) ){
                                //     return callback(new Error('请填写最小值'))
                                // }
                                // if((gasMaxValue==null && gasMaxCase!=null) ){
                                //     return callback(new Error('请填写最大值'))
                                // }
							}
							return callback();
						}
					}
				]
			},
			signRules:{
				content:[LIB.formRuleMgr.length(500),LIB.formRuleMgr.require("承诺内容")]
			}
		},
		enableGasStandard: false

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
		},
		computed:{
			isWorkLevel:function(){
				return this.mainModel.vo.type == 2;
			},
			isGasCheck:function(){
				return  this.mainModel.vo.type == 4;
			},
			isPromision:function(){
				return  this.mainModel.vo.type == 8 || this.mainModel.vo.type == 9 || this.mainModel.vo.type == 10;
			},
			typeContent:function () {
				var map={"2":"分级依据","4":"标准范围","6":"声明内容","7":"声明内容","8":"承诺内容","9":"结论内容","10":"承诺内容"};
				return map[this.mainModel.vo.type];
			}
		},
		data:function(){
			return dataModel;
		},
		watch:{
			'mainModel.vo.type':function (val) {
				if(val==2){
					this.mainModel.rules = this.mainModel.levelRules;
				}else if(val == 4){
					this.mainModel.rules = this.mainModel.rulespms;
				}else if (val ==  5){
					this.mainModel.rules = this.mainModel.signRules;
				}
			},
		},
		methods:{
			newVO : newVO,
			beforeDoSave: function() {
                var vo = this.mainModel.vo;
                vo.compId = this.orgId ;
                vo.orgId = this.orgId ;
                if(this.isTop) {
                	LIB.Msg.error("请选择公司");
                	return false;
				}

				if(!this.isGasCheck) {
					return;
				}
				if(!vo.criteria) {
					vo.criteria = {}
				}
				if(!vo.criteria.strValue) {
					vo.criteria.strValue = {};
				}
				if(this.enableGasStandard) {
					if(_.isEmpty(vo.gasMinValue)) {
						vo.criteria.strValue.gasMinValue_empty = "1";
					}
					if(_.isEmpty(vo.gasMaxValue)) {
						vo.criteria.strValue.gasMaxValue_empty = "1";
					}
					vo.criteria.strValue.content_empty = "1";
				}else {
					if(!vo.criteria.intValue) {
						vo.criteria.intValue = {};
					}
					vo.criteria.strValue.gasMinValue_empty = "1";
					vo.criteria.strValue.gasMaxValue_empty = "1";
					vo.criteria.intValue.gasMinCase_empty = 1;
					vo.criteria.intValue.gasMaxCase_empty = 1;
				}
			},
			afterDoDelete:function () {
				this.$dispatch("ev_dtUpdate");
			},
			afterInit: function() {
				var _this = this;
				if(this.mainModel.vo.type == 4 ) {

					_this.mainModel.vo.gasMinValue = null;
					_this.mainModel.vo.gasMaxValue = null;
					_this.mainModel.vo.gasMinCase = '1';
					_this.mainModel.vo.gasMaxCase = '1';

return ;
					api.queryLookupItem().then(function(res){
						if(res.data && res.data.disable == 0 && res.data.value == 1) {
							_this.enableGasStandard = true;
						}
						// if(_this.mainModel.vo.attr1=='1') {
						// 	// _this.mainModel.vo.gasMinCase = '1';
						// 	// _this.mainModel.vo.gasMaxCase = '1';
						// 	_this.mainModel.vo.content = null;
						// }else {
						// 	if(_this.mainModel.opType == 'create'){
                         //        _this.mainModel.vo.gasMinCase = '1';
                         //        _this.mainModel.vo.gasMaxCase = '1';
                         //        _this.mainModel.vo.content = null;
						// 	}
						// 	_this.mainModel.vo.gasMinValue = null;
						// 	_this.mainModel.vo.gasMaxValue = null;
						// 	_this.mainModel.vo.gasMinCase = null;
						// 	_this.mainModel.vo.gasMaxCase = null;
						// }
					})
				}
			},
			afterInitData: function() {
				var _this = this;
				if(this.mainModel.vo.type == 4 ) {
					api.queryLookupItem().then(function(res){
						if(res.data && res.data.disable == 0 && res.data.value == 1) {
							_this.enableGasStandard = true;
						}
						if(_this.mainModel.vo.attr1=='1') {
							// _this.mainModel.vo.gasMinCase = '1';
							// _this.mainModel.vo.gasMaxCase = '1';
							if(isNaN(_this.mainModel.vo.gasMinCase)) _this.mainModel.vo.gasMinCase = '1';
                            if(isNaN(_this.mainModel.vo.gasMaxCase)) _this.mainModel.vo.gasMaxCase = '1';

							_this.mainModel.vo.content = null;
						}else {
							_this.mainModel.vo.gasMinValue = null;
							_this.mainModel.vo.gasMaxValue = null;
                            if(isNaN(_this.mainModel.vo.gasMinCase)) _this.mainModel.vo.gasMinCase = '1';
                            if(isNaN(_this.mainModel.vo.gasMaxCase)) _this.mainModel.vo.gasMaxCase = '1';

                            // _this.mainModel.vo.gasMaxCase = null;
						}
					})
				}
			}
		},
		init: function(){
			this.$api = api;
		},
        events: {
            'do-org-category-change': function (orgId, isTop) {
                this.orgId = orgId || null;
                this.isTop = isTop;
            }
        }

	});

	return detail;
});