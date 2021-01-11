define(function(require){
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail-xl.html");

	var chinese2Pinyin = require("libs/chinese2pinyin");
	var dominationAreaSelectModal = require("componentsEx/selectTableModal/dominationAreaSelectModal");
	//初始化数据模型
	var newVO = function() {
		return {
			//ID
			id : null,
			//编码
			code : null,
			//名称
			name : null,
			compId: '',
			orgId: '',
			remark: '',
			//禁用标识 0未禁用，1已禁用
			disable : '1',
            abbreviate: '',
			parentId:null,//上级属地ID
			parentDominationArea:{id:null,name:null},//上级属地
			QRCode:[],
		}
	};


	//Vue数据
	var dataModel = {
		mainModel : {
			vo : newVO(),
			opType : 'view',
			isReadOnly : true,
			title:"",
            disableList: [{id: "0", name: "启用"}, {id: "1", name: "停用"}],
            rules: {
                "name" : [LIB.formRuleMgr.require("名称"),
                    LIB.formRuleMgr.length()
                ],
                "compId": [{ required: true, message: '请选择所属公司' }, LIB.formRuleMgr.length() ],
                "orgId": [{ required: true, message: '请选择所属部门' }, LIB.formRuleMgr.length() ],
                "disable": [
                    LIB.formRuleMgr.require("状态")
                ],
				"parentId" : [LIB.formRuleMgr.allowStrEmpty],
            }
		},
		selectModel : {
			dominationAreaSelectModel : {
				visible : false,
				filterData : {orgId : null}
			},
		},
		QRCodeModel : {
			url: "",
			showBig:false
		},
		dominationAreaSetParentId:false,
	};
	//Vue组件
	/**
	 *  请统一使用以下顺序配置Vue参数，方便codeview
	 *	el
	 template
	 components
	 componentName
	 props
	 data
	 computed
	 watch
	 methods
	 events
	 vue组件声明周期方法
     init/created/beforeCompile/compiled/ready/attached/detached/beforeDestroy/destroyed
	 **/
	var detail = LIB.Vue.extend({
		mixins : [LIB.VueMixin.dataDic,LIB.VueMixin.auth,LIB.VueMixin.detailPanel],
		template: tpl,
		components : {
			"dominationareaSelectModal":dominationAreaSelectModal,
        },
        computed: {
            disableLabel: function () {
                return this.mainModel.vo.disable === '1' ? '停用' : '启用';
            }
        },
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			doShowDominationAreaSelectModal : function() {
				if(!this.mainModel.vo.orgId){
					LIB.Msg.info("请先选择所属部门");
					return;
				}
				this.selectModel.dominationAreaSelectModel.visible = true;
				var excludeIds = [];
				if(this.mainModel.vo.id && this.mainModel.opType == 'update'){
					excludeIds.push(this.mainModel.vo.id);
				}
				this.selectModel.dominationAreaSelectModel.filterData = {orgId : this.mainModel.vo.orgId, "criteria.strsValue": JSON.stringify({excludeIds: excludeIds})};
			},
			doSaveDominationArea : function(selectedDatas) {
				if (selectedDatas) {
					this.mainModel.vo.parentDominationArea = {
						id: selectedDatas[0].id,
						name: selectedDatas[0].name
					}
					this.mainModel.vo.parentId = selectedDatas[0].id;
				}
			},
			doClearParentDominationArea:function(){
				this.mainModel.vo.parentDominationArea = null;
				this.mainModel.vo.parentId=null
			},
            onNameChanged: function () {
				var name = this.mainModel.vo.name;
				this.mainModel.vo.abbreviate = chinese2Pinyin.convert(name, "F", {remainSpecial: true});
            },
            afterInitData: function (transferVO) {
				if (this.mainModel.action === 'copy') {
					this.mainModel.vo.name += '（复制）';
				}
				// if(this.mainModel.action === 'view'){
				// 	this.QRCodeModel.url = "/dominationarea/qrcode/" + this.mainModel.vo.id;
				// }else{
				// 	this.QRCodeModel.url = "";
				// }
				if(transferVO) {
					this.mainModel.vo.QRCode = [];
					this.mainModel.vo.QRCode.push({fileId: "QRCODE-DominationArea:" + transferVO.id});
				}
            },
            beforeInit:function(transferVO){

			},
			beforeDoSave: function() {
				this.parent=_.clone(this.mainModel.vo.parentDominationArea)
				this.mainModel.vo.parentDominationArea = null;
				
			},
			afterDoSave: function() {
				this.mainModel.vo.QRCode = [];
				this.mainModel.vo.QRCode.push({fileId: "QRCODE-DominationArea:" + this.mainModel.vo.id});
				this.mainModel.action = 'view';
				this.mainModel.vo.parentDominationArea=this.parent
			},
			doPic: function () {
				this.QRCodeModel.showBig = true;
			}

		},
		events : {
		},
		ready:function(){
			this.dominationAreaSetParentId = LIB.getBusinessSetStateByNamePath("common.dominationAreaSetParentId");
		},
    	init: function(){
        	this.$api = api;
        },
	});

	return detail;
});