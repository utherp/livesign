language_pack = {
	words:{},
	locale:'English',
	which_words:function (locale, words) {
		if (undefined == locale || locale == null) locale = language_pack.locale;
		if (typeof(words) != 'object' || words == null) words = language_pack.words;
		if (typeof(words[locale]) == 'object') return words[locale];

		if (locale != language_pack.locale)
			return which_words(null, words);

		if (words != language_pack.words)
			return which_words(locale);

		return null;
	},

	lang:function () {
		var words = language_pack.which_words(this.locale, this.words);

		for (var i = 0; i < arguments.length; i++) {
			words = words[arguments[i]];
			if (undefined == words) return '';
		}
		return words;
	}
};


