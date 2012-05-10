/**
 * @file
 * JS file of autocomplete_contacts. Does everything needed
 * 
 * @author Willem Coetzee
 */

/**
 * Using Drupal behaviours to declare main function
 */

// We need this piece of code to disable form submit on enter. Thus far this is the only solution I can find.
$(document).ready(function() {
 
  //Workaround for dropdown not going away when clicking elsewhere on the screen 
  $("body").click(function(e) {
    if(!((e.target.id == "term-names-wrapper-0") || (e.target.id == "term-names-input-0") || ((e.target.id == "term-names-dropdown-item-0")))){
        $(".dropdown-term-names").hide();
        $(".term-names-input").val("");
      }     
  });

  $(window).keydown(function(event){
    if(event.keyCode == 13) {
      event.preventDefault();
      return false;
    }
  });

});

Drupal.behaviors.autocomplete_dropbox = function() {

  // Set term counter
  $('.autocomplete-dropbox-field-wrapper').each(function() {
    $(this).find('.autocomplete-dropbox-label .terms-count .entered').html('0');
  });


  // Support for Tipsy. If Tipsy module installed, add tipsy.     
  try {
    $('.term-names-wrapper').tipsy({fade: true, gravity: $.fn.tipsy.autoWE, delayIn: 0, delayOut: 500, trigger: 'hover', opacity: 0.8, offset: 0, title: function() { return $(this).find('.description').html();}, html: 1});
  } catch(e) {}

 
  function getDropdownData(vocabId) {

    //var dropdownData = [];
    //$.ajax({
    //  url: "http://dev.nojoshmo.com/autocomplete_dropbox.json?vid="+vocabId,
    //  async: false,
    //  dataType: 'json',
    //  success: function (json) {
    //    data = json;
    //    dropdownData = new Array();
    //    for(var i in data) {
    //      var innerArray = new Array();
    //      innerArray["id"] = data[i].tid;
    //      innerArray["value"] = data[i].name;
    //      dropdownData[i] = innerArray;
    //    }  
    //  }
    //});
    //return dropdownData;
    return Drupal.settings.autocomplete_dropbox["a"+vocabId];
  }

  var navigationIndex = 0;

  $('.term-names-wrapper').each(function() {
    $(this).find('.description').html($(this).parent().find('.textfield').find('.description').html());
  });

  // The delete button next to each term
  $(".entered-term-name a").click(function() {
    var temp_array = $(this).parent().parent().parent().parent().find('.form-text').val().split(',');
    var deleteIndex = 0;
    for (var i = 0; i < temp_array.length; i++) {
      if ((temp_array[i] == $(this).parent().children('.term-id').html()) || (temp_array[i] == '###' + $(this).parent().children('.new-item').html()) )
        deleteIndex = i;
    }
    temp_array.splice(deleteIndex,1);
      
    //Now we use this code to make a string again since join doesnt want to work
    if (temp_array.length == 1) {
      temp_string = temp_array[0];
    }
    else if (temp_array.length > 1) {
      temp_string = '';
      for (var k = 0; k < temp_array.length; k++) {
        if (k == 0)
          temp_string = temp_array[k];
        else
          temp_string = temp_string + ',' + temp_array[k];
      }
    }
    else {
      temp_string = '';
    }
    $(this).parent().parent().parent().parent().find('.terms-count .entered').html($(this).parent().parent().children().length - 1);
    $(this).parent().parent().parent().parent().find('.form-text').val(temp_string);    
    $(this).parent().remove();
  });

  $(".term-names-wrapper").click(function(e) {

    $(this).find(".term-names-input").focus();
      if($(this).parent().parent().find(".term-names-dropdown").is(":visible")) {
      //do nothing...
      }
      else {
        $(".dropdown-term-names").hide();
        $(".term-names-input").val("");
      }
  });

  $(".term-names-input").keyup(function(e, keyCode){

    keyCode = keyCode || e.keyCode;

    if (keyCode == 13) { //Enter key
      if ($(this).val() != '') {
        if (navigationIndex != 0) {
          var usernameValue = $(this).parent().parent().parent().find(".term-names-dropdown-item:nth-child("+ navigationIndex +") .term-id").html();
          $(this).parent().find("#entered-term-names-wrapper").append("<div class='entered-term-name'>" + $(this).parent().parent().find(".term-names-dropdown-item:nth-child("+ navigationIndex +")").html() + "<a class='close-entered-term-name'>×</a></div>");
          $(this).parent().parent().find('.terms-count .entered').html($(this).parent().find('#entered-term-names-wrapper').children().length);
          // Add the username to the original hidden input
          if ($(this).parent().parent().find('.form-text').val() == "")
            $(this).parent().parent().find('.form-text').val($(this).parent().parent().find(".term-names-dropdown-item:nth-child("+ navigationIndex +") .term-id").html());
          else
            $(this).parent().parent().find('.form-text').val($(this).parent().parent().find('.form-text').val() + ',' + $(this).parent().parent().find(".term-names-dropdown-item:nth-child("+ navigationIndex +") .term-id").html());
          // Clear what needs to be cleared.
          $(this).val('');
          $(this).parent().parent().find(".dropdown-term-names").html('');
          $(this).parent().parent().find(".dropdown-term-names").hide();
          navigationIndex = 0;
        }
        else {
          if ($(this).parent().parent().find(".dropdown-term-names").css('display') == 'none') {
            $(this).parent().find("#entered-term-names-wrapper").append("<div class='entered-term-name'><div class='new-item' style='display: inline;'>" + $(this).val() + "</div><a class='close-entered-term-name'>×</a></div>");
            $(this).parent().parent().find('.terms-count .entered').html($(this).parent().find('#entered-term-names-wrapper').children().length);
            if ($(this).parent().parent().find('.form-text').val() == "")
              $(this).parent().parent().find('.form-text').val('###' + $(this).val());
            else
              $(this).parent().parent().find('.form-text').val($(this).parent().parent().find('.form-text').val() + ',' + '###' + $(this).val());
            $(this).val('');
          }
        }
      }
    }
    // Down arrow pressed
    else if (keyCode == 40) {
      $(this).parent().parent().parent().find(".term-names-dropdown-item:nth-child("+ navigationIndex +")").css("background-color", "white");
      navigationIndex = navigationIndex+1;     
      $(this).parent().parent().parent().find(".term-names-dropdown-item:nth-child("+ navigationIndex +")").css("background-color", "#ebeef0");
    }
    // Up arrow pressed
    else if (keyCode == 38) {
      $(this).parent().parent().parent().find(".term-names-dropdown-item:nth-child("+ navigationIndex +")").css("background-color", "white");
      navigationIndex = navigationIndex-1;     
      $(this).parent().parent().parent().find(".term-names-dropdown-item:nth-child("+ navigationIndex +")").css("background-color", "#ebeef0");   
    }
    else {
      if($(this).parent().parent().find('.terms-count .entered').html() == $(this).parent().parent().find('.terms-count .allowed').html()){
        $(this).val('');
      }
      else {
        $(this).parent().parent().find('.dropdown-term-names').html('');
        $(this).parent().parent().find('.dropdown-term-names').css('display', 'block');
        vocabId = $(this).parent().parent().find(".vocab-id").html();
        $(this).parent().css("background-image", "url("+Drupal.settings['module_path']['0']+"/images/throbber-loading.gif)");
        dropdownData = getDropdownData(vocabId);
        //console.log(dropdownData);
        var dropdownLength = dropdownData.length;
        flag_dropdown_empty = true;
        for (var k = 0; k < dropdownLength; k++) {
          if(($(this).val() != '') && (dropdownData[k]['value'].toUpperCase().indexOf($(this).val().toUpperCase(), 0) > -1)) {
            flag_dropdown_empty = false; 
            $(this).parent().parent().find('.dropdown-term-names').append("<div class='term-names-dropdown-item' id='term-names-dropdown-item-0'><div class='term-id'>" + dropdownData[k]['id'] + "</div>" + dropdownData[k]['value'] + "</div>");
            $(this).parent().css("background-image", "url("+Drupal.settings['module_path']['0']+"/images/throbber.gif)");
          }
          else {
            navigationIndex = 0;
          } 
        }
        if (flag_dropdown_empty)
          $(this).parent().parent().find('.dropdown-term-names').hide();
        $(this).parent().css("background-image", "url("+Drupal.settings['module_path']['0']+"/images/throbber.gif)");
      }
    }
    // Backspace pressed
    if (keyCode == 8) {
      // Leave for later
    }

    // Mouse actions

    // The delete button next to each entered term
    $(this).parent().find(".entered-term-name a").click(function() {
      var temp_array = $(this).parent().parent().parent().parent().find('.form-text').val().split(',');
      var deleteIndex = 0;
      for (var i = 0; i < temp_array.length; i++) {
        console.log($(this).parent().children('.new-item').html());
        if ((temp_array[i] == $(this).parent().children('.term-id').html()) || (temp_array[i] == '###' + $(this).parent().children('.new-item').html()) )
          deleteIndex = i;
      }
      temp_array.splice(deleteIndex,1);
      
      //Now we use this code to make a string again since join doesnt want to work
      if (temp_array.length == 1) {
        temp_string = temp_array[0];
      }
      else if (temp_array.length > 1) {
        temp_string = '';
        for (var k = 0; k < temp_array.length; k++) {
          if (k == 0)
            temp_string = temp_array[k];
          else
            temp_string = temp_string + ',' + temp_array[k];
        }
      }
      else {
        temp_string = '';
      }
      $(this).parent().parent().parent().parent().find('.terms-count .entered').html($(this).parent().parent().children().length - 1);
      $(this).parent().parent().parent().parent().find('.form-text').val(temp_string);    
      $(this).parent().remove();
    });

    //Mouseclick on dropdown items
    $(this).parent().parent().find(".term-names-dropdown-item").click(function() {
      $(this).parent().parent().find("#entered-term-names-wrapper").append("<div class='entered-term-name'>" + $(this).html() + "<a class='close-entered-term-name'>×</a></div>");
      // Add the username to the original hidden input
      if ($(this).parent().parent().find('.form-text').val() == "")
        $(this).parent().parent().find('.form-text').val($(this).children('.term-id').html());
      else
        $(this).parent().parent().find('.form-text').val($(this).parent().parent().find('.form-text').val() + ',' + $(this).children('.term-id').html());
      //Increase term count
      $(this).parent().parent().find('.terms-count .entered').html($(this).parent().parent().find('#entered-term-names-wrapper').children().length);
      // Clear what needs to be cleared.
      $(this).parent().parent().find(".term-names-input").focus();
      $(this).parent().parent().find(".term-names-input").val('');
      $(this).parent().parent().find(".term-names-input").trigger(jQuery.Event('keyup', {which: 26})); // This is a bit of trickery... I just trigger a key-up event on the input for other stuff to work
      $(this).parent().parent().find(".dropdown-term-names").html('');
      $(this).parent().parent().find(".dropdown-term-names").hide();
      navigationIndex = 0;
    });

    // Some more stuff that doesn't need anything to happen beforehand except elements to be created

    ///Mouseover on dropdown items
    $(this).parent().parent().find(".term-names-dropdown-item").hover(function() {
      $(this).css("background-color", "#ebeef0");
    },
    function() {
      $(this).css("background-color", "white");
    });

  }); // keyup

}

