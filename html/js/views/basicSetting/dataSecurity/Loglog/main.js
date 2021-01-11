define(function(require){
    //基础js
    var LIB = require('lib');
    var tpl = LIB.renderHTML(require("text!./main.html"))
    //Vue数据模型
    var dataModel = function(){
        return{
            moduleCode : LIB.ModuleCode.BS_DaS_LogL,
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
            tableModel:LIB.Opts.extendMainTableOpt(
                {
                    url : "logLogin/list{/curPage}{/pageSize}",

                    selectedDatas:[],

                    columns:[{
                        title : "",
                        fieldName : "id",
                        fieldType : "cb",
                    },{
                        title :  this.$t("das.oniu.loginMode"),
                        fieldName : "loginType",
                        fieldType: "custom",
    					filterType : "enum",
//                        filterType : "text",
    					filterName:"criteria.intsValue.loginType",
                        popFilterEnum : LIB.getDataDicList("login_type"),
                        render: function (data) {
                            return LIB.getDataDic("login_type", data.loginType);
                            // if (data.loginType == "0") {
                            //     return "网页";
                            // } else if (data.loginType == "1") {
                            //     return "移动端-Andriod";
                            // } else {
                            //     return "移动端-iOS";
                            // }
                        },
                        width: 100
                    },{
                        title : this.$t("das.oniu.accounts"),
                        fieldName : "account",
        				filterType : "text",
        				filterName:"account",
                        width: 160

                    },
                    //  {
                    //     title : "IP",
                    //     fieldName : "ip",
        			// 	filterType : "text",
        			// 	filterName:"ip",
                    //     width: 121

                    // }, {
                    //     title : this.$t("das.oniu.posit"),
                    //     fieldName : "qth",
        			// 	filterType : "text",
        			// 	filterName:"qth",
                    //     width: 240

                    // }, 
                    {
                        title :this.$t("das.oniu.time"),
                        fieldName : "createDate",
        				filterType : "date",
        				filterName:"createDate",
                        width: 180
                    },{
                        title :"OS版本",
                        fieldName : "loginOs",
                        filterType : "text",
                        filterName:"loginOs",
                        width: 180
                    },{
                        title :"网页-浏览器",
                        fieldName : "browser",
                        filterType : "text",
                        filterName:"browser",
                    }]
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
                url: "/logLogin/exportExcel",
                withColumnCfgParam: true
            }
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
            //     if(data.cell.fieldName == "name") {
            //         this.showDetail(data.entry.data);
            //     }else{
            //         this.detailModel.show = false;
            //     }
            // },
            
            //显示详情
            // showDetail:function(row){
            //     this.detailModel.show = true;
            //     this.$broadcast('ev_detailReload',row.id);
            // },
            //显示全部分类
            doShowCategory:function(){
                this.mainModel.showCategory = !this.mainModel.showCategory;
            },
            //新增方法
            doAdd : function(){
                this.editModel.show = true;
                this.editModel.title = "新增";
                this.editModel.opType = "create";
                this.editModel.id = null;
                this.$broadcast('ev_editReload', null);
            },
            //修改方法
            doUpdate:function(){
                var rows = this.tableModel.selectedDatas;
                    
                if(rows.length > 1){
                    LIB.Msg.warning("无法批量修改数据");
                    return;
                }
                var row = rows[0];
                this.editModel.show = true;
                this.editModel.title = "修改";
                this.editModel.opType = "update";
                this.editModel.id = row.id;
                this.$broadcast('ev_editReload',row.id);
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
//	var BASE = require('base');
//	var LIB = require('lib');
//
//	var gridSel = "#jqxgrid";
//	var grid;
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
//
//
//	//初始化jqxGrid
//	function initJqxGrid(vm,mainModel){
//		//Grid数据源配置
//		var dataOpts = {
//			url: BASE.ctxpath+"/logLogin/list",
////				 url: "http://sz.safewaychina.cn:10025/safeye-web",
//			datafields:
//				[
//					{ name: 'loginType', type: 'string' },
//					{ name: 'account', type: 'string' },
//					{ name: 'ip', type: 'string' },
//					{ name: 'qth', type: 'string' },
//					{ name: 'createDate', type: 'string' }
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
//				{ text: '登录方式',  datafield: 'loginType', width: '10%' ,
//					filtertype: 'custom', createfilterpanel: LIB.jqxHelper.buildInputFilter,
//					cellsrenderer: function (row, columnfield, value, defaulthtml, columnproperties) {
//						if (value == 1) {
//							return "网页";
//						} else {
//							return "手机";
//						}
//					}
//				},
//				{ text: '账号', datafield: 'account',
//					filtertype: 'custom', createfilterpanel: LIB.jqxHelper.buildInputFilter
//				},
//				{ text: 'ip',  datafield: 'ip', width: '10%' ,
//					filtertype: 'custom', createfilterpanel: LIB.jqxHelper.buildInputFilter
//				},
//				{ text: '地理位置', datafield: 'qth',
//					filtertype: 'custom', createfilterpanel: LIB.jqxHelper.buildInputFilter
//				},
//				{ text: '时间',  datafield: 'createDate', width: '10%' ,
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
//	//初始化页面控件
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
//		var vm =LIB.VueEx.extend({
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
//		});
//
//
//	return vm;
//});