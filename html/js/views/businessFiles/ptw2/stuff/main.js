define(function (require) {
    //基础js
	var Vue=require("vue");
    var LIB = require('lib');
    var api = require("../api");
    var tpl = LIB.renderHTML(require("text!./main.html"));
	var workContent=require('./components/work-cotnent');
	var copySelectModel = require('./dialog/copySelectModel')
    //编辑弹框页面fip (few-info-panel)
    // var detailPanel = require("./detail");
	LIB.registerDataDic("iptw_stuff_type", [
        ["8","作业方式"],
        ["3","危害辨识"],
        ["4","控制措施"],
        ["6","个人防护设备"],
		["1","作业工具/设备"],
		["2","作业资格证书"],
		["5","工艺隔离-方法"],
		//["7","作业取消原因"]
	]);
    
    var initDataModel = function () {
        return {
			workCatalogs:[],
			workCatalogSelectedIndex:0,
			stuffTypes:LIB.getDataDicList("iptw_stuff_type"),
			stuffTypeSelectedIndex:0,
            moduleCode: "ptwStuff",
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
	                url: "ptwstuff/list{/curPage}{/pageSize}",
	                selectedDatas: [],
	                columns: [
	                 LIB.tableMgr.column.cb,
					 LIB.tableMgr.column.code,
					{
						//名称
						title: "名称",
						fieldName: "name",
						filterType: "text"
					},
					 LIB.tableMgr.column.disable,
					{
						//类型 1:作业工具/设备,2:作业资格证书,3:危害辨识,4:控制措施,5:工艺隔离-方法,6:个人防护设备,7:作业取消原因
						title: "类型",
						fieldName: "type",
						orderName: "type",
						filterName: "criteria.intsValue.type",
						filterType: "enum",
						fieldType: "custom",
						popFilterEnum: LIB.getDataDicList("iptw_stuff_type"),
						render: function (data) {
							return LIB.getDataDic("iptw_stuff_type", data.type);
						}
					},
					 LIB.tableMgr.column.company,
					 LIB.tableMgr.column.dept,
					 LIB.tableMgr.column.modifyDate,
					 LIB.tableMgr.column.createDate,

	                ]
	            }
            ),
            detailModel: {
                show: false
            },
            uploadModel: {
                url: "/ptwstuff/importExcel"
            },
            exportModel : {
                url: "/ptwstuff/exportExcel",
                withColumnCfgParam: true
            },

        };
    };

    var vm = LIB.VueEx.extend({
		mixins : [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainPanel],
		template: tpl,
		components: {
            //"detailPanel": detailPanel,
			"workContent":workContent,
			"copySelectModel":copySelectModel
		},
        data: initDataModel,
        computed:{
			currentWorkCatalog:function(){
				if(this.workCatalogs.length>0){
					return this.workCatalogs[this.workCatalogSelectedIndex];
				}
				return {};
			},
			currentStuffType:function () {
				return this.stuffTypes[this.stuffTypeSelectedIndex];
			}
		},
        methods: {
            doSaveCopy:function (list) {
            	var arr = []
				list.forEach(function (item) {
					arr.push(item.id);
                });
            	var srcCatalogId = this.workCatalogs[this.workCatalogSelectedIndex].id;
            	var srcType = this.stuffTypes[this.stuffTypeSelectedIndex].id;

				api.ptwstuffCopy({srcCatalogId:srcCatalogId, srcType:srcType}, arr).then(function (res) {
					LIB.Msg.info("保存成功")
                })
            },
            gotoCopy: function () {
            	var item = this.workCatalogs[this.workCatalogSelectedIndex];
                var list = _.reject(this.workCatalogs,function (work) {
					return item.id == work.id
                });
                this.$refs.copyModel.initData(list, this.stuffTypes[this.stuffTypeSelectedIndex].value)
            },
            gotoDic:function () {
                var router = LIB.ctxPath("/html/main.html#!");
                var routerPart="/ptw/catalog?type=0";
                window.open(router + routerPart);
            },
			onAccordingSelected:function (index,workCatagory) {
				//重置子内容 需要重新加载数据
				this.stuffTypes.forEach(function(item){//这里重置，防止上一个作业类型的不重新加载
					item.show=false;
				});
				// this.stuffTypeSelectedIndex=0;
				this.workCatalogSelectedIndex=index;
				this.workCatalogInit(workCatagory.id,this.currentStuffType.id, true);
			},
			workCatalogInit:function(workCatalogId,type, isSelect){
				var _this=this;
				var detail=_.findWhere(_this.stuffTypes,{id:type});
				// if(detail.show){
				// 	return ;
				// }

				var pms={
					'workCatalog.id':workCatalogId,
					type:type,
				};
				this.$api.getCatalogDetail(pms).then(function (data) {
					Vue.set(detail,"values",data);
					Vue.set(detail,"show",true);
                    if(isSelect) _this.$refs.workContent.init();
				})
			},
			onTabsSwitch:function (index) {
				this.stuffTypeSelectedIndex=index;
				this.workCatalogInit(this.currentWorkCatalog.id,this.currentStuffType.id, true);
			},
			doEdit:function () {
				this.$parent.doEdit.apply(this.$parent,arguments);
			},
            updateNav: function () {
				this.$refs.catlog.selectedIndex = this.workCatalogSelectedIndex;
            },
			initFun: function (data) {
				var _this = this;
                var first = data[0];
                var type = _this.stuffTypes[0].id;
                _this.workCatalogSelectedIndex = 0;
                _this.stuffTypeSelectedIndex = 0;
                data.forEach(function (item, index) {
                    if(item.id == _this.$route.query.id){
                        first = item;
                        _this.workCatalogSelectedIndex=index;
                    }
                });

                _this.stuffTypes.forEach(function (item, index) {
                    if(item.id == _this.$route.query.type){
                        type = item.id;
                        _this.stuffTypeSelectedIndex=index;
                    }
                });

                _this.workCatalogs=data;
                _this.updateNav(); // 更新左侧组件
                _this.workCatalogInit(first.id, type);
            }
        },
        events: {
			"update_list":function () {
				this.workCatalogInit(this.workCatalogs[this.workCatalogSelectedIndex].id, this.currentStuffType.id)
            }
        },
        init: function(){
        	this.$api = api;
        	console.log(this)
        },
        created:function () {
			var _this=this;
			this.$api.getWorkCatalogs().then(function (data) {
				if(!data||data.length===0){return}
				_this.initFun(data);
			})
		}
    });
console.log(vm)
    return vm;
});
