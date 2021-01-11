define(function(require) {
    var Vue = require("vue");
    var Vuex = require("vueX");
    var types = require("./mutation-types");
    Vue.use(Vuex);

    var state = {
        // 查询条件
        keyWordSearchData: {
            code: null,
            value: {
                displayName: null,
                filterName: null,
                filterValue: null
            }
        },
        // 跨路由跳转
        goToInfoData: {
            opt: {
                path: null,
                method: 'detail'
            },
            vo: {
                id: null,
                code: null
            },
            extra:{}
        },
        // 全局poptip
        poptipData: {
            html: '',
            position: '',
            flag: ''
        }
    };

    // mutations
    var mutations = {};

    mutations[types.UPDATE_SEARCH_VAL] = function(state, keyWordSearchData) {
        if (!_.isEmpty(keyWordSearchData)) {
            state.keyWordSearchData = keyWordSearchData;
        }
    };
    mutations[types.GO_TO_INFO] = function(state, goToInfoData) {
        if (!_.isEmpty(goToInfoData)) {
            state.goToInfoData = _.deepExtend(state.goToInfoData, goToInfoData);

        }
    };
    mutations[types.CLEAR_GO_TO_INFO] = function(state) {
        state.goToInfoData = {
            opt: {
                path: null,
                method: 'detail'
            },
            vo: {
                id: null,
                code: null
            },
            extra:{}
        };
    };
    mutations[types.UPDATE_POPTIP] = function (state, poptipData) {
        if (!_.isEmpty(poptipData)) {
            state.poptipData = _.assign(state.poptipData, poptipData);
        }
    };
    var search = {
        state: state,
        // mutation 必须是同步函数 所以异步操作尽量在actions里处理
        mutations: mutations
    };

    return new Vuex.Store({
        // modules里定义`store`和`mutations`。`store`是我们正常要维护的状态数据,`mutatinons`是操作和维护store的处理
        modules: {
            search: search,
        },
        strict: true

        // ,
        // middlewares: [Vuex.createLogger]
    })
});