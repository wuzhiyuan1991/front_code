define(function(require){
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail.html");
	
	//初始化数据模型
    var newVO = function() {
        return {
            //id
            id : null,
            //编码
            code : null,
            //内容
            content : null,
            //来源 0:手机检查,1:web录入,2 其他
            checkSource : null,
            //状态 1:待审核,2:已转隐患,3:被否决
            status : null,
            //类型: 1.随机观察 2.领导力分享
            type : null,
            //
            compId : null,
            //组织id
            orgId : null,
            //审核时间
            auditDate : null,
            //检查时间
            checkDate : null,
            //关闭时间
            closeDate : null,
            //附件类型 文字:1006,图片:1007,视频:1008
            contentType : null,
            //是否禁用 0启用,1禁用
            disable : null,
            //点赞数
            praises : null,
            //发布者姓名
            publisherName : null,
            //是否立即整改 0-是,1-否
            reformType : null,
            //备注
            remarks : null,
            //评论数
            reviews : null,
            //修改日期
            modifyDate : null,
            //创建日期
            createDate : null,
            //公司信息
            projectInfo: null,
            asmtShareComments: []
    	}
    };

    //Vue数据
	var dataModel = {
		mainModel : {
			vo : newVO(),
			opType : 'view',
			isReadOnly : true,
			title:"",
		},
        pictures: [],
		tableModel : {
			// url: '',
			columns: [
				{
					title: "内容",
					fieldName: 'content'
				},
                {
                    title: "评论人",
                    fieldName: 'userName',
                    width: 120
                },
				{
					title: '评论时间',
					fieldName: 'createDate',
					width: 180
				}

			]
		}
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
		components : {},
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
            backgroundStyle : function(fileId){
                return "url("+this.convertPicPath(fileId,'watermark')+"),url("+LIB.ctxPath()+"/html/images/default.png)"
            },
            convertPicPath:LIB.convertPicPath,
            beforeInit: function () {
				this.mainModel.vo.asmtShareComments = [];
            },
            afterInitData : function() {
            	var _this = this;
                this.pictures = [];
                //初始化图片
                api.listFile({recordId : this.mainModel.vo.id}).then(function(res){
                    _this.pictures = _.map(res.data, function (item) {
						return LIB.convertFileData(item);
                    });
                });
            },
		},
		events : {
		},
        init: function(){
        	this.$api = api;
        }
	});

	return detail;
});