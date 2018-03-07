analyzeCallBack = () => {
	let analyzer = new textAnalyzer();
	let toAnalyze = prepareForDisplay($("#editing").html());
	$("#editing").html(analyzer.analyze(toAnalyze));
	analyzer.registerEventListeners();
}

$(document).ready(() => {
	new Clipboard('#copyBtn', {
		text: function(trigger) {
			return prepareForCopy($("#editing").html().toString());
		}
	});
	$("#analyze").click(analyzeCallBack);
});