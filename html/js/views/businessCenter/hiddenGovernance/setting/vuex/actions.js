define(function (require) {

    var api = require("./api");
    var types = require("./mutation-types")
    var BASE = require("base")


    //获取文件访问路径
    var getFileSrc = function (file) {
        return BASE.SwConfig.url + "/file/image/" + file.id + "/scale";
    }

    var actions = {

        //设置编辑业务对象时弹窗初始数据
        setEditModel: function (store, model) {

            model.rightPictures = [];
            model.wrongPictures = [];
            model.referenceMaterials = [];

            //加载图片
            api.listFile({recordId: model.id}).then(function (res) {
                model.rightPictures = [];
                model.wrongPictures = [];
                model.referenceMaterials = [];
                var data = res.data;

                _.each(data, function (pic) {
                    if (pic.dataType == "rightPictures") {
                        model.rightPictures.push({fileId: pic.id});
                    } else if (pic.dataType == "wrongPictures") {
                        model.wrongPictures.push({fileId: pic.id});
                    } else if (pic.dataType == "referenceMaterials") {
                        model.referenceMaterials.push({fileId: pic.id});
                    }
                });
                store.dispatch(types.SET_EDIT_MODEL, model);
            });
        },

        //设置创建业务对象时弹窗初始数据
        setCreateModel: function (store, model) {
            api.getUUID().then(function (res) {
                var data = res.data;
                store.dispatch(types.SET_CREATE_MODAL, {id: data});
            });
        },

        //清除弹窗数据
        cleanModel: function (store) {
            store.dispatch(types.CLEAN_MODAL);
        }
    };

    return actions;
});