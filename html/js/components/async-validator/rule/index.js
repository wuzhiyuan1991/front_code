define(function(require) {
	return {
		  required: require('./required'),
		  whitespace: require('./whitespace'),
		  type: require('./type'),
		  range: require('./range'),
		  enum: require('./enum'),
		  pattern: require('./pattern')
	}
});