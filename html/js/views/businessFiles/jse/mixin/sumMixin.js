define(function(require) {

    var api = require("./vuex/api");
    var mixin = {
        methods: {
            _queryPoolNum: function () {

                var _setSumToDom = function (data) {
                    var el1 = document.querySelector('.sidebar-menu a[data-code="opStdCard"]');
                    var el2 = document.querySelector('.sidebar-menu a[data-code="opMaintCard"]');
                    var el3 = document.querySelector('.sidebar-menu a[data-code="opEmerCard"]');

                    if (el1) {
                        var text1 = el1.title;
                        el1.innerHTML = '<i></i>' + text1 + '(' + data.std + ')';
                    }
                    if (el2) {
                        var text2 = el2.title;
                        el2.innerHTML = '<i></i>' + text2 + '(' + data.maint + ')';
                    }
                    if (el3) {
                        var text3 = el3.title;
                        el3.innerHTML = '<i></i>' + text3 + '(' + data.emer + ')';
                    }
                };

                api.getUndoCount().then(function (res) {
                    var ret = {
                        std: 0,
                        maint: 0,
                        emer: 0
                    };
                    var kvMap = {
                        '1': 'std',
                        '2': 'maint',
                        '3': 'emer'
                    };
                    _.forEach(res.data, function (item, k) {
                        ret[kvMap[k]] = Number(item) || 0
                    });
                    _setSumToDom(ret);
                })
            },
            onTableDataLoaded: function () {
                this._queryPoolNum();
            }
        }
    };

    return mixin;
});
