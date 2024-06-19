(function($) {
   'use strict';

   /************* Quick view ****************/
   $.extend({
      quickview_init: function() {
         var self = this,
            $qvContainer = $('#gva-quickview'),
            $qvOverlay = $('<div class="mfp-bg gva-mfp-fade-in"></div>'),
            productId;
            self.$html = $('html');
            self.$body = $('body');
         self.$body.on('click', '.btn-quickview', function(e) {
            e.preventDefault();
            productId = $(this).data('product_id');
            
            if (productId) {
               self.$html.css('width', 'auto');
               $qvOverlay.appendTo(self.$body);
               $qvOverlay.addClass('show mfp-ready gva-loader');
               _LoadQuickView();
            }
         }); 
         
         var _LoadQuickView = function() {
            var ajaxUrl,
               data = {
                  product_id: productId
               };
            
            if (typeof wc_add_to_cart_params !== 'undefined') {
               ajaxUrl = wc_add_to_cart_params.wc_ajax_url.toString().replace('%%endpoint%%', 'inusti_ajax_load_product');
            } else {
               data['action'] = 'inusti_ajax_load_product';
            }
            
            window.gva_quickview_get_product = $.ajax({
               type: 'POST',
               url: ajaxUrl,
               data: data,
               dataType: 'html',
               cache: false,
               headers: {'cache-control': 'no-cache'},
               beforeSend: function() {
                  if (typeof window.gva_quickview_get_product === 'object') {
                     window.gva_quickview_get_product.abort();
                  }
               },
               error: function(XMLHttpRequest, textStatus, errorThrown) {
                  console.log('AJAX error - ' + errorThrown);
                  
                  self.$html.css('width', '');
                                          
                  $qvOverlay.removeClass('mfp-ready mfp-removing').remove();
               },
               success: function(data) {
                  $qvContainer.html(data);
                  
                  var $currentContainer = $qvContainer.children('#product-'+productId),
                     $productForm = $currentContainer.find('form.cart'),
                     $lastImg = $('#gva-quickview-images').find('img').last();
                     _qvShowModal();
               }
            });
         },
         
         _qvShowModal = function() {
            $.magnificPopup.open({
               mainClass: '',
               closeMarkup: '<a class="gva-close"></a>',
               removalDelay: 180,
               items: {
                  src: $qvContainer,
                  type: 'inline'
               },
               callbacks: {
                  open: function() {
                     _LoadSlider();
                     
                     $qvOverlay.one('touchstart.qv', function() {
                        $.magnificPopup.close();
                     });
                  },
                  beforeClose: function() {
                     $qvOverlay.addClass('mfp-removing');
                  },
                  close: function() {
                     self.$html.css('width', '');
                                          
                     $qvOverlay.removeClass('mfp-ready mfp-removing').remove(); 
                  }
               }
            });
         },
         
         /* Function: Re-init slider */
         _LoadSlider = function() {
            $("#gva-quickview-images").owlCarousel({
               singleItem : true,
               loop: false,
               nav: true, 
               items: 1,
               autoplay: false,
               autoplayTimeout: 5000,
               autoplayHoverPause: true,
               navText: [ '<span><i class="las la-arrow-left"></i></span>', '<span><i class="las la-arrow-right"></i></span>' ],
            });
         };
      }
   });

   var scrollToTop = function() {
      var scrollTo = $('#wp-main-content').offset().top - 100;
      $('html, body').stop().animate({
         scrollTop: scrollTo
      }, 400);
   };

   $(window).load(function(){
      $.quickview_init();
      $(document).on('click', '.minicart-close', function(e){
         e.preventDefault();
         $(this).parents('.cart').removeClass('open');
      })
   });
   
})(jQuery);
