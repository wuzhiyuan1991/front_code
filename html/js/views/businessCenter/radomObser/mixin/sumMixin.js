define(function(require) {

    var api = require("./vuex/api");
    var mixin = {
        methods: {
            _queryPoolNum: function () {

                var _setSumToDom = function (data) {
                    var el1 =  document.querySelector('.sidebar-menu a[data-code="radomObser"]');

                    var text1 = el1.title;

                    el1.innerHTML = '<i></i>' + text1 + '(' + data + ')';
                };

                api.getUndoCount().then(function (res) {
                    _setSumToDom(res.data || 0);
                })
            },
            onTableDataLoaded: function () {
                this._queryPoolNum();
            }
        }
    };

    return mixin;
});
