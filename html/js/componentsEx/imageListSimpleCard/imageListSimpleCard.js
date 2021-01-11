define(function (require) {

    var LIB = require('lib');
    require("vue");

    var template = require("text!./main.html");

    var opts = {
        template: template,
        props: {
            title: {
                type: String,
                default: ''
            },
            remark: {
                type: String,
                default: "参考资料"
            },
            data: {
                type: Array,
                "default" : function(){return [];}
            },
            config:{
                type:Object,
                "default" : function(){return [];}
            },
            readonly: {
                type: Boolean,
                default: false
            },
            class:{
                type: String,
                default: null
            },
            limitFile:{
                type: Boolean,
                default: true
            }
        },
        computed: {
            params : function () {
                if(this.config.params) {
                    return this.config.params;
                }
                return {
                    recordId: null,
                    dataType: null,
                    fileType: null
                };
            },
            filters : function () {
                var defaultFilters = {
                    max_file_size: '1mb',
                    mime_types: [{title: "files", extensions: "png,jpg,jpeg"}]
                }
                if(this.config.filters) {
                    _.defaults(this.config.filters, defaultFilters);
                    return this.config.filters;
                }
                return defaultFilters;
            },
            fileType : function() {
                return this.filters.mime_types[0].extensions;
            },
            fileMaxSize : function() {
                return this.filters.max_file_size;
            }
        },
        methods: {
            doDeleteFile: function (fileId, index) {
                var _this = this;
                LIB.Modal.confirm({
                    title: '确定删除?',
                    onOk: function () {
                        this.$resource("file").delete("file", [fileId]).then(function (data) {
                            if (data.data && data.error != '0') {
                                return;
                            }
                            _this.$emit('refresh-img')
                            _this.data.splice(index, 1);
                            LIB.Msg.success("删除成功");

                        })
                    }
                });
            },

            /**
             * 上传文件成功回调
             * @param data
             */
            referMater: function (data) {
                this.$emit('refresh-img')
                this.data.push(LIB.convertFileData(data.rs.content));
            },
        },
        ready: function () {
        }
    };

    var component = LIB.Vue.extend(opts);
    LIB.Vue.component('image-list-simple-card', component);
});