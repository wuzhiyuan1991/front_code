define(function (require) {

    var LIB = require('lib');
    var tpl = require("text!./deliver.html");
    var userSelectModal = require("componentsEx/selectTableModal/userSelectModal");
    var multiInputSelect = require("componentsEx/multiInputSelector/main");
    var api = require("../vuex/api");
    var newVO = function () {
		return {
			id : null,
			//
			code : null,
			//任务类型 1:变更评估,2:变更审批,3:变更实施,4:变更验收,5:应用范围评估
			taskType : null,
			//委托原因
			reason : null,
			//禁用标识 0未禁用，1已禁用
			disable : "0",
			//委托类型 0:委托,1:移交
			type : null,
			//变更申请
           
            assigneeId:null
		}
	};
    var initDataModel = function () {
        return {
            mainModel: {
                vo: newVO(),
                title: "委托",
                rules:{
                    "code" : [LIB.formRuleMgr.require(""),
                              LIB.formRuleMgr.length(100)
                    ],
                    'assigneeId':LIB.formRuleMgr.require("被委托人"),
                    "taskType" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.require("任务类型")),
                    "reason" : [
                              LIB.formRuleMgr.length(200)
                    ],
                    "disable" :LIB.formRuleMgr.require("状态"),
                    "type" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
                    "pecApplication.id" : [LIB.formRuleMgr.require("变更申请")],
                }
            },
            userSelectModel:{
                show:false,
                filterData:{}
            },
            rules: {
               
            },
            user:[]
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
                    this.user = []
                    this.mainModel.vo.reason=null
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
            taskType:{
                type: String,
                default: "2"
            },
            candidates:{
                type:Array,
                default:[]
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
                if (_this.user.length>0) {
                    _this.mainModel.vo.assigneeId= _this.user[0].id
                }
                this.mainModel.vo.taskType= parseInt(this.taskType)+1
                  
                this.mainModel.vo.type=1
                this.$refs.ruleform.validate(function (valid) {
					if (valid) {
                        _this.$emit('do-save',_this.mainModel.vo)
					}
				})
            },
            doSaveSelect: function(val) {
            this.user = val
            },
        }
    };

    var component = LIB.Vue.extend(opts);
    return component;
    
});