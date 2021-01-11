define(function(require) {

    var LIB = require('lib');

    var mixin = {
        methods: {
            doClose: function() {
                window.close()
            },
            doContentScrollTo: function(top) {
                var div = this.$els.rightContent.getElementsByClassName("simple-card-body");
                div.length && (div[0].scrollTop = 0);
            },
            displayCriterion: function(type) {
                if (type == null) return;
                var types = [
                    { id: "1", name: "打分项" },
                    { id: "5", name: "加分项" },
                    { id: "10", name: "减分项" },
                    { id: "15", name: "否决项" }];
                var filterRes = types.filter(function(t) {
                    return t.id === type;
                });
                if (filterRes.length) {
                    return filterRes[0].name
                } else {
                    return types[0].name
                }
            },
            replaceReturnKey: function(name) {
                return name.replace(/[\r\n]/g, '<br/>');
            },
        },
        computed: {},
        events: {}
    };

    return mixin;
});
