define(function (require) {

    var LIB = require('lib');
    var tpl = require("text!./approvalStep.html");
    
    var api = require("../vuex/api");
    var newVO = function () {
		return {
			id: null,
            signResult: null,
            signOpinion: null
			//编码
		}
	};
    var initDataModel = function () {
        return {
            mainModel: {
                vo: newVO(),
                title: "安全措施",
                
            },
            next:null,
            userSelectModel:{
                show:false,
            },
            rules: {
                "name": LIB.formRuleMgr.require("内容"),
            },
        };
    };

    var opts = {
        template: tpl,
        data: function () {
            var data = initDataModel();
            return data;
        },
       
        watch: {
            visible: function (val) {
                if(val){
                    this.mainModel.vo.id = this.vo.id;
                    this.mainModel.vo.signResult = 1;
                    this.mainModel.vo.signOpinion = null;
                }
            }
        },
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            vo: {
                type: Object,
                default:null
            }
          
        },
        computed: {
           
        },
        methods: {
            doSave: function () {
                this.$emit('do-save', this.mainModel.vo);
            }
        }
    };

    var component = LIB.Vue.extend(opts);
    return component;
    
});