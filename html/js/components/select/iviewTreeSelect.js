define(function(require) {	

	var Vue = require("vue");
	var Icon = require("../iviewIcon");
	var Dropdown = require("./iviewDropDown");
	var clickoutside = require("../directives/clickoutside");
    var assist = require("../utils/assist");

	
	var template = '<div :class="classes" v-clickoutside="handleClose">'+
					        '<div '+
					        ':class="prefixCls+\'-selection\'" '+
					        'v-el:reference '+
					        '@click="toggleMenu"> '+
					        '<div class="ivu-tag" v-if="multiple" v-for="item in selectedMultiple"> '+
					            '<span class="ivu-tag-text">{{ item.label }}</span> '+
					            '<Icon type="ios-close-empty" @click.stop="removeTag($index)"></Icon> '+
					        '</div> '+
					        '<span :class="prefixCls+\'-placeholder\'" v-show="showPlaceholder && !filterable && !readonly">{{ placeholder }}</span> '+
					        '<span :class="prefixCls+\'-selected-value\'" v-show="!showPlaceholder && !multiple && !filterable" :title="selectedSingle">{{ selectedSingle }}</span> '+
					        '<input '+
					            'type="text" '+
					            ':class="prefixCls+\'-input\'" '+
					            'v-if="filterable" '+
					            'v-model="query" '+
					            ':placeholder="placeholder" '+
					            ':style="inputStyle"> '+
					        '<Icon type="ios-close" :class="prefixCls+\'-arrow\'" v-show="showCloseIcon" @click.stop="clearSingleSelect"></Icon> '+
					        '<Icon type="arrow-down-b" :class="prefixCls+\'-arrow\'"></Icon> '+
					    '</div> '+
					    '<Dropdown :placement="placement" :popper-fixed="popperFixed" v-show="visible" transition="slide-up" v-ref:dropdown> '+
					        '<ul :class="prefixCls+\'-dropdown-list\'"><slot></slot></ul> '+
					    '</Dropdown> '+
					'</div>';
			     
			     
	var prefixCls = 'ivu-select';

	var opts = {
		template :  template,
		components: { Icon:Icon, Dropdown:Dropdown },
	    directives: { clickoutside:clickoutside },
	    props: {
		    placement: {
                type: String,
                default: 'bottom-start'
            },
	        model: {
	            type: [String, Number, Array],
	            default: ''
	        },
	        multiple: {
	            type: Boolean,
	            default: false
	        },
			readonly:{
				type: Boolean,
				default: false
			},
	        disabled: {
	            type: Boolean,
	            default: false
	        },
	        clearable: {
	            type: Boolean,
	            default: false
	        },
	        placeholder: {
	            type: String,
	            default: '请选择'
	        },
	        filterable: {
	            type: Boolean,
	            default: false
	        },
	        filterMethod: {
	            type: Function
	        },
	        size: {
	            validator: function validator(value) {
	                return assist.oneOf(value, ['small', 'large']);
	            }
	        },
	        labelInValue: {
	            type: Boolean,
	            default: false
	        },
	        list: {
	            type: [Array],
            	default: null
	        },
	        displayAttr: {
	            type: String
	        },
			idAttr : {
				type:String,
		    	default:"id"
		    },
			displayCustom: {
	        	type: Boolean,
				default: false
			},
            displayFunc: {
                type: Function
            },
            showAbsentTip: {
	        	type: Boolean,
				default: false
			},
			popperFixed: {
				type: Boolean,
				default: true,
			}
	    },
	    data: function data() {
	        return {
	            prefixCls: prefixCls,
	            visible: false,
	            options: [],
	            optionInstances: [],
	            selectedSingle: '', // label
	            selectedMultiple: [],
	            focusIndex: 0,
	            query: '',
	            inputLength: 20
	        };
	    },

	    computed: {
	        classes: function classes() {
				var oot ={};
				oot[prefixCls + '-visible']=this.visible;
				oot[prefixCls + '-disabled']=this.disabled;
				oot[prefixCls + '-multiple']=this.multiple;
				oot[prefixCls + '-single']=!this.multiple;
				oot[prefixCls + '-show-clear']=this.showCloseIcon;
				oot[prefixCls + '-' + this.size]=!!this.size;
				oot[prefixCls + '-' + 'readonly'] = this.readonly;
	            return ['' + prefixCls, oot
	                    	//{
	            				//[prefixCls + '-visible']: this.visible,
	            				//[prefixCls + '-disabled']: this.disabled,
	            				//[prefixCls + '-multiple']: this.multiple,
	            				//[prefixCls + '-single']: !this.multiple,
	            				//[prefixCls + '-show-clear']: this.showCloseIcon,
	            				//[prefixCls + '-' + this.size]: !!this.size
	                    	//}
	            ];
	        },
	        showPlaceholder: function showPlaceholder() {//debugger;
	            var status = false;

	            if (typeof this.model === 'string') {
	                if (this.model === '') {
	                    status = true;
	                } 
	                //anson tag 暂时不允许显示的值是空字符串，如果是空字符串则显示placeHolder
		            else if(this.selectedSingle == '') {
	                    status = true;
		            }
	            } else if (Array.isArray(this.model)) {
	                if (!this.model.length) {
	                    status = true;
	                }
	            } 
 	            //anson tag 暂时不允许显示的值是空字符串，如果是空字符串则显示placeHolder
	            else if(this.selectedSingle == '') {
                    status = true;
	            }

	            return status;
	        },
	        showCloseIcon: function showCloseIcon() {
	            return !this.multiple && this.clearable && !this.showPlaceholder && !this.readonly;
	        },
	        inputStyle: function inputStyle() {
	            var style = {};

	            if (this.multiple) {
	                style.width = this.inputLength + 'px';
	            }

	            return style;
	        }
	    },
	    methods: {
	        toggleMenu: function toggleMenu() {
	            if (this.disabled || this.readonly) {
	                return false;
	            }
				this.$broadcast("ev_dropdown_tree")
	            this.visible = !this.visible;
	        },
	        hideMenu: function hideMenu() {
	            this.visible = false;
	            this.focusIndex = 0;
	            this.$broadcast('on-select-close');
	        },

	        // find option component
	        findChild: function findChild(cb) {
	            var find = function find(child) {
	                var name = child.$options.componentName;
//debugger;
	                if (name) {
	                    cb(child);
	                } else if (child.$children.length) {
	                    child.$children.forEach(function (innerChild) {
	                        find(innerChild, cb);
	                    });
	                }
	            };

//	            if (this.optionInstances.length) {
	            //解决动态切换数据源问题
	            if (this.optionInstances.length && (this.optionInstances[0].label || this.optionInstances[0].$el)) {
	                this.optionInstances.forEach(function (child) {
	                    find(child);
	                });
	            } else {
	                this.$children.forEach(function (child) {
	                    find(child);
	                });
	            }
	        },
	        updateOptions: function updateOptions(init) {
	            var _this = this;

	            var options = [];
	            var index = 1;

	            this.findChild(function (child) {
	                options.push({
	                    value: child.value,
	                    label: child.label === undefined ? child.$el.innerHTML : child.label
	                });
	                child.index = index++;

	                if (init) {
	                    _this.optionInstances.push(child);
	                }
	            });

	            this.options = options;

	            if (init) {
	                this.updateSingleSelected(true);
	                this.updateMultipleSelected(true);
	            }
	        },
	        updateSingleSelected: function() {
	        	var select = {};
				if(this.list) {
					var init = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

					var type = typeof this.model;
	
					//anson tag 先清空绑定的显示的数据的值，避免绑定数据在数据源中不存在，而显示的值不清空的问题
					this.selectedSingle = '';
					if (type === 'string' || type === 'number') {
	//	                for (var i = 0; i < this.options.length; i++) {
	//	                    if (this.model === this.options[i].value) {
	//	                        this.selectedSingle = this.options[i].label;
	//	                        break;
	//	                    }
	//	                }
						for (var i = 0; i < this.list.length; i++) {
							if (this.model === this.list[i][this.idAttr]) {
								if(this.displayCustom) {
                                    this.selectedSingle = this.displayFunc(this.list[i]);
								} else {
                                    this.selectedSingle = this.list[i][this.displayAttr];
								}
                                select = this.list[i];
								break;
							}
						}
					}
					if(select.id) {
                        this.$emit('on-single-change', select);
                        this.placeholder= "请选择";
					} else if (this.showAbsentTip && this.model) {
						this.placeholder= "关联对象已被删除，请重新选择";
					}
					//anson tag 清空绑定的数据的值
	//	            if(this.selectedSingle == '') {
	//	            	this.model = '';
	//	            }

					this.toggleSingleSelected(this.model, init);
				}
	        },
	        clearSingleSelect: function clearSingleSelect() {
	            if (this.showCloseIcon) {
	                this.findChild(function (child) {
	                    child.selected = false;
	                });
	                this.model = '';
	                this.$emit("on-clear-single-select");
	            }
	        },
	        updateMultipleSelected: function updateMultipleSelected() {
	            var init = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

	            if (this.multiple && Array.isArray(this.model)) {
	                var selected = [];

	                for (var i = 0; i < this.model.length; i++) {
	                    var model = this.model[i];

	                    for (var j = 0; j < this.list.length; j++) {
	                        var option = this.list[j];

	                        if (model === option[this.idAttr]) {
	                            selected.push({
	                                value: option[this.idAttr],
	                                label: option[this.displayAttr]
	                            });
	                        }
	                    }
	                }

	                this.selectedMultiple = selected;
	            }

	            this.toggleMultipleSelected(this.model, init);
	        },
	        removeTag: function removeTag(index) {
	            if (this.disabled) {
	                return false;
	            }
	            this.model.splice(index, 1);
	        },

	        // to select option for single
	        toggleSingleSelected: function toggleSingleSelected(value) {
	            var init = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

	            if (!this.multiple) {
	                var label = '';

	                this.findChild(function (child) {
	                    if (child.value === value) {
	                        child.selected = true;
	                        label = child.label === undefined ? child.$el.innerHTML : child.label;
	                    } else {
	                        child.selected = false;
	                    }
	                });

	                this.hideMenu();

	                if (!init) {
	                    if (this.labelInValue) {
	                        this.$emit('on-change', {
	                            value: value,
	                            label: label
	                        });
	                    } else {
	                        this.$emit('on-change', value);
	                    }
	                }
	            }
	        },

	        // to select option for multiple
	        toggleMultipleSelected: function toggleMultipleSelected(value) {
	            var _this2 = this;

	            var init = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

	            if (this.multiple) {
	                (function () {
	                    var hybridValue = [];
	                    for (var i = 0; i < value.length; i++) {
	                        hybridValue.push({
	                            value: value[i]
	                        });
	                    }

	                    _this2.findChild(function (child) {
	                        var index = value.indexOf(child.value);

	                        if (index >= 0) {
	                            child.selected = true;
	                            hybridValue[index].label = child.label === undefined ? child.$el.innerHTML : child.label;
	                        } else {
	                            child.selected = false;
	                        }
	                    });

	                    if (!init) {
	                        if (_this2.labelInValue) {
	                            _this2.$emit('on-change', hybridValue);
	                        } else {
	                            _this2.$emit('on-change', value);
	                        }
	                    }
	                })();
	            }
	        },
	        handleClose: function handleClose() {
	            this.hideMenu();
	        },
	        handleKeydown: function handleKeydown(e) {
	            if (this.visible) {
	                var keyCode = e.keyCode;
	                // Esc slide-up
	                if (keyCode === 27) {
	                    e.preventDefault();
	                    this.hideMenu();
	                }
	                // next
	                if (keyCode === 40) {
	                    e.preventDefault();
	                    this.navigateOptions('next');
	                }
	                // prev
	                if (keyCode === 38) {
	                    e.preventDefault();
	                    this.navigateOptions('prev');
	                }
	                // enter
	                if (keyCode === 13) {
	                    e.preventDefault();

	                    this.findChild(function (child) {
	                        if (child.isFocus) {
	                            child.select();
	                        }
	                    });
	                }
	            }
	        },
	        navigateOptions: function navigateOptions(direction) {
	            var _this3 = this;

	            if (direction === 'next') {
	                var next = this.focusIndex + 1;
	                this.focusIndex = this.focusIndex === this.options.length ? 1 : next;
	            } else if (direction === 'prev') {
	                var prev = this.focusIndex - 1;
	                this.focusIndex = this.focusIndex <= 1 ? this.options.length : prev;
	            }

	            var child_status = {
	                disabled: false
	            };

	            this.findChild(function (child) {
	                if (child.index === _this3.focusIndex) {
	                    child_status.disabled = child.disabled;

	                    if (!child.disabled) {
	                        child.isFocus = true;
	                    }
	                } else {
	                    child.isFocus = false;
	                }
	            });

	            this.resetScrollTop();

	            if (child_status.disabled) {
	                this.navigateOptions(direction);
	            }
	        },
	        resetScrollTop: function resetScrollTop() {
	            var index = this.focusIndex - 1;
	            var bottomOverflowDistance = this.optionInstances[index].$el.getBoundingClientRect().bottom - this.$refs.dropdown.$el.getBoundingClientRect().bottom;
	            var topOverflowDistance = this.optionInstances[index].$el.getBoundingClientRect().top - this.$refs.dropdown.$el.getBoundingClientRect().top;

	            if (bottomOverflowDistance > 0) {
	                this.$refs.dropdown.$el.scrollTop += bottomOverflowDistance;
	            }
	            if (topOverflowDistance < 0) {
	                this.$refs.dropdown.$el.scrollTop += topOverflowDistance;
	            }
	        },
            selectSame: function () {
                this.$emit("select-same");
            }
	    },
	    ready: function ready() {
	        this.updateOptions(true);
	        document.addEventListener('keydown', this.handleKeydown);
	    },
	    
	    beforeDestroy: function beforeDestroy() {
	        document.removeEventListener('keydown', this.handleKeydown);
	    },

	    watch: {
	        model: function model() {
	            if (this.multiple) {
	                this.updateMultipleSelected();
	            } else {
	                this.updateSingleSelected();
	            }
	        },
	        visible: function visible(val) {
	            if (val) {
	                this.$broadcast('on-update-popper');
	            } else {}
	        },
	        list: function (val) {
	        	var _this = this;
	        	
	        	//解决动态切换数据源的问题
	        	this.options = [];
	            this.optionInstances = [];
//	            this.selectedSingle = ''; // label
	            this.selectedMultiple = [];
	            
	            
//	        	 if (typeof this.model === 'string') {
//	                if (this.model === '') {
//	                    status = true;
//	                }
//	        		 this.model = '';
//                     status = true;
//	            } else if (Array.isArray(this.model)) {
//	                if (!this.model.length) {
//	                    status = true;
//	                }
//	            	this.model.length = 0;
//                    status = true;
//	            }
	        	//debugger;
	        	this.updateOptions(true);
	        }

	    },
	    events: {
	        'on-select-selected': function onSelectSelected(value) {//debugger;
	            if (this.model === value) {
                    this.selectSame();
	                this.hideMenu();
	            } else {
	                if (this.multiple) {
	                    var index = this.model.indexOf(value);
	                    if (index >= 0) {
	                        this.removeTag(index);
	                    } else {
	                        this.model.push(value);
	                    }
	                } else {
	                    this.model = value;
	                }
	            }
	        }
	    }
	};
	
	
	var component = Vue.extend(opts);
	Vue.component('iv-tree-select', component);
    
});