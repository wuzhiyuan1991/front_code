define(function (require) {
    var Vue = require("vue");
    var LIB = require("lib");
    var template = require("text!./license-issue.html");
    var commonApi = require("../../api");
    var model = require("../../model");
    var videoHelper = require("tools/videoHelper");

    return Vue.extend({
        template: template,
        props: {
            model: {
                type: Object,
                required: true,
            },
            vo: {
                type: Object,
                require: true
            }
        },
        data: function () {
            var _this = this;
            return {
                open: true,
                signRoles: [],
                signRolesHistories: [],
                playModel: {
                    title: "视频播放",
                    show: false,
                    id: null
                },
                searchId: {},
                authodModel: {
                    show: false,
                  columns:[
                      {
                          title: "委托时间",
                          fieldName: "createDate",
                          width: 150
                      },
                      {
                          title: "审批/签发阶段",
                          width: 150,
                          render: function (data) {
                              var list = [].concat(_this.signRolesHistories, _this.signRoles);
                             var obj = _.find(list, function (item) {
                                    return item.id == data.relId;
                              });
                             if(obj) return obj.signCatalog.name;
                             return ''
                          }
                      },
                      {
                          title: "委托人",
                          fieldName: "mandator.name",
                          width: 150
                      },
                      {
                          title: "被委托人",
                          fieldName: "assignee.name",
                          width: 150
                      },
                      {
                          //开始时间
                          title: "委托理由",
                          fieldName: "reason",
                          width:210
                      },
                  ]
                },
                vedioModel: {
                    show: false,
                    columns: [
                        //  LIB.tableMgr.ksColumn.cb,
                        //  LIB.tableMgr.ksColumn.code,
                        // {
                        // 	//参与人id串
                        // 	title: "参与人id串",
                        // 	fieldName: "participant",
                        // 	keywordFilterName: "criteria.strValue.keyWordValue_participant"
                        // },
                        {
                            //开始时间
                            title: "开始时间",
                            fieldName: "startTime",
                            keywordFilterName: "criteria.strValue.keyWordValue_startTime",
                            width: 150
                        },
                        {
                            //结束时间
                            title: "结束时间",
                            fieldName: "endTime",
                            keywordFilterName: "criteria.strValue.keyWordValue_endTime",
                            width: 150
                        },
                        {
                            title: "视频连线参与人",
                            render: function (data) {
                                var userlist = ''
                                _.map(data.users, function (item) {
                                    return userlist += item.name + ','
                                })
                                return userlist.substr(0, userlist.length - 1)
                            }
                        },
                        {
                            title: "视频连接时长",
                            render: function (data) {
                                var date1 = new Date(data.startTime);  //开始时间
                                var date2 = new Date(data.endTime);    //结束时间
                                var date3 = date2.getTime() - date1.getTime()  //时间差的毫秒数
                                //计算出相差天数
                                var days = Math.floor(date3 / (24 * 3600 * 1000))
                                var time=''
                                //计算出小时数
                                if (days!==0) {
                                    time+=days+"天"
                                }
                                var leave1 = date3 % (24 * 3600 * 1000)    //计算天数后剩余的毫秒数
                                var hours = Math.floor(leave1 / (3600 * 1000))
                                //计算相差分钟数
                                if (hours!==0) {
                                    time+=hours+"时"
                                }
                                var leave2 = leave1 % (3600 * 1000)        //计算小时数后剩余的毫秒数
                                var minutes = Math.floor(leave2 / (60 * 1000))
                                if (minutes!==0) {
                                    time+=minutes+"分"
                                }
                                //计算相差秒数
                                var leave3 = leave2 % (60 * 1000)      //计算分钟数后剩余的毫秒数
                                var seconds = Math.round(leave3 / 1000)
                                if (seconds!==0) {
                                    time+=seconds+"秒"
                                }
                                return time
                            },
                            width:150
                        }
                        //					 LIB.tableMgr.ksColumn.modifyDate,
                        ////					 LIB.tableMgr.ksColumn.createDate,
                        //
                    ],
                    data: []
                }
            }
        },
        created: function () {
            var _this = this;
            this.initData();
        },

        methods: {
            getRoleLists: function (items) {
                var obj = {};
                if(items.attr3 == '1' && items.countersignatures && items.countersignatures.length>0){
                    var list =  _.map(items.countersignatures, function (item) {
                        return {
                            users: [item.signer],
                            signCatalog:items.signCatalog,
                            signOpinion: item.signOpinion,
                            enableCtrlMeasureVerification: items.enableCtrlMeasureVerification,
                            cloudFiles: item.cloudFiles
                        }
                    });
                    return list;
                }else {
                    return [items];
                }
            },
            showAuthodModel: function () {
                this.authodModel.show = true;
            },
            showVedioTable: function (item) {
                this.vedioModel.data = item.videoCallRecords
                this.vedioModel.show = true
            },
            convertPath: LIB.convertPath,
            changeAllStatus: function () {
                this.open = !this.open
                var _this = this
                _.each(this.signRoles, function (item) {
                    item.isShow = !_this.open;
                })
                 _.each(this.signRolesHistories, function (item) {
                    item.isShow = !_this.open;
                })
            },
            getItemName: function (item) {
                if (item.isExtra == '1') {
                    if (this.getStatusExt)
                        return "其他（" + item.content + "）";
                    else return "其他";
                } else {
                    return item.content || item.name + '';
                }
            },

            getStuffList: function (id) {
                var list = []
                if (this.model.workStuffs) {
                    list = this.model.workStuffs.filter(function (item) {
                        return item.stuffType == 10 && item.workPersonnelId == id;
                    });
                }
                return list;
            },
            initData: function () {
                var _this = this;
                var signPersonnels = [];
                _this.signRoles = [];
                _this.signRolesHistories = [];
                // var signPersonnels=this.vo.firstUsedPermit.workPersonnels.filter(function (item) {
                if (this.vo.workPersonnels && this.vo.workPersonnels.length > 0) {
                    var signPersonnels = this.vo.workPersonnels.filter(function (item) {
                        return item.type == "1";
                    });
                    _.each(signPersonnels, function (item) {
                        var obj = { isShow: false };
                        _this.signRolesHistories.push(_.extend(obj, item));
                    });
                }
                signPersonnels = [];
                if (this.vo.firstUsedPermit && this.vo.firstUsedPermit.workPersonnels.length > 0) {
                    var signPersonnels = this.vo.firstUsedPermit.workPersonnels.filter(function (item) {
                        return item.type == "1";
                    });
                    _.each(signPersonnels, function (item) {
                        var obj = { isShow: false };
                        _this.signRoles.push(_.extend(obj, item));
                    });
                }
            },
            getStatus: function (val) {
                if (val == '1') return '<span style="color:green;">已审批</span>';
                if (val == '0') return '<span style="color:grey;">待审批</span>';
                if (val == '2') return '<span style="color:red;">已否决</span>';
            },
            changeStatus: function (item) {
                item.isShow = !item.isShow;
                var open = 0
                _.each(this.signRoles, function (key) {
                    if (key.isShow) {
                        open++
                    }
                })
                if (open == this.signRoles.length) {
                    this.open = false
                } else {
                    this.open = true
                }
            },
            getFiles: function (data, type) {
                var files = data.filter(function (item) {
                    return item.dataType == type
                });
                return files;
            },
            // 播放
            doPlay: function (file) {
                this.playModel.show = true;
                setTimeout(function () {
                    videoHelper.create("player", LIB.convertFileData(file));
                }, 50);
            },
        },
        watch: {
            'model': function (val) {
                this.initData();
            }
        }
    })
})
