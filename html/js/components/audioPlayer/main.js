define(function (require) {
    var Vue = require("vue");
    var LIB = require('lib');
    var template = '<Modal :visible.sync="visible" title="播放音频" :footer-hide="true" class="userSelectModal" @on-cancel="doPause">' +
        '    <div class="edit-pop-container">' +
        '        <div class="epc-content" style="text-align: center;background-color: #ddd;padding: 150px 0;">' +
        '            <audio :src="src" controls autoplay v-el:audio></audio>' +
        '        </div>' +
        '    </div>' +
        '</Modal>';

    var opts = {
        template: template,
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            path: {
                type: String,
                default: ''
            }
        },
        data: function () {
            return {
            };
        },
        computed: {
            src: function () {
                return LIB.isURL(this.path) ? this.path: ( this.path ? LIB.ctxPath(this.path) : '');
            }
        },
        watch: {
            'visible': function (val) {
                if(!val) {
                    this.doPause();
                }
            }
        },
        methods: {
            doPause: function () {
                this.$els.audio.pause();
            }
        }
    };

    var comp = Vue.extend(opts);
    Vue.component('audio-player', comp);
});


