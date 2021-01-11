define(function(require){
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail.html");
	
	//初始化数据模型
	var newVO = function() {
		return {
			//考试日程id
			id : null,
			////考试记录
			paperRecord : {id:'', name:'',createDate:null,testTime:null,userScore:null},
			examSubmit:null,
			////用户
			//user : {id:'', name:''},
			score:null,
			//大题
			paperTopics : [],
			//知识点
			examPoints : [],
			examPaper:{name:null,createType:null,replyTime:null,score:null},
			exam:{examDate:null,place:null,remarks:null},
			//考试状态
			status:null,
			code:null,
            user:{name:""},
			orgId:null,
            result:null,
			attr1: null
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
	        },
	        emptyRules:{}
		},
		//得分
        userScore:null
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
		computed:{
            statusValue:function(){
                var value = this.mainModel.vo.status;
                if(value==0){
                    return "待开始";
                }else if(value ==1 && this.mainModel.vo.paperRecord.id){
                    return "已交卷";
                }else if(value ==1 && !this.mainModel.vo.paperRecord.id){
                    return "已开始";
                }else if(value==2 && this.mainModel.vo.paperRecord.id){
                    return "已结束";
                }else if(value==2 && !this.mainModel.vo.paperRecord.id){
                    return "缺考";
                }
            },
            testTime:function(){
                if (this.mainModel.vo.paperRecord.testTime) {
                    var seconds = parseInt(this.mainModel.vo.paperRecord.testTime);// 秒
                    if(_.isNaN(seconds)) {
                        return '';
                    }
                    var hours = Math.floor(seconds / 3600);
                    seconds = seconds - hours * 3600;
                    var minutes = Math.floor(seconds / 60);
                    seconds = seconds - minutes * 60;

                    var result = '';
                    result += hours > 0 ? hours + '时' : '';
                    result += minutes > 0 ? minutes + '分' : '';
                    result += seconds > 0 ? seconds + '秒' : '';

                    return result;
                } else {
                    return ''
                }
            },

		},
		methods:{
			newVO : newVO,
			beforeInit:function(){
				this.mainModel.vo.examPoints = [];
                this.userScore = null
			},
            afterInitData:function(){
                if(this.mainModel.vo.paperRecord.userScore){
                    this.userScore = this.mainModel.vo.paperRecord.userScore.substr(0, this.mainModel.vo.paperRecord.userScore.length - 2) +"分"
                }
            },
            doShowReport:function() {
            	if(this.mainModel.vo.status != 2) {
        			LIB.Msg.warning("所有人都完成考试后方可查看解析");
					return;
        		}
                if(this.mainModel.vo.paperRecord == null && !!this.mainModel.vo.examSubmit) {
            		LIB.Msg.warning("系统正在评分中，请稍候");
					return;
                }else {
            		window.open(LIB.ctxPath("/front/examschedule/"+this.mainModel.vo.id+"/report"));
                }
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