define(function(require) {

    var api = require("./vuex/api");
    var mixin = {
        methods: {
            _queryPoolNum: function () {

                var _setSumToDom = function (data) {
                    var el1 =  document.querySelector('.sidebar-menu a[data-code="hiddenRegist"]');
                    var el2 =  document.querySelector('.sidebar-menu a[data-code="hiddenAssign"]');
                    var el3 =  document.querySelector('.sidebar-menu a[data-code="hiddenReform"]');
                    var el4 =  document.querySelector('.sidebar-menu a[data-code="hiddenVerify"]');

                    var text1 = el1.title;
                    var text2 = el2.title;
                    var text3 = el3.title;
                    var text4 = el4.title;

                    el1.innerHTML = '<i></i>' + text1 + '(' + data.register + ')';
                    el2.innerHTML = '<i></i>' + text2 + '(' + data.assign + ')';
                    el3.innerHTML = '<i></i>' + text3 + '(' + data.reform + ')';
                    el4.innerHTML = '<i></i>' + text4 + '(' + data.verify + ')';
                };

                api.queryPoolNum().then(function (res) {
                    var ret = {
                        register: 0,
                        assign: 0,
                        reform: 0,
                        verify: 0
                    };
                    var kvMap = {
                        '0': 'register',
                        '1': 'assign',
                        '2': 'reform',
                        '3': 'verify',
                        '11': 'assign'
                    };
                    _.forEach(res.data, function (item) {
                        ret[kvMap[item.status]] = ret[kvMap[item.status]] + Number(item.sum)
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
