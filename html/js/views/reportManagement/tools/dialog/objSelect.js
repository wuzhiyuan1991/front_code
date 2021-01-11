define(function(require){
    var LIB = require("lib");
    var api = require("../vuex/objSelectApi");
    var template = require("text!./objSelect.html");
    
    var opts = {
    		template:template,
    		props:{
    			type:{ //frw-机构,dep-部门,per-人员,equip-设备设施
    				type:String,
    				'default':'frw'
    			},
    			disabled:Boolean,
    			values:Array,
				subjectMatterType:false,
				mechanismType:false
    		},
    		data:function(){
    			return {
    				show:false,
    				treeData:[],
                    modelType: '' //数据缓存标识
    			}
    		},
			computed:{
				showTitle: function(){
					var type = this.type;
					return "frw" === type ? "选择机构" : "dep" === type ? "选择部门" : "per" === type ? "选择人员" : "equip" === type ? "选择设备设施" : "选择";
				},
				parentNode: function(){
					return _.contains(["dep",'per','equip'],this.type);;
				},
				isDepart: function(){
					return "dep" === this.type;
				}
			},
    		watch:{
    			type:function(type){
					this.loadTreeData(type);
    			}
    		},
    		methods:{
				loadTreeData:function(type){
                    this.modelType = type;
    				var _this = this;
    				this.treeData = [];
					var qryParam = {
						doOrgLimit: "1" == LIB.getSettingByNamePath("envBusinessConfig.reportFunction.enableDataLimit")
					};
    				if("frw" === type){//机构
						this.subjectMatterType=false;
						this.mechanismType = true;
						qryParam['type'] = 1;
    					api.listOrg(qryParam).then(function(res){
    						_this.treeData = _.map(res.data,function(d){
    							return {key:d.id, label:d.name, parentKey:d.parentId};
    						});
    					});
    				}else if("dep" === type){//部门
						this.subjectMatterType=false;
						this.mechanismType = false;
    					api.listDep().then(function(res){
    						_this.treeData = _.map(res.data,function(d){
    							return {key:d.id, label:d.name, parentKey:d.parentId,type: d.type};
    						});
    					});
    				}else if("per" === type){//人员
						this.subjectMatterType=false;
						this.mechanismType = false;
    					api.listPerson(qryParam).then(function(res){
    						_this.treeData = _.map(res.data,function(d){
    							return {key:d.id, label:d.name, parentKey:d.parentId};
    						});
    					});
    				}else if("equip" === type){//设备设施
						this.subjectMatterType=true;
						this.mechanismType = false;
    					api.listEquip(qryParam).then(function(res){
    						_this.treeData = _.map(res.data,function(d){
    							return {key:d.id, label:d.name, parentKey:d.parentId,type: d.type};
    						});
    					});
    				}
				}
    		},
			ready:function(){
				this.loadTreeData(this.type);
			}
    };
    var comp = LIB.Vue.extend(opts);
    return comp;
});