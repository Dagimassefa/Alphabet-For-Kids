var $main = $('.page-container'),
	$pages = $main.children('div.page'),
	animcursor = 1,
	pagesCount = $pages.length,
	current = 0,
	isAnimating = false,
	endCurrPage = false,
	endNextPage = false,
	animEndEventNames = {
		'WebkitAnimation' : 'webkitAnimationEnd',
		'OAnimation' : 'oAnimationEnd',
		'msAnimation' : 'MSAnimationEnd',
		'animation' : 'animationend'
	},
	animEndEventName = animEndEventNames[ Modernizr.prefixed( 'animation' ) ],
	support = Modernizr.cssanimations,
	canvas = document.getElementById('mainCanvas');
context = canvas.getContext('2d');
window.addEventListener('resize', resizeCanvas, false);
resizeCanvas();
$pages.each(function() {
	var $page = $(this);
	$page.data('originalClassList', $page.attr('class'));
});
$pages.eq(current).addClass('page-current');
$('.help').click(function() {
	$('.rightMenu').toggleClass('active');
});
$('.hinter').click(function() {
	$('#mainCanvas').clearCanvas();
	$('.hint').text($(this).text());
	$('.hint-audio').text($(this).data('audio'));
	$('a.hinter').removeClass("active");
	$(this).addClass("active");
});
$('.tools').click(function() {
	$('a.tools').removeClass("active");
	$(this).addClass("active");
});
$('.nav').click(function() {
	$('#mainCanvas').clearCanvas();
	nextPage($(this).data('animation'));
});
$('.eraser').click(function() {
	$('#mainCanvas').clearCanvas();
});
$('#backbutton').on('swiperight', function(e) {
	$('.page-2 .toolbar').toggleClass('active');
}).on('swipeleft', function(e) {
	$('.page-2 .list').toggleClass('active');
})
$('#speakbutton').click(function() {
	speak($('.page-2 .hint-audio').text(), {
		noWorker: true
	});
})

// Functions
function resizeCanvas() {
	var width = document.width
	var height = document.height
	canvas.width = width;
	canvas.height = height;
	$('#mainCanvas').sketch({
		defaultColor: "#e74c3c",
		defaultSize: 15
	});
};
function nextPage(animation) {
	if(isAnimating) {
		return false;
	}
	isAnimating = true;
	var $currPage = $pages.eq(current);
	if(current < pagesCount - 1) {
		++current;
	}
	else {
		current = 0;
	}
	var $nextPage = $pages.eq(current).addClass('page-current'),
		outClass = '', inClass = '';
	switch(animation) {
		case 1:
			outClass = 'page-moveToTopFade';
			inClass = 'page-moveFromBottomFade';
			break;
		case 2:
			outClass = 'page-moveToBottomFade';
			inClass = 'page-moveFromTopFade';
			break;
	}
	$currPage.addClass(outClass).on(animEndEventName, function() {
		$currPage.off(animEndEventName);
		endCurrPage = true;
		if(endNextPage) {
			onEndAnimation($currPage, $nextPage);
		}
	});
	$nextPage.addClass(inClass).on(animEndEventName, function() {
		$nextPage.off(animEndEventName);
		endNextPage = true;
		if(endCurrPage) {
			onEndAnimation($currPage, $nextPage);
		}
	});
	if(!support) {
		onEndAnimation($currPage, $nextPage);
	}
};
function onEndAnimation($outpage, $inpage) {
	endCurrPage = false;
	endNextPage = false;
	resetPage($outpage, $inpage);
	isAnimating = false;
};
function resetPage($outpage, $inpage) {
	$outpage.attr('class', $outpage.data('originalClassList'));
	$inpage.attr('class', $inpage.data('originalClassList') + ' page-current');
};