if (Drupal.jsEnabled) {
$(document).ready(function() {
  $('.dropbox-widget').each(function() {
    savedTidsTextfield = $(this).find('.saved-tids input[type=hidden]');
    commaListTextfield = $(this).find('.new-terms input[type=hidden]');
    autocompletedropboxTextfield = $(this).find('.autocomplete-dropbox input[type=text]');
    termLimit = $(this).find('.this-term-id-limit input[type=hidden]').val();
    if(termLimit == 0)
      termLimit = false;
    comma_list  = savedTidsTextfield.val()+'';
    term_list   = commaListTextfield.val()+'';
		// commaListTextfield.val('');

		// create arrays from comma lists
		var ar_empty = false;
		if (comma_list.length == 0) 
			ar_empty = true;
		var tids = comma_list.split(',');
		var terms = term_list.split(',');
		var ar_size = tids.length;

		// console.debug(ar_empty);
		var code = 'var data = {items: [';

		if (!ar_empty)
		for(i = 0; i < ar_size; i++) {
			var term = terms.shift();
			var tid = tids.shift();
			code = code + '{value: "' + term +'", name: "' + term + '", tid: "' + tid + '"},';
			// console.debug( '{value: "' + term +'", name: "' + term + '", tid: "' + tid + '"},');
		}

		code = code + ']};';
    eval(code);

    autocompletedropboxTextfield.autoSuggest(Drupal.settings.basePath + "autocomplete_dropbox.json", {
      minChars:           2,
      selectedItemProp:   'name',
      searchObjProps:     'name',
      emptyText:          '',
      queryParam:         'term',
      neverSubmit:        'True',
      emptyText:          'No Results',
      preFill:            data.items,
      selectionLimit:     termLimit,
    });
  });
});
}
