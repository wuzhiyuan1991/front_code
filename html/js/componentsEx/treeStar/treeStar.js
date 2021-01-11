define(function(require) {

	var Vue = require("vue");

	var opts = {
		template :'<div class="mp-header formTitle" style="position: relative ;padding-left: 14px">'+
				'<div class="basic" @click="doTitleClick" style="cursor: pointer;padding: 20px 12px 20px 0px">{{query}}</div>'+
			 		'<span v-if="enableNodeEdit" @click="doTab" style="cursor: pointer;right:15px;position: absolute;top: 20px;font-size: 20px;">' +
					'<Icon type="gear-b" v-if="isReturn"></Icon>' +
					'<Icon type="reply" v-else style="font-style: normal;"></Icon>'+
					'</span>'+
				'</div>'+
			'<div class="ivu-transfer-list-body report_left" style="min-height: 340px">'+
					'<div style="height: 100%; overflow:auto;padding-left: 15px;">'+
						'<div style="min-width: 80px">' +
							'<iv-tree-node-star ' +
								':single-select="singleSelect"' +
								' :show-checkbox="showCheckbox" ' +
								':model="model1" ' +
								':allow-parent-checked="allowParentChecked"' +
								' :display-attr="displayAttr"' +
								' :edit="edit"' +
								 ':is-tab="isTab"'+
								':is-title-click="isTitleClick"'+
								' :id-attr="idAttr" ' +
								':sort-index="sortIndex"'+
								':selected-datas="selectedDatas">' +
							'</iv-tree-node-star>'+
						'</div>'+
					'</div>'+
				'</div>',

		props: {
			enableNodeEdit:{
				type:[Boolean],
				default:true
			},
			edit:{
				type:[Boolean],
				default:false
			},
			model: {
				type:[Object,Array],
				require:true
			},
		    singleSelect: {
		    	type:Boolean,
		    	default:false
		    },
			selectedDatas: {
	            type: Array
			},
			idAttr : {
				type:String
				,
		    	default:"id"
		    },
		    pidAttr : {
				type:String
				,
	    		default:"pid"
		    },
		    displayAttr : {
				type:String
				,
		    	default:"name"
		    },
		    //是否允许folder选中
		    allowParentChecked: {
		    	type:Boolean,
	    		default:false
		    },
			showCheckbox:{
				type:Boolean,
				default:true
			},
			open:{
				type:Boolean,
				default:true
			},
			//控制显示文字
			query:{
				type:String,
				default:"查询方案"
			},
			//收藏跟星星切换
			isTab:{
				type:Boolean,
				default:true
			},
			//设置层级 用来控制第一层级 不显示星星跟删除按钮
			index:{
				type:Boolean,
				default:false
			},
			//点击切换的时候 文字切换
			isReturn:{
				type:Boolean,
				default:true
			},
			//点击查询的时候清空选中的数据
			isTitleClick:{
				type:Boolean,
				default:true
			},
			//树排序 保存索引字段
			sortIndex:{
				type:Number,
				default:null
			}
		  },
		  data: function () {
		    return {
//		      open: true,
//		      checked : true,
			  treeArr:[]

		    }
		  },

		  computed: {
			  model1 : function() {
				if(this.model){
					  if(this.model instanceof Array) {

						this.refreshModel();

						var _this = this;
						this.$nextTick(function() {
							_this.$broadcast("ev_selectedDatas_changed", this.selectedDatas);
						})
						return this.model;
					  }

						var _this = this;
						this.$nextTick(function() {
							_this.$broadcast("ev_selectedDatas_changed", this.selectedDatas);
						})
					  return this.model;
			  }else{
					return {};
				}
			  }
		  },
		  watch : {
			  selectedDatas : function(val) {
				  this.$broadcast("ev_selectedDatas_changed", this.selectedDatas);
			  }
		  },
		  methods: {
			  //重新根据prop数据源构造tree的数据源
			  refreshModel : function () {
				  if(this.model instanceof Array) {

					  var newModel = [];
					  _.each(this.model, function(item){
						  newModel.push(_.extend({}, item));
					  });
					  this.model = newModel;

					  var pidAttr = this.pidAttr;
					  var idAttr = this.idAttr;
					  var displayAttr = this.displayAttr;
					  var pidObjMap = _.groupBy(this.model, pidAttr);

					  var idArr = _.pluck(newModel, idAttr);
					  var pidArr = _.pluck(newModel, pidAttr);

					  var rootPids = _.difference(pidArr, idArr);

					  //构造属性结构
					  _.each(this.model, function(item){
						  var id = item[idAttr];
						  //添加一个索引值 用来做排序操作
						  //Vue.set(item,'sortIndex',null);
						  //给他添加一个属性
						  if(pidObjMap[id]){
							  if(!item.children) {
						        Vue.set(item, 'children', []);

							  }
//							  item.children = item.children || [];
//						item.children.push(pidObjMap[id]);
							  item.children = item.children.concat(pidObjMap[id]);
						  }
					  });

					  var rootDatas = _.filter(this.model, function(item){
						  //parentId不存在， 或者parentId不存在在所有数据的id，则该数据为rootNode
						  return !item[pidAttr] || _.contains(rootPids, item[pidAttr]);
					  });

					  var root = {id : "-1"};
				      Vue.set(root, 'children', rootDatas);
					  root[displayAttr] = "全部";
					  if(this.index){
						  _.each(root.children,function(item){
							  Vue.set(item, 'index', false);
						  })
					  }
					  this.model = root;
				  }
			  },
			  //把属性结构转换陈数组格式 在给添加一个index属性 丢给后端
			  doChangeTree:function(data){
				  var _this = this;
				  _.each(data.children,function(item,index){
					 // item["sortIndex"] = index;
					  var str ={
						  id: item.id,
						  name: item.name,
						  parentId: item.parentId||null,
						  sortIndex: index,
						  star: item.star||null
					  }
					  _this.treeArr.push(str);
					  if(item.children){
						  _this.doChangeTree(item);
					  }
				  });
				  return _this.treeArr;
			  },
			  doTab:function(){
				  //星星跟删除按钮切换
				  this.isTab = !this.isTab;
				  //ico跟返回切换
				  this.isReturn=!this.isReturn;
				  if(this.isReturn){
				     this.treeArr = [];
					 var data = this.doChangeTree(this.model);
				     this.$emit("do-save",data);
				  }
			  },
			  doTitleClick:function(){
				  this.isTitleClick=false;
				  this.$emit("on-title-click");

			  }
		  },
		  events : {
			  "ev_treeNode_clicked" : function(obj) {
				  this.isTitleClick=true;
				  if(this.singleSelect) {
					  this.selectedDatas = [];
					  this.selectedDatas.push(obj.data);

					  this.$broadcast("ev_selectedDatas_changed", this.selectedDatas);
				  }
				  else {
					  if(!obj.checked) {
						  	var _this = this;
					    	for(var i = 0; i < this.selectedDatas.length; i++) {
					    		 var item = this.selectedDatas[i];
								 if(item[_this.idAttr] == obj.data[_this.idAttr]) {
									 this.selectedDatas.splice(i,1)
									 break;
								 }
					    	}
					  } else {
							 this.selectedDatas.push(obj.data);
					  }
				  }


				  //先判断父组件是i-select
				  // todo...

				  //发送给select组件使用
				  this.$dispatch('on-select-selected', obj.data[this.idAttr]);


//				  this.$broadcast("ev_selectedDatas_changed", this.selectedDatas);
				  this.$emit("on-tree-node-click", obj);

			  }
		  },
		  created :function() {
//		  beforeCompiled :function() {
			  if(this.singleSelect && this.selectedDatas) {
				  this.selectedDatas.splice(1, this.selectedDatas.length);
			  }

			  this.refreshModel();
// 			  if(this.model instanceof Array) {
//
// //				this.model = _.deepExtend([], this.model);
// 				var newModel = [];
// 				_.each(this.model, function(item){
// 					newModel.push(_.extend({}, item));
// 				});
// 				this.model = newModel;
//
//
// 			    var pidAttr = this.pidAttr;
// 			    var idAttr = this.idAttr;
// 			    var displayAttr = this.displayAttr;
// 				var pidObjMap = _.groupBy(this.model, pidAttr);
//
// 				//构造属性结构
// 				_.each(this.model, function(item){
// 					var id = item[idAttr];
// 					if(pidObjMap[id]){
// 						item.children = item.children || [];
// //						item.children.push(pidObjMap[id]);
// 						item.children = item.children.concat(pidObjMap[id]);
// 					}
// 				});
// 				var rootDatas = _.filter(this.model, function(item){
// 					return !item[pidAttr];
// 				});
//
// 				var root = {children : rootDatas};
// 				root[displayAttr] = "全部";
// 				this.model = root;
// 			  }
		  },
		  ready: function() {
			  this.$broadcast("ev_selectedDatas_changed", this.selectedDatas);
			  this.$emit("on_tree_data_ready", this.model1);
		  }
	};


	var component = Vue.extend(opts);
	Vue.component('tree-star', component);

});