define(function (require) {
	//基础js
	var LIB = require('lib');
	var api = require("./vuex/api");
	var tpl = LIB.renderHTML(require("text!./main.html"));



	var initDataModel = function () {
		return {
			isSearch: false,
			refreshPage: true,
			select: 1,
			input: '',
			searchvalue: '',
			data: [],
			total: 0,
			searchType: 1,
			list: [{ id: 1, value: '法规/规范/制度名称' }, { id: 2, value: '条款内容' }]
		};
	}

	var vm = LIB.VueEx.extend({
		mixins: [LIB.VueMixin.dataDic, LIB.VueMixin.auth, LIB.VueMixin.mainPanel],
		template: tpl,
		data: initDataModel,
		components: {
		},
		methods: {
			goto: function (data) {
				if (this.searchType == 1) {
					switch (data.type) {
						case '1':
							window.open("/html/main.html#!/viewLawsText?lawsId=" + data.id + '&&discernId=' + data.discernId)
							break;
						case '2':
							window.open("/html/main.html#!/viewLawsText?regulationId=" + data.id + '&&discernId=' + data.discernId)
							break;
						case '3':
							window.open("/html/main.html#!/viewLawsText?standardId=" + data.id + '&&discernId=' + data.discernId)
							break;
						default:
							break;
					}

				} else {
					switch (data.type) {
						case '1':
							window.open("/html/main.html#!/viewLawsText?lawsId=" + data.pId + '&&discernId=' + data.discernId + '&&chapterId=' + data.chapterId)
							break;
						case '2':
							window.open("/html/main.html#!/viewLawsText?regulationId=" + data.pId + '&&discernId=' + data.discernId+ '&&chapterId=' + data.chapterId)
							break;
						case '3':
							window.open("/html/main.html#!/viewLawsText?standardId=" + data.pId + '&&discernId=' + data.discernId+ '&&chapterId=' + data.chapterId)
							break;
						default:
							break;
					}
					
				}

			},
			doMore: function (index) {
				// if ($('.computedHeight').get(index).clientHeight<60) {
				// 	LIB.Msg.warning('内容无需展开')
				// 	return
				// }
				this.data[index].more = !this.data[index].more
				if (this.data[index].more) {
					$('.computedHeight').eq(index).addClass('scontent')
				} else {
					$('.computedHeight').eq(index).removeClass('scontent')
				}

			},
			pageChange: function (val) {
				var _this = this
				LIB.globalLoader.show()
				if (this.select == 1) {
					api.querylaws({ currentPage: val, pageSize: 10, name: this.searchvalue }).then(function (res) {
						_this.total = parseInt(res.data.total)
						_this.data = res.data.list
						for (var index = 0; index < _this.data.length; index++) {
							var reg = new RegExp(_this.searchvalue, "g")
							if (_this.data[index].type == 2) {
								_this.data[index].chName = _this.data[index].name.replace(reg, '<span style="color:red;;margin:0">' + _this.searchvalue + '</span>')
							} else {
								_this.data[index].name = _this.data[index].name.replace(reg, '<span style="color:red;;margin:0">' + _this.searchvalue + '</span>')
							}

						}
						LIB.globalLoader.hide()
					})
				} else {
					api.querylawscontent({ currentPage: val, pageSize: 10, content: this.searchvalue }).then(function (res) {
						_this.total = parseInt(res.data.total)
						for (var index = 0; index < res.data.list.length; index++) {
							var reg = new RegExp(_this.searchvalue, "g")
							res.data.list[index].more = true
							res.data.list[index].content = res.data.list[index].content.replace(reg, '<span style="color:red;margin:0">' + _this.searchvalue + '</span>')

						}

						_this.data = res.data.list
						_this.$nextTick(function () {
							$('.computedHeight').each(function (index, item) {
								console.log($(item).height());
								if ($(item).height() < 70) {
									$(item).prev().hide()
								}
								$(item).addClass('scontent')
							})
						})
						LIB.globalLoader.hide()
					})
				}

			},
			searchLaws: function () {
				var _this = this

				this.input = _.trim(this.input)
				if (this.input !== '') {
					this.refreshPage = false
					this.searchvalue = this.input
					this.isSearch = true
					this.searchType = this.select
					LIB.globalLoader.show()
					$('#search').css('top', '50px')
					if (this.select == 1) {
						api.querylaws({ currentPage: 1, pageSize: 10, name: this.searchvalue }).then(function (res) {
							_this.total = parseInt(res.data.total)
							_this.data = res.data.list
							for (var index = 0; index < _this.data.length; index++) {
								var reg = new RegExp(_this.searchvalue, "g")
								_this.data[index].name = _this.data[index].name.replace(reg, '<span style="color:red;margin:0">' + _this.searchvalue + '</span>')
							}
							_this.$nextTick(function () {
								_this.refreshPage = true
							})
							LIB.globalLoader.hide()
						})
					} else {
						api.querylawscontent({ currentPage: 1, pageSize: 10, content: this.searchvalue }).then(function (res) {
							_this.total = parseInt(res.data.total)

							for (let index = 0; index < res.data.list.length; index++) {
								var reg = new RegExp(_this.searchvalue, "g")
								res.data.list[index].more = true
								res.data.list[index].content = res.data.list[index].content.replace(reg, '<span style="color:red;margin:0">' + _this.searchvalue + '</span>')

							}

							_this.data = res.data.list
							_this.$nextTick(function () {
								_this.refreshPage = true
								$('.computedHeight').each(function (index, item) {
									console.log($(item).height());
									if ($(item).height() < 70) {
										$(item).prev().hide()
									}
									$(item).addClass('scontent')
								})
							})
							LIB.globalLoader.hide()

						})
					}
				} else {
					LIB.Msg.error('请输入关键字')
				}

			}
		},
		events: {
		},
		init: function () {
			this.$api = api;
		},
		ready: function () {
		}
	});
	return vm;
});
