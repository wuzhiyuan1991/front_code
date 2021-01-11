
define(function(require){
	//基础js
	var LIB = require('lib');
	var api = require("./vuex/api");
	//编辑弹框页面
	//var editComponent = require("./edit");
	var editComponent = require("./edit");
	//vue数据 配置url地址 拉取数据
	var dataModel = {
		//业务中心危害因素 业务档案 ---检查项
		risktype:{
			data:null,
			//selectedTreeDatas:[],
			showHide:false,
			selectedDatas: [],
		},
		innerAddFun:{
			type:Function
		},
		//业务档案 ---检查依据
		checkbasistype:{
			data:null,
			showHide:false,
			selectedDatas: [],
		},
		listTableType:{
			data:null,
			showHide:false,
			selectedDatas: [],
		},
		equipmentType:{
			data:null,
			showHide:false,
			selectedDatas: [],
		},
		industryCategory:{
			data:null,
			showHide:false,
			selectedDatas: [],
		},
		courseCategory:{
			data:null,
			showHide:false,
			selectedDatas: [],
		},
		certificationSubject:{
			data:null,
			showHide:false,
			selectedDatas: [],
		},
		addModel:{
			//显示弹框
			show : false,
			title:"修改",
			id: null
		},
		showTrainingCategory:false
	};
	var vm = LIB.VueEx.extend({
		//引入html页面
		template: require("text!./main.html"),
		components : {
			"editcomponent":editComponent
		},
		data : function() {
			return dataModel;
		},
		methods:{
			doTabs:function(data){
				var _this = this;
				_this.key = data.key;
				if(this.key==2){
					api.checkbasistype().then(function(res1){
						_this.checkbasistype.data = res1.data;
					});
				}else if(this.key==3){
					//业务档案--隐患排除---检查表
					api.listTableType().then(function(res2){
						_this.listTableType.data = res2.data;
					});
				}else if(this.key==4){
					api.equipmentType().then(function(res3){
						_this.equipmentType.data = res3.data;
					});

				}else if(this.key==5){
					//行业分类
					api.industryCategory().then(function(res4){
						_this.industryCategory.data = res4.data;
					});

				}else if(this.key==6){
					//课程类型
					api.courseCategory().then(function(res5){
						_this.courseCategory.data = res5.data;
					});
				}else if(this.key==7){
					//取证类型
					api.certificationSubject().then(function(res6){
						_this.certificationSubject.data = res6.data;
					})
				}
			},
			//全部显示
			treeShowList:function(){
				this.$refs.treegridrisk.$children[0].doShowNode(function(){
				})
			},
			//全部隐藏
			treeHide:function(){
				this.$refs.treegridrisk.$children[0].doHideNode(function(){
				})
			},
			//全部显示
			treeList:function(){
				this.$refs.treegridlist.$children[0].doShowNode(function(){
				})
			},
			//全部隐藏
			treeListHide:function(){
				this.$refs.treegridlist.$children[0].doHideNode(function(){
				})
			},
			//全部显示
			treeListEquipment:function(){
				this.$refs.equipment.$children[0].doShowNode(function(){
				})
			},
			//全部隐藏
			treeListHideEquipment:function(){
				this.$refs.equipment.$children[0].doHideNode(function(){
				})
			},
			//全部显示
			treeListIndustry:function(){
				this.$refs.industry.$children[0].doShowNode(function(){
				})
			},
			//全部隐藏
			treeListHideIndustry:function(){
				this.$refs.industry.$children[0].doHideNode(function(){
				})
			},
			//全部显示
			treeListCourseCategory:function(){
				this.$refs.course.$children[0].doShowNode(function(){
				})
			},
			//全部隐藏
			treeListHideCourseCategory:function(){
				this.$refs.course.$children[0].doHideNode(function(){
				})
			},
			//全部显示
			treeListCertificationSubject:function(){
				this.$refs.certification.$children[0].doShowNode(function(){
				})
			},
			//全部隐藏
			treeListHideCertificationSubject:function(){
				this.$refs.certification.$children[0].doHideNode(function(){
				})
			},
			//业务中心--风险评估---危害辨识    业务档案--隐患排查---检查项
			//新增
			treeAdd:function(val){
			    this.addModel.show = true;
				this.addModel.title = "新增"
				this.$broadcast('ev_detailrisktypeAdd',val);
			},

			risktypeDoAddNode:function(value, innerAddFun){
				this.innerAddFun = innerAddFun;
				this.addModel.title = "新增"
				this.$broadcast('ev_detailReload',value,"risktypeAdd","add");
				this.addModel.show = true;
			},
			//修改
			risktypeDoEditNode:function(value) {
				this.treeGridName = value;
				this.addModel.title="修改"
				//value.data.name += "modify"
				this.$broadcast('ev_detailReload',value,"risktypeUpdata","updata");
				this.addModel.show = true;
			},
			//删除
			risktypeDoDelNode:function(value){
				var id = value.data.id;
				var _this = this;
				if(value.data.children && value.data.children.length > 0){
					LIB.Msg.error("该分类下面存在子分类，不可删除！");
					return
				}
				var callback = function (res) {
					if(res.status == 200){
						window.businessCache = true;
						LIB.Msg.info("删除成功");
						value.parentChildren.splice(value.parentChildren.indexOf(value.data), 1);
					}
				}
				api.deleteRiskType(null,[id]).then(callback)
			},
			//业务档案---风险评估---检查依据
			checkbasistypeDoAddNode:function(value, innerAddFun) {
				this.innerAddFun = innerAddFun;
				this.addModel.title = "新增"
				this.$broadcast('ev_detailReload',value,"checkbasistypeAdd","add");
				this.addModel.show = true;
			},
			//修改
			checkbasistypeDoEditNode:function(value) {
				this.treeGridName = value;
				this.addModel.title="修改"
				//value.data.name += "modify"
				this.$broadcast('ev_detailReload',value,"checkbasistypeUpdata","updata");
				this.addModel.show = true;
			},
			//删除
			checkbasistypeDoDelNode:function(value){
				var id = value.data.id;
				var _this = this;
				if(value.data.children && value.data.children.length > 0){
					LIB.Msg.error("该分类下面存在子分类，不可删除！");
					return
				}
				var callback = function (res) {
					if(res.status == 200){
						window.businessCache = true;
						LIB.Msg.info("删除成功");
						value.parentChildren.splice(value.parentChildren.indexOf(value.data), 1);
					}
				}
				api.deleteCheckBasisType(null,[id]).then(callback)
			},
			//业务档案--隐患排除---检查表
			listTableTypeDoAddNode:function(value, innerAddFun) {
				this.innerAddFun = innerAddFun;
				this.addModel.title = "新增"
				this.$broadcast('ev_detailReload',value,"listTableTypeAdd","add");
				this.addModel.show = true;
			},
			//修改
			listTableTypeDoEditNode:function(value) {
				this.treeGridName = value;
				this.addModel.title="修改"
				//value.data.name += "modify"
				this.$broadcast('ev_detailReload',value,"listTableTypeUpdata","updata");
				this.addModel.show = true;
			},
			//删除
			listTableTypeDoDelNode:function(value){
				var id = value.data.id;
				var _this = this;
				if(value.data.children && value.data.children.length > 0){
					LIB.Msg.error("该分类下面存在子分类，不可删除！");
					return
				}
				var callback = function (res) {
					if(res.status == 200){
						window.businessCache = true;
						LIB.Msg.info("删除成功");
						value.parentChildren.splice(value.parentChildren.indexOf(value.data), 1);
					}
					//_this.retrieveData();
				}
				api.delTableType(null,[id]).then(callback)
			},
			//设备设施类型
			equipmentTypeDoAddNode:function(value, innerAddFun) {
				this.innerAddFun = innerAddFun;
				this.addModel.title = "新增"
				this.$broadcast('ev_detailReload',value,"equipmentTypeAdd","add");
				this.addModel.show = true;
			},
			//修改
			equipmentTypeDoEditNode:function(value) {
				this.treeGridName = value;
				this.addModel.title="修改"
				//value.data.name += "modify"
				this.$broadcast('ev_detailReload',value,"equipmentTypeUpdata","updata");
				this.addModel.show = true;
			},
			//删除
			equipmentTypeDoDelNode:function(value){
				var id = value.data.id;
				var _this = this;
				if(value.data.children && value.data.children.length > 0){
					LIB.Msg.error("该分类下面存在子分类，不可删除！");
					return
				}
				var callback = function (res) {
					if(res.status == 200){
						window.businessCache = true;
						LIB.Msg.info("删除成功");
						value.parentChildren.splice(value.parentChildren.indexOf(value.data), 1);
					}
					//_this.retrieveData();
				}
				api.delEquipmentType(null,value.data).then(callback)
			},
			//行业分类
			industryCategoryDoAddNode:function(value, innerAddFun) {
				this.innerAddFun = innerAddFun;
				this.addModel.title = "新增"
				this.$broadcast('ev_detailReload',value,"industryCategoryAdd","add");
				this.addModel.show = true;
			},
			//修改
			industryCategoryDoEditNode:function(value) {
				this.treeGridName = value;
				this.addModel.title="修改"
				//value.data.name += "modify"
				this.$broadcast('ev_detailReload',value,"industryCategoryUpdata","updata");
				this.addModel.show = true;
			},
			//删除
			industryCategoryDoDelNode:function(value){
				var id = value.data.id;
				var _this = this;
				if(value.data.children && value.data.children.length > 0){
					LIB.Msg.error("该分类下面存在子分类，不可删除！");
					return
				}
				var callback = function (res) {
					if(res.status == 200){
						window.businessCache = true;
						LIB.Msg.info("删除成功");
						value.parentChildren.splice(value.parentChildren.indexOf(value.data), 1);
					}
					//_this.retrieveData();
				}
				api.delIndustryCategory(null,value.data).then(callback)
			},
			//课程类型
			courseCategoryDoAddNode:function(value, innerAddFun) {
				this.innerAddFun = innerAddFun;
				this.addModel.title = "新增"
				this.$broadcast('ev_detailReload',value,"courseCategoryAdd","add");
				this.addModel.show = true;
			},
			//修改
			courseCategoryDoEditNode:function(value) {
				this.treeGridName = value;
				this.addModel.title="修改"
				//value.data.name += "modify"
				this.$broadcast('ev_detailReload',value,"courseCategoryUpdata","updata");
				this.addModel.show = true;
			},
			//删除
			courseCategoryDoDelNode:function(value){
				var id = value.data.id;
				var _this = this;
				if(value.data.children && value.data.children.length > 0){
					LIB.Msg.error("该分类下面存在子分类，不可删除！");
					return
				}
				var callback = function (res) {
					if(res.status == 200){
						window.businessCache = true;
						LIB.Msg.info("删除成功");
						value.parentChildren.splice(value.parentChildren.indexOf(value.data), 1);
					}
					//_this.retrieveData();
				}
				api.delCourseCategory(null,value.data).then(callback)
			},
			//取证类型
			certificationSubjectDoAddNode:function(value, innerAddFun) {
				this.innerAddFun = innerAddFun;
				this.addModel.title = "新增"
				this.$broadcast('ev_detailReload',value,"certificationSubjectAdd","add");
				this.addModel.show = true;
			},
			//修改
			certificationSubjectDoEditNode:function(value) {
				this.treeGridName = value;
				this.addModel.title="修改"
				//value.data.name += "modify"
				this.$broadcast('ev_detailReload',value,"certificationSubjectUpdata","updata");
				this.addModel.show = true;
			},
			//删除
			certificationSubjectDoDelNode:function(value){
				var id = value.data.id;
				var _this = this;
				if(value.data.children && value.data.children.length > 0){
					LIB.Msg.error("该分类下面存在子分类，不可删除！");
					return
				}
				var callback = function (res) {
					if(res.status == 200){
						window.businessCache = true;
						LIB.Msg.info("删除成功");
						value.parentChildren.splice(value.parentChildren.indexOf(value.data), 1);
					}
					//_this.retrieveData();
				}
				api.delCertificationSubject(null,value.data).then(callback)
			},
			//获取数据
			retrieveData:function(){
				var _this = this;
				//业务中心 ---危害因素 业务档案 ---检查项
				api.risktype().then(function(res){
					_this.risktype.data = res.data;
				});
				////业务档案 ---检查依据
				//api.checkbasistype().then(function(res1){
				//	_this.checkbasistype.data = res1.data;
				//});
				////业务档案--隐患排除---检查表
				//api.listTableType().then(function(res2){
				//	_this.listTableType.data = res2.data;
				//});
				//api.equipmentType().then(function(res3){
				//	_this.equipmentType.data = res3.data;
				//});
				////行业分类
				//api.industryCategory().then(function(res4){
				//	_this.industryCategory.data = res4.data;
				//});
				////课程类型
				//api.courseCategory().then(function(res5){
				//	_this.courseCategory.data = res5.data;
				//});
				////取证类型
				//api.certificationSubject().then(function(res6){
				//	_this.certificationSubject.data = res6.data;
				//})
			},
			doUpdate:function(value,flag,type){
				//if(flag == "add"){
				//	var obj = {
				//		id:value.vo.id,
				//		name:value.vo.name,
				//		code:value.vo.code,
				//		orderNo:value.vo.orderNo,
				//	}
				//	this.innerAddFun(obj);
				//}else{
				//	this.treeGridName.data.name= value.vo.name;
				//	this.treeGridName.data.code = value.vo.code;
				//	this.treeGridName.data.orderNo = value.vo.orderNo;
				//}
				var _this = this;
				if(type=="risktypeUpdata" || type=="risktypeAdd"){
					api.risktype().then(function(res){
						_this.risktype.data = res.data;
					});
				}else if(type=="checkbasistypeAdd" || type=="checkbasistypeUpdata"){
					api.checkbasistype().then(function(res1){
						_this.checkbasistype.data = res1.data;
					});
				}else if(type=="listTableTypeAdd" || type=="listTableTypeUpdata"){
					api.listTableType().then(function(res2){
						_this.listTableType.data = res2.data;
					});
				}else if(type=="equipmentTypeAdd" || type=="equipmentTypeUpdata"){
					api.equipmentType().then(function(res3){
						_this.equipmentType.data = res3.data;
					});
				}else if(type=="industryCategoryAdd" || type=="industryCategoryUpdata"){
					api.industryCategory().then(function(res4){
						_this.industryCategory.data = res4.data;
					});
				}else if(type=="courseCategoryAdd" || type=="courseCategoryUpdata"){
					api.courseCategory().then(function(res5){
						_this.courseCategory.data = res5.data;
					});
				}else if(type=="certificationSubjectAdd" || type=="certificationSubjectUpdata"){
						api.certificationSubject().then(function(res6){
							_this.certificationSubject.data = res6.data;
						})
				}
				window.businessCache = true;
				this.addModel.show = false;
			},
			doEditAdd:function(value,type){
				var _this = this;
				var obj = {
					id:value.vo.id,
					name:value.vo.name,
					code:value.vo.code,
					orderNo:value.vo.orderNo,
				}
				if(type == "risktype"){
					//this.risktype.data.push(obj);
					//this.retrieveData();
					api.risktype().then(function(res){
						_this.risktype.data = res.data;
					});
				}else if(type == "checkbasistype"){
					//this.checkbasistype.data.push(obj);
					//this.retrieveData();
					api.checkbasistype().then(function(res1){
						_this.checkbasistype.data = res1.data;
					});
				}else if(type =="listTableType"){
					//this.listTableType.data.push(obj);
					//this.retrieveData();
					api.listTableType().then(function(res2){
						_this.listTableType.data = res2.data;
					});
				}else if(type =="equipmentType"){
					//this.listTableType.data.push(obj);
					//this.retrieveData();
					api.equipmentType().then(function(res3){
						_this.equipmentType.data = res3.data;
					});
				}else if(type =="industryCategory"){
					//this.listTableType.data.push(obj);
					//this.retrieveData();
					api.industryCategory().then(function(res4){
						_this.industryCategory.data = res4.data;
					});
				}else if(type =="courseCategory"){
					//this.listTableType.data.push(obj);
					//this.retrieveData();
					api.courseCategory().then(function(res5){
						_this.courseCategory.data = res5.data;
					});
				}else if(type =="certificationSubject"){
					//this.listTableType.data.push(obj);
					//this.retrieveData();
					api.certificationSubject().then(function(res6){
						_this.certificationSubject.data = res6.data;
					})
				}
				this.addModel.show = false;
			},

		},
		//events : {
		//	//修改
		//	"ev_editUpdata":function(value,flag){
		//
		//		},
		//		"ev_editAdd":function(value,type){
		//			var obj = {
		//				id:value.vo.id,
		//				name:value.vo.name,
		//				code:value.vo.code
		//			}
		//			if(type=="risktype"){
		//				this.risktype.data.push(obj);
		//			}else if(type=="checkbasistype"){
		//				this.checkbasistype.data.push(obj);
		//			}else if(type=="listTableType"){
		//				this.listTableType.data.push(obj);
		//			}
		//			this.addModel.show = false;
		//		},
		//	},

		ready:function(){
			this.retrieveData();
			},
		})
	return vm;
})