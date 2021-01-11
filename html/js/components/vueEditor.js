define(function(require) {
	var Vue = require("vue");
	var template = '<component :is="currentView" @dblclick="triggerEdit" @blur="unEdit" :value.sync="value"></component>';
	var opts = {
			template :  template,
			data:function(){
				return {
					currentView:'show'
				}
			},
			props:{
				value:{
					type:String
				}
			},
			components:{
				show:{
						template: '<b v-text="value"></b>',
						props: ['value']
					},
				edit:{
						template: '<input type="text" v-model="value"/>',
						props: ['value']
					}
			},
			methods:{
				triggerEdit:function(){
					this.currentView = ('show' === this.currentView ? 'edit' : 'show');
					if(this.currentView === 'edit'){
						this.$nextTick(function(){
							this.$children[0].$el.focus();
						});
					}
				},
				unEdit:function(){
					this.currentView = 'show';
				}
			}
	};
	
	var component = Vue.extend(opts);
	Vue.component('vueEditor', component);
});