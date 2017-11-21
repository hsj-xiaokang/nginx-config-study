
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

/* 只能输入数字 */
(function justNUmber () {
	$('.num-input').keydown(function(event) {
		var keys = ['Tab','Home','End','Backspace','Delete','ArrowLeft','ArrowRight','F12',' '];
		if (keys.indexOf(event.key) == -1) {
			if (/[^0-9]/g.test(event.key)) {
				event.preventDefault();
			}
		}
	});
	$('.num-input').keyup(function(event){
		$(this).val($(this).val().replace(/[^\d]/g,''));
	});
	$('.num-nput').on('paste', function() {
		var ptxt = arguments[0].originalEvent.clipboardData.getData('Text');
		$(this).val(ptxt.replace(/[^\d]/g,''));
	});
})();
