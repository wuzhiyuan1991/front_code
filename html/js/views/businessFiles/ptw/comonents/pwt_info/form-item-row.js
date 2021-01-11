
define(function (require) {
    var Vue = require("vue");
    var template = '<div class="flex-layout">\n' +
        '        <div class="flex-grow1"><slot></slot></div>\n' +
        '        <div style="min-width:100px;width: 100px"><slot name="after"></slot></div>\n' +
        '    </div>';
    return Vue.extend({
        template: template,
        data: function () {
            return {}
        },
        methods: {}
    })
})
