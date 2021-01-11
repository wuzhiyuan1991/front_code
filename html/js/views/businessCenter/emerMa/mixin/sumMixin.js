define(function(require) {

    var api = require("./vuex/api");
    var mixin = {
        methods: {
            _queryTodoNum: function () {

                var _setSumToDom = function (data) {
                    var el1 =  document.querySelector('.sidebar-menu a[data-code="selfEvaluationTask"]');

                    var text1 = el1.title;

                    el1.innerHTML = '<i></i>' + text1 + '(' + data + ')';
                };

                api.getUndoCount().then(function (res) {
                    var num1 = res.data['0'];//待自评
                    var num2 = res.data['1'];//待签名
                    _setSumToDom(parseFloat(num1) + parseFloat(num2));
                })
            },
            onTableDataLoaded: function () {
                this._queryTodoNum();
            }
        }
    };

    return mixin;
});
