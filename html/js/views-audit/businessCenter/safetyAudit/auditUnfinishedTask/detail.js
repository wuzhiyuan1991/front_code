define(function(require){
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail.html");

    LIB.registerDataDic("audit_unfinished_task_frequency_type", [
        ["1","日"],
        ["2","月"],
        ["3","季"],
        ["4","年"],
        ["5","半年"],
        ["6","周"]
    ]);

	//初始化数据模型
	var newVO = function() {
		return {
			id : null,
			//唯一标识
			code : null,
			//禁用标识 0未禁用，1已禁用
			disable : "0",
			//所属公司Id
			compId : null,
			//组织机构Id
			orgId : null,
			//到期日期
			endDate : null,
			//频率类型 1:日,2:月,3:季,4:年
			frequencyType : null,
            auditPlan:{id:null,name:null},
            auditTable:{id:null,name:null},
			user:{id:null,name:null},
            scorePeople:{id:null,name:null},
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
	        rules:{
				"code" : [LIB.formRuleMgr.length(100)],
				"disable" :LIB.formRuleMgr.require("状态"),
				"compId" : [LIB.formRuleMgr.require("所属公司")],
				"orgId" : [LIB.formRuleMgr.length(10)],
				"endDate" : [LIB.formRuleMgr.allowStrEmpty],
				"frequencyType" : [LIB.formRuleMgr.length(255)],
	        }
		},
        tableModel: {
            detailTableModel : {
                url : "auditunfinishedtask/detail/list/{curPage}/{pageSize}",
                columns: [
                    {
                        title: "要素名称",
                        fieldType: "custom",
                        render: function(data) {
                            if (data.auditElement) {
                                return data.auditElement.name;
                            }
                        },
                        width: 240
                    },
                    {
                        title: "任务名称",
                        fieldType: "custom",
                        render: function(data) {
                            if (data.auditFile) {
                                return data.auditFile.name;
                            }
                        },
                        width: 240
                    },
                    {
                        title: "任务频率",
                        fieldType: "custom",
                        render: function (data) {
                            return LIB.getDataDic("audit_unfinished_task_frequency_type", data.frequencyType);
                        },
                        width: 80
                    },
                    {
                        title: "计划完成时间",
                        fieldType: "custom",
                        render: function (data) {
                            return data.endDate;
                        },
                        width: 150
                    },
                	]
			}
        }
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
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
            afterInitData : function() {
                this.$refs.detailTable.doQuery({auditPlanId : this.mainModel.vo.auditPlanId,endDate:this.mainModel.vo.endDate});
            },
            getDates :function (endDate) {
                var currentTime = Date.now();
                var end_date = new Date(endDate).Format("yyyy-MM-dd 23:59:59");
                var num = (currentTime-Date.parse(end_date))/(1000*3600*24);
                var days = parseInt(Math.ceil(num));
				return days;
            }
		},
		events : {
		},
    	init: function(){
        	this.$api = api;
        }
	});

	return detail;
});