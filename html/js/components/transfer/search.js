define(function(require) {
	var Vue = require("vue");

	var template = '<div :class="prefixCls">'
					        +'<iv-input '
					        +':value.sync="query" '
                            +'size="small" '
					        +':icon="icon" '
					        +':placeholder="placeholder" '
					        +'@on-click="handleClick"></iv-input>'
					+'</div>';
	var iInput = require('../iviewInput');

    var opts =  {
		template : template,
        components: { 'iInput':iInput },
        props: {
            prefixCls: String,
            placeholder: String,
            query: String
        },
        computed: {
            icon :function() {
                return this.query === '' ? 'ios-search' : 'ios-close';
            }
        },
        methods: {
            handleClick :function() {
                if (this.query === '') return;
                this.query = '';
            }
        }
    };
	var component = Vue.extend(opts);
	return component; 
});