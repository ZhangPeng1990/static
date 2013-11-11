var html = '<table border="1" style="border-color: black;">\
				<tr>\
					<td>1</td>\
				</tr>\
			</table>';

jQuery.foo = function() {   //或者 jQuery.foo = $.foo function()
	$("body").html(html);
};  