define(function (require) {

    var LIB = require('lib');
    var tpl = require("text!./content.html");
    
    var api = require("../vuex/api");
    var newVO = function () {
        return {
            id : null,
            //唯一标识
            code : null,
            //类型 1:应拉断路器、隔离开关,2:应装接地线、应合接地刀闸,3:应设遮栏、应挂标示牌及防止二次回路误碰等措施,4:工作条件,5:注意事项,6:操作项目
            type : null,
            //内容
            content : null,
            //禁用标识 0:启用,1:禁用
            disable : "0",
            //执行状态 0:待核对,1:已执行
            result : null,
            //电气票
            ewWorkCard : {id:'', name:''},
        }
	};
    var initDataModel = function () {
        return {
            mainModel: {
                vo: newVO(),
                title: "安全措施",
                rules: {
                    "content": LIB.formRuleMgr.require("安全措施"),
                },
            },
            next:null,
            userSelectModel:{
                show:false,
            },
        };
    }

    var opts = {
        template: tpl,
        mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.formModal],

        data: function () {
            var data = initDataModel();
            return data;
        },
       
        watch: {
            visible: function (val) {
              
            }
        },
        props: {
            visible: {
                type: Boolean,
                default: false
            },
          
        },
        computed: {
           
        },
        methods: {
            newVO: newVO,
            init: function (val, obj) {
                this.mainModel.vo = new newVO();
                this.mainModel.opType = 'create'
                if(val){
                    this.mainModel.vo.type = val.type;
                    _.extend(this.mainModel.vo.ewWorkCard , val.ewWorkCard);
                }
                if(obj){
                    _.extend(this.mainModel.vo, obj);
                    this.mainModel.opType = 'update'
                }
            },

        }
    };

    var component = LIB.Vue.extend(opts);
    return component;
    
});