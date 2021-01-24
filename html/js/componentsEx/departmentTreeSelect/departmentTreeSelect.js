define(function(require) {

	var LIB = require('lib');

	var template='<iv-tree-select '+
		':popper-fixed="popperFixed"'+
		':model.sync="id"'+
		':placement="placement"'+
		':list="data"'+
		'id-attr="id"'+
        ':placeholder="placeholder"'+ 
		'display-attr="name"' +
		':disabled="disabled"' +
		'@on-clear-single-select="doClearSingleSelect"' +
		':clearable="clearable">'+
			'<iv-tree :model="treeData"'+
			':selected-datas.sync="selectedDatas4Tree"'+
			'id-attr="id"'+
			':default-open-layer="defaultOpenLayer"'+
			'pid-attr="parentId"'+
			':serch-filterable="true"'+
			'display-attr="name"'+
			':single-select="true"'+
			':allow-parent-checked="true"'+
			'class="treeDepartment"'+
			'</iv-tree>'+
		'</iv-tree-select>';

	var opts = {
		template :  template,
		props: {
			placement: {
                type: String,
                default: 'bottom-start'
            },
            //是否允许folder选中
            allowParentChecked: {
                type: Boolean,
                default: false
            },
			id: {
				type: [String, Number, Array],
				default: ''
			},
			data: {
				type: [Array],
			},
			selectedDatas:{
				type: [Array],
			},
			selectAllComp:{//所有公司都可选
				type: Boolean,
				default: false
			},
			compId:{
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
			flag:{
				type: Boolean,
				default: true
			},
            clearable:{
                type: Boolean,
                default: false
			},
			defaultCompId:Boolean,
			popperFixed:{
				type:Boolean,
				default:true,
			}
		},
		watch : {
			id : function(val) {
				//清空选中的树

                // if(this.compId){
                //    this.selectedDatas4Tree = [{"id":val}];
                // }else{
                //    this.selectedDatas4Tree=[{"id":val}];
                // }
                // if(_.isEmpty(val)) {
                //     this.id = this.compId;
                // }
				// 复制的时候 afterInitData 自动修改部门为 本用户部门
				var _this = this;
				if(_this.id){
					if(_this.compId){
						_this.selectedDatas4Tree = [{"id":_this.id}];
					}else{
						_this.selectedDatas4Tree=[{"id":_this.id}];
					}
					if(_.isEmpty(val)) {
						_this.id = _this.compId;
					}
				}
            },
			//oldVal 为compId变化的之前的id
			compId:function(val, oldVal){
				if (oldVal) {
					this.selectedDatas4Tree = [];
				}
                // 下面会导致切换公司后部门信息丢失
				 if(this.compId && this.flag){
				 	this.ready = true;
                     this.flag = false;
                     //在每次修改公司的时候 都清空部门id
                     //规则为旧的oldVal 没有值 新的val有值 部门id有值
                     if(oldVal && val && this.id && window.changeMarkObj.hasCompChanged){
                         this.id = this.compId;
                         debugger
                         window.changeMarkObj.hasCompChanged = false;
                     }
                     this.init();
				 }
			},
			"selectedDatas4Tree": function (nVal, oVal) {
				var nId = _.get(nVal, '[0].id');
				var oId = _.get(oVal, '[0].id');
				if (oId && oId !== nId) {
                	window.changeMarkObj.hasDeptChanged = true;
                    // 防止没有属地组件，标志位不会重置
                    setTimeout(function () {
                        window.changeMarkObj.hasDeptChanged = false;
                    }, 500)
				}
            }
		},
		data: function () {
			return {
                selectedDatas4Tree: [],
				treeData: null,
				defaultOpenLayer:2,
				placeholder:LIB.lang('ri.bc.psd')
			}
        },
		methods: {
            doClearSingleSelect: function () {
				this.selectedDatas4Tree = [];
            },
            //查询出公司下面的所有部门
            buildAllDeptByParentId : function (parentId, result) {
            	var _this = this;
                var resultTmp = _.filter(LIB.setting.orgList, function (data) {
                    return data.parentId === parentId && data.type === "2";
                });
                if(!_.isEmpty(resultTmp)) {
                    _.each(resultTmp, function (_item) {
                        _this.buildAllDeptByParentId(_item.id, resultTmp);
                    });
                    _.each(resultTmp, function (_tmpItem) {
                        result.push(_tmpItem);
                    })
                }
            },
			//获取数据
			init:function(parentId){
            	if(this.defaultCompId){
            		this.compId=LIB.user.compId;
				}
				var _this = this;

           				//查询出公司下面的所有部门
				var result = _.filter(LIB.setting.orgList, function (data) {
					return data.parentId === _this.compId && data.type == "2";
				});
				if (this.selectAllComp) {//所有公司都可选
					result =LIB.setting.orgList
					this.defaultOpenLayer=0
				}
				
				if(!_.isEmpty(result)&&!this.selectAllComp) {
					_.each(result, function (_item) {
						//查询出公司下面的所有部门
						_this.buildAllDeptByParentId(_item.id, result);
					});
				}
                this.data = result;
				this.treeData = [];
                this.treeData = _.filter(result, function (item) {
					return item.disable != '1'
                });
                if(this.ready && this.data.length < 1){

					//如果禁止输入 要去掉之前的默认id 防止 数据不进行更新 bug2508
					_this.id = "";
				}
				//防止watch 多次请求
				setTimeout(function(){
					_this.flag = true;
				}, 2000);

                // 设置空
                setTimeout(function () {
                    if(_this.id){
                    	var val =  _.find(_this.treeData,function (item) {
							return item.id == _this.id;
                        });

                    	if(val){
                            _this.selectedDatas4Tree=[{"id":_this.id}];
						}else{

                            _this.selectedDatas4Tree = [];
                            _this.id = null;
						}

                        // if(_.isEmpty(_this.id)) {
                        //     _this.id = _this.compId;
                        // }
                    }
                },150)

			},
		},
        attached: function() {

            var isNeedRefreshData = false;
            if(this.orgListVersion != window.allClassificationOrgListVersion) {
                this.orgListVersion = window.allClassificationOrgListVersion;
                isNeedRefreshData  = true;
            } else if(!this.data) {
                isNeedRefreshData  = true;
            }
            if(isNeedRefreshData) {
                var _this = this;
                var result = _.filter(LIB.setting.orgList, function (data) {
                    return data.parentId == _this.compId && data.type == "2";
                });

                if(!_.isEmpty(result)) {
                    _.each(result, function (_item) {
                        //查询出公司下面的所有部门
                        _this.buildAllDeptByParentId(_item.id, result);
                    });
                }

                this.data = result;
                this.treeData = _.filter(result, function (item) {
                    return item.disable != '1'
                });
            }
        },
        created : function () {
            this.orgListVersion = 1;
        },
		ready: function ready() {
			this.init();
			if(this.id){
				this.selectedDatas = [];
				this.selectedDatas4Tree.push({"id":this.id});
            }
		}
	};
	var component = LIB.Vue.extend(opts);
	LIB.Vue.component('department-tree-select', component);

});