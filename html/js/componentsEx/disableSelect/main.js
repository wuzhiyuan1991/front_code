define(function (require) {

    var LIB = require('lib');

    var template = require("text!./main.html");

    var opts = {
        template: template,
        props: {
            value: {
                type: String,
                default: ''
            },
            readOnly: {
               type: Boolean,
               default: true
            },
            showInput: {
                type: Boolean,
                default: false
            },
            disabled: {
                type: Boolean,
                default: false
            }
        },
        data: function () {
            return {
                disableList: [{id: "0", name: this.$t('gb.common.enable')}, {id: "1", name: this.$t('gb.common.disable')}]
            }
        },
        computed: {
            showSelect: function () {
                return !this.readOnly && this.showInput;
            },
            text: function () {
                if(this.showSelect) {
                    return ''
                }
                return LIB.getDataDic("disable", this.value);
            },
            styleObj: function () {
                var obj = {
                    color: '#fff',
                    padding: '4px 10px'
                };
                if(this.value === '0') {
                    obj.backgroundColor = "#aacd03";
                } else if(this.value === '1'){
                    obj.backgroundColor = "#f03";
                }
                return obj;
            }
        },
        methods: {

        },
        ready: function () {
        }
    };

    var component = LIB.Vue.extend(opts);
    LIB.Vue.component('disable-select', component);
});