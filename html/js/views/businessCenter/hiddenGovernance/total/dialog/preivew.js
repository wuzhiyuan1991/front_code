define(function (require) {
    var LIB = require('lib');
    var api = require("../../vuex/api");
    //右侧滑出详细页
    var tpl = require("text!./preview.html");
    return LIB.Vue.extend({
        template: tpl,
        data: function () {
            return {
                show: false,
                load: false,
                mouth: undefined,
                year: undefined,
                date: undefined,
                checkImages: [],//每条检查记录里面的图片，带了index length=记录.length
                allImages: [],//所有的图片 ： 只是图片对象 id,index
                data: {
                    topCompName:null,
                    topCompCode: null,
                    checkDate: null,
                    becheckCompanyName: "",
                    beCheckDeptCode: "",
                    currentDeptCode: "",
                    currentCompnayCode: "",
                    checkCompanyName: "",
                    items: [],
                    newItems:[]
                },
                areanames:[],
                hidePrintImg: false,//是否带图打印
            }
        },
        methods: {
            _handleData:function(list1) {
                var _this = this;
                var userNames=[];
                this.areanames=[];
                var list = [];
                var newItems = [];
                var newItemsT = {};
                list=list1.filter(function (item) {
                    if(_this.areanames.indexOf(item.areaName)===-1){
                        _this.areanames.push(item.areaName)
                    }
                    if(userNames.indexOf(item.userName)===-1){
                        userNames.push(item.userName);
                                return true;
                            }
                    else{
                        return false;
                    }
                });

                list1=list1.filter(function (item) {

                    // if(!item.legalRegulations || !item.legalRegulations[0] || !item.legalRegulations[0].id) return false;
                    if(newItems.indexOf(item.checkItem)===-1){
                        newItems.push(item.checkItem);
                        newItemsT[item.checkItem] = [item.checkDate];
                        return true;
                    }
                    else{
                        if(newItemsT[item.checkItem].indexOf(item.checkDate)===-1){
                            newItemsT[item.checkItem].push(item.checkDate);
                            return true;
                        }
                        return false;
                    }
                });

                var date = new Date();
                this.year = date.getFullYear();
                this.month = _.padLeft(date.getMonth() + 1, 2, '0');
                this.date = this.year + "-" + this.month + "-" + date.getDay();
                var company = this.data.company;
                var checkDate;//取最大的

                var checkImages = [], allImages = [], imgindex = -1;
                list.forEach(function (item, index) {
                    //图片处理
                    var tempImgs = [];
                    if (item.cloudFiles && item.cloudFiles.length > 0) {
                        tempImgs = tempImgs.concat(item.cloudFiles.map(function (img) {
                            imgindex++;
                            return {
                                index: imgindex,
                                id: img.id
                            }
                        }))
                    }
                    checkImages[index] = tempImgs;
                    allImages = allImages.concat(tempImgs);
                    if (item.reformMaxDealDate) {//整改期限转换
                        var date = new Date(item.reformMaxDealDate);
                        var dateobj = {
                            year: date.getFullYear(),
                            month: date.getMonth() + 1,
                            day: date.getDate(),
                        };
                        item.reformMaxDealDate = dateobj;
                    }
                    //checkdate
                    if (item.checkDate && (!checkDate || checkDate < item.checkDate)) {
                        checkDate = item.checkDate;
                    }
                });
                var checkImages = [], allImages = [], imgindex = -1;
                list1.forEach(function (item, index) {
                    //图片处理
                    var tempImgs = [];
                    if (item.cloudFiles && item.cloudFiles.length > 0) {
                        tempImgs = tempImgs.concat(item.cloudFiles.map(function (img) {
                            imgindex++;
                            return {
                                index: imgindex,
                                id: img.id
                            }
                        }))
                    }
                    checkImages[index] = tempImgs;
                    allImages = allImages.concat(tempImgs);
                    if (item.reformMaxDealDate) {//整改期限转换
                        var date = new Date(item.reformMaxDealDate);
                        var dateobj = {
                            year: date.getFullYear(),
                            month: date.getMonth() + 1,
                            day: date.getDate(),
                        };
                        item.reformMaxDealDate = dateobj;
                    }
                    //checkdate
                    if (item.checkDate && (!checkDate || checkDate < item.checkDate)) {
                        checkDate = item.checkDate;
                    }
                });

                this.allImages = allImages;
                this.checkImages = checkImages;
                this.data.items = list;

                this.data.newItems = list1;

                if (checkDate) {
                    // var _date=new Date(checkDate);
                    // this.data.checkDate={
                    //     year:_date.getFullYear(),
                    //     month:_date.getMonth()+1,
                    //     day:_date.getDate(),
                    // }
                    this.data.checkDate = checkDate.substr(0, 10);
                } else {
                    this.data.checkDate = '';
                }
                // var compId = LIB.user.compId;
                // var orgId = LIB.user.orgId;
                // if (compId) {
                //     api.getOrganization({id: compId}).then(function (result) {
                //         _this.data.currentCompnayCode = result.data.code;
                //     });
                // }
                // if (orgId) {
                //     api.getOrganization({id: orgId}).then(function (result) {
                //         _this.data.currentDeptCode = result.data.code;
                //     });
                // }
                var compId = list[0].compId;
                var topComp = this.getTopComp(compId);
                this.data.topCompName = topComp.name;
                this.data.topCompCode = topComp.code;
                this.data.beCheckDeptCode = list[0].compCode;
                this.data.checkCompanyName = list[0].userCompName;

                this.data.becheckCompanyName = list[0].compName;



            },
            getTopComp: function(id){
                var comp = LIB.setting.orgMap[id];
                if(comp && comp.parentId){
                    comp = this.getTopComp(comp.parentId);
                }
                return comp;

                
            },
            dateFormat: function (date) {
                return new Date(date).Format("yyyy年MM月d日");
            },
            init: function (data) {
                this._handleData(data);
                if (this.load === false) {
                    this.load = true;
                }
                this.show = true;
            },
            doPrint: function (hideImg) {
                this.hidePrintImg = hideImg;
                this.$nextTick(function () {
                    window.print();
                })
            },
            doClose: function () {
                this.show = false;
            }
        }
    })
});