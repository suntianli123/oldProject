(function (doc, win) {
	styleNodeFontSize();
})(document, window);

window.onresize = function () {
	styleNodeFontSize();
};

function styleNodeFontSize() {
	var width = document.documentElement.clientWidth;
	var styleNode = document.createElement('style');
	if (width > 640) {
		styleNode.innerHTML = 'html{font-size:' + 640 / 15 + 'px!important}';
	} else {
		styleNode.innerHTML = 'html{font-size:' + width / 15 + 'px!important}';
	}
	document.head.appendChild(styleNode);
}
