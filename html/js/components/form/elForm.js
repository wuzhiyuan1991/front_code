define(function(require) {
	var Vue = require("vue");
	var template = '<div class="el-form" :class="['
				    +'labelPosition ? \'el-form--label-\' + labelPosition : \'\','
				    +'{ \'el-form--inline\': inline }'
				    +']">'
				    +'<slot></slot>'
				    +'</div>';
	    	  
	var opts = {
			template : template,
		    props: {
		      model: {
		    	  type:Object,
		    	  required:true
		      },
		      rules: Object,
		      labelPosition: String,
		      labelWidth: String,
		      labelSuffix: {
		        type: String,
		        'default': ''
		      },
		      inline: Boolean
		    },
		    data: function() {
		      return {
		        fields: {},
		        fieldLength: 0
		      };
		    },
		    created: function() {
		      this.$on('el.form.addField', function(field) {
		        this.fields[field.prop] = field;
		        this.fieldLength++;
		      });
		      /* istanbul ignore next */
		      this.$on('el.form.removeField', function(field) {
		        if (this.fields[field.prop]) {
		          delete this.fields[field.prop];
		          this.fieldLength--;
		        }
		      });
		    },
		    methods: {
		      resetFields: function() {
		        for (var prop in this.fields) {
		          var field = this.fields[prop];
		          field.resetField();
		        }
		      },
		      validate: function(callback) {
		        var count = 0;
		        var valid = true;
		        for (var prop in this.fields) {
	        	  var _this = this;
		          var field = this.fields[prop];
		          field.validate('',  function(errors) {
		            if (errors) {
		              valid = false;
		            }

		            if (++count === _this.fieldLength) {
		              callback(valid);
		            }
		          });
		        }
		      },
		      validateField: function(prop, cb) {
		        var field = this.fields[prop];
		        if (!field) { throw new Error('must call validateField with valid prop string!'); }

		        field.validate('', cb);
		      }
		    }
	};
	var comp = Vue.extend(opts);
	Vue.component('el-form', comp);
});