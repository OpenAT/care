/**
 * Created by mkarrer on 02.03.16.
 */
/*
jQuery('.icon_container').addClass('back');
*/
/*
jQuery('.product_item > div .oe_product_image').flip({
  axis: 'y',
  trigger: 'manual',
  reverse: true
});
*/

jQuery('.product_item > div').mouseenter(function() {
/*    jQuery(this).find('.icon_container img').show();
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
    $icon = jQuery(this).find('.icon_container img').clone();
    jQuery(this).find('.icon_container img').hide();
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
    var $zwischensumme = 0;
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
    //calculateSum();
});