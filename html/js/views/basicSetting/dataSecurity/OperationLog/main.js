define(function(require){
    //基础js
    var LIB = require('lib');
    var tpl = LIB.renderHTML(require("text!./main.html"))
    //Vue数据模型
    var dataModel = function(){
        return{
            moduleCode : LIB.ModuleCode.BS_DaS_OpeL,
            //此处可以不绑定数据，默认会开启组织机构的分类选项
//         categoryData : {
//            //添加全部分类默认显示文字
//            title:"赛为集团Vqq",
////            config:[{
////                //是否显示设置按钮
////                NodeEdit:false,
////                //左侧类别名称
////                title:"组织机构",
////                //数据源网址  请求优先
////                url:"user/setting",
////                type:"org"
////            }]
//         },
            tableModel: LIB.Opts.extendMainTableOpt(
                {
                    url : "logoperate/list{/curPage}{/pageSize}",

                    selectedDatas:[],

                    columns:[{
                        title : "",
                        fieldName : "id",
                        fieldType : "cb"
                    },{
                        title : this.$t("das.oniu.operatType"),
                        width : 100,
                        fieldName : "type",
                        fieldType: "custom",
        				filterType : "enum",
        				filterName:"criteria.strsValue.type",
        				popFilterEnum : LIB.getDataDicList("operation_type"),
        				render: function (data) {
                            return LIB.getDataDic("operation_type",data.type);
                        }
                    },{
                        title : this.$t("das.oniu.operator"),
                        width : 160,
                        fieldName : "username",
                        fieldType : "link",
        				filterType : "text",
        				filterName:"username"
                    }, {
                        title :this.$t("das.oniu.dataIdentificat"),
                        width : 160,
                        fieldName : "attr1",
        				filterType : "text",
        				filterName:"attr1"
                    }, {
                        title : "IP",
                        width : 160,
                        fieldName : "ip",
        				filterType : "text",
        				filterName:"ip"
                    }, {
                        title : this.$t("das.oniu.opContent"),
                        fieldName : "afterOperate",
        				filterType : "text",
        				filterName:"afterOperate",
                        renderClass: "textarea",
                        width: 800
                    }, {
                        title : this.$t("das.oniu.opTime"),
                        fieldName : "createDate",
        				filterType : "date",
        				filterName:"createDate",
                        width: 180
                    }],
                    defaultFilterValue: {"criteria.orderValue": {fieldName: "createDate", orderType: "1"}}
                }
            ),
            //控制全部分类组件显示
            mainModel : {
                //显示分类
                showCategory : false,
                showHeaderTools:false,
            },
            editModel : {
                //控制编辑组件显示
                title : "新增",
                //显示编辑弹框
                show : false,
                //编辑模式操作类型
                type : "create",
                id: null
            },
            detailModel : {
                //控制右侧滑出组件显示
                show : false
            },
            exportModel : {
                url: "/logoperate/exportExcel",
                withColumnCfgParam: true
            },
        }

    };

    var vm = LIB.VueEx.extend({
        template:tpl,
        data:dataModel,
//      components : {
//          "editcomponent":editComponent,
//          "detailcomponent":detailComponent
//      },
        methods:{

            // doTableCellClick:function(data) {
            //     //if(data.cell.fieldName == "name") {
            //     //    this.showDetail(data.entry.data);
            //     //}else{
            //     //    this.editModel.show = false;
            //     //}
            // },
            //显示全部分类
            doShowCategory:function(){
                this.mainModel.showCategory = !this.mainModel.showCategory;
            },
            //导出方法
            doExport:function(){
                LIB.Modal.confirm({
                    title:'导出选中数据?',
                    onOk:function(){
                        var rows = this.tableModel.selectedDatas;
                        var deleteIds = _.map(rows,function(row){return row.id});
                        LIB.Msg.warning("导出");
                    }
                });
            },
            doTableCellClick : function(data){debugger;
                if (data.cell.colId == 2) {//状态单元格--修改状态
                    var _data = _.clone(data.entry.data);
                    if(_data.attr2 && _data.attr2 != '9999999999') {
                        window.open('/html/main.html#!/basicSetting/organizationalInstitution/PersonnelFi?method=detail&id='+_data.attr2+'&name='+_data.username)
                    }
                }
            },
        },
        //响应子组件$dispatch的event
        events : {
            //edit框点击保存后事件处理
            "ev_editFinshed" : function(data) {
                this.emitMainTableEvent("do_update_row_data", {opType:"update", value: data});
                this.editModel.show = false;
            },
            //edit框点击取消后事件处理
            "ev_editCanceled" : function() {
                this.editModel.show = false;
            },
            //detail框点击关闭后事件处理
//          "ev_detailColsed" : function(){
//              this.detailModel.show = false;
//          }
        }
    });
    return vm;
});


//define(function (require) {
//	//基础js
//	var LIB = require('lib');
//
//	var gridSel = "#jqxgrid";
//	//Vue数据模型
//	var dataModel = {
//		//控制全部分类组件显示
//		mainModel: {
//			//显示分类
//			showCategory: false,
//			showHeaderTools: false,
//			//当前grid所选中的行
//			selectedRow: []
//		},
//		editModel: {
//			//控制右侧滑出组件显示
//			show: false
//		},
//		detailModel: {
//			//控制编辑组件显示
//			title: "新增",
//			//显示编辑弹框
//			show: false,
//			//编辑模式操作类型
//			type: "create",
//			id: null
//		}
//	};
//
//	//初始化页面控件
//
//
//	//初始化jqxGrid
//	function initJqxGrid(vm,mainModel){
//		//Grid数据源配置
//		var dataOpts = {
//			url: BASE.ctxpath+"/logoperate/list",
////				 url: "http://sz.safewaychina.cn:10025/safeye-web",
//			datafields:
//				[
//					{ name: 'createDate', type: 'string' },
//					{ name: 'attr1', type: 'string' },
//					{ name: 'type', type: 'string' },
//					{ name: 'username', type: 'string' },
//					{ name: 'ip', type: 'string' },
//					{ name: 'afterOperate', type: 'string' }
//				]
//		}
//		//初始化Grid
//		var dataAdapter = LIB.jqxHelper.buildPageDataAdapter(dataOpts,"#jqxgrid");
//		//Grid配置
//		var gridOpts = {
//			width: '100%',
//			height: '700px',
//			//交替行效果
//			altrows: true,
//			source: dataAdapter,
//			columns: [
//				{ text: '操作类型',  datafield: 'type', width: '10%' ,
//					filtertype: 'custom', createfilterpanel: LIB.jqxHelper.buildInputFilter,
//					cellsrenderer: function (row, columnfield, value, defaulthtml, columnproperties) {
//						if (value == "UPDATE") {
//							return "更新";
//						} else if(value == "INSERT"){
//							return "创建";
//						}else{
//							return "删除";
//						}
//					}
//				},
//				{ text: '操作人', datafield: 'username',
//					filtertype: 'custom', createfilterpanel: LIB.jqxHelper.buildInputFilter
//				},
//				{ text: '数据标识',  datafield: 'attr1', width: '10%' ,
//					filtertype: 'custom', createfilterpanel: LIB.jqxHelper.buildInputFilter
//				},
//				{ text: 'IP', datafield: 'ip',
//					filtertype: 'custom', createfilterpanel: LIB.jqxHelper.buildInputFilter
//				},
//				{ text: '操作内容', datafield: 'afterOperate',
//					filtertype: 'custom', createfilterpanel: LIB.jqxHelper.buildInputFilter
//				},
//				{ text: '操作时间',  datafield: 'createDate', width: '10%' ,
//					filtertype: 'custom', createfilterpanel: LIB.jqxHelper.buildInputFilter
//				}
//			]
//		};
//		//初始化Grid
//		grid = LIB.jqxHelper.buildPageGrid(gridOpts,"#jqxgrid",mainModel);
//		//右滑
//		LIB.jqxHelper.creatCellClickEvent(grid,1,function(row){
//			vm.showDetail(row);
//		});
//	}
//
//		//使用Vue方式，对页面进行事件和数据绑定
//		/**
//		 *  请统一使用以下顺序配置Vue参数，方便codeview
//		 *    el
//		 template
//		 components
//		 componentName
//		 props
//		 data
//		 computed
//		 watch
//		 methods
//		 events
//		 vue组件声明周期方法
//		 created/beforeCompile/compiled/ready/attached/detached/beforeDestroy/destroyed
//		 **/
//		var vm = LIB.VueEx.extend({
//			template:require("text!./main.html"),
//			data:function(){return dataModel},
//			methods: {
//			},
//
//			//响应子组件$dispatch的event
//			events: {
//				//edit框点击保存后事件处理
//				"ev_editFinshed": function () {
//					grid.jqxGrid("updatebounddata", "data");
//					this.editModel.show = false;
//				},
//				//edit框点击取消后事件处理
//				"ev_editCanceled": function () {
//					this.editModel.show = false;
//				},
//				//detail框点击关闭后事件处理
//				"ev_detailColsed": function () {
//					this.detailModel.show = false;
//				}
//			},
//			ready: function () {
//				//初始化grid
//				initJqxGrid(this, dataModel.mainModel);
//			}
//
//		});
//
//	return vm;
//});