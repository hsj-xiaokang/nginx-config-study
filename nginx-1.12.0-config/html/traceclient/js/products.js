$(function () {

	/* 点击'搜索' */
	$('#search-button').on('click', function () {
		getProductList();
	});
	/* select框改变 */
	$('#products-search-select').on('change', function () {
		getProductList();
	});

	/* 敲击回车 */
	$(document).keydown(function(e) {
		if(e.which == 13 && $('.products-name-div input').is(":focus")){
			getProductList();
		}
	});
	/* 获取产品类型列表 */
	getProductTypeList();

	/* 获取精选产品列表 */
	getProductList();

	/* 禁用enter键表单自动提交 */
	prohibitFormDefaultSubmit();

});

/* 获取产品类型列表  ? */
function getProductTypeList () {
	$.ajax({
		url: productTypeList,
		type: 'POST',
		dataType: 'json',
		data: {
			operatorid: 2,
			lastlogincode: '123'
		},
		success: function (data){
			console.log('获取产品类型列表成功!');
			console.log(data);
			if (data.flag === 1) {
				var template = '<option value="">全部</option>';
				for (var i=0; i<data.data.length; ++i) {
					template += '<option value="'+data.data[i].code+'">'+data.data[i].typeName+'</option>';
				}
				$('#products-search-select').html(template);
			}
			else{
			}
		},
		error: function (){
			console.log('失败!');
		}
	});
}

/* 获取精选产品列表 */
function getProductList (currentPage) {
	currentPage = currentPage || 1;
	$.ajax({
		url: goodProductList,
		type: 'POST',
		dataType: 'json',
		data: {
			type: $('#products-search-select').val(),
			productionname: $('#products-name-div>input').val(),
			pageSize: 12,
			currentPage: currentPage
		},

		success: function (data){
			console.log(data);
			if (data.flag === 1) {
				data.page.totalPage = data.page.totalPage === 0 ? 1 : data.page.totalPage;
				console.log('获取精选产品列表成功!');
				console.log(data.data);
				vue.productList = data.data;
				$('body,html').animate({ scrollTop: 0 },0);
				/* 分页 */
				$(".zxf_pagediv").createPage({
					pageNum: data.page.totalPage,//总页码
					current: data.page.currentPage,//当前页
					shownum: 7,//每页显示个数
					backfun: function(e) {
						e.current = e.current > e.pageNum ? e.pageNum : e.current;
						e.current = e.current < 1 ? 1 : e.current;
						console.log('当前页:');
						console.log(e);
						getProductList(e.current);

					}
				});
			}
			else{}
		},
		error: function (){
			console.log('失败!');
		},
	});
}


/*  */
/* vue */
var vue = new Vue({
	el: '#products-list-wrapper',
	data:{ productList: [] }, //产品列表
	methods: {
		/* 点击产品 跳转 */
		clickProduct: function (id){
			sessionStorage.setItem('pagePath',$('#current-page').text()); //当前导航存入session
			window.location.href = './trace_archive.html?id=' + id;
		}
	}
});


/* 禁用enter键表单自动提交 */
function prohibitFormDefaultSubmit  () {
	document.onkeydown = function(event) {
		var target, code, tag;
		if (!event) {
			event = window.event; //针对ie浏览器
			target = event.srcElement;
			code = event.keyCode;
			if (code == 13) {
				tag = target.tagName;
				if (tag == "TEXTAREA") { return true; }
				else { return false; }
			}
		}
		else {
			target = event.target; //针对遵循w3c标准的浏览器，如Firefox
			code = event.keyCode;
			if (code == 13) {
				tag = target.tagName;
				if (tag == "INPUT") { return false; }
				else { return true; }
			}
		}
	};
}

