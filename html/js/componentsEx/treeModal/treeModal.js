define(function(require) {

    /*var Vue = require("vue");*/
    var LIB = require('lib');
    var template = require("text!./treeModal.html");
    var opts = {
        template :  template,
        props: {
            model: {
                type: [Object, Array],
                require: true
            },
            idAttr: {
                type: String,
                default: "id"
            },
            pidAttr: {
                type: String,
                default: "parentId"
            },
            displayAttr: {
                type: String,
                default: "name"
            },
            width:{
              type:String,
              default:"900"
            },
            visible: {
                type: Boolean,
                default: false
            },
            title:{
                type: String,
                default: "选择"
            },
            //是否单选
            singleSelect: {
                type: Boolean,
                default: true
            },
            allowParentChecked:{
                type: Boolean,
                default: true
            },
            assist: {
                type: Boolean,
                default: false
            },
            assistFunc: {
                type: Function,
                default: function () {
                    return '';
                }
            },
            defaultOpenLayer: {
                type: Number,
                default: 2
            },
            open: {
                type: Boolean,
                default: false
            }

        },
        data: function() {
            return {
                //搜索的值
                searchValue: null,
                //选择的数据
                selectedDatas:[],
                showLoading:false,
                //默认只有第一次 才加载数据
                value:1
            }
        },
        watch: {
            visible: function(val) {
                if (val) {
                    this.selectedDatas = [];
                    //清楚搜索的值
                    this.searchValue = null;
                }
            }
        },
        methods:{
            doFilterLeft: function(val) {
                this.searchValue = val;
            },
            doSave: function() {
                if (this.selectedDatas.length === 0) {
                    LIB.Msg.warning("请选择数据");
                    return;
                }
                this.visible = false;
                this.$emit('do-save', this.selectedDatas);
            },
        },

    };


    var component = LIB.Vue.extend(opts);
    LIB.Vue.component('tree-modal', component);

});