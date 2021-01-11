/**
 * Created by yyt on 2017/1/4.
 */
define(function(require) {

    var Vue = require("vue");

    var opts = {
        props: {
            disabledHours: {
                type: Array,
                default :function() {
                    return [];
                }
            },
            disabledMinutes: {
                type: Array,
                default :function() {
                    return [];
                }
            },
            disabledSeconds: {
                type: Array,
                default :function() {
                    return [];
                }
            },
            hideDisabledOptions: {
                type: Boolean,
                default: false
            }
        }
    };
    return opts;
})

