
/*function showModal(){
   var id = '#modal';
   $(id).html('Voici ma fenetre modale<br/><a href="#" class="close">Fermer la fenetre</a>');
   
   // On definit la taille de la fenetre modale
   resizeModal();
   
   // Effet de transition     
   $('#fond').fadeIn(1000);   
   $('#fond').fadeTo("slow",0.8);
   // Effet de transition   
   $(id).fadeIn(2000);
   
   $('.popup .close').click(function (e) {
      // On désactive le comportement du lien
      e.preventDefault();
      // On cache la fenetre modale
      hideModal();
    });
}
function hideModal(){
   // On cache le fond et la fenêtre modale
   $('#fond, .popup').hide();
   $('.popup').html('');
}

function resizeModal(){
   var modal = $('#modal');
   // On récupère la largeur de l'écran et la hauteur de la page afin de cacher la totalité de l'écran
   var winH = $(document).height();
   var winW = $(window).width();
   
   // le fond aura la taille de l'écran
   $('#fond').css({'width':winW,'height':winH});
   
   // On récupère la hauteur et la largeur de l'écran
   var winH = $(window).height();
   // On met la fenêtre modale au centre de l'écran
   modal.css('top', winH/2 - modal.height()/2);
   modal.css('left', winW/2 - modal.width()/2);
}

$(document).ready(function() {
   
   // show Modal
   $('#show').click(function (e) {
      e.preventDefault();
      showModal();
   });
   
   //Hide Modal  
   $('#fond').click(function () {
      hideModal();
    });
   
   // resize Modal
   $(window).resize(function () {
      resizeModal()
   });
   
});*/

jQuery(function($){
                              
   //Lorsque vous cliquez sur un lien de la classe poplight
   $('a.poplight').on('click', function() {
      var popID = $(this).data('rel'); //Trouver la pop-up correspondante
      var popWidth = $(this).data('width'); //Trouver la largeur

      //Faire apparaitre la pop-up et ajouter le bouton de fermeture
      $('#' + popID).fadeIn().css({ 'width': popWidth}).prepend('<a href="#" class="close"><img src="close_pop.png" class="btn_close" title="Close Window" alt="Close" /></a>');
      
      //Récupération du margin, qui permettra de centrer la fenêtre - on ajuste de 80px en conformité avec le CSS
      var popMargTop = ($('#' + popID).height() + 80) / 2;
      var popMargLeft = ($('#' + popID).width() + 80) / 2;
      
      //Apply Margin to Popup
      $('#' + popID).css({ 
         'margin-top' : -popMargTop,
         'margin-left' : -popMargLeft
      });
      
      //Apparition du fond - .css({'filter' : 'alpha(opacity=80)'}) pour corriger les bogues d'anciennes versions de IE
      $('body').append('<div id="fade"></div>');
      $('#fade').css({'filter' : 'alpha(opacity=80)'}).fadeIn();
      
      return false;
   });
   
   
   //Close Popups and Fade Layer
   $('body').on('click', 'a.close, #fade', function() { //Au clic sur le body...
      $('#fade , .popup_block').fadeOut(function() {
         $('#fade, a.close').remove();  
   }); //...ils disparaissent ensemble
      
      return false;
   });

   
});