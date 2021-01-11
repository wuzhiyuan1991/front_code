define(function(require){
	var LIB = require('lib');
	var api = require("./vuex/api");

    var videoHelper = require("tools/videoHelper");
	//右侧滑出详细页
	var tpl = require("text!./detail.html");
	
	//初始化数据模型
	var newVO = function() {
		return {
			//ID
			id : null,
			//编码
			code : null,
			name : null,
			//公司id
			compId : null,
			//组织id
			orgId : null,
			//内容
			content : null
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
				"name" : [
					LIB.formRuleMgr.require("依据名称"),
					LIB.formRuleMgr.length(255)
				],
				"compId" : [
                    LIB.formRuleMgr.require("所属公司"),
                    LIB.formRuleMgr.length()
				]
	        },
	        emptyRules:{}
		},
        fileModel: {
            rightPic: {
                cfg: {
                    params: {
                        recordId: null,
                        dataType: 'U1',
                        fileType: 'U',
                    },
                    filters: {
                        max_file_size: '10mb',
                        mime_types: [{title: "files", extensions: "png,jpg,jpeg"}]
                    },
                },
                data: []
            },
            wrongPic: {
                cfg: {
                    params:{
                        recordId : null,
                        dataType : 'U2',
                        fileType : 'U',
                    },
                    filters:{
                        max_file_size: '10mb',
                        mime_types: [{ title: "video", extensions: "mp4" }]
                    },
                },
                data: []
            },
            referMater: {
                cfg: {
                    params:{
                        recordId : null,
                        dataType : 'U4',
                        fileType : 'U',
                    },
                    filters:{
                        max_file_size: '10mb',
                        mime_types: [{ title: "file", extensions: "pdf,doc,docx,xls,xlsx,ppt,pptx,zip,rar,txt" }]
                    },
                },
                data: []
            }
        },
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
		methods:{
			newVO : newVO,
		},
		events : {
		},
        init: function () {
            this.$api = api;
        }
	});

	return detail;
});