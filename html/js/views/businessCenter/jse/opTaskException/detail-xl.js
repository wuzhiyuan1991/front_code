define(function(require){
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail-xl.html");
	//初始化数据模型
	var newVO = function() {
		return {
            id : null,
			//唯一标识
			code : null,
			//卡票名称
			name : null,
			//发布标识 0:已发布，1:未发布
			disable : '1',
			//所属部门id
			orgId : null,
			//卡票类型 1:操作票,2:维检修作业卡,3:应急处置卡
			type : '1',
			//审核状态 0:待提交,1:待审核,2:已审核
			status : '0',
			//所属公司id
			compId : null,
			//审核时间（已审核状态独有）
			auditDate : null,
			// 审核人
            // auditorId: null,
			user: null,
			//检修内容/操作流程
			content : null,
			//备注
			remarks : null,
			//修改日期
			// modifyDate : null,
			// 修改人
			// createBy: null,
			//操作票操作步骤
			// opStdSteps : []
            //发令调度员编号
            dispatcherCode:null,
            // 发令调度员姓名
            dispatcherName:null,
            // 调度令编号
            dispatchCode:null,
            opCard: {id: '', name: '', type: '', orgId: ''},
            operators:[],
            supervisors:[],
            auditors:[]
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
            rules: {
            },
			emptyRules: {}
		},
		groupColumns : [
			{
				title : "操作内容",
				fieldName : "content",
				keywordFilterName: "criteria.strValue.keyWordValue_content",
				renderClass: 'textarea-autoheight'
			},
            {
                title : "风险及控制措施",
                fieldName : "risk",
                keywordFilterName: "criteria.strValue.keyWordValue_risk",
                renderClass: 'textarea-autoheight'
            },
			{
				title : "操作人",
				fieldName : "operator.name",
			},
			{
				title : "操作时间",
				fieldName : "operateTime",
			},
			{
				title : "监护人",
				fieldName : "supervisor.name",
			},
			{
				title : "监护人确认时间",
				fieldName : "confirmTime",
			},
		],
		cardModel : {
			stepCardModel : {
				showContent : true
			}
		},
        selectModel: {

        },
		groups: null,
        activeTabName: '1',
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
        computed: {
        },
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
            _getVO: function () {
                var _this = this;
                api.get({id: this.mainModel.vo.id}).then(function (res) {
                    if(res.data) {
                        _.deepExtend(_this.mainModel.vo, res.data);
                    }
                })
            },
			 _getItems: function () {
				var container = this.$els.container;
				var top = container.scrollTop;
				var _this = this;
				api.getGroupAndItem({id: this.mainModel.vo.id}).then(function (res) {
					var groups = res.data.OpTaskStep;
					var items = res.data.OpTaskStepItem;
					_this._convertData(groups, items);
					_this.$nextTick(function () {
                        container.scrollTop = top;
                    })
                })	
            },
			_convertData: function (groups, items) {
				// 组按orderNo排序
				var _groups = _.sortBy(groups, function (group) {
					return parseInt(group.orderNo);
                });
				// 项按stepId分组
				var _items = _.groupBy(items, "stepId");
                // 项按orderNo排序, 并将项添加到对应的组中
                _.forEach(_groups, function (group) {
                    group.items = _.sortBy(_items[group.id], function (item) {
                        return parseInt(item.orderNo);
                    });
                });

                this.groups = _groups;
            },
            // 预览
            doPreview: function () {
				this.$emit("do-preview", this.mainModel.vo.id);
            },
			afterInitData : function() {
                this._getItems();
			},
			beforeInit : function() {
				this.groups = null;
				this.activeTabName = '1';
			},
            changeTab: function (tabEle) {
                this.activeTabName = tabEle.key;
            },
        },
		events : {
		},
    	init: function(){
        	this.$api = api;
        },
	});

	return detail;
});