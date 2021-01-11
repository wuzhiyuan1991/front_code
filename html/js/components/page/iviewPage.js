define(function(require)  {

	var Vue = require("vue");
    var assist = require("../utils/assist");
    var Options = require("./iviewPageOptions");

	var template = '<ul :class="simpleWrapClasses" v-if="simple">'+
					        '<li '+
					        'title="上一页" '+
					        ':class="prevClasses" '+
					        '@click="prev"> '+
					        '<a><i class="ivu-icon ivu-icon-ios-arrow-left"></i></a> '+
					    '</li> '+
					    '<div :class="simplePagerClasses" :title="current + '/' + allPages"> '+
					        '<input '+
					            'type="text" '+
					            ':value="current" '+
					            '@keydown="keyDown" '+
					            '@keyup="keyUp" '+
					            '@change="keyUp"> '+
					        '<span>/</span> '+
					        '{{ allPages }} '+
					    '</div> '+
					    '<li '+
					        'title="下一页" '+
					        ':class="nextClasses" '+
					        '@click="next"> '+
					        '<a><i class="ivu-icon ivu-icon-ios-arrow-right"></i></a> '+
					    '</li> '+
					'</ul> '+
					'<ul :class="wrapClasses" v-else> '+
					    '<span :class="[prefixCls + \'-total\']" v-if="showTotal"> '+
					        '<slot>共 {{ total }} 条</slot> '+
					    '</span> '+
					    '<li '+
					        'title="上一页" '+
					        ':class="prevClasses" '+
					        '@click="prev"> '+
					        '<a><i class="ivu-icon ivu-icon-ios-arrow-left"></i></a> '+
					    '</li> '+
                        '<template v-if="showNumber">' +
					    '<li title="第一页" :class="itemactive1" @click="changePage(1)"><a>1</a></li> '+
					    '<li title="向前 5 页" v-if="current - 3 > 1" :class="[prefixCls + \'-item-jump-prev\']" @click="fastPrev"><a><i class="ivu-icon ivu-icon-ios-arrow-left"></i></a></li> '+
					    '<li :title="current - 2" v-if="current - 2 > 1" :class="[prefixCls + \'-item\']" @click="changePage(current - 2)"><a>{{ current - 2 }}</a></li> '+
					    '<li :title="current - 1" v-if="current - 1 > 1" :class="[prefixCls + \'-item\']" @click="changePage(current - 1)"><a>{{ current - 1 }}</a></li> '+
					    '<li :title="current" v-if="current != 1 && current != allPages" :class="[prefixCls + \'-item\',prefixCls + \'-item-active\']"><a>{{ current }}</a></li> '+
					    '<li :title="current + 1" v-if="current + 1 < allPages" :class="[prefixCls + \'-item\']" @click="changePage(current + 1)"><a>{{ current + 1 }}</a></li> '+
					    '<li :title="current + 2" v-if="current + 2 < allPages" :class="[prefixCls + \'-item\']" @click="changePage(current + 2)"><a>{{ current + 2 }}</a></li> '+
					    '<li title="向后 5 页" v-if="current + 3 < allPages" :class="[prefixCls + \'-item-jump-next\']" @click="fastNext"><a><i class="ivu-icon ivu-icon-ios-arrow-right"></i></a></li> '+
					    '<li :title="\'最后一页:\' + allPages" v-if="allPages > 1" :class="itemactive" @click="changePage(allPages)"><a>{{ allPages }}</a></li> '+
                        '</template>' +
                        '<li '+
					        'title="下一页" '+
					        ':class="nextClasses" '+
					        '@click="next"> '+
					        '<a><i class="ivu-icon ivu-icon-ios-arrow-right"></i></a> '+
					    '</li> '+
					    '<Options '+
					        ':show-sizer="showSizer" '+
					        ':page-size="pageSize" '+
					        ':page-size-opts="pageSizeOpts" '+
					        ':show-elevator="showElevator" '+
					        ':_current.once="current" '+
					        ':current.sync="current" '+
					        ':all-pages="allPages" '+
					        '@on-size="onSize" '+
					        '@on-page="onPage"> '+
					    '</Options> '+
					'</ul>';
			     
			     
	var prefixCls = 'ivu-page';

	var opts = {
		template :  template,
		components: {Options: Options },
        props: {
            current: {
                type: Number,
                default: 1
            },
            total: {
                type: Number,
                default: 0
            },
            pageSize: {
                type: Number,
                default: 10
            },
            pageSizeOpts: {
                type: Array,
                default:function() {
                    return [10, 20, 30, 40]
                }
            },
            size: {
                validator:function(value) {
                    return assist.oneOf(value, ['small']);
                }
            },
            simple: {
                type: Boolean,
                default: false
            },
            showTotal: {
                type: Boolean,
                default: false
            },
            showElevator: {
                type: Boolean,
                default: false
            },
            showSizer: {
                type: Boolean,
                default: false
            },
            showNumber: {
                type: Boolean,
                default: true
            }
        },
        data : function() {
            return {
                prefixCls: prefixCls
            }
        },
        computed: {
        	itemactive:function(){
        		var obj = {};
	        	obj[prefixCls + '-item-active'] = this.current == this.allPages;
	            return [
		                    prefixCls + '-item', obj
	                    ];
        	},
        	itemactive1:function(){
        		var obj = {};
	        	obj[prefixCls + '-item-active'] = this.current==1;
	            return [
		                    prefixCls + '-item', obj
	                    ];
        	},
            allPages : function() {
                var allPage = Math.ceil(this.total / this.pageSize);
                return (allPage === 0) ? 1 : allPage;
            },
            simpleWrapClasses : function() {
                return [
                    prefixCls,
                    prefixCls + '-simple'
                ]
            },
            simplePagerClasses : function() {
                return prefixCls + '-simple-pager';
            },
            wrapClasses : function() {
                return [
                    prefixCls,
                    {
                        'mini': !!this.size
                    }
                ]
            },
            prevClasses : function() {
            	var obj = {}; 
            	obj[prefixCls + '-disabled'] = this.current == 1;
                return [
                    prefixCls + '-prev',
                    obj
                ]
            },
            nextClasses : function() {
            	var obj = {}; 
            	obj[prefixCls + '-disabled'] = this.current == this.allPages;
                return [
                    prefixCls + '-next',
                    obj
                ]
            }
        },
        methods: {
            changePage : function(page, forceEmitChangeEvent) {
                if (this.current != page) {
                    this.current = page;
                    this.$emit('on-change', page);
                } else if(forceEmitChangeEvent) {
                    this.$emit('on-change', page);
                }
            },
            prev : function() {
                var current = this.current;
                if (current <= 1) {
                    return false;
                }
                this.changePage(current - 1);
            },
            next : function() {
                var current = this.current;
                if (current >= this.allPages) {
                    return false;
                }
                this.changePage(current + 1);
            },
            fastPrev : function() {
                var page = this.current - 5;
                if (page > 0) {
                    this.changePage(page);
                } else {
                    this.changePage(1);
                }
            },
            fastNext : function() {
                var page = this.current + 5;
                if (page > this.allPages) {
                    this.changePage(this.allPages);
                } else {
                    this.changePage(page);
                }
            },
            onSize : function(pageSize) {
                this.pageSize = pageSize;
                this.changePage(1, true);
            },
            onPage : function(page) {
                this.changePage(page);
            },
            keyDown : function(e) {
                var key = e.keyCode;
                var condition = (key >= 48 && key <= 57) || key == 8 || key == 37 || key == 39;

                if (!condition) {
                    e.preventDefault();
                }
            },
            keyUp : function(e) {
                var key = e.keyCode;
                var val = parseInt(e.target.value);

                if (key === 38) {
                    this.prev()
                } else if (key === 40) {
                    this.next()
                } else if (key == 13) {
                    var page = 1;

                    if (val > this.allPages) {
                        page = this.allPages;
                    } else if (val <= 0) {
                        page = 1;
                    } else {
                        page = val;
                    }

                    e.target.value = page;
                    this.changePage(page);
                }
            }
        }
	};
	
	
	var component = Vue.extend(opts);
	Vue.component('page', component);
    
});