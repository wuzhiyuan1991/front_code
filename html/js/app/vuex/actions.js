define(function(require) {

    var types = require("./mutation-types")

    var actions = {
        // 更新查询项
        updateSearchKey: function(store, keyWordSearchData) {
            store.dispatch(types.UPDATE_SEARCH_VAL, keyWordSearchData);
        },
        // 跳转
        updateGoToInfoData: function(store, goToInfoData) {
            _.defaults(goToInfoData.opt, {method: 'detail'})
            store.dispatch(types.GO_TO_INFO, goToInfoData)
        },
        clearGoToInfoData: function (store) {
            store.dispatch(types.CLEAR_GO_TO_INFO)
        },
        updatePoptipData: function (store, poptipData) {
            _.defaults(poptipData, {flag: Date.now()});
            store.dispatch(types.UPDATE_POPTIP, poptipData)
        }
    };

    return actions;
});