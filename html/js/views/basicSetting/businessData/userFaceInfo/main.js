define(function (require) {
    //基础js
    var LIB = require('lib');
    var api = require("./vuex/api");
    var BASE = require('base');
    var tpl = LIB.renderHTML(require("text!./main.html"));
    //编辑弹框页面fip (few-info-panel)
    var detailPanel = require("./detail");      //修改 detailPanelClass : "middle-info-aside"
    //编辑弹框页面bip (big-info-panel)
//	var detailPanel = require("./detail-xl");   //修改 detailPanelClass : "large-info-aside"
    //编辑弹框页面bip (big-info-panel) Legacy模式
//  var detailPanel = require("./detail-tab-xl");//修改 detailPanelClass : "large-info-aside"
    
	//Legacy模式
//	var userFaceInfoFormModal = require("componentsEx/formModal/userFaceInfoFormModal");

    
    var initDataModel = function () {
        return {
            moduleCode: "userFaceInfofjghjk1",
            //控制全部分类组件显示
            mainModel: {
                showHeaderTools: false,
                //当前grid所选中的行
                selectedRow: [],
                detailPanelClass : "middle-info-aside"
//				detailPanelClass : "large-info-aside"
            },
            tableModel: LIB.Opts.extendMainTableOpt(
	            {
	                url: "userfaceinfo/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
	                 LIB.tableMgr.column.cb,
					 LIB.tableMgr.column.code,
                    {
                        title:'人员',
                        fieldName: "user.username",
                        orderName: "username",
                        filterType: "text",
                        width: 100
                    },
                        LIB.tableMgr.column.company,
                        LIB.tableMgr.column.dept,
                    {
                        title:'在职',
                        orderName: "user_disable",
                        fieldType: "custom",
                        filterType: "enum",
                        filterName: "criteria.intsValue.disable",
                        fieldName:'disable',
                        popFilterEnum : LIB.getDataDicList("start_up"),
                        render: function (data) {
                            if(data && data.user && data.user.disable === '0') {
                                return '<i class="ivu-icon ivu-icon-checkmark-round" style="font-weight: bold;color: #aacd03;margin-right: 5px;"></i>' + '是';
                            } else {
                                return '<i class="ivu-icon ivu-icon-close-round" style="font-weight: bold;color: #f03;margin-right: 5px;"></i>' + '否';
                            }
                        },
                        width: 100
                    },
                    {
                        //人脸图片路径
                        title: "人脸注册时间",
                        fieldName: "createDate",
                        filterType: "date",
                    },
					// {
					// 	//人脸图片路径
					// 	title: "人脸图像",
					// 	fieldName: "filePath",
                    //     render: function (data) {
                    //         return '<img style="height:30px;width:auto" src="' + LIB.ctxPath() + '/html/images/default.png"/>'
                    //     },
                    // },
                     {
                            //人脸图片路径
                            title: "人脸图像",
                            fieldName: "filePath",
                            render: function (data) {
                                if (data.cloudFile) {
                                   
                                        var img = LIB.convertFilePath(LIB.convertFileData(data.cloudFile))
                                        return '<img class="faceImg" style="height:30px;width:auto;cursor:pointer" src="' + img + '"/>'
                                    
                                   
                                } else {
                                    return '<img   style="height:30px;width:auto" src="images/default.png"/>'
                                }
                            },
                        }
	                ],
                    defaultFilterValue:{"postType":"0"}
	            }
            ),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/userfaceinfo/importExcel"
            },
            exportModel : {
                url: "/userfaceinfo/exportExcel",
                withColumnCfgParam: true
            },
            images:[]
			//Legacy模式
//			formModel : {
//				userFaceInfoFormModel : {
//					show : false,
//				}
//			}

        };
    }

    var vm = LIB.VueEx.extend({
		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainPanel],
		//Legacy模式
//		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainLegacyPanel],
    	template: tpl,
        data: initDataModel,
        components: {
            "detailPanel": detailPanel,
			//Legacy模式
//			"userfaceinfoFormModal":userFaceInfoFormModal,
            
        },
        methods: {
            doTableCellClick: function (data) {
                var target = data.event.target
                if (target && target.classList.contains("faceImg")) {
                    $('.viewer-close').off('click')

                    this.images = _.map([data.entry.data.cloudFile], function (content) {
                        return LIB.convertFileData(content);
                    });
                    var _this = this;
                    setTimeout(function () {
                        _this.$refs.imageViewer.view(0);
                        $('.viewer-close').on('click',function () {
                           
                            _this.images = []
                        })
                    }, 100);



                } else if (data.cell.colId == 1) {
                    this.showDetail(data.entry.data)
                }

            },
			//Legacy模式
//			doAdd : function(data) {
//				this.formModel.userFaceInfoFormModel.show = true;
//				this.$refs.userfaceinfoFormModal.init("create");
//			},
//			doSaveUserFaceInfo : function(data) {
//				this.doSave(data);
//			}

        },
        events: {
        },
        init: function(){
        	this.$api = api;
        },
        ready: function () {
            var column = _.find(this.tableModel.columns, function (c) {
                return c.fieldName === 'disable';
            });
            this.$refs.mainTable.doOkActionInFilterPoptip(null, column, ['0']);
        },
    });

    return vm;
});
