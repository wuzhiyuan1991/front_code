define(function (require) {
    var LIB = require('lib');
    var template = require("text!./layer.html");

    var opt = {
        template: template,
        props: {
            values: {
                type: Array,
                default: function () {
                    return []
                }
            }
        },
        data: function () {
            return {}
        },
        computed: {
            times: function () {
                // var res = 0;
                // _.each(this.values, function (item) {
                //     res += parseInt(item.xValue);
                // });
                // return res;
                return _.get(this.values, '[0].xValue')
            },
            percent: function () {
                return _.get(this.values, '[0].yValue')
            },
            items: function () {
                var size = 6,
                    length = _.ceil(this.values.length / size),
                    res = [];
                for(var i = 0; i < length; i++) {
                    res.push({
                        children: this.values.slice(i*size, (i+1)*size)
                    })
                }
                return res;
            }
        },
        methods: {
            displayCompName: function (id) {
                return LIB.getDataDic("org", id)["csn"];
            }
        }
    };
    return LIB.Vue.extend(opt);
});