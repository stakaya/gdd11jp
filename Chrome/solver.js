var i = 0;
while (true) {
	var element = document.getElementById('card' + i);
	if (element == null) {
		break;
	} else {
		var j = 0;
		while (true) {
			var card = document.getElementById('card' + j);
			if (card == null) {
				break;
			}
			if (i != j) {
				var myevent = document.createEvent('MouseEvents');
				myevent.initEvent('click', false, true);
				card.dispatchEvent(myevent);
				var eve = document.createEvent('MouseEvents');
				eve.initEvent('click', false, true);
				element.dispatchEvent(eve);
			}
			j++;
		}
	}
	i++;
}
