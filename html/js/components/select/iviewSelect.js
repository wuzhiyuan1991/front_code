define(function(require) {

	var Vue = require("vue");
	var Icon = require("../iviewIcon");
	var Dropdown = require("./iviewDropDown");
	var clickoutside = require("../directives/clickoutside");
    var assist = require("../utils/assist");
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver || false;

    var template = '<div :class="classes" v-clickoutside="handleClose">' +
        '<div ' +
        ':class="prefixCls+\'-selection\'" ' +
        'v-el:reference ' +
        '@click.prevent="toggleMenu">' +
        '<div class="ivu-tag" v-if="multiple" v-for="item in selectedMultiple">' +
        '<span class="ivu-tag-text">{{ item.label }}</span>' +
        '<Icon type="ios-close-empty" @click.stop="removeTag($index)"></Icon>' +
        '</div> ' +
        '<span :class="prefixCls+\'-placeholder\'" v-show="showPlaceholder && !filterable">{{ placeholder }}</span>' +

        '<span :class="prefixCls+\'-selected-value\'" v-show="!showPlaceholder && !multiple && !filterable" :title="selectedSingle">{{{ selectedSingle }}}</span>' +
        '<input ' +
        'type="text" ' +
        ':class="prefixCls+\'-input\'" ' +
        'v-if="filterable" ' +
        'v-model="query" ' +
        ':placeholder="placeholder" ' +
        ':style="inputStyle"' +
        '@blur="handleBlur"' +
        '@keydown="resetInputState"' +
        '@keydown.delete="handleInputDelete" v-el:input>'+
        '<Icon type="ios-close" :class="prefixCls+\'-arrow\'" v-show="showCloseIcon" @click.stop="clearSingleSelect"></Icon>' +
        '<Icon type="arrow-down-b" :class="prefixCls+\'-arrow\'"></Icon>' +
        '</div>' +
        '<Dropdown :popper-fixed="popperFixed" v-show="visible" :transition="transitionWay" v-ref:dropdown  :placement="placement">' +
        '<ul :class="prefixCls+\'-dropdown-list\'" v-el:options><slot></slot><i-option v-if="isEmptySlots" v-for="item in list" :value="item.id">{{ item.value }}</i-option></ul>' +
        '<div v-if="showBtnBox" :class="prefixCls+\'-dropdown-btn-box\'"><a href="javascript:void(0);" class="ok" @click="doSure">确定</a><a href="javascript:void(0);" @click="doCancel">取消</a></div>' +
        '</Dropdown>' +
        '</div>';

    var prefixCls = 'ivu-select';

    var opts = {
        name: 'iSelect',
        template: template,
        components: {Icon: Icon, Dropdown: Dropdown},
        directives: {clickoutside: clickoutside},
        props: {
            placement: {
                type: String,
                default: 'bottom-start'
            },
            model: {
                type: [String, Number, Array, Boolean],
                default: ''
            },
            multiple: {
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
            query: { // 搜索输入框中的绑定的变量, filterable为true时才有效
                type: String,
                default: ''
            },
            asInput: { // 是否可以将搜索框输入的值作为最终选择的值，只对单选有效；filterable为true时才有效
                type: Boolean,
                default: false
            },
            verifiable: {
                type: Boolean,
                default: false
            },
            popperFixed:{
                type: Boolean,
                default: true
            },
            displayFn: {
                type: Function,
                default: null
            }
        },
        data: function () {
            return {
                prefixCls: prefixCls,
                visible: false,
                options: [],
                optionInstances: [],
                selectedSingle: '', // label
                selectedMultiple: [],
                focusIndex: 0,
                // query: '',
                inputLength: 20,
                isEmptySlots: false
            };
        },

	    computed: {
			//組件彈出的动画效果
			transitionWay:function transitionWay(){
				return (this.placement=='top-start') ? 'slide-down':'slide-up'
			},
	        classes: function classes() {
				var oot ={};
				oot[prefixCls + '-visible']=this.visible;
				oot[prefixCls + '-disabled']=this.disabled;
				oot[prefixCls + '-multiple']=this.multiple;
				oot[prefixCls + '-single']=!this.multiple;
				oot[prefixCls + '-show-clear']=this.showCloseIcon;
				oot[prefixCls + '-' + this.size]=!!this.size;
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
	        showPlaceholder: function showPlaceholder() {
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
	            return !this.multiple && this.clearable && !this.showPlaceholder;
	        },
	        inputStyle: function inputStyle() {
	            var style = {};

	            if (this.multiple) {
	                style.width = this.inputLength + 'px';
	            }

                return style;
            },
            showBtnBox: function () {
                return this.verifiable && this.multiple;
            }
        },
        methods: {
            doSure: function () {
                this.handleClose();
                this.$emit("on-ok");
            },
            doCancel: function () {
                this.handleClose();
                this.model = [];
                this.$emit("on-cancel");
            },
            // 点击事件：打开/关闭下拉框
            toggleMenu: function() {
                if (this.disabled) {
                    return false;
                }
                this.visible = !this.visible;
            },

            hideMenu: function hideMenu() {
                if(this.queryChanged) {
                    this.queryChanged = false;
                    return;
                }
                this.visible = false;
                this.focusIndex = 0;
                if(this.$children) {
                    this.$broadcast('on-select-close');
                }
            },

	        // find option component
	        findChild: function findChild(cb) {
	            var find = function find(child) {
	                var name = child.$options.componentName;
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
                    this.$children && this.$children.forEach(function (child) {
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
	        updateSingleSelected: function updateSingleSelected() {
	            var init = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

	            var type = typeof this.model;

                //anson tag 先清空绑定的显示的数据的值，避免绑定数据在数据源中不存在，而显示的值不清空的问题
                this.selectedSingle = '';
                if ((type === 'string' || type === 'number') && !_.isEmpty(this.options)) {
                    var findModel = false;
                    for (var i = 0; i < this.options.length; i++) {
                        if (this.model === this.options[i].value) {
                            this.selectedSingle = (this.displayFn && this.displayFn(this.options[i])) || this.options[i].label;
                            findModel = true;
                            break;
                        }
                    }
                    if (!findModel && !this.asInput) {
                        this.model = '';
                        this.query = '';
                    }
                }

                this.toggleSingleSelected(this.model, init);
            },

            // 清除单选结果
            clearSingleSelect: function() {
                if (this.showCloseIcon) {
                    this.findChild(function (child) {
                        child.selected = false;
                    });
                    this.model = '';
                }
                if (this.filterable) {
                    this.query = '';
                }
            },
            // 更新多选选中结果
            updateMultipleSelected: function (init, slot) {
                // var init = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
                init = init === undefined ? false : init;
                slot = (slot === undefined ? false : slot);

	            if (this.multiple && Array.isArray(this.model)) {
	                var selected = [];

	                for (var i = 0; i < this.model.length; i++) {
	                    var model = this.model[i];

	                    for (var j = 0; j < this.options.length; j++) {
	                        var option = this.options[j];

	                        if (model === option.value) {
	                            selected.push({
	                                value: option.value,
	                                label: option.label
	                            });
	                        }
	                    }
	                }

	                this.selectedMultiple = selected;
	            }

                this.toggleMultipleSelected(this.model, init);
            },

            // 删除多选的单项
            removeTag: function(index) {
                if (this.disabled) {
                    return false;
                }
                this.model.splice(index, 1);
                if (this.filterable && this.visible) {
                    this.$els.input.focus();
                }
                this.$broadcast('on-update-popper');
            },
            // 单选选择
            toggleSingleSelected: function (value) {
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
            // 多选选择
            toggleMultipleSelected: function (value) {
                var init = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

                var _this = this;

                if (this.multiple) {

                    var hybridValue = [];
                    for (var i = 0; i < value.length; i++) {
                        hybridValue.push({
                            value: value[i]
                        });
                    }

                    _this.findChild(function (child) {
                        var index = value.indexOf(child.value);

	                        if (index >= 0) {
	                            child.selected = true;
	                            hybridValue[index].label = child.label === undefined ? child.$el.innerHTML : child.label;
	                        } else {
	                            child.selected = false;
	                        }
	                    });

                    if (!init) {
                        if (_this.labelInValue) {
                            _this.$emit('on-change', hybridValue);
                        } else {
                            _this.$emit('on-change', value);
                        }
                    }

                }
            },
            handleClose: function () {
                this.hideMenu();
            },
            handleKeydown: function (e) {
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
            navigateOptions: function (direction) {
                var _this = this;

                if (direction === 'next') {
                    var next = this.focusIndex + 1;
                    this.focusIndex = this.focusIndex === this.options.length ? 1 : next;
                } else if (direction === 'prev') {
                    var prev = this.focusIndex - 1;
                    this.focusIndex = this.focusIndex <= 1 ? this.options.length : prev;
                }

                var child_status = {
                    disabled: false,
                    hidden: false
                };

                this.findChild(function (child) {
                    if (child.index === _this.focusIndex) {
                        child_status.disabled = child.disabled;
                        child_status.hidden = child.hidden;

                        if (!child.disabled && !child.hidden) {
                            child.isFocus = true;
                        }
                    } else {
                        child.isFocus = false;
                    }
                });

	            this.resetScrollTop();

                if (child_status.disabled || child_status.hidden) {
                    this.navigateOptions(direction);
                }
            },
            resetScrollTop: function () {

                // var index = this.focusIndex - 1;
                // var dropdownRect = this.$refs.dropdown.$el.getBoundingClientRect();
                // var instanceRect = this.optionInstances[index].$el.getBoundingClientRect();
                // var bottomOverflowDistance = instanceRect.bottom - dropdownRect.bottom;
                // var topOverflowDistance = instanceRect.top - dropdownRect.top;
                // if (bottomOverflowDistance > 0) {
                //     this.$refs.dropdown.$el.scrollTop += bottomOverflowDistance;
                // }
                // if (topOverflowDistance < 0) {
                //     this.$refs.dropdown.$el.scrollTop += topOverflowDistance;
                // }

                var index = this.focusIndex - 1;
                if (this.optionInstances.length === 0) {
                    return
                }
                var dropdownStyle = getComputedStyle(this.$refs.dropdown.$el, null);
                var instanceStyle = getComputedStyle(this.optionInstances[index].$el, null);
                var boxHeight = _.get(dropdownStyle, 'height', '200');
                var itemHeight = _.get(instanceStyle, 'height', '31');

                boxHeight = parseInt(boxHeight) || 200;
                itemHeight = parseInt(itemHeight) || 31;

                var distance = itemHeight * this.focusIndex - boxHeight;

                this.$refs.dropdown.$el.scrollTop = distance > 0 ? distance : 0;

            },

            /**
             * 根据`asInput`的值；分为两种情况
             * 1、asInput=true && !this.multiple： 将搜索框输入的值作为最终值，如果输入的项和某个子项label值相等，则使用该子项
             * 2、常规流程，只做过滤，需要用户点选某项才能更新model的值
             */
            handleBlur: function () {
                var _this = this;
                setTimeout(function () {
                    if(_this.asInput && !this.multiple) {
                        var hasValue = false, _model = '';
                        _this.findChild(function (child) {
                            var label = child.label === undefined ? child.searchLabel : child.label;
                            if(label === _this.query) {
                                hasValue = true;
                                _model = child.value;
                            }
                        });

                        if(hasValue) {
                            _this.model = _model;
                        } else if(_this.query){
                            _this.model = '-0'; // 特数值用来通过表单验证
                        } else {
                            _this.model = ''
                        }
                    } else {
                        var model = _this.model;
                        if(_this.multiple) {
                            _this.query = '';
                        } else {
                            if (model !== '') {
                                _this.findChild(function (child) {
                                    if (child.value === model) {
                                        _this.query = child.label === undefined ? child.searchLabel : child.label;
                                    }
                                })
                            } else {
                                _this.query = '';
                            }
                        }
                    }
                }, 300)
            },
            resetInputState: _.debounce(function (e) {
                var _this = this;

                // 输入后检测输入的值是否已存在，存在则选中并让其滚动到可视区域
                if(_this.asInput && !this.multiple) {
                    var hasValue = false,
                        _model = '',
                        index = -1;
                    _this.findChild(function (child) {
                        var label = child.label === undefined ? child.searchLabel : child.label;
                        if(label === _this.query) {
                            hasValue = true;
                            child.selected = true;
                            index = child.index;
                            _model = child.value;
                        } else {
                            child.selected = false;
                        }
                    });

                    // model 变化会关闭下拉框 这里给个表示阻止关闭
                    _this.queryChanged = true;
                    if(hasValue) {
                        _this.focusIndex = index;
                        _this.resetScrollTop();
                        _this.model = _model;
                    } else if(_this.query){
                        _this.model = '-0'; // 特数值用来通过表单验证
                    } else {
                        _this.model = ''
                    }
                }

                this.inputLength = this.$els.input.value.length * 12 + 20;
            }, 300),
            handleInputDelete:function () {
                if (this.multiple && this.model.length && this.query === '') {
                    this.removeTag(this.model.length - 1);
                }
            },
            // use when slot changed
            slotChange:function () {
                this.options = [];
                this.optionInstances = [];
            },
            setQuery:function (query) {
                if (!this.filterable) return;
                this.query = query;
            },
            modelToQuery: function() {
                var _this = this;
                if (!this.multiple && this.filterable && this.model) {
                    this.findChild(function (child) {
                        if (_this.model === child.value) {
                            if (child.label) {
                                _this.query = child.label;
                            } else if (child.searchLabel) {
                                _this.query = child.searchLabel;
                            } else {
                                _this.query = child.value;
                            }
                        }
                    });
                }
            }
        },
        compiled: function () {
            var _this = this;
            this.isEmptySlots = !this._slotContents || this._slotContents.default == undefined ? true : false;

            this.modelToQuery();
            // this.updateOptions(true);
            document.addEventListener('keydown', this.handleKeydown);
            // watch slot changed
            if (MutationObserver) {
                this.observer = new MutationObserver(function() {
                    _this.modelToQuery();
                    _this.slotChange();
                    _this.updateOptions(true, true);
                });
                _this.observer.observe(_this.$els.options, {
                    // attributes: true,
                    childList: true,
                    characterData: true,
                    subtree: true
                });
            }
        },

        ready: function() {
            //使用$nextTick优化isEmptySlots默认值为false时无法显示默认option问题
            this.$nextTick(function () {
                if (_.isArray(this.list)) {
                    this.updateOptions(true);
                }
            });
            this.updateOptions(true);
            document.addEventListener('keydown', this.handleKeydown);
        },
        beforeDestroy: function beforeDestroy() {
            document.removeEventListener('keydown', this.handleKeydown);
            if (this.observer) {
                this.observer.disconnect();
            }
        },

        watch: {
            model: function (val) {
                // if (val === '') this.query = '';
                this.modelToQuery();
                if (this.multiple) {
                    this.updateMultipleSelected();
                } else {
                    this.updateSingleSelected();
                }
            },
            visible: function (val) {
                if (val) {
                    if (this.multiple && this.filterable) {
                        this.$els.input.focus();
                    }
                    this.$broadcast('on-update-popper');

                    // 打开时计算滚动距离，让已选中的子项滚动到可视区域
                    var _this = this;
                    this.$nextTick(function () {
                        var item = _.find(this.optionInstances, function (item) {
                            return item.value === _this.model
                        });
                        this.focusIndex = _.get(item, 'index', 1);
                        this.resetScrollTop();
                    })
                } else {
                    if (this.filterable) {
                        this.$els.input.blur();
                    }
                    this.$broadcast('on-destroy-popper');
                }
            },
            query: function (val) {
                this.$broadcast('on-query-change', val);
                var is_hidden = true;
                this.$nextTick(function() {
                    this.findChild(function(child){
                        if (!child.hidden) {
                            is_hidden = false;
                        }
                    });
                    this.notFound = is_hidden;
                });
                this.$broadcast('on-update-popper');
            },
            list: function (val) {
	        	//解决动态切换数据源的问题
	        	this.options = [];
	            this.optionInstances = [];
//	            this.selectedSingle = ''; // label
                this.selectedMultiple = [];
                this.updateOptions(true);
                if(this.filterable) {
                    this.$broadcast('on-query-change', this.query);
                }
            }
        },
        events: {
            /**
             * 点击子项后，由子项向上发出的事件
             * @param value
             * @param label
             */
            'on-select-selected': function (value, label) {
                if (this.model === value) {
                    // 防止单选时删除已选中项一个或多个字符后再次选择该项，label显示不完整
                    if (this.filterable && !this.multiple) {
                        this.query = label;
                    }
                    this.hideMenu();
                }
                else {
                    if (this.multiple) {
                        var index = this.model.indexOf(value);
                        if (index >= 0) {
                            this.removeTag(index);
                        } else {
                            this.model.push(value);
                            this.$broadcast('on-update-popper');
                        }

                        if (this.filterable) {
                            this.query = '';
                            this.$els.input.focus();
                        }
                    }
                    else {
                        this.model = value;
                        if (this.filterable) {
                            this.findChild(function(child) {
                                if (child.value === value) {
                                    this.query = child.label === undefined ? child.searchLabel : child.label;
                                }
                            });
                        }
                    }
                    this.$emit('on-select', this.model)
                }
            }
        }
    };


    var component = Vue.extend(opts);
    Vue.component('i-select', component);

});
