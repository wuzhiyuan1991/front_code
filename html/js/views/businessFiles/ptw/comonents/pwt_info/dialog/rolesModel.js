define(function(require){
	var LIB = require('lib');
 	//数据模型
	var tpl = require("text!./rolesModel.html");

    LIB.registerDataDic("iptw_catalog_is_signer_type", [
        ["1","是"],
        ["3","否"],
    ]);

    LIB.registerDataDic("iptw_catalog_enable_commitment", [
        ["0","否"],
        ["1","是"]
    ]);


    LIB.registerDataDic("iptw_catalog_is_inherent", [
        ["0","否"],
        ["1","是"]
    ]);

    LIB.registerDataDic("iptw_catalog_is_multiple", [
        ["0","否"],
        ["1","是"]
    ]);

    LIB.registerDataDic("iptw_catalog_signer_type", [
        ["1","作业申请"],
        ["2","作业批准"]
    ]);
	//初始化数据模型
	var newVO = function() {
		return {
            id : null,
            //编码
            code : null,
            //作业签发人
            name : null,
            //启用/禁用 0:启用,1:禁用
            disable : "0",
            //字典类型 1:作业类型,2:作业分级,3:个人防护设备,4:气体检测指标,5:签发人员,6:作业取消声明,7:作业完成声明
            type : 5,
            //承诺内容
            content : null,
            //应用承诺 0:否,1:是
            enableCommitment : '1',
            //作业固有角色 0:否,1:是
            isInherent : '0',
            //是否可复选签发人 0:否,1:是
            isMultiple : '0',
            //签发人类型 1:作业申请人,2:作业批准人,3:自定义会签角色
            signerType : '3',
		}
	};

	//Vue数据
	var dataModel = {
        modify:true,
        selectOrgId: null,
		mainModel : {
			vo : newVO(),
			opType : 'create',
			isReadOnly : false,
			title:"添加",

			//验证规则
            //验证规则
            rules:{
                "code" : [LIB.formRuleMgr.length(255)],
                "name" : [LIB.formRuleMgr.require("作业签发人"),
                           LIB.formRuleMgr.length(50)
                ],
                "content" : [LIB.formRuleMgr.length(500)],
                "enableCommitment" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
                "signerType" : [LIB.formRuleMgr.allowIntEmpty].concat(LIB.formRuleMgr.allowIntEmpty),
            },
		},

	};
	
	var detail = LIB.Vue.extend({
		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.formModal],
		template: tpl,

		watch:{
			visible:function (val) {
				val && this.beforeInit();
            }
		},
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
            beforeDoSave: function () {
                this.mainModel.vo.compId = LIB.user.compId;
                this.mainModel.vo.orgId = LIB.user.compId;
            },
			beforeInit:function () {
				this.mainModel.vo = this.newVO();
            },

			
		},
        events: {
		    "updata-select-org-id": function (id) {
                this.selectOrgId = id;
            }
        }
	});
	
	return detail;
});