$(document).ready(function() {

  $('.dropbox-widget').each(function() {

    savedTidsTextfield              = $(this).find('.saved-tids input[type=hidden]');
    commaListTextfield              = $(this).find('.new-terms input[type=hidden]');
    autocompletedropboxTextfield    = $(this).find('.autocomplete-dropbox input[type=text]');
    termLimit                       = $(this).find('.this-term-id-limit input[type=hidden]').val();
    //~ alert(termLimit);
    if(termLimit == 0)
      termLimit = false;

    comma_list  = savedTidsTextfield.val();
    term_list   = commaListTextfield.val();
    commaListTextfield.val('');
    count_tids = substr_count(comma_list, ',');

    var code = 'var data = {items: [';

    for (var k = 0; k < count_tids; k++) {
      pos = comma_list.indexOf(',');
      termpos = term_list.indexOf(',');
      tid = comma_list.substr(0, pos);
      term_name = term_list.substr(0, termpos);
      comma_list = comma_list.substr(pos+1);
      term_list = term_list.substr(termpos+1);
      code = code + '{value: "' + term_name +'", name: "' + term_name + '", tid: "' + tid + '"},';
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
