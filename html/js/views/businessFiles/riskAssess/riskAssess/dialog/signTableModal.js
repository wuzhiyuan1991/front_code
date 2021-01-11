define(function(require){
    var LIB = require('lib');
    //数据模型
    var tpl = require("text!./signTableModal.html");
    var api = require("../vuex/api");
    var columns = [
        {
            title: '责任部门',
            render: function (data) {
                return LIB.getDataDic('org',data.user.orgId)['deptName']
            },
            width: "150px"
        },
        {
            title: '岗位',
            render: function (data) {
                return _.pluck(data.positionList, "name").join("、")
            }
        },
        {
            title: '人员',
            fieldName: 'user.name',
            width: "120px"
        },
        {
            title: '签名',
            width: "150px",
            render: function (data) {
                var fileId = _.get(data, "cloudFiles[0].id");
                if (!fileId) {
                    return "";
                }
                var src = LIB.convertPicPath(fileId);
                return '<img src="' + src + '" height="24">';
            },
            event:true
        },
        {
            title: '签署日期',
            render: function (data) {
                return data.isSign === '1' ? data.signDate : '<a href="javascript:;" style="color: blue;" data-action="SENDNOTICE">发送提醒</a>'
            },
            event: true,
            width: "150px"
        }
    ];
    var detail = LIB.Vue.extend({
        mixins : [LIB.VueMixin.dataDic],
        template: tpl,
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            id: {
                type: String,
                default: ''
            }
        },
        watch: {
            visible: function (nVal) {
                nVal && this._init();
            }
        },
        data:function(){
            return {
                mainModel : {
                    title: "查看签名"
                },
                tabs: [
                    {
                        id: '',
                        name: '全部'
                    },
                    {
                        id: '1',
                        name: '已签'
                    },
                    {
                        id: '0',
                        name: '未签'
                    }
                ],
                checkedTabId: '',
                columns: columns,
                values: null,
                showSendNotice: false,
                images: null
            };
        },
        methods:{
            doClose: function () {
                this.visible = false;
            },
            doTabClick: function (id) {
                this.checkedTabId = id;
                var values = this.allValues;

                if (id) {
                    values = _.filter(values, "isSign", id);
                }

                this.values = values;
            },
            sendBatchNotify: function () {
                var users = _.filter(this.allValues, "isSign", '0');
                var ids = _.pluck(users, "id");
                api.sendNotify(ids).then(function (res) {
                    LIB.Msg.info("提醒发送成功");
                })
            },
            onRowClicked: function (item, e) {
                var el = e.target;
                if (el.nodeName.toUpperCase() === 'IMG') {
                    return this.doViewImages(item);
                }
                if (el.dataset && el.dataset.action === 'SENDNOTICE') {
                    api.sendNotify([item.id]).then(function (res) {
                        LIB.Msg.info("提醒发送成功");
                    })
                }
            },
            doViewImages: function (item) {
                var images = item.cloudFiles;
                this.images = _.map(images, function (content) {
                    return {
                        fileId: content.id,
                        name: content.orginalName,
                        fileExt: content.ext
                    }
                });
                var _this = this;
                setTimeout(function () {
                    _this.$refs.imageViewer.view(0);
                }, 100);
            },
            _getList: function () {
                var _this = this;
                api.getSignList({id: this.id}).then(function (res) {
                    _this.values = res.data;
                    _this.allValues = res.data;
                    _this.showSendNotice = _.some(res.data, "isSign", "0");
                })
            },
            _init: function () {
                this.values = null;
                this.checkedTabId = '';
                this._getList();
            }
        }
    });

    return detail;
});