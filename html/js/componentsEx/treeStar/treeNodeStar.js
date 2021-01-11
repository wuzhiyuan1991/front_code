define(function(require) {
	/* star为可配置显示收藏按钮
	 isTab为删除跟星星切换属性
	 isIndex为可配置是否显示第一层删除按钮
	*/
	var Vue = require("vue");
	var template = require("text!./treeNodeStar.html");


	var opts = {
		template :  template,
		props: {
			edit:{
				type:[Boolean],
				default:false
			},
			parentModel:Object,
		    model: Object,
		    //是否允许folder选中
		    allowParentChecked: {
		    	type:Boolean
		    },
		    //是否单选
		    singleSelect: {
		    	type:Boolean,
		    	default:true
		    },
		    displayAttr:{
		    	type:String,
		    	default:"name"
		    },
			idAttr:{
				type:String,
				default:"id"
			},
		    selectedDatas: {
	            type: Array,
	            default:function(){return [];}
			},
			showCheckbox:{
				type:Boolean,
			},
			showChecked:{
				type:Boolean,
				default:false

			},
			defaultOpen: {
				type:Boolean,
				default:true
			},
			//控制星星点击的时候切换
			star:{
				type:Boolean,
			},
			//收藏跟星星切换
			isTab:{
				type:Boolean,
				default:true
			},
			//第一层级不能显示删除按钮
			isIndex:{
				type:Boolean,
				default:true
			},
			//树排序 保存索引字段
			sortIndex:{
				type:Number,
				default:null
			},
			isStarShow:{
				type:Boolean,
				default:false
			},
			isTitleClick:{
				type:Boolean,
				default:true
			}
		  },
		  data: function () {
		    return {
		      checked : false,
		      open:true
		    }
		  },
		  computed: {
		    isFolder: function () {
			  return  this.model.children &&
				this.model.children.length > 0
		    },

		    displayLabelValue:function() {
//		    	console.log("this.displayAttr = " + this.displayAttr);
		    	return this.model[this.displayAttr] || "";
		    },
			  //idAttr 设置一个变量用来控制id
			 isShow:function(){
				 return this.model[this.idAttr] && this.model[this.idAttr] != '-1';
			 } ,
		   treeClasses: function() {
				  var obj = {};
				  obj['bold'] = this.isFolder;
				  obj['bold'] = !this.isIndex;
				  //obj['custom-vi-tree-item-selected'] = this.showChecked;
			      obj['custom-vi-tree-item-star'] = this.showChecked && this.isTitleClick;
			   //这个用来区分鼠标hover 跟选中是的class
			      obj['custom-vi-tree-item-report'] = !this.showChecked;
				  obj["custom-vi-tree-item-select-down"] = this.edit;
				  return [obj];
			  },

			  ////对其问题 传出去一个class
			  listClasses:function(){
				  var prm = {};
				  prm['custom-vi-tree-item-select-prm'] = !this.isIndex && !this.isFolder;
				  prm['custom-vi-tree-item-select-obj'] = !this.isFolder;
				  return [prm];
			  },
			  isValue:function(){
				  var num = this.$refs.treeNodes ? _.reduce(this.$refs.treeNodes,function(memo, node){ return memo + node.isValue;},0) : 0;
				  if(this.model.star){
					  num += 1;
				  }
				  return num;
			  }
//		  ,
//		    isChecked: function() {
//				 var _this = this;
//		    	_.each(selectedDatas, function(item){
//					 if(item.id == _this.model.id) {
//						 console.log(data);
//						 _this.checked = true;
//						 return true;
//					 }
//				 })
//		    	return false;
//		    }
		  },
		  watch : {
//			  selectedDatas  : function(val) {debugger;
//			  	console.log("selectedDatas changed ---------------------------------------------------");
//				  	var _this = this;
//			    	_.each(this.selectedDatas, function(item){
//						 if(item.id == _this.model.id) {
//							 console.log(item);
//							 _this.checked = true;
//							 return;
//						 }
//					 });
//			  },
			  checked : function(val) {
				  //更新所有children选中的状态
				  if(this.$children) {
					  //非单选则选中所有子节点
					  if(!this.singleSelect) {
						  _.each(this.$children,function(child){
							 child.$data.checked = val;
						  });
					  }
				  }
				  //更新parent状态
				  if(val) {

				  }else {
					  if(this.$parent && this.$parent.$data) {
//						  this.$parent.$data.checked = false;
					  }
				  }
				  //添加class判断
				if(this.showCheckbox){
					this.showChecked=false;
				}
				  else{
					this.showChecked=this.checked;
				}
			  },
			  //isStar:function(){
				//  console.log(this.isStar);
			  //}


		  },
		  methods: {
			 doAddNode : function() {
				 this.$dispatch("on-add-node", {data: this.model, parentData: this.parentModel}, this.addChildWithType);
//				 var obj = {id:"123",name: 'new stuff'}
//				 this.addChildWithType(obj);
			 },
			 doEditNode : function() {
				 this.$dispatch("on-edit-node", {data: this.model, parentData: this.parentModel});
			 },
			 doDelNode : function() {
				 //var parentChildren = this.parentModel.children;
				 //parentChildren.splice(parentChildren.indexOf(this.model), 1);
				 this.$dispatch("on-del-node", {data: this.model, parentData: this.parentModel});
			 },
		     doEditUp:function(){
				 //当前点击元素的索引位置
				 var index = this.sortIndex;
				 //父元素的长度
				 var parentLenth = this.parentModel.children.length;
				 if(index == 0){
					 //如果点击的 在第一个 就把它移动到最后一个
					 this.parentModel.children.splice(index,1);
					 this.parentModel.children.splice(parentLenth,0,this.model);
				 }else {
					 //如果点击的不是第一个 那就他的索引值减去1 让他往上移动
					 this.parentModel.children.splice(index,1);
					 this.parentModel.children.splice(index - 1,0,this.model);
				 }
				 //this.$el.parentNode.insertBefore(this.$el,this.$el.parentNode.childNodes[index]);
			  },
			  doEditDown:function(){
				  //当前点击元素的索引位置
				  var index = this.sortIndex + 1;
				  //父元素的长度
				  var parentLenth = this.parentModel.children.length;
				  if(index == parentLenth){
					  //如果点击的 是最后一个 就把它移动到第一个
					  this.parentModel.children.splice(index-1,1);
					  this.parentModel.children.splice(0,0,this.model);
				  }else {
					  //如果点击的不是最后一个 那就他的索引值加去1 让他往下移动
					  this.parentModel.children.splice(index-1,1);
					  this.parentModel.children.splice(index,0,this.model);
				  }
			  },
			//参数 e : 事件， type : 0 表示checkbox点击的事件， 1 表示span 显示label点击的事件
		    toggle: function (e, type) {
		      if (this.isFolder) {
			      //只有当点击span 显示的label时才 收起或展开子节点
		    	  if(type == 1) {
		    		  this.open = !this.open;
		    	  } else {
					  this.checked = !this.checked;
				  }
		      } else {
			    this.checked = !this.checked;
//			    this.$dispatch("ev_treeNode_clicked", {data:this.model, checked: this.checked});

//			    this.refreshCheckedStatus();

//			    if(this.checked) {
//			    	this.selectedDatas.push(this.model);
//			    } else {
//			    	this.selectedDatas = [];
//			    }
		      }

		    //当点击的是父节点的 span 显示的label时， 不发送选中事件
		    if(!(this.isFolder && type == 1)) {
			    this.$dispatch("ev_treeNode_clicked", {data:this.model, checked: this.checked});
		    }

		    },

		  doStar:function(){
			  //this.star = !this.star;
			  //if(this.model.star == true){
				//  this.model.star = false
			  //}else{
				//  this.model.star = true;
			  //}
			  //this.$dispatch("on-star", {data:this.model,star:this.star});
			  var _this = this,star;
			  //获取star的长度
			  while(_this && _this.model.id != -1){
				  if(_this.$parent){
					  _this = _this.$parent;
					  star = _this.isValue;
				  }
			  }
			  this.$dispatch("on-star",this.model,star);
		  },
		//鼠标移入
		  doShowStar:function(){
			  this.isStarShow = true;
		  },
		  //鼠标移出
		  doHideStar:function(){
			  this.isStarShow = false;
		  },
		    addChildWithType: function (newObj) {
		      if (!this.isFolder) {
		        Vue.set(this.model, 'children', []);
		        this.addChild(newObj);
		      } else {
		    	  this.addChild(newObj);
		      }
		      this.open = true;
		    },
		    addChild: function (newObj) {
		      this.model.children.push(newObj);
		    }
//		    ,
//		    refreshCheckedStatus:function() {
//				  var _this = this;
//		    	_.each(this.selectedDatas, function(item){
//					 if(item.id == _this.model.id) {
//						 console.log(item);
//						 _this.checked = true;
//						 return;
//					 }
//				 });
//		    }
		 },
		 events : {
			 "ev_selectedDatas_changed" : function(data) {
//				 console.log("recieved msg ");
				 var _this = this;
					 if( _this.model){
						 _.each(data, function(item){
							 if(item && item[_this.idAttr] == _this.model[_this.idAttr]) {
								 //如果是子节点， 或者单选模式下的父节点， 则设置选中
								 if(!_this.isFolder || (_this.singleSelect && _this.isFolder)) {
									 //使用$nextTick，防止部分情况 页面不更新的情况
									 _this.$nextTick(function() {
										 _this.checked = true;
									 });
								 }
							 } else {
								 _this.checked = false;
							 }
						 })
					 return true;
				 }
			 }
		 },
		 ready: function() {
			 this.open = this.defaultOpen;

//			  debugger;
//			  console.log("this.selectedDatas");
//			  console.log(this.selectedDatas);
//			  this.refreshCheckedStatus();
//			  this.$broadcast("ev_selectedDatas_changed", this.selectedDatas);
		  }
	};


	var component = Vue.extend(opts);
//	Vue.component('iv-tree', component);
	Vue.component('iv-tree-node-star', component);


});