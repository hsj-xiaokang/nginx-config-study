$(function () {
	$.ajax({
		url: printFakeNoQRCodeByFakeArchivesHistory,
		type: 'POST',
		dataType: 'JSON',
		data: {
			fakearchiveshistoryid: getQueryString('fakearchiveshistoryid'), 
			tracearchivesid: getQueryString('tracearchivesid'),
			operatorid: JSON.parse(sessionStorage.getItem('loginInfo')).uid,
			lastlogincode: JSON.parse(sessionStorage.getItem('loginInfo')).lastlogincode
		},
		success: function (data) {
			console.log('success!');
			console.log(data);
			if (data.flag === 1) {
				var template = '';
				for (var fakeArchives of data.data) {
					template += ' <div>'+
									'<div>'+
										'<img src="'+fakeArchives.twodimensioncodepath+'" />'+
									'</div>'+
									'<div class="fakeArchives-text">验证码&nbsp;&nbsp;<span>'+fakeArchives.fakeno+'</span></div>'+
								  '</div>'
				}
				$('.print-fakeArchives-wrapper').html(template);
			}
		},
		error: function () {
			console.log('error');
		}
	});
});