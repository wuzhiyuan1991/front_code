define(function (require) {
    var LIB = require('lib');
    var API = require("./vue/api");


    var getData = function () {
        API.get().then(function (data) {
            _.extend(loadVueData.mainModel, data.body);
        });
    }

    var loadVueData = {
        moduleCode: LIB.ModuleCode.BS_BaC_SofL,
        mainModel: {
            unit: null,
            subsystem: null,
            peopleAccount: null,
            organizationAccount: null,
            onlineAccount: null,
            terminalAccount: null,
            projectName: null,
            support: null
        },
        uploadModel: {
            //默认file/upload,可配置为其他接口
            url: "/licence/importLicence",
            //文件过滤器，默认只能上传图片，可不配
            filters: {
                max_file_size: '10kb',
                mime_types: [{title: "licence", extensions: "lic"}]
            },
            //回调函数绑定 //默认可省略
            events: {
                onSuccessUpload: function (file, rs) {
                    LIB.Msg.info("上传成功");
                    _.extend(loadVueData.mainModel, rs.content);
                }
            }
        }
    };


    //使用Vue方式，对页面进行事件和数据绑定
    var vm = LIB.VueEx.extend({
        template: require("text!./main.html"),
        data: function () {
            return loadVueData
        },
        ready: function () {
            getData();
        },
        methods: {}
    });


    return vm;
});
