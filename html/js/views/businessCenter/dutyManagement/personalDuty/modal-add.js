define(function (require) {
    var Vue = require("vue");
    var template = require("text!./modal-add.html");
    var api = require("./vuex/api");
    var LIB=require("lib");
    return Vue.extend({
        template: template,
        data: function () {
            return {
                visible: false,
                modalTitle: "新增值班记录",
                title: "即将创建新的值班记录，值班记录的日期为",
                dutyRecordDate: new Date(),
                workCatalogList: [],
                selectedWorkCatalogId: undefined,
                selectedWorLevelId: undefined,
                callback: null,
                modalStyle: {
                    minWidth: '500px',
                    maxWidth: '600px'
                },
				timeYMD: new Date(),
                compId: LIB.user.compId,
				// compId: "fdjrpck3nf",
				orgId: LIB.user.orgId,
                isShowBtn: false
            }
        },
        init: function () {
            var _this=this;
        },
        watch: {
            visible: function (val) {
                if(val) {
                   this.orgId = LIB.user.orgId;
                }else{
                    this.orgId = null;
                }
            },
            'selectedWorkCatalogId':function(){
                var selWorkCatalog = _.findWhere(this.workCatalogList, {id: this.selectedWorkCatalogId});
                if(selWorkCatalog.levelList&&selWorkCatalog.levelList.length>0){
                    this.selectedWorLevelId=selWorkCatalog.levelList[0].id;
                } else {
                    this.selectedWorLevelId=undefined;
                }
            },

			orgId: function(val){
                var _this = this;
				if(val) {
					api.selectDutyDepartApi({ orgId: this.orgId }).then(function(res) {
                        if(res.data == '0') _this.isShowBtn = true;
					    else _this.isShowBtn = false;
                    })
				}
			}
        },
        methods: {
			// 格式化时间 年-月-日
			// nowDate: function() {
			// 	var date = new Date();
			// 	var seperator = "-";
			// 	var year = date.getFullYear();
			// 	var month = date.getMonth() + 1;
			// 	var strDate = date.getDate();
			// 	if (month >= 1 && month <= 9) {
			// 		month = "0" + month;
			// 	}
			// 	if (strDate >= 0 && strDate <= 9) {
			// 		strDate = "0" + strDate;
			// 	}
			// 	var nowDate = year + seperator + month + seperator + strDate;
			// 	return nowDate;
			// },
            getDataDic: LIB.getDataDic,
            isTopComp: function (id) {
                var orgList = _.filter(LIB.setting.orgList, function (item) {
                    return item.type == "1";
                });
                var obj = _.find(orgList, function (item) {
                    return id == item.id;
                })
                if(obj.code!='虚拟节点' ){
                    return true;
                }
                this.workCatalogList = [];
                return false;
            },

            init:function(id, levelId, cb, name) {
                this.selectedWorkCatalogId = id ? id : this.workCatalogList[0].id;
                this.selectedWorLevelId = levelId;
                this.visible = true;
                this.callback = cb;
                this.title = name;
                this.modalTitle = "选择" + name;
                this.isShowBtn = false;
                this.orgId = null;
            },
            show:function(){
                // this.changeOrgId(this.compId)
                if(!this.workCatalogList || !this.workCatalogList[0]) return this.visible=true;
                this.selectedWorkCatalogId= this.workCatalogList[0].id;
                var level=this.workCatalogList[0].levelList;
                this.selectedWorLevelId=level && level.length > 0 ? level[0].id : undefined;
                this.visible=true;
            },
			doSave: function() {
				var _this = this;
				api.createDutyInfoApi(null, {orgId: this.orgId}).then(function(res) {
					_this.$emit("refresh-main-tabel")
				});
				this.visible = false;
			},
            doClose: function () {
                this.visible = false;
            },
            doWorkCataLogMore: function () {
                var router = LIB.ctxPath("/html/main.html#!");
                var routerPart="/ptw/catalog";
                window.open(router + routerPart);
            }
        },
        ready: function () {
            var _this = this;
            api.selectDutyDepartApi({ orgId: this.orgId }).then(function(res) {
                if(res.data == '0') _this.isShowBtn = true;
                else _this.isShowBtn = false;
            })
        }
    })
})