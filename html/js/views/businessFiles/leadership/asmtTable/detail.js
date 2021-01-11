define(function(require){
	var LIB = require('lib');
	var api = require("./vuex/api");
	//右侧滑出详细页
	var tpl = require("text!./detail.html");
	var groupModal = require("./formModal/group");
	var itemModal = require('./formModal/item');
	//初始化数据模型
	var newVO = function() {
		return {
			//id
			id : null,
			//编码
			code : null,
			//自评表名称
			name : null,
			compId : null,
            asmtItems: [],
            score: 0
		}
	};
	//Vue数据
	var dataModel = {
		mainModel : {
			vo : newVO(),
			opType : 'view',
			isReadOnly : true,
			title:"",
			
			//验证规则
	        rules:{
				"name" : [
					LIB.formRuleMgr.require("自评表名称"),
				 	 LIB.formRuleMgr.length()
				],
                "compId": [
                    { required: true, message: '请选择所属公司' },
                    LIB.formRuleMgr.length()
                ]
	        },
	        emptyRules:{}
		},
        tableModel : {
            asmtItemTableModel : {
                columns : [
                    {
                        title : "名称",
                        fieldName : "name"
                    },
                    {
                        title: '分数',
                        fieldName: 'score',
                        width: '80px'
                    }
                ]
            }
        },
		formModel : {
			group : {
				show : false,
				queryUrl : "asmttable/{id}/asmtitem/{asmtItemId}"
			},
			item: {
				show: false
			}
		},
        updateGroupNameIndex: -1,
		selectModel : {
		}

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
	 created/beforeCompile/compiled/ready/attached/detached/beforeDestroy/destroyed
	 **/

	var detail = LIB.Vue.extend({
		mixins : [LIB.VueMixin.dataDic,LIB.VueMixin.auth,LIB.VueMixin.detailPanel],
		template: tpl,
		components : {
			groupModal: groupModal,
            itemModal: itemModal
        },
		data:function(){
			return dataModel;
		},
		methods:{
			newVO : newVO,
            _getData: function () {
                var _this = this;
                api.get({id: this.mainModel.vo.id}).then(function (res) {
                    _this.mainModel.vo.asmtItems = res.data.asmtItems;
                    _this.calcScore();
                })
            },
            // -------------项操作--------------

            doMoveItems:function(data) {
                var _this = this;

                if (data.offset === -1 && data.index === 0) {
                    return;
                }
                if (data.offset === 1 && (data.index === data.items.length - 1)) {
                    return;
                }

                var offset = data.offset === 1 ? 2 : 1;
				var params = {
                    asmtTableId: this.mainModel.vo.id,
					id: data.item.id,
                    itemOrderNo: data.item.itemOrderNo
                };

                api.updateItemOrderNo({type : offset}, params).then(function (res) {
                    _this._getData();
                    LIB.Msg.info("移动成功");
                });
            },

            doAddItem: function (groupIndex) {
                this.groupIndex = groupIndex;
                this.$refs.itemFormModal.init("create");
                this.formModel.item.show = true;
            },

            doRemoveItem: function (params) {
                var _this = this;
                LIB.Modal.confirm({
                    title: '确定删除数据?',
                    onOk: function() {
                        _this.$api.removeAsmtItems({id:_this.mainModel.vo.id},{id: params.id}).then(function () {
                            LIB.Msg.info("删除成功");
                            _this._getData();
                        })
                    }
                });

            },
            doEditItem: function (data) {
                this.$refs.itemFormModal.init("update", _.cloneDeep(data));
                this.formModel.item.show = true;
            },
            doUpdateItem: function (data) {
                if(data.asmtBasisList.length > 0) {
                    data.asmtBasisList = _.filter(data.asmtBasisList, function (item) {
                        return item.id
                    })
                }
                var _this = this;
                api.updateAsmtItem({id: this.mainModel.vo.id}, data).then(function(){
                    LIB.Msg.info("保存成功");
                    _this.formModel.item.show = false;
                    _this._getData();
                });
            },
            doCreateItem: function (_data) {
                var data = _.cloneDeep(_data);
                var _this = this;
                // 过滤自评依据
                if(data.asmtBasisList.length > 0) {
                    data.asmtBasisList = _.filter(data.asmtBasisList, function (item) {
                        return item.id
                    })
                }
                // 获取当前分组
                var group = _.cloneDeep(this.mainModel.vo.asmtItems[this.groupIndex]);
                var _vo = _.assign(data, {
                    groupName: group.groupName,
                    asmtTable: _.pick(this.mainModel.vo, ['id','name']),
                    compId: LIB.user.compId
                });
                api.saveAsmtItem({id:this.mainModel.vo.id},_vo).then(function(res){
                    group.asmtItemList.push(_.assign(_vo, {
                        id: res.data.id
                    }));
                    _this.mainModel.vo.asmtItems.splice(_this.groupIndex, 1, group);
                    LIB.Msg.info("新增成功");
                    _this.calcScore();
                });
            },


            // -------------分组操作---------------------
            doAddGroup: function () {
                var _this = this;
                api.getUUID().then(function(res){
                    var len = _this.mainModel.vo.asmtItems.length + 1;
                    var group = {
                        id: res.data,
                        groupOrderNo: 0,
                        asmtTableId: _this.mainModel.vo.id,
                        asmtItemList: [],
                        groupName: '分组' +  len
                    };
                    while (true) {
                        var isGroupNameExist = _this.mainModel.vo.asmtItems.some(function (t) {
                            return t.groupName === group.groupName;
                        });
                        if(isGroupNameExist) {
                            len += 1;
                            group.groupName = "分组" + len;
                        } else {
                            break;
                        }
                    }
                    _this.mainModel.vo.asmtItems.push(group);
                    _this.$nextTick(function () {
                        var scroll= document.getElementsByClassName('detail-container')[0];
                        scroll.scrollTop = scroll.scrollHeight;
                    })
                });
                // this.formModel.group.show = true;
            },
            doUpdateGroupName: function (index,oldname, e) {
                this.oldname = oldname;
                this.updateGroupNameIndex = index;
                this.$nextTick(function () {
                    e.target.closest(".clearfix").querySelector('input').focus();
                })
            },
            doSaveGroupName: function (newName) {
                if(this.oldname === newName) {
                    this.updateGroupNameIndex = -1;
                    return;
                }
                if(!newName) {
                    LIB.Msg.error("分组名不能为空");
                    return;
                }
                if(newName.length > 50) {
                    LIB.Msg.error("分组名长度不能超过50个字符");
                    return;
                }
                var _this = this;
                var params = {
                    oldGroupName: this.oldname,
                    groupName: newName,
                    asmtTableId: this.mainModel.vo.id
                };
                this.$api.updateGroupName(params).then(function (res) {
                    LIB.Msg.info("修改成功");
                    _this.updateGroupNameIndex = -1;
                });
            },
            doDeleteGroup: function (index, groupName) {
                var _this = this;
                var params = {
                    groupName: groupName,
                    asmtTableId: this.mainModel.vo.id
                };
                LIB.Modal.confirm({
                    title: '删除当前自评项分组?',
                    onOk: function() {
                        _this.$api.deleteGroup(null, params).then(function () {
                            LIB.Msg.info("删除成功");
                            _this.mainModel.vo.asmtItems.splice(index, 1);
                            _this.calcScore();
                        })
                    }
                });

            },
            beforeInit: function () {
                this.mainModel.vo.asmtItems = null;
                this.updateGroupNameIndex = -1;
            },
            buildSaveData: function () {
                return _.omit(this.mainModel.vo, 'asmtItems');
            },
            afterInitData: function () {
                this.calcScore();
                var lastColumn = _.last(this.tableModel.asmtItemTableModel.columns);
                if(!this.hasAuth('edit') && lastColumn.fieldName === 'up') {
                    this.tableModel.asmtItemTableModel.columns.pop();
                }
            },
            calcScore: function () {
                var vo = this.mainModel.vo;
                var score = 0;

                if(vo.asmtItems && vo.asmtItems.length > 0) {
                    _.each(vo.asmtItems, function (item) {
                        if(item.asmtItemList && item.asmtItemList.length > 0) {
                            _.each(item.asmtItemList, function (val) {
                                score += parseInt(val.score);
                            })
                        }
                    })
                }

                vo.score = score;
            },
            doDelete: function () {
                var _vo = this.mainModel.vo;
                var _this = this;
                var params = _.omit(_vo, 'asmtItems');
                LIB.Modal.confirm({
                    title: '删除当前数据?',
                    onOk: function() {
                        _this.$api.remove(null, params).then(function() {
                            _this.afterDoDelete(_vo);
                            _this.$dispatch("ev_dtDelete");
                            LIB.Msg.info("删除成功");
                        });
                    }
                });
            }
		},
		events : {
		},
        init: function(){
        	this.$api = api;
        }
	});

	return detail;
});