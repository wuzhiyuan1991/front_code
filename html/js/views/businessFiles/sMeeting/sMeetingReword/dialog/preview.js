define(function (require) {
    var LIB = require('lib');
    var api = require("../vuex/api");
    //右侧滑出详细页
    var tpl = require("text!./preview.html");

    //Vue数据
    var dataModel = {
        vo: null,
        items: null,
        
    };
    //Vue组件
    /**
     *  请统一使用以下顺序配置Vue参数，方便codeview
     *	 el
     template
     components
     componentName
     props
     data
     computed
     watch
     methods
     _XXX    			//内部方法
     doXXX 				//事件响应方法
     beforeInit 		//初始化之前回调
     afterInit			//初始化之后回调
     afterInitData		//请求 查询 接口后回调
     afterInitFileData  //请求 查询文件列表 接口后回调
     beforeDoSave		//请求 新增/更新 接口前回调，返回false时不进行保存操作
     afterFormValidate	//表单rule的校验通过后回调，，返回false时不进行保存操作
     buildSaveData		//请求 新增/更新 接口前回调，重新构造接口的参数
     afterDoSave		//请求 新增/更新 接口后回调
     beforeDoDelete		//请求 删除 接口前回调
     afterDoDelete		//请求 删除 接口后回调
     events
     vue组件声明周期方法
     init/created/beforeCompile/compiled/ready/attached/detached/beforeDestroy/destroyed
     **/
    var detail = LIB.Vue.extend({
        mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth],
        template: tpl,
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            previewData: {
                type: Object,
                default: {}
            }
        },
        data: function () {
            return dataModel;
        },
    
        computed:{
            tableData:function(){
                var arr= []
                var temp=[]
                _.each(this.previewData.tableData,function(item){
                    
                    if (temp.length<1) {
                        temp.push(item)
                    }else {
                        temp.push(item)
                        arr.push(temp)
                        temp=[]
                       
                    }
                    
                })
                if (this.previewData.tableData.length%2==1) {
                    arr.push([this.previewData.tableData[this.previewData.tableData.length-1]])
                }
                
                return arr
            }
        },
        methods: {
            imgUrl:function(url){
                return LIB.convertImagePath(LIB.convertFileData(url))
            },
            doClose: function () {
                this.visible = false;
            },
            doPrint: function () {
                window.print();
            },

        },
        events: {
        },
        init: function () {
            this.$api = api;
        }
    });

    return detail;
});