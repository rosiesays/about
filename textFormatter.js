/**
* Format the linebreaks with newline characters and remove all preceding white space
*/
prepareForCopy = (str) => {
	return removeBeginningWhiteSpace(this.formatLineBreaks(str, "\n"));
}

/**
* Format the linebreaks with <br> and remove all preceding line breaks
*/
prepareForDisplay = (str) => {
	return removeBeginningBr(this.formatLineBreaks(str, "<br>", ["br"]));
}

/**
* Replaces html with the proper line break encoding in the proper spots
*/
formatLineBreaks = (str, lineBreak, exclusions) => {
	const removeNewLines = str.replace(/\r?\n|\r/g, "");
	const removeDivDiv = removeNewLines.replace(/<div><div>/g, lineBreak);
	const removeDiv = removeDivDiv.replace(/<div><\/div>/g, "").replace(/<div>(<br>)?/g, lineBreak);
	const removeP = removeDiv.replace(/<p><\/p>/g, "").replace(/<\/p>/g, lineBreak);
	const removeBr = removeP.replace(/<br>/g, lineBreak);
	return removeCode(removeBr, exclusions).replace(/&nbsp;/g, " ");
}

/**
* Remove any <br>'s at the beginning of the string
*/
removeBeginningBr = (str) => {
	return str.replace(/^(<br>)*/, "");
}

/**
* Remove any white space at the beginning of the string
*/
removeBeginningWhiteSpace = (str) => {
	return str.replace(/^\s/, "");
}

/**
* Removes any HTML code by replacing anything between a '<' and a '>' (and the brackets themselves) with an empty string. 
* Doesn't remove tags specified to be excluded in exclusions
*/
removeCode = (str, exclusions) => {
	if(exclusions == null){
		return str.replace(/<[^>]*>/g, "");
	}
	const pattern = "<(?!" + exclusions.join(")[^>]*>|<(?!") + ")[^>]*>";
	return str.replace(new RegExp(pattern, "g"), "");
}