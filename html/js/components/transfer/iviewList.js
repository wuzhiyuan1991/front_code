define(function(require) {
	var Vue = require("vue");
	var template = require("text!./iviewList.html");
	var Search = require('./search');

//    var Checkbox = require('../iviewCheckbox');

	var opts = {
			template : template,
	        components: { "Search":Search},
	        props: {
	            prefixCls: String,
	            data: Array,
	            renderFormat: Function,
	            checkedKeys: Array,
	            style: Object,
	            title: [String, Number],
	            filterable: Boolean,
	            filterPlaceholder: String,
	            filterMethod: Function,
	            notFoundText: String,
	            validKeysCount: Number,
				showcount:{
					type:Boolean,
					default:true
				},
                //是否显示图标
                showFixIco:{
                    type:Boolean,
                    default:false
                }
	        },
	        data :function() {
	            return {
	                showItems: [],
	                query: '',
	                showFooter: true
	            }
	        },
	        computed: {
	            classes :function() {
	            	var obj ={};
	                obj[this.prefixCls+'-with-footer'] = this.showFooter;
	                return [
	                    this.prefixCls,obj
	                ];
	            },
	            bodyClasses :function() {
	            	var obj = {};
	            	obj[this.prefixCls+'-body-with-search']= this.filterable;
	            	obj[this.prefixCls+'-body-with-footer']= this.showFooter;
	                return [
	                    this.prefixCls+'-body',obj
	                ]
	            },
	            count :function() {
	                var validKeysCount = this.validKeysCount;
	                //return (validKeysCount > 0 ? validKeysCount + '/' : '') + this.data.length;
					return this.data.length;
	            },
	            checkedAll :function() {
	                return this.data.filter(function(data){return data && !data.disabled}).length === this.validKeysCount && this.validKeysCount !== 0;
					//return this.validKeysCount && this.validKeysCount !== 0 ? true:false;
	            },
	            checkedAllDisabled:function () {
	                return this.data.filter(function(data){return data && !data.disabled}).length <= 0;
	            }
	        },
	        methods: {
	            itemClasses :function(item) {
	            	var obj = {};
	            	obj[this.prefixCls+'-content-item-disabled']= item.disabled;
	                return [
	                    this.prefixCls+'-content-item',obj
	                ]
	            },
	            showLabel :function(item) {
	                return this.renderFormat(item);
	            },
	            isCheck:function (item) {
	                return this.checkedKeys.some(function(key){return key === item.key;});
	            },
	            select:function (item) {
	                if (item.disabled) return;
	                var index = this.checkedKeys.indexOf(item.key);
	                index > -1 ? this.checkedKeys.splice(index, 1) : this.checkedKeys.push(item.key);
					this.$emit('on-select',item);
	            },
	            updateFilteredData :function() {
	                this.showItems = this.data;
	            },
	            toggleSelectAll:function (status) {
	            	var _this = this;
	                this.checkedKeys = status ?
	                        this.data.filter(function(data){return data && !data.disabled || _this.checkedKeys.indexOf(data.key) > -1;}).map(function(data){return data.key;}) :
	                        this.data.filter(function(data){return data && data.disabled && _this.checkedKeys.indexOf(data.key) > -1;}).map(function(data){return data.key;});
					this.$emit('on-toggle-select-all',this.checkedKeys,status);

	            },
	            filterData :function(value) {
	                return this.filterMethod(value, this.query);
	            },
                onDblclick: function (item) {
					this.$emit("on-dblclick", item)
                }
	        },
	        created :function() {
	            this.updateFilteredData();

	        },
	        compiled:function () {
	            this.showFooter = this.$els.footer.innerHTML !== '';
	        },
	        watch: {
	            data :function() {
	                this.updateFilteredData();
	            }
	        }
	    }
	var component = Vue.extend(opts);
	return component;
});