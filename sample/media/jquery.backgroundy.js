/*
BackgroundY v0.5beta
Plugin developed by: Paun Narcis
http://1web.ro/backgroundy/
Released under the GPL license:
http://www.gnu.org/licenses/gpl.html
*/
(function ($) {
    $.fn.extend({
        backgrounder: function (options) {
            var _this = this;
			var defaults = {
                loadingtext: 'Loading image ...',
                loadingimage: '/media/loading.gif',
                wrapperclass: 'bg-wrapper',
				imgpath: '/media/',
				imgs: ['img-bg1.jpg','img-bg2.jpg','img-bg3.jpg'],
				imgsaspectratio: 1.777777777777778, //16:9 image assumed
				interval: 7000,
				zindexbase: 3,
				easing: 'linear',
			    eventcrossfade: function(){}
            }
            var o = $.extend({},defaults, options);
			o.zindexfront=o.zindexbase+1;
            var $context = $('#'+o.wrapperclass);
			var innerSpace = { w: 0, h: 0 };
			var bgPadCurrentNo = bgCurrentNo = 1;
			var intID_01 = '';

			function prepareDOM(){
				var html = '<div id="' + o.wrapperclass + '"><div id="bg-pad1" style="top: 0px; left:0px; display: none; z-index: ' + o.zindexfront + ';" class="bg-pad"><img src="' + o.imgpath + o.imgs[0] +'" id="bg-img1" width="100%"></div><div id="bg-pad2" style="top: 0px; left: 0px; z-index: ' + o.zindexbase + '; display: none;" class="bg-pad"><img src="' + o.imgpath + o.imgs[0] + '" id="bg-img2" width="100%"></div></div>';
				$('body').prepend(html);
			};
			slide = function() {
				var r=bgCurrentNo;
				while (r==bgCurrentNo) { //prevent generating same no again and again
					r=Math.floor(Math.random()*o.imgs.length);
				}
				bgCurrentNo=r;
				loadReqBG(bgCurrentNo);
			}
			function loadReqBG(num) {
				$('#bg-pad'+bgPadCurrentNo).hide();
				//$('#loading').show();
				$('#bg-img'+bgPadCurrentNo).attr('src', o.imgpath + o.imgs[num]);
			}
			function onloadCrossFadeBG() {
				if (bgPadCurrentNo==1) {
					$('#bg-pad1').css('z-index',o.zindexfront);
					$('#bg-pad2').css('z-index',o.zindexbase);
					$('#bg-pad'+bgPadCurrentNo).fadeIn(700);
					bgPadCurrentNo=2;
				} else {
					$('#bg-pad1').css('z-index',o.zindexbase);
					$('#bg-pad2').css('z-index',o.zindexfront);
					$('#bg-pad'+bgPadCurrentNo).fadeIn(700);
					bgPadCurrentNo=1;
				}
				if (o.eventcrossfade !== undefined) {
					o.eventcrossfade.call();
				}
			}
			function getInnerSpace() {
				var w = 0, h = 0;
				if ((typeof(window.innerWidth) == 'number') && (typeof(window.innerHeight) == 'number')) {
					//Non-IE
					w = window.innerWidth;
					h = window.innerHeight;
				} else if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
					//IE 6+ in 'standards compliant mode'
					w = document.documentElement.clientWidth;
					h = document.documentElement.clientHeight;
				} else if (document.body && (document.body.clientWidth || document.body.clientHeight)) {
					//IE 4 compatible
					w = document.body.clientWidth;
					h = document.body.clientHeight;
				};
				return {w: w,h: h};
			}
			function onWindowResize( event ) {
				innerSpace = getInnerSpace();
				var refH = innerSpace.h;
				var newH = innerSpace.w/o.imgsaspectratio;
					if (newH>=refH) {
						$(".bg-pad").width(innerSpace.w);
						$(".bg-pad").height(newH);
						$(".bg-pad").css({'top' : -((newH/2)-(refH/2)), 'left' : '0'});
					};
					if (newH<refH) {
						$(".bg-pad").width(refH * o.imgsaspectratio);
						$(".bg-pad").height(refH);
						$(".bg-pad").css({'top' : '0', 'left' : -(((refH * o.imgsaspectratio)/2)-(innerSpace.w/2))});
					};
			}
            function init() {
				prepareDOM();
				//so it shall work in IE8 too
				if (!window.addEventListener) {
					window.attachEvent("onresize", onWindowResize);
				}
				else {
					window.addEventListener('resize', onWindowResize, false );
				}
				onWindowResize();
				slide;
				$('#bg-img1').load(function() {
					onloadCrossFadeBG();
				});
				$('#bg-img2').load(function() {
					onloadCrossFadeBG();
				});
				intID_01 = setInterval(slide, o.interval);
            }
			init();

			$.fn.backgrounder.stop = function(){
				intID_01 = clearInterval(intID_01);
			return _this;	
			}
			$.fn.backgrounder.start = function(){
				intID_01 = setInterval(slide, o.interval);
			return _this;
			}
		return this;
		}
    });
})(jQuery);