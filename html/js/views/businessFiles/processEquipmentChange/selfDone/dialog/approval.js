define(function (require) {

    var LIB = require('lib');
    var tpl = require("text!./approval.html");
    var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");
    var multiInputSelect = require("componentsEx/multiInputSelector/main");
    var api = require("../vuex/api");
    var newVO = function () {
		return {
            id : null,
			//编码
			code : null,
			//处理人类型  1:基层站队长,2:管理处机关业务人员,3:管理处机关科室长,4:管理处机关主管领导,5:公司业务处室业务人员,6:公司业务处室科室长,7:公司业务处室主管领导
			handlerType : null,
			//流转设置 1:直接提交给下一个审批角色,2:提交给下一个审批人
			flowType :'1',
			//审批时间
			auditTime : null,
			//审批结果 0:通过,1:不通过
			result : '0',
			//启用/禁用 0:启用,1:禁用
			disable : "0",
			//意见
            opinion : null,
            nextAuditors:''
		}
	};
    var initDataModel = function () {
        return {
            mainModel: {
                vo: newVO(),
                title: "审批",
                
            },
            users:[],
            userSelectModel:{
                show:false,
                filterData:{}
            },
            rules: {
                "code" : [LIB.formRuleMgr.length(255)],
				"handlerType" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.require("处理人类型")),
				"flowType" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.require("流转设置")),
				"auditTime" : [LIB.formRuleMgr.require("审批时间")],
				"result" : LIB.formRuleMgr.require("审批结果"),
				"disable" :LIB.formRuleMgr.require("状态"),
				"opinion" : [LIB.formRuleMgr.length(500)],
				"pecApplication.id" : [LIB.formRuleMgr.require("变更申请")],
            },

        };
    }

    var opts = {
        template: tpl,
        data: function () {
            var data = initDataModel();
            return data;
        },
        components: {
            "userSelectModal": userSelectModal,
            'multiInputSelect':multiInputSelect
        },
        watch: {
            visible: function (val) {
                if (!val) {
                   _.extend(this.mainModel.vo,newVO()) 
                }
            },
            candidates:function(val){
                var excludeIds = [];
                if(val.length > 0){
                    excludeIds = _.map(val,"id");
                }
                this.userSelectModel.filterData = {"criteria.strsValue": JSON.stringify({excludeIds: excludeIds})};
            }
        },
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            
            candidates:{
                type:Array,
                default:[]
            },
            vo:{
                type:Object,
                
            }
          
        },
        computed: {
           
        },
        methods: {
            doShowSelectUserModal:function(){
               
                this.userSelectModel.show=true;
            },
            doCancel:function () {
                this.visible = false;
            },
            doSave:function(){
                var _this = this
                if (_this.users.length==0&&_this.mainModel.vo.flowType==2) {
                   LIB.Msg.warning('请选择下一个审批人')
                   return
                }
                if (_this.mainModel.vo.flowType==2) {
                    this.mainModel.vo.nextAuditors = JSON.stringify(_.map(this.users,'id'))
                }
                // this.mainModel.vo.taskType= parseInt(this.taskType)+1
                  
                // this.mainModel.vo.type=1
                this.$refs.ruleform.validate(function (valid) {
					if (valid) {
                        _this.$emit('do-save',_this.mainModel.vo)
					}
				})
            },
            doSaveSelect: function(val) {
            this.users= val
            },
        }
    };

    var component = LIB.Vue.extend(opts);
    return component;
    
});