define(function(require){
	var LIB = require('lib');

 	//数据模型
	var tpl = require("text!./addFileModal.html");
	var editComponent = require("./edit");
	var api = null;

	//初始化数据模型
	var newVO = function() {
		return {
			name:null,
			parent:{id:null},
			compId:null
		}
	};

	//Vue数据
	var dataModel = {
		mainModel : {
			vo : newVO(),
		},
		//文件数据
		folderData:null,
		//最大不可编辑的目录数量
		readOnlySize:null,
		editModel:{
			show:false,
			title:"编辑"
		}
	};
	
	var detail = LIB.Vue.extend({
		template: tpl,
		components : {
			"editcomponent":editComponent
		},
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
			doSave: function () {
				var _this = this;
				_this.$emit("do-file-finshed");
			},
            doClose:function(){
                this.doSave();
            },
			doNewFile:function(){
				var _this = this;
                if(_this.mainModel.vo.name){
                    api.createFile(this.mainModel.vo).then(function(res){
                        //_this.folderData.push(_this.mainModel.vo);
                        if(_this.mainModel.vo.parent.id){
                            _this.doNodeLoading(_this.mainModel.vo.parent.id);
                        }else{
                            _this.doLoading();
                        }
                    })
                }

			},
			//编辑状态
			doEdit:function(data){
				this.editModel.show = true;
				this.$broadcast('ev_editReload',data);
			},
			doDelNode:function(index,data){
				var _this = this;
				api.delFile(null,data).then(function(res){
					_this.folderData.splice(index,1);
					LIB.Msg.info("删除成功");
				})
			},
			//刷新父节点数据
			doLoading:function(){
				var _this = this ;
				var resource = _this.$resource("/material/list/{currentPage}/{pageSize}");
				var baseParam = {
					currentPage: 1,
					pageSize:20,
					"criteria.orderValue.fieldName":"sort",
                    "criteria.orderValue.orderType":"0",
                    compId:_this.mainModel.vo.compId
				}
				resource.get(baseParam).then(function(res){
					_this.folderData = res.data.list;
				});
			},
			//刷新子节点
			doNodeLoading:function(id){
				var _this = this;
				var resource = _this.$resource("/material/list/{currentPage}/{pageSize}");
				var baseParam = {
					currentPage: 1,
					pageSize:20,
					"parent.id":id,
					"criteria.orderValue.fieldName":"sort",
                    "criteria.orderValue.orderType":"0",
                    compId:_this.mainModel.vo.compId
				}
				resource.get(baseParam).then(function(res){
					var data = res.data.list;
					var arr = [];
					//过滤掉上传的文本
					if(data){
						_.each(data,function(item){
							if(item.type == 1){
								arr.push(item);
							}
						})
					}
					this.folderData = data ? arr:data;
				});
			},
			doEditFinshed:function(){
				this.editModel.show = false;
				if(this.mainModel.vo.parent.id){
					this.doNodeLoading(this.mainModel.vo.parent.id);
				}else{
					this.doLoading();
				}
			},
			doEditUp:function(i,index,data){
				var _this = this;
				if(i==1){
					if(index == 0) {
						return;
					}else {
						var parentLenth = this.folderData.length;
						var up = _this.folderData[index].sort;
						var down = _this.folderData[index-1].sort;
					     _this.folderData[index].sort = down;
						 _this.folderData[index-1].sort = up;
                        //var arr = JSON.parse(JSON.stringify(_this.folderData));
                        _.each(_this.folderData,function(item){
                            if(item.parent){
                                delete  item.parent;
                            }
                        })
                        //console.log(_this.folderData);
						api.batchFile(_this.folderData).then(function(res){
							//_this.folderData.splice(index,1);
							//_this.folderData.splice(index - 1,0,data);
                            if(_this.mainModel.vo.parent.id){
                                _this.doNodeLoading(_this.mainModel.vo.parent.id);
                            }else{
                                _this.doLoading();
                            }
						})
					}
				}else if(i == 2) {
					var maxIndex = _this.folderData.length-1;
					if(index == maxIndex) {
						return;
					}else {
						var down = _this.folderData[index].sort;
						var up = _this.folderData[index+1].sort;
						_this.folderData[index].sort = up;
						_this.folderData[index+1].sort = down;
                        _.each(_this.folderData,function(item){
                            if(item.parent){
                                delete  item.parent;
                            }
                        })
						//_this.$set("folderData", _this.folderData);
						api.batchFile(_this.folderData).then(function(res){
							//_this.folderData.splice(index,1);
							//_this.folderData.splice(index + 1,0,data);
                            if(_this.mainModel.vo.parent.id){
                                _this.doNodeLoading(_this.mainModel.vo.parent.id);
                            }else{
                                _this.doLoading();
                            }
						})
					}
				}
			},
		},
		ready: function () {
			var _this = this;
			require(["./vuex/api"], function (data) {
				api = data;
			});
		},
		events:{
			"ev_editFileReload": function (val,id,data) {
				var _this = this;
				var _vo = _this.mainModel.vo;
				//清空数据
				_.extend(_vo, newVO());
				_this.readOnlySize = 0;
				var arr = [];
				//过滤掉上传的文本
				if(data){
					_.each(data,function(item){
						if(item.type == 1){
							if(item.isEditable == 0) {
								_this.readOnlySize = _this.readOnlySize + 1;
							}
							arr.push(item);
						}
					})
				}
				this.folderData = data ? arr:data;
				_vo.compId = id;
				//判断val 是否有值
				if(val){
					_vo.parent.id = val;
				}
			}
		},
	});
	
	return detail;
});