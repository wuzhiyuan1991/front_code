define(function(require) {

	var LIB = require('lib');

	var template='<iv-tree-select '+
		':model.sync="model"'+
		':list="data"'+
		'id-attr="id"'+
		'display-attr="name"' +
		':disabled="disabled">'+
			'<iv-tree :model="data"'+
			':selected-datas.sync="selectedDatas"'+
			'id-attr="id"'+
			'pid-attr="parentId"'+
			'display-attr="name"'+
			':single-select="true"'+
			':allow-parent-checked="true"'+
			':show-checkbox="false"'+
			'class="treeDepartment"'+
			'</iv-tree>'+
		'</iv-tree-select>'

	var opts = {
		template :  template,
		props: {
			model: {
				type: [String, Number, Array],
				default: ''
			},
			data: {
				type: [Array],
			},
			selectedDatas:{
				type: [Array],
			},
			orgId:{
				type: String,
			},
			disabled:{
				type: Boolean,
				default: false
			},
			//初始化 第一次禁止disabled为ture
			ready:{
				type: Boolean,
				default: false
			},
		},
		watch : {
			model : function(val) {
				//清空选中的树
				this.selectedDatas=[{"id":val}];
				//this.selectedDatas.push({"id":val});
			},
			orgId:function(){
				if(this.orgId){
					this.ready = true;
					this.init();
				}
			}
		},
		methods: {
			//获取数据
			init:function(parentId){
				var _this = this;
				var parentId=parentId;
				//var parentId=this.parentId;
				var resource = this.$resource("organization/list/dept");
				resource.get({parentId:this.orgId}).then(function(res){
					if(this.ready && res.data.length < 1){
						_this.disabled = true;
						//如果禁止输入 要去掉之前的默认id 防止 数据不进行更新 bug2508
						_this.model = "";
					}else{
						_this.disabled = false;
					}
					_this.data=res.data;
				});
			},
		},
		ready: function ready() {
			this.init();
			if(this.model){
				this.selectedDatas = [];
				this.selectedDatas.push({"id":this.model});
			}
			//this.selectedDatas = [];
			//this.selectedDatas.push({"id":""});
		}
	}
	var component = LIB.Vue.extend(opts);
	LIB.Vue.component('user-tree-select', component);

});