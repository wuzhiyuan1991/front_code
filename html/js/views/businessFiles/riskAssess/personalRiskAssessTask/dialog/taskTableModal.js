define(function(require){
    var LIB = require('lib');
    //数据模型
    var tpl = require("text!./taskTableModal.html");
    var videoHelper = require("tools/videoHelper");

    var api = require("../vuex/api");
    var columns = [
        {
            title: '研判项',
            fieldName: "content"
        },
        {
            title: '标准',
            fieldName: "standard",
            width: "180px"
        },
        {
            title: '落实结果',
            fieldName: 'result',
            width: "180px"
        },
        {
            title: '检查情况',
            fieldName: 'checkResult',
            width: "80px",
            render: function (data) {
                var o = {
                    "0": "不符合",
                    "1": "符合",
                    "2": "不涉及"
                };
                return data.checkResult ? o[data.checkResult] : ""
            }
        },
        {
            title: '附件',
            render: function (data) {
                var result = '';
                var files = _.filter(data.cloudFiles, function (item) {
                    return !_.includes(['AQZRZ3', 'AQZRZ7', 'FXYP3'], item.dataType);
                });
                _.forEach(files, function (item) {
                    result += '<div class="lite-table-file-row" data-action="VIEWFILE" data-id="' + item.id + '" title="' + item.orginalName + '">' + item.orginalName +'</div>';
                });
                return result;
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
            }
        },
        data:function(){
            return {
                mainModel : {
                    title: "查看任务明细"
                },
                columns: columns,
                groups: null,
                images: null,
                playModel:{
                    title : "视频播放",
                    show : false,
                    id: null
                },
                audioModel: {
                    visible: false,
                    path: null
                }
            };
        },
        methods:{
            doClose: function () {
                this.visible = false;
            },

            _convertData: function (groups, items) {
                // 组按orderNo排序
                var _groups = _.sortBy(groups, function (group) {
                    return parseInt(group.orderNo);
                });
                // 项按stepId分组
                var _items = _.groupBy(items, "groupId");
                // 项按orderNo排序, 并将项添加到对应的组中
                _.forEach(_groups, function (group) {
                    group.items = _.sortBy(_items[group.id], function (item) {
                        return parseInt(item.orderNo);
                    });
                });

                this.groups = _groups;
            },
            onRowClicked: function (item, e) {
                var el = e.target;
                var action = _.get(el, "dataset.action");
                if (action !== 'VIEWFILE') {
                    return;
                }
                var files = item.cloudFiles;
                var fileId = el.dataset.id;
                var index = _.findIndex(files, "id", fileId);

                this.doClickFile(index, files);
            },

            doClickFile: function (index, fileList) {
                var files = fileList;
                var file = files[index];
                var _this = this;
                var images;
                if (_.includes(['AQZRZ2', 'AQZRZ6', 'FXYP2'], file.dataType)) {

                    this.playModel.show=true;
                    setTimeout(function() {
                        videoHelper.create("player",file.id);
                    }, 50);

                } else if (_.includes(['AQZRZ4', 'AQZRZ8', 'FXYP4'], file.dataType)) {
                    this.audioModel.path = file.ctxPath;
                    this.audioModel.visible = true;
                }
                else if (_.includes(['png', 'jpg', 'jpeg'], file.ext)) {
                    images = _.filter(files, function (item) {
                        return _.includes(['png', 'jpg', 'jpeg'], item.ext) && !_.includes(['AQZRZ3', 'AQZRZ7', 'FXYP3'], item.dataType)
                    });
                    this.images = _.map(images, function (content) {
                        return {
                            fileId: content.id,
                            name: content.orginalName,
                            fileExt: content.ext
                        }
                    });

                    setTimeout(function () {
                        _this.$refs.imageViewer.view(_.findIndex(images, "id", file.id));
                    }, 100);
                } else {
                    window.open("/file/down/" + file.id)
                }
            },
            _getList: function (id) {
                var _this = this;
                api.getTaskWorkList({id: id}).then(function (res) {
                    var groups = res.data.group;
                    var items = res.data.item;
                    _this._convertData(groups, items);
                })
            },
            init: function (id) {
                this.values = null;
                this._getList(id);
            }
        }
    });

    return detail;
});