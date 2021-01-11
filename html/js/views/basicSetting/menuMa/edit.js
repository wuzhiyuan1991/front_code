
define(function(require){
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    //vue数据
    var newVO = function () {
        return {
            id:null,
            name: null
        }
    };

    //vue数据 配置url地址 拉取数据
    var dataModel = {
        vo: newVO(),
    };
    var vm = LIB.VueEx.extend({
        template: require("text!./edit.html"),
        data:function(){
            return dataModel;
        },
        //引入html页面
        methods:{
            //保存
            doSave:function(){
                api.update(dataModel.vo).then(function(res){
                    if(res.status==200){
                        LIB.Msg.info("修改成功");
                    }
                })
                //this.$dispatch("treeRefresh");
                this.$dispatch("ev_editCanceled");
                //刷新
                var _this=this;
                setTimeout(function(){
                    _this.$dispatch("treeRefresh");
                },1000)
            },
            //取消
            doCancel:function(){
                this.$dispatch("ev_editCanceled");
            }
        },
        events:{
            //点击取得id跟name值 双向绑定
            "ev_detailReload" : function(id,name) {
                dataModel.vo.name =name;
                dataModel.vo.id=id;
            }
        }
    })
    return vm;
})