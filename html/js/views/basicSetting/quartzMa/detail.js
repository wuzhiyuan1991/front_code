define(function(require){
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail.html");
	//初始化数据模型
	var newVO = function() {
		return {
			quartzJobName : null,
			//备注
			description : 0,
			//执行频率
			cron : null,
			//任务状态
			triggerState:null,
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
				"cron" : [LIB.formRuleMgr.require("cron表达式"),LIB.formRuleMgr.length(200,1)],
	        },
	        emptyRules:{}
		},
		tableModel : {
		},
		formModel : {
		},
		selectModel : {
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
			doSave: function() {

                //当beforeDoSave方法明确返回false时,不继续执行doSave方法, 返回undefine和true都会执行后续方法
                if (this.beforeDoSave() === false) {
                    return;
                }

                var _this = this;
                var _data = this.mainModel;

                this.$refs.ruleform.validate(function(valid) {
                    if (valid) {
                        if (_this.afterFormValidate && !_this.afterFormValidate()) {
                            return;
                        }
                        var _vo = _this.buildSaveData() || _data.vo;
                            _this.$api.update(_vo).then(function(res) {
                                LIB.Msg.info("保存成功");
                                _this.afterDoSave({ type: "U" }, res.body);
                                _this.changeView("view");
                                _this.$dispatch("ev_dtUpdate");
                            });
                    } else {
                        //console.error('doSave error submit!!');
                    }
                });
            },
            doPause: function() {
            	var _this = this;
                LIB.Modal.confirm({
                    title: '确定暂停该任务?',
                    onOk: function() {
                        _this.$api.pause(null, _this.mainModel.vo).then(function() {
                            LIB.Msg.info("暂停成功");
                            _this.mainModel.vo.triggerState = 'PAUSED';
                            _this.changeView("view");
                            _this.$dispatch("ev_dtUpdate");
                        });
                    }
                });
            },
            doResume: function() {
            	var _this = this;
                LIB.Modal.confirm({
                    title: '确定恢复该任务?',
                    onOk: function() {
                        _this.$api.resume(null, _this.mainModel.vo).then(function() {
                            LIB.Msg.info("恢复成功");
                            _this.mainModel.vo.triggerState = 'NORMAL';
                            _this.changeView("view");
                            _this.$dispatch("ev_dtUpdate");
                        });
                    }
                });
            },
		},
		events: {
            //edit框数据加载
            "ev_dtReload": function(data) {
            	this.mainModel.isReadOnly = true;
                _.deepExtend(this.mainModel.vo,data);
            }

        },
        ready: function(){
        	this.$api = api;
        }
	});

	return detail;
});