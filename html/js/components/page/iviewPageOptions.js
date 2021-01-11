define(function(require) {	

	var Vue = require("vue");
    var iOption = require("../select/iviewOption");
    var iSelect = require("../select/iviewSelect");
	

	
	var template = '<div v-if="showSizer || showElevator" :class="optsClasses">'+
					        '<div v-if="showSizer" :class="sizerClasses">'+
					    '<i-select :model.sync="pageSize" @on-change="changeSize" :placement="placement">'+
					        '<i-option v-for="item in pageSizeOpts" :value="item" style="text-align:center;">{{ item }} 条/页</i-option>'+
					    '</i-select>'+
					'</div>'+
					'<div v-if="showElevator" :class="ElevatorClasses">'+
					    '跳至'+
					    '<input type="text" :value="_current" @keyup.enter="changePage">'+
					    '页'+
					'</div>'+
					'</div>';
			     
			     
	var prefixCls = 'ivu-page';

	function isValueNumber (value) {
        return (/^[1-9][0-9]*$/).test(value + '');
    }
	
	var opts = {
		template :  template,
		components: { iOption:iSelect, iSelect:iOption },
        props: {
            placement: {
                type: String,
                default: 'top-start'
            },
            pageSizeOpts: Array,
            showSizer: Boolean,
            showElevator: Boolean,
            current: Number,
            _current: Number,
            pageSize: Number,
            allPages: Number
        },
        computed: {
            optsClasses : function() {
                return [
                    prefixCls + '-options'
                ]
            },
            sizerClasses : function() {
                return [
                    prefixCls + '-options-sizer'
                ]
            },
            ElevatorClasses : function() {
                return [
                    prefixCls + '-options-elevator'
                ]
            }
        },
        methods: {
            changeSize : function() {
                this.$emit('on-size', this.pageSize);
            },
            changePage : function(event) {
                var val = event.target.value.trim();
                var page = 0;

                if (isValueNumber(val)) {
                    val = Number(val);
                    if (val != this.current) {
                        var allPages = this.allPages;

                        if (val > allPages) {
                            page = allPages;
                        } else {
                            page = val;
                        }
                    }
                } else {
                    page = 1;
                }

                if (page) {
                    this.$emit('on-page', page);
                    event.target.value = page;
                }
            }
        }
	};
	
	
	var component = Vue.extend(opts);
	Vue.component('options', component);
    
});