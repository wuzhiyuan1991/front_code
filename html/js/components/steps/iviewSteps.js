define(function(require) {	

	var Vue = require("vue");
    var assist = require("../utils/assist");
	

	
	var template = '<div :class="classes">'+
				        '<slot></slot>'+
			       '</div>';
			     
			     
	var prefixCls = 'ivu-steps';

	var opts = {
		template :  template,
		props: {
            current: {
                type: Number,
                default: 0
            },
            status: {
                validator : function(value) {
                    return assist.oneOf(value, ['wait', 'process', 'finish', 'error']);
                },
                default: 'process'
            },
            size: {
                validator : function(value) {
                    return assist.oneOf(value, ['small']);
                }
            },
            direction: {
                validator : function(value) {
                    return assist.oneOf(value, ['horizontal', 'vertical']);
                },
                default: 'horizontal'
            }
        },
        computed: {
            classes : function() {
                var obj = {};
                obj[prefixCls + '-' + this.size] = !!this.size;
                return [
                    prefixCls,
                    prefixCls + '-' + this.direction,
                    obj
                ]
            }
        },
        ready : function() {
            this.updateChildProps(true);
            this.setNextError();
            this.updateCurrent(true);
        },
        methods: {
            updateChildProps : function(isInit) {
                var total = this.$children.length;
                var _this = this;
                this.$children.forEach(function(child, index) {
                    child.stepNumber = index + 1;

                    if (_this.direction === 'horizontal') {
                        child.total = total;
                    }
                    
                    // 如果已存在status,且在初始化时,则略过
                    // todo 如果当前是error,在current改变时需要处理
                    if (!(isInit && child.status)) {
                        if (index == _this.current) {
                            if (_this.status != 'error') {
                                child.status = 'process';
                            }
                        } else if (index < _this.current) {
                            child.status = 'finish';
                        } else {
                            child.status = 'wait';
                        }
                    }

                    if (child.status != 'error' && index != 0) {
                    	_this.$children[index - 1].nextError = false;
                    }
                });
            },
            setNextError : function() {
                var _this = this;
                this.$children.forEach(function(child, index){
                    if (child.status == 'error' && index != 0) {
                    	_this.$children[index - 1].nextError = true;
                    }
                });
            },
            updateCurrent : function(isInit) {
                if (isInit) {
                	if(this.$children[this.current]) {
	                    var current_status = this.$children[this.current].status;
	                    if (!current_status) {
	                        this.$children[this.current].status = this.status;
                    	}
                   }
                } else {
                    this.$children[this.current].status = this.status;
                }
            }
        },
        watch: {
            current : function() {
                this.updateChildProps();
            },
            status : function() {
                this.updateCurrent();
            }
        }
	};
	
	
	var component = Vue.extend(opts);
	Vue.component('steps', component);
    
});