define(function (require) {

    var Vuex = require("vueX");
    var types = require("./mutation-types");
    var api = require("./api");

    var initData = function () {
        return {
            id: null,
            name: null,
            content: null,
            rightPictures: [],
            wrongPictures: [],
            referenceMaterials: []
        };
    }

    var data = initData();

    var state = {
        model: data,
    };

    var mutations = {};

    mutations[types.SET_EDIT_MODEL] = function (state, model) {
        _.extend(state.model, model);
    };


    mutations[types.SET_CREATE_MODAL] = function (state, model) {
        var data = initData();
        data.id = model.id;
        _.extend(state.model, data);
    };

    mutations[types.CLEAN_MODAL] = function (state, model) {
        var data = initData();
        _.extend(state.model, data);
    };


    var edit = {
        state: state,
        mutations: mutations
    };

    return new Vuex.Store({
        modules: {
            edit: edit,
        },
        strict: true,
        middlewares: [Vuex.createLogger]
    })
});