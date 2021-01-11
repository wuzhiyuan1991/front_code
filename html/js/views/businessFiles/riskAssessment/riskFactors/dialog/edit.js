define(function(require){
	var LIB = require('lib');
 	//数据模型
	var api = require("../vuex/api");
	var tpl = require("text!./edit.html");
	
	var newVO = function() {
		return {
				id :null,
				name:null,
				orgId:null,
				code:null,
				description:null,
				parentId:null,
                parentHazardFactor:{},
		}
	};
	//数据模型
	var dataModel = {
			mainModel : {
				vo : newVO(),
				//当前的操作类型， create：创建， update ：更新， 影响'保存'按钮的事件处理
				opType : "",
			},
			selectedDatas:[],
			hazardfactorTypeList:[],
			orgList:[],
			selectedOrg:[],
			rules: {
	    		orgId: [
	    	            	{ required: true, message: '请选择所属公司'},
	    	          ],
	    	    name: [
	    	                { required: true, message: '请输入危害因素名称'},
					LIB.formRuleMgr.length(50)
	    	                //{ max: 50, message: '长度在 0 到 50 个字符'},
	    	                ],
    	        code: [
    	                   { required: true, message: '请输入编码'},
					LIB.formRuleMgr.length(100)
    	                   //{ max: 100, message: '长度在 0 到 100 个字符'},
	    	         	],
	    	    description: [
					LIB.formRuleMgr.length(500)
	     	                   //{ max: 500, message: '长度在 0 到 500 个字符'},
	    	               ],
	    	}
	};
	
	
	var detail = LIB.Vue.extend({
		template: tpl,
		data:function(){
			return dataModel;
		},
		methods:{
			doSave:function(){
				var _this = this;
				if(_this.selectedOrg && _this.selectedOrg.length >0){
					dataModel.mainModel.vo.orgId = _this.selectedOrg[0].id;
				}
				if(_this.selectedDatas && _this.selectedDatas.length >0){
					dataModel.mainModel.vo.parentId = _this.selectedDatas[0].id;
                    dataModel.mainModel.vo.parentHazardFactor=_this.selectedDatas[0];
				}
				_this.$refs.ruleform.validate(function (valid) {
	            if (valid) {
	            	
					if(_this.mainModel.opType == "create") {
						api.create(_.pick(_this.mainModel.vo,"id","name","description","parentId","orgId","code")).then(function(res){
							_this.$dispatch("ev_gridRefresh");
		            		LIB.Msg.info("保存成功");
						});
					} else if(_this.mainModel.opType == "update"){
						api.update(_.pick(_this.mainModel.vo,"id","name","description","parentId","orgId","code")).then(function(res){
							_this.$dispatch("ev_editFinshed",dataModel.mainModel.vo);
							LIB.Msg.info("修改成功");
						});
					}
		            }else{
		                return false;
		               }
					});
			},
			doCancel:function(){
				this.$dispatch("ev_editCanceled");
			}
		},
		events : {
			//edit框数据加载
			"ev_editReload" : function(nVal){
				this.$refs.ruleform.resetFields();
				//注意！ events中使用 绑定的data， 需要通过全局对象直接引用， 而methods中可以直接通过this引用到data
				var _data = dataModel.mainModel;
				var _vo = dataModel.mainModel.vo;
				//清空数据
        		_.extend(_vo,newVO());
        		this.selectedOrg=new Array();
        		this.selectedDatas=new Array();
        		//存在nVal则是update
        		if(nVal != null) {
        			_data.opType = "update";
	        		api.get({id:nVal}).then(function(res){
	        			//初始化数据
	        			_.deepExtend(_vo, res.data);
	        		 	dataModel.selectedOrg.push({"id":res.data.orgId});
	        			dataModel.selectedDatas.push({"id":res.data.parentId});
	        		});
	        		//初始化分类列表数据
	        		api.selectTree({id:nVal}).then(function(res){
	        			dataModel.hazardfactorTypeList = res.data;
	        		});
        		} else {
            		_data.opType = "create";
            		api.getUUID().then(function(res){
            			_vo.id = res.data;
            		});
            		//初始化分类列表数据
            		api.listTableType().then(function(res){
            			dataModel.hazardfactorTypeList = res.data;
            		});
        		}
        		//初始化机构下拉数据
    			api.listOrganization().then(function(res){
    				dataModel.orgList = res.data;
    			});
			},
		}
	});
	
	return detail;
});