define(function(require) {
    var LIB = require('lib');
	var template = require("text!./multiSelectInput.html");
	var clickoutside = require("components/directives/clickoutside");
    var opts = {
		name:"multiSelectInput",
		template:template,
		directives: { clickoutside:clickoutside },
		data:function(){
			return {
				hover:false,
				disabled:false
            };
		},
		props:{
			readonly:{
				type : Boolean,
				default : false
			},
			selectedMultiple : {
				type : Array,
				required : true
			},
			idField : {
				type : String,
				default : "id"
			},
			displayField : {
				type : String,
				default : "name"
			}
		},
		computed: {
			clazz:function(){
				var oot ={};
				oot['ivu-select-hover'] = this.hover;
				return [oot];
			},
			inputClazz:function(){
				var oot = {};
				oot['isReadonly'] = this.readonly;
				return ['ivu-select-selection', oot];
			},
			icoStyle:function(){
				return {
					'cursor': 'pointer',
					'line-height': '28px',
					'color':'#56b5ff',
					'top': '2px',
					'left':'241px',
					'position': 'absolute'
				}
			}
		},
		methods:{
			//鼠标移入 移出
			doMouseEnter:function(){
				this.hover = true;
			},
			doMouseLeave:function(){
				this.hover = false;
			},
			toggleMenu:function(){
				if (this.disabled) {
					return false;
				}
				this.$emit('on-click');
			},
			showLabel:function(item){
				return item[this.displayField];
			},
			removeTag: function removeTag(index) {
				if (this.disabled) {
					return false;
				}
				this.selectedMultiple.splice(index, 1);
			},
			handleClose:function(){
				this.visible = false;
			}
		}
	};

	var component = LIB.Vue.extend(opts);
	return component;
});