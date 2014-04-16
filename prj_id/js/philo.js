$(function(){ /* to make sure the script runs after page load */
 
    $('a.read_more').click(function(event){ /* find all a.read_more elements and bind the following code to them */
 
        event.preventDefault(); /* prevent the a from changing the url */
        $(this).parents('.panel').find('.more_text').show(); /* show the .more_text span */
 
    });
 
});