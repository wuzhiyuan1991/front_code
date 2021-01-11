define(function(require) {	

	var Vue = require("vue");
	var edit = require("../vueEditor");

	
	var template = '<div '+
					    'class="el-tabs__item" '+
					        ':class="{ '+
					          '\'is-active\': $parent.currentName === tab.key, '+
					          '\'is-disabled\': tab.disabled, '+
					          '\'is-closable\': closable '+
					        '}"> '+
					        '<vue-editor v-if="editable" v-ref\:"editor" :value.sync="tab.label"></vue-editor>'+
					        '<b v-text="tab.label" v-else></b> '+
//					        '<span '+
//					          'class="el-icon-close" '+
//					          'v-if="closable" '+
//					          '@click="$emit(\'remove\', tab, $event)"> '+
//					        '</span> '+
					         '<Icon :type="cIconType" ' +
					         'v-if="closable" '+
					         '@click="$emit(\'remove\', tab, $event)"> '+

					         '</Icon>' +
							'<Icon style="padding-left:10px;"' +
							'type="edit" ' +
							'v-if="editable && closable" '+
							'@click="doEdit()"> '+
							'</Icon>'
    '</div>';

	var opts = {
		template :  template,
		components: {
		      edit:edit
	    },
		props: {
	      tab: {
	        type: Object,
	        required: true,
	      },
		  iconType:String,
	      closable: Boolean,
	      editable: Boolean
	    },
		computed:{
			cIconType:function(){
				return this.iconType || 'close';
			},
            edit:function(){
				console.log(this.iconType)
                return "edit" || 'close';
            },
		},
		methods:{
			doEdit:function () {
				debugger
				this.$children[0].triggerEdit();
            }
		}
	};
	
	
	var component = Vue.extend(opts);
	Vue.component('el-tab', component);
    
});