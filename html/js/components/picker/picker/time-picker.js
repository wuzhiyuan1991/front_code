/**
 * Created by yyt on 2017/1/4.
 */

define(function(require) {

    var Vue = require("vue");
    var oneOf = require('../../utils/assist').oneOf;
    var Picker = require('../picker');
    var TimePanel = require('../panel/time');
    var TimeRangePanel = require('../panel/time-range');
    var Options = require('../time-mixins');
    //import Picker from '../picker.vue';
    //import TimePanel from '../panel/time.vue';
    //import TimeRangePanel from '../panel/time-range.vue';
    //import Options from '../time-mixins';
    //import { oneOf } from '../../../utils/assist';

    var getPanel = function (type) {
        if (type === 'timerange') {
            return TimeRangePanel;
        }
        return TimePanel;
    };

    var opts = {
        mixins: [Picker, Options],
        props: {
            type: {
                validator :function(value) {
                    return oneOf(value, ['time', 'timerange']);
                },
                default: 'time'
            },
            value: {}
        },
        created :function() {
            if (!this.value) {
                if (this.type === 'timerange') {
                    this.value = ['',''];
                } else {
                    this.value = '';
                }
            }
            this.panel = getPanel(this.type);
        }
    };

    var component = Vue.extend(opts);
    Vue.component('vi-time-picker', component);

    return component;
});