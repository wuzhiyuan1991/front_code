define(function (require) {

  var LIB = require('lib');
  require("vue");
  var videoHelper = require("tools/videoHelper");

  var template = require("text!./videoUpload.html");

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
        "default": function () {
          return [];
        }
      },
      config: {
        type: Object,
        "default": function () {
          return [];
        }
      },
      readonly: {
        type: Boolean,
        default: false
      },
      class: {
        type: String,
          default: null
      }
    },
    computed: {
      params: function () {
        if (this.config.params) {
          return this.config.params;
        }
        return {
          recordId: null,
          dataType: null,
          fileType: null
        };
      },
      filters: function () {
        var defaultFilters = {
          max_file_size: '10mb',
          mime_types: [{
            title: "files",
            extensions: "mp4,avi,flv,3gp"
          }]
        }
        if (this.config.filters) {
          _.defaults(this.config.filters, defaultFilters);
          return this.config.filters;
        }
        return defaultFilters;
      },
      fileType: function () {
        return this.filters.mime_types[0].extensions;
      },
      fileMaxSize: function () {
        return this.filters.max_file_size;
      }
    },
    data: function () {
      return {
        playModel: {
          title: "视频播放",
          show: false,
          id: null
        },
      }
    },
    methods: {
      doPlay: function (file) {
        this.playModel.show = true;
        setTimeout(function () {

          videoHelper.create("player", file);
        }, 50);
      },
      convertPath: LIB.convertPath,
      doDeleteFile: function (fileId, index) {
        var _this = this;
        LIB.Modal.confirm({
          title: '确定删除?',
          onOk: function () {
            this.$resource("file").delete("file", [fileId]).then(function (data) {
              if (data.data && data.error != '0') {
                return;
              }
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
        this.data.push(LIB.convertFileData(data.rs.content));
      },
      updateLoad: function () {
        this.$refs.uploader.$el.firstElementChild.click();
      }
    },
    ready: function () {}
  };

  return opts
});