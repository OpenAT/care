/**
 * Created by mkarrer on 02.03.16.
 */
/*
jQuery('.wsd-icon_container').addClass('back');
*/
/*
jQuery('.product_item > div .oe_product_image').flip({
  axis: 'y',
  trigger: 'manual',
  reverse: true
});
*/



// ////// START ALEX

$(document).ready( function() {

    // rotation help-function
    $.fn.animateRotate = function(angle, duration, delay, easing, complete) {
        return this.each(function() {
        var $elem = $(this);

        $({deg: 0}).delay(delay).animate({deg: angle}, {
            duration: duration,
            easing: easing,
            step: function(now) {
                $elem.css({
                    transform: 'rotate(' + now + 'deg)'
                });
            },
                complete: complete || $.noop
            });
        });
    };


    // giftbox-animation
    $effect_disp_width = 0; // min. screen resolution where animation starts; 0 = on every device, 768 = no effect on mobile...

    $("body[data-rootcatid='7'] .oe_product").click( function( e ) {
        e.preventDefault();

        $( this).find('section').mouseleave( function() {
            $( this ).find('.wrap_wsd_1').flip( true );
        })

        window.parent.$("html, body").animate({ scrollTop: 0 });

        if ($(window).width() > $effect_disp_width) {
            var $target = $('.spenden_paket_bg');
            var $move_old = $(this).find('.wsd-animated-giftbox');

            var $move = $move_old.clone().appendTo('body').css({
                'top': $move_old.offset().top,
                'left': $move_old.offset().left,
                'width': '70px',
                'z-index': 999,
                'position':'absolute'
            });

            var bezier_params = {
                start: {
                    x: $move_old.offset().left,
                    y: $move_old.offset().top,
                    angle: -100,
                    length: 0
                },
                end: {
                    x: $target.offset().left + 100,
                    y: $target.offset().top + 135,
                    angle: 60,
                    length: 1
                }
            }

            var $form = $(this).find('form');
            $move_old.hide();

            $move.animate({path: new $.path.bezier(bezier_params)}, 2000, function () {
                $(this).remove();

                $form.submit();

            }).animateRotate(180, 1750, 250);
        }
        else {
            $(this).find('form').submit();
        }
    });


    // disable quick-add-to-cart-button
    $("body[data-rootcatid='7'] .oe_website_sale .a-submit").unbind('click');


    // activate flip-effect
    if ( $( window).width() > $effect_disp_width ) {
        $("body[data-rootcatid='7'] .wrap_wsd_1").flip({ trigger: 'hover' });
    }



    // activate flip-effect on the whole tile
    $("body[data-rootcatid='7'] .oe_product, body[data-rootcatid='7'] .oe_product section").mouseenter( function() {
        if ( $( window).width() > $effect_disp_width )
            $( this).find('.wrap_wsd_1').flip( true );
    }).mouseleave( function() {
        if ( $( window).width() > $effect_disp_width )
            $( this).find('.wrap_wsd_1').flip( false );
    });


    // close box and slide to the right on submit of the cart
    $('.small_cart_buttons a').click( function(e) {
        e.preventDefault();

        $('.spenden_paket_bg').css('background','transparent');
        $('.spenden_paket_bg_2').css("background-image", "url('/care_config/static/img/care_paket_geschlossen.png')")

        var timeout_animation = setTimeout( function() {
            $('.spenden_paket_bg_2').css('left','300px').css('z-index', '99');
            $('#spenden_paket_confirmed').delay(150).fadeIn();
        }, 1500);

        var timeout_href = setTimeout( function() {
            //window.location.href = "/shop/checkout";
            //window.location.href = "#";

            window.parent.$("html, body").animate({ scrollTop: $('.one-page-checkout').offset().top });
        }, 3000)
    });

});






// ////// END ALEX






jQuery('.product_item > div').mouseenter(function() {
/*    jQuery(this).find('.wsd-icon_container img').show();
    jQuery(this).find('.oe_product_image').flip(true);
}).mouseleave(function() {
    jQuery(this).find('.oe_product_image').flip(false);
*/
});

jQuery('.product_item > div .submit_button a').click(function(e) {
    e.preventDefault();
    console.log('test');
});

jQuery('.product_item > div').click(function() {
/*
    $icon = jQuery(this).find('.wsd-icon_container img').clone();
    jQuery(this).find('.wsd-icon_container img').hide();
    if(jQuery(window).scrollTop() > jQuery('.spenden_paket').offset().top - jQuery('#header').height() - 20) {
        $bodyelem.animate({
            scrollTop: jQuery('.spenden_paket').offset().top - jQuery('#header').height() - 20
        }, 700);
    }

    var $animationOffsetTop = 40;
    jQuery('.spenden_paket').prepend($icon.addClass('animated_icon').css('marginLeft',(jQuery('.spenden_paket').width()/2)-($icon.width()/2)).css('marginTop',((jQuery('.spenden_paket').height())/2) + $animationOffsetTop));
    var oldTop = jQuery(this).find('.oe_product_image').offset().top - (jQuery('.spenden_paket .box_caption').height()/2) + (jQuery(this).find('.oe_product_image').height()/2) - (jQuery('.spenden_paket').offset().top + (jQuery('.spenden_paket').height()/2) + $animationOffsetTop+10);
    var oldLeft = jQuery(this).offset().left + (jQuery(this).width()/2) - (jQuery('.spenden_paket').offset().left + (jQuery('.spenden_paket').width()/2));
    $icon.css('top',oldTop).css('left',oldLeft);
    $icon.addClass('rotate');
    
    var bezier_params = {
        start: {
            x: oldLeft,
            y: oldTop,
            angle: -85
        },
        end: {
            x: 0,
            y: 0,
            angle: 85,
            length: 0.33
        }
    }

    $icon.animate({path : new jQuery.path.bezier(bezier_params)},1200);
*/
   /*var $zwischensumme = 0;
    var $tabelle = jQuery('.spenden_paket_zf tbody');
    var $spendentext = jQuery(this).find('p.left').text();
    var $spendenbetrag = +(jQuery(this).find('p.right').text().substring(2));
    var $tabellenzeile = "";
    var $box_nr = jQuery(this).children('div').attr('class');
    var $box_nr_add = '#' + $box_nr + ' input';

    if (jQuery(this).hasClass('cart')) {
        jQuery($box_nr_add).val(+(jQuery($box_nr_add).val()) + 1);
    } else {
        $tabellenzeile = '<tr class="box" id="' + $box_nr + '"><td class="td_1">' + $spendentext + '</td><td class="td_2">&#8364; ' + $spendenbetrag + '</td><td class="td_3"><input type="text" value="' + 1 + '"></td><td class="td_4"><img src="http://care.floatwork.at/wp-content/themes/floatwork_/images/close.png" alt="Close Button" /></td></tr>';
        $tabelle.append($tabellenzeile);
        jQuery(this).addClass('cart');
    }

    $zwischensumme += $spendenbetrag;
    jQuery('#spenden_paket_summe span').text($zwischensumme);
    //calculateSum();*/
});