$(document).ready( function() {
	var relaunch = ( window.location.href.indexOf( 'care-relaunch-css' ) > -1 ) ? 1 : 0;
	
	if ( relaunch ) {
		$('#products_grid_before').hide();
	}

	// rotation help-function
	$.fn.animateRotate = function(angle, duration, delay, easing, complete) {
		if ( !relaunch ) {
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
		}
	};


	// giftbox-animation
	$effect_disp_width = 0; // min. screen resolution where animation starts; 0 = on every device, 768 = no effect on mobile...

	$("body[data-rootcatid='7'] .oe_product").click( function( e ) {
		if ( !relaunch ) {
			e.preventDefault();

			$( this ).find('.wrap_wsd_1').flip( true );

			//window.parent.$("html, body").animate({ scrollTop: 0 });

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
		} else {
			e.preventDefault();
			$('#products_grid_before').show();
			var $form = $(this).find('form');
			$form.submit();
		}
	});


	// disable quick-add-to-cart-button
	$("body[data-rootcatid='7'] .quick_add_to_cart .a-submit").unbind('click');


	// activate flip-effect
	if ( ( $( window).width() > $effect_disp_width ) && !relaunch ) {
		$("body[data-rootcatid='7'] .wrap_wsd_1").flip();
	}



	// activate flip-effect on the whole tile
	$("body[data-rootcatid='7'] .oe_product_cart form").mouseenter( function() { //body[data-rootcatid='7'] .oe_product, body[data-rootcatid='7'] .oe_product section
		if ( ( $( window).width() > $effect_disp_width ) && !relaunch ) {
			$( this).find('.wrap_wsd_1').flip( true );
		}
	}).mouseleave( function() {
		if ( ( $( window).width() > $effect_disp_width ) && !relaunch ) {
			$( this).find('.wrap_wsd_1').flip( false );
		}
	});


	// close box and slide to the right on submit of the cart
	$("body[data-rootcatid='7'] .small_cart_buttons a").click( function(e) {
		if ( !relaunch ) {
			e.preventDefault();

			$('.spenden_paket_bg').css('background','transparent');
			$('.spenden_paket_bg_2').css("background-image", "url('/care_config/static/img/care_paket_geschlossen.png')")

			var timeout_animation = setTimeout( function() {
				$('.spenden_paket_bg_2').css('left','300px').css('z-index', '99');
				$('#spenden_paket_confirmed').delay(150).fadeIn();
			}, 1500);
		} else {
			e.preventDefault();
		}
		var timeout_href = setTimeout( function() {
			//window.location.href = "/shop/checkout";
			//window.location.href = "#";

			//window.parent.$("html, body").animate({ scrollTop: $('.one-page-checkout').offset().top });
			parentIFrame.scrollToOffset( 0, $('.one-page-checkout').offset().top - 25 );
			parentIFrame.sendMessage('parcel-closed');
		}, 3000);
	});
});
