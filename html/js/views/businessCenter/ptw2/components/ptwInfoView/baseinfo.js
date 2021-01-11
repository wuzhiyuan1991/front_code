define(function (require) {
    var Vue = require("vue");
    var LIB = require("lib");
    var template = require("text!./baseinfo.html");
    var videoHelper = require("tools/videoHelper");
    var educationDetail = require();
    return Vue.extend({
        template: template,
        mixins: [LIB.VueMixin.dataDic],
        props: {
            model: {
                type: Object,
                required: true,
                default: function () {
                }
            },
            workcard:Object,
        },
        data:function () {
          return {
              baseSetting:'',
              playModel: {
                  title: "视频播放",
                  show: false,
                  id: null
              },

                  tableModel:{
                  visible:false,
                  columns:[
                      {
                          title: '检测时间',
                          fieldName: "content",
                          width:"140px"
                      },
                      {
                          title: '监护内容',
                          fieldName: "superviseContent",
                          width: "380px"
                      },
                      {
                          title: '图片',
                          fieldName: "standard",
                          width: "180px"
                      },
                      {
                          title: '视频',
                          fieldName: "standard",
                          width: "100px"
                      },
                      {
                          title: '签名',
                          fieldName: "standard",
                          width: "100px"
                      },
                  ]
              },
              educationModel:{
                  visible:false
              },
              applyName:null
          }
        },
        computed: {
            imageStyle:function () {
                return 'height:20px;width:auto;margin-bottom:0;margin-left:5px;'
            },
            // 作业中所使用的主要工具/设备
            equipmentList: function () {
                var list = this.model.workStuffs.filter(function (item) {
                    return item.type == 1;
                });
                var list2 = this.model.cardTpl.ptwCardStuffs.filter(function (item) {
                    return item.stuffType == 1;
                });
                _.each(list, function (item1) {
                    item1.select = true;
                });
                _.each(list2,function (item2) {
                    if(!_.find(list, function (item1) {
                            return item1.id == item2.stuffId
                        })){
                        list.push({name:item2.ptwStuff.name})
                    }
                });
                return list;
            },
            certificateList: function () {
                if(!this.model.cardTpl) return ;
                var list = this.model.workStuffs.filter(function (item) {
                    return item.type == 2;
                });

                var list3 = this.model.workPersonnels.filter(function (item) {
                    return item.type == 7;
                });
                _.each(list, function (item1) {
                    item1.select = true;
                    item1.person = _.filter(list3, function (item3) {
                        return item1.workStuffId == item3.certStuffId;
                    });
                });

                return list;
            },
            gerContractorEmpName:function (item) {
                if(item.person.ContractorEmp){
                    return temp.person.ContractorEmp.name;
                }else if(item.users && item.users.length>0){
                    var str = '';
                    item.users
                }
            },
            workDeptslist:function () {
                var list = [].concat(this.model.workDepts, this.model.workContractors);
                return list;
            },
            workPersonList:function () {
                var list = [].concat(this.model.selworkPersonnels['5'], this.model.selworkPersonnels['4']);
                return list;
            },
            applyPerson:function () {
                // var list=this.model.workPersonnels.filter(function (item) {
                //     return item.type==1;
                // });
                // return list;
                if(this.workcard.vo && this.workcard.vo.applicant)
                    return this.workcard.vo.applicant.name;

            },
            //  维修人员列表
            repairPersonList:function () {
                var list = _.filter(this.model.workPersonnels, function (item) {
                    return item.type == "6";
                });
                return list;
            },
            // 安全教育实施人员列表
            securityEducationPersonList:function () {
                var list =  _.filter(this.model.workPersonnels, function (item) {
                    return item.type == "2";
                });
                return list;
            },
            // 监护人员列表
            custodyPersonList: function () {
                var list = _.filter(this.model.workPersonnels, function (item) {
                    return item.type == "3";
                });
                // list = this.model.superviseRecords;
                return list;
            },
            // 有效期
            activeTime:function () {
                if(this.model.workStartTime && this.model.workEndTime){
                    var s = new Date(this.model.workStartTime).getTime();
                    var e = new Date(this.model.workEndTime).getTime();
                    return parseInt((s-e)/1000/(3600*24))
                }
                return ''
            },
            // 作业方式
            operateList:function () {
                var list = this.model.workStuffs.filter(function (item) {
                    return item.type == 9;
                });
                return list;
            },

            // 配置文件
            jsonList: function () {
                var list = [];
                // console.log("========", this.model, this.workcard);
                if(this.model.attr3 && this.model.attr3.length>5){
                    list = JSON.parse(this.model.attr3);
                }else {
                    list = this.baseSetting;
                }
                return list;
            }

        },
        watch:{
            "model.applUnitId":function (val) {
                this.applyName = this.getDataDic('org', val)['deptName'];
                if(!this.applyName){
                    this.applyName = this.model.applyUnit.deptName;
                    // this.applyName = this.model.
                    // var _this = this;
                    // var resource = this.$resource("/contractor/list/1/10?id="+val);
                    // resource.get().then(function(res){
                    //     var list = res.data.list;
                    //    if(list.length>0){
                    //        _this.applyName = list[0].deptName;
                    //    }
                    // });
                }
            }
        },
        methods:{
            convertPath: LIB.convertPath,
            convertFilePath: LIB.convertFilePath,

            getPersonVal:function (arr, str) {
                return _.map(arr, _.iteratee(str)).join('，');
            },


            gotoShowEducationDetail:function () {
                this.educationModel.visible = true;
            },
            certificatePerson: function (personList) {
                var temp = false;
                personList.forEach(function (person) {
                    if( (person.contractorEmp && person.contractorEmp.name) || (person.user && person.user.name) ){
                        temp = true;
                    }
                });
                return temp;
            },
            getFiles:function (data,type) {
                var files = [];
                _.each(data,function (item) {
                    if(item.dataType==type) {
                        files.push(LIB.convertFileData(item));
                    }
                });
                return files;
            },
            // 播放
            doPlay: function (file) {
                this.playModel.show = true;
                setTimeout(function () {
                    videoHelper.create("player", file);
                }, 50);
            },
            getItemName:function (item) {
                if(item.isExtra == '1'){
                    return "其他（" + item.content +"）"
                }else{
                    return item.name;
                }
            },
            getApplyName:function (applUnitId) {
                this.getDataDic('org', applUnitId)['deptName'];
            },
            getBaseSetting:function () {
                var _this = this;
                var resource = this.$resource("ptwcardtpl/defaultcolumnsettings/list");
                resource.get().then(function(res){
                    _this.baseSetting = res.body;
                })
            }
        },
        created:function () {
            this.getBaseSetting();
        }
    })
})
