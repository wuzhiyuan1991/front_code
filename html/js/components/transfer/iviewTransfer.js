define(function(require) {
	var Vue = require("vue");
	var template = require("text!./iviewTransfer.html");
	
	var List = require('./iviewList');
    var Operation = require('./iviewOperation');
    var prefixCls = 'ivu-transfer';
    var opts = {
		template : template,
        components: { "List":List, "Operation":Operation },
        props: {
            data: {
                type: Array,
                'default':function () {
                    return []
                }
            },
            renderFormat: {
                type: Function,
                'default':function (item) {
                    return item.label || item.key;
                }
            },
            targetKeys: {
                type: Array,
                'default':function () {
                    return []
                }
            },
            selectedKeys: {
                type: Array,
                'default':function () {
                    return []
                }
            },
            listStyle: {
                type: Object,
                'default':function () {
                    return {}
                }
            },
            titles: {
                type: Array,
                'default':function () {
                    return ['源列表', '目的列表']
                }
            },
            operations: {
                type: Array,
                'default':function () {
                    return []
                }
            },
            filterable: {
                type: Boolean,
                'default': false
            },

            filterPlaceholder: {
                type: String,
                'default': '请输入搜索内容'
            },
            filterMethod: {
                type: Function,
                'default' :function(data, query) {
//                    var type = ('label' in data) ? 'label' : 'key';
                    var type = _.findKey(data,'label') ? 'label' : 'key';
                    return data[type].indexOf(query) > -1;
                }
            },
            notFoundText: {
                type: String,
                'default': '列表为空'
            },
            showcount:{
                type:Boolean,
                default:true
            }
        },
        data :function() {
            return {
                prefixCls: prefixCls,
                leftData: [],
                rightData: [],
                leftCheckedKeys: [],
                rightCheckedKeys: []
            }
        },
        computed: {
            classes :function() {
                return [
                        prefixCls
                ]
            },
            leftValidKeysCount :function() {
                return this.getValidKeys('left').length;
            },
            rightValidKeysCount :function() {
                return this.getValidKeys('right').length;
            }
        },
        methods: {
            gotoTop:function () {
                $(".lefttoptoselect").scrollTop(0);
                // this.$refs.right.scrollTop = 0;
            },
            getValidKeys :function(direction) {
            	var _this = this;
                if(this[direction+'Data']) {
                    return this[direction+'Data'].filter(function(data){return data && !data.disabled && _this[direction+'CheckedKeys'].indexOf(data.key) > -1;}).map(function(data){return data.key} );
                } else {
                    return [];
                }

            },
            splitData :function(init) {
                if(this.data) {
                    var _this = this;
                    init = init || false;
                    this.leftData = this.data.concat();
                    this.rightData = [];
                    if (this.targetKeys.length > 0) {
                        this.targetKeys.forEach(function (targetKey) {
                            _this.rightData.push(
                                _this.leftData.filter(function (data, index) {
                                    if (data.key === targetKey) {
                                        _this.leftData.splice(index, 1);
                                        return true;
                                    }
                                    return false;
                                })[0]);
                        });
                    }
                    if (init) {
                        this.splitSelectedKey();
                    }
                }
            },
            splitSelectedKey :function() {
                var selectedKeys = this.selectedKeys;
                if (selectedKeys.length > 0) {
                    this.leftCheckedKeys = this.leftData
                            .filter(function(data){return selectedKeys.indexOf(data.key) > -1;})
                            .map(function(data){return data.key;});
                    this.rightCheckedKeys = this.rightData
                            .filter(function(data){return selectedKeys.indexOf(data.key) > -1;})
                            .map(function(data){return data.key;});
                }else{
                    this.leftCheckedKeys = [];
                    this.rightCheckedKeys = [];
                }
            },
            moveTo :function(direction) {
                var targetKeys = this.targetKeys;
                var opposite = direction === 'left' ? 'right' : 'left';
                var moveKeys = this.getValidKeys(opposite);
                var newTargetKeys = (direction === 'right') ?
                        moveKeys.concat(targetKeys) :
                        targetKeys.filter(function(targetKey){return !moveKeys.some(function(checkedKey){return targetKey === checkedKey;});});
                this.$refs[opposite].toggleSelectAll(false);
                this.$emit('on-change', newTargetKeys, direction, moveKeys);
            },
            onLeftDblclick: function (item) {
                var targetKeys = this.targetKeys;
                var moveKeys = [item.key];
                var newTargetKeys = moveKeys.concat(targetKeys);
                this.$emit('on-change', newTargetKeys, 'right', moveKeys);
            },
            onRightDblclick: function (item) {
                var targetKeys = this.targetKeys;
                var moveKeys = [item.key];
                var newTargetKeys = targetKeys.filter(function(targetKey){return !moveKeys.some(function(checkedKey){return targetKey === checkedKey;});})
                this.$emit('on-change', newTargetKeys, 'left', moveKeys);
            }
        },
        watch: {
        	targetKeys :function() {
        		this.splitData(false);
        	},
        	data :function() {
                this.splitData(false);
            }
        },
        created :function() {
            this.splitData(true);
        }
    };
    var component = Vue.extend(opts);
    // return component;
    Vue.component('Transfer', component);
});