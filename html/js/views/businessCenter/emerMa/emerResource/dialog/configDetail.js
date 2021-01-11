define(function(require){
    var LIB = require('lib');
    //数据模型
    var tpl = require("text!./configDetail.html");
    var api = require("../vuex/api");

    //初始化数据模型
    var newVO = function () {
        return {

        }
    };

    var detail = LIB.Vue.extend({
        computed:{

        },
        mixins : [LIB.VueMixin.dataDic],
        template: tpl,
        components:{
        },
        props: {
            visible: {
                type: Boolean,
                default: false
            },
        },
        watch:{
            visible:function(val){
                // val && this._init()
            }
        },

        data:function(){
            return {
                lists:[
                        [{name:"作业场所配备",check:false},{check:true},{check:true},{check:true}],

                        [{name:"个人防护装备",check:false},{check:true},{check:true},{check:true}],

                        [{name:"救援车辆配备",check:false},{check:true},{check:true},{check:true}],

                        [{name:"救援物资配备",check:false},{check:false},{check:true},{check:true}],
                ],

            };
        },

        methods:{
            //    获取文件
            //    this.getFileList(this.uploadModel.params.recordId);

            // /returnClass(item , index)
            returnClass:function (item, index) {
                return "item.name?'tableCardRowTitle colorGreen':'tableCardRowTitle'"
            },
            getStyleBorder:function (indexs, index) {
                var str = '';
                indexs%2==0?(str+='background:#fff;') : (str+='background:#F2F6FF;');
               if(index == 0){
                   str+="border-left:1px solid #EAEAEA;"
               }
               return str;
            },

            _init:function () {
                this.mainModel.vo.shipOptions = null;
                this.mainModel.vo.user = LIB.user.name;
            },
            doClose:function () {
                this.visible = false;
            },

        },
        init: function(){
            this.$api = api;
        }

    });

    return detail;
});