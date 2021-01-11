define(function (require) {
    var LIB = require('lib');
    // var api = require("../../vuex/api");
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
                },
                areanames:[],
                hidePrintImg: false,//是否带图打印
                mainModel:{
                         
                },
                fileModel: {
                    safetyPic: {
                        cfg: {
                            params: {
                                recordId: null,
                                dataType: 'RC1', //安全标志 RC:RiskCard
                                fileType: 'RC',
                            },
                            filters: {
                                max_file_size: '10mb',
                                mime_types: [{title: "files", extensions: "png,jpg,jpeg"}]
                            },
                        },
                        data: []
                    },
                    riskPointPic: {
                        cfg: {
                            params: {
                                recordId: null,
                                dataType: 'RC2', //风险点图片
                                fileType: 'RC',
                            },
                            filters: {
                                max_file_size: '10mb',
                                mime_types: [{title: "files", extensions: "png,jpg,jpeg"}]
                            },
                        },
                        data: []
                    },
                }
        

            }
        },
        methods: {

            calcImageURL: function (image) {
                return LIB.convertImagePath(image, 'scale');
            },
            _handleData:function(list) {
                var _this = this;
                var userNames=[];
                this.areanames=[];
                list=list.filter(function (item) {
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

                var date = new Date();
                this.year = date.getFullYear();
                this.month = _.padLeft(date.getMonth() + 1, 2, '0');
                this.date = this.year + "-" + this.month + "-" + date.getDay();
                var company = this.data.company;
                var checkImages = [], allImages = [], imgindex = -1;
                var checkDate;//取最大的
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
                this.allImages = allImages;
                this.checkImages = checkImages;
                this.data.items = list;
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
            init: function (data,arry) {
               // this._handleData(data);
                 this.mainModel=data
                //   console.log("=========")
                //   console.log(arry)
                  this.fileModel=arry
               //   this.calcImageURL()
// return ;        
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