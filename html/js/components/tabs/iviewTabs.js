define(function (require) {

    var Vue = require("vue");
    var ElTab = require("./iviewTab");
    require("./iviewTabPane");


    var template = '<div class="el-tabs" :class="[type ? \'el-tabs--\' + type : \'\']">' +
        '<div class="el-tabs__header">' +
        '<el-tab :icon-type="iconType"' +
        'v-for="tab in tabs" ' +
        'v-ref:tabs ' +
        ':tab="tab" ' +
        ':closable="closable" ' +
        ':editable="editable" ' +
        '@remove="handleTabRemove" ' +
        '@click.native="handleTabClick(tab, $event)"> ' +
        '</el-tab> ' +
        '<div ' +
        'class="el-tabs__active-bar" ' +
        ':style="barStyle" ' +
        'v-if="!this.type && tabs.length > 0"> ' +
        '</div> ' +
        '</div> ' +
        '<div class="el-tabs__content"> ' +
        '<slot></slot> ' +
        '</div> ' +
        '</div>';


    var opts = {
        template: template,
        components: {
            ElTab: ElTab
        },

        props: {
            type: String,
            tabPosition: String,
            activeName: String,
            closable: false,
            editable: false,
            iconType: String,
            tabWidth: 0,
            model: Array
        },

        data: function () {
            return {
                tabs: [],
                children: null,
                activeTab: null,
                currentName: 0,
                barStyle: ''
            };
        },

        watch: {
//		      activeName: {
//		        handler(val) {
//		          this.currentName = val;
//		        }
//		      },
            activeName: function (val) {
                this.currentName = val;
            },

            'currentName': function () {
                this.calcBarStyle();
            },
            model: function () {
                var _this = this;
                var cloneTabs = _.filter(this.tabs, function (tab) {
                    return _.contains(_this.$children, tab);
                });
                this.tabs = cloneTabs;
                this.$children.forEach(function (tab) {
                    if (tab.$el.className.indexOf("el-tab-pane") != -1 && !_.contains(_this.tabs, tab)) {
                        _this.tabs.push(tab);
                        _this.currentName = tab.key;
                    }
                });
            }
        },

        methods: {
            handleTabRemove: function (tab, ev) {
                ev.stopPropagation();
                tab.$destroy(true);

                var index = this.tabs.indexOf(tab);

                if (index !== -1) {
                    this.tabs.splice(index, 1);
                }

                if (tab.key === this.currentName) {
                    var nextChild = this.tabs[index];
                    var prevChild = this.tabs[index - 1];

                    this.currentName = nextChild ? nextChild.key : prevChild ? prevChild.key : '-1';
                }
                this.$emit('tab-remove', tab, index);
            },
            handleTabClick: function (tab, event) {
                this.currentName = tab.key;
                this.$emit('tab-click', tab, event);
            },
            calcBarStyle: function (firstRendering) {
                if (this.type || !this.$refs.tabs) return {};
                var style = {};
                var offset = 0;
                var tabWidth = 0;

                var _this = this;
                this.tabs.every(function (tab, index) {
                    var $el = _this.$refs.tabs[index].$el;
                    if (tab.key !== _this.currentName) {
                        offset += $el.clientWidth;
                        return true;
                    } else {
                        tabWidth = $el.clientWidth;
                        return false;
                    }
                });

//		        this.tabs.every(function(tab, index) {
//		          var $el = tab.$el;
//		          if (tab.key !== _this.currentName) {
//		            offset += $el.clientWidth;
//		            return true;
//		          } else {
//		            tabWidth = $el.clientWidth;
//		            return false;
//		          }
//		        });

                style.width = tabWidth + 'px';
                style.transform = 'translateX(' + offset + 'px)';

                if (!firstRendering) {
                    style.transition = 'transform .3s cubic-bezier(.645,.045,.355,1), -webkit-transform .3s cubic-bezier(.645,.045,.355,1)';
                }
                this.barStyle = style;
            }
        },

        created: function () {
//		      if (!this.key) {
//		        this.key = this.$parent.$children.indexOf(this) + 1 + '';
//		      }
        },

//		    mounted() {
        ready: function () {//debugger;
            if (this.$children.length < 1) return;

            var fisrtKey = this.$children[0].key || '1';
            this.currentName = this.activeName || fisrtKey;
//			      this.$children.forEach(tab => this.tabs.push(tab));
            var _this = this;

            var el = this.$el;
            var elss = el.getElementsByClassName('el-tab-pane');

//			      _.indexOf(elss, this.$children[0].$el);


//			      this.$children.forEach(function(tab) {
//			    	  console.log("vue component index " + tab.key);
//			    	  console.log(tab.label);
//			    	  console.log( "element index : " +
//					      _.indexOf(elss, tab.$el)
//					     );
//			    	  _this.tabs.push(tab)
//			      });


            //重新构造 header的顺序，保证header的顺序和content的顺序一致 start
            var _arr = [];
            this.$children.forEach(function (tab) {
//			    	  console.log("vue component index " + tab.key);
//			    	  console.log(tab.label);
//			    	  console.log( "element index : " + _.indexOf(elss, tab.$el));	 
                //记录content的顺序
                var index = _.indexOf(elss, tab.$el) + 1;
                //重置content的key，保证index和key一致
                tab.key = index + '';
                //构造新的_arr
                _arr.push({"index": index, "tab": tab});
            });

            //重置顺序
            _arr = _.sortBy(_arr, "index");
            _.each(_arr, function (item) {
                _this.tabs.push(item.tab);
//		    		  console.log(item.tab.key);
            });

            //重新构造 header的顺序，保证header的顺序和content的顺序一致 end

//			      this.$nextTick(() => this.calcBarStyle(true));

            this.$nextTick(function () {
                _this.calcBarStyle(true);
            });
        }
    };


    var component = Vue.extend(opts);
    Vue.component('el-tabs', component);

});