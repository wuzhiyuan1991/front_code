define(function (require) {

    var LIB = require('lib');
    var tpl = require("text!./approvalStep.html");
    
    var api = require("../vuex/api");
    var newVO = function () {
		return {
			id: null,
			//编码
			code: null,
			//禁用标识 0未禁用，1已禁用
			disable: "0",
			//公司id
			compId: null,
			//部门id
			orgId: null,
			//工作内容
			content: null,
			//备注
			remark: null,
			//状态 0:待完成,1:已完成
			status: '0',
			user: { id: "", username: "" },
			executeUserId: null
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
    }

    var opts = {
        template: tpl,
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
        
        }
    };

    var component = LIB.Vue.extend(opts);
    return component;
    
});