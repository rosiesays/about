function textAnalyzer () {
	var self = this;
	
	// Load the keywords from file
	self.keywords = WORDS.words.map((word) => word.keyword);
	
	self.foundWords = [];
	self.foundWordReplacements = [];
	
	/**
	* Return the replacement text, following the capitalization of the original
	*/
	self.processCapitalization = (replace, innerText) => {
		if(innerText.charAt(0) === innerText.charAt(0).toUpperCase()) {
			replace = replace.charAt(0).toUpperCase() + replace.slice(1);
		}
		return replace;
	}
	
	/**
	* Find all keyword matches in the message and compile an array of the matches in order
	*/
	self.findMatches = (message) => {
		//Creates regular expression that matches the json keywords
		const keywordMatcher = new RegExp(`(\\b${self.keywords.join("\\b)|(\\b")}\\b)`, "gi");
		
		// Find all the matches, store them in an array
		const matches = message.match(keywordMatcher);
		
		// Prevent errors with null values
		if(matches !== null) {
			self.foundWords = matches;
		}
	}
	
	/**
	* Load the replacement phrases for the keyword matches in order
	*/
	self.getReplacements = () => {
		self.foundWordReplacements = self.foundWords.map((word)=>WORDS.words[self.keywords.indexOf(word.toLowerCase())].replacement);
	}
	
	/**
	* Find all the keywords in the message, load the replacements, and add the warning
	*/
	self.analyze = (message) => {
		self.findMatches(message);
		self.getReplacements();
		
	    let count = 0;
        self.foundWords.forEach((matchedWord) => {
                //Adds the warning css class to all instances of a keyword
                let id = "warningId" + count;
                message = message.replace(new RegExp("\\b" + matchedWord + "(?!</span>)\\b", "i"), `<span id="${id}" contenteditable="false" class="warning">${matchedWord}</span>`);
                count++;
        });		
		return message;
	}
	
	/**
	* Accept all the changes suggested by Rosie
	*/
	self.acceptAllChanges = () => {
		for(let i = 0; i < self.foundWordReplacements.length; i++){
			let element = $("#warningId" + i);
			if(element.length !== 0){
				let innerText = element.text();
				let replace = self.foundWordReplacements[parseInt(element.attr('id').replace("warningId", ""))]
				element.html(self.processCapitalization(replace, innerText));
				element.removeClass("warning");
				element.removeAttr("title");
				element.removeAttr("contenteditable");
			}			 
		}
	}
	
	/**
	* Register event listeners for each warning to replace with the suggestion
	*/
	self.registerEventListeners = () => {
		for(let i = 0; i < self.foundWords.length; i++){
			let tooltip = WORDS.words[self.keywords.indexOf(self.foundWords[i].toLowerCase())].message;
			$("#warningId" + i).attr('title', tooltip);
            
            let element = $("#warningId" + i);
            
            element.on("dblclick", () => {
				let innerText = element.text();
				let replace = self.foundWordReplacements[parseInt(element.attr('id').replace("warningId", ""))]
				element.html(self.processCapitalization(replace, innerText));
				element.removeClass("warning");
				element.removeAttr("title");
				element.removeAttr("contenteditable");
			});
		}
		$("#allChange").on("click", self.acceptAllChanges);
	}
}
