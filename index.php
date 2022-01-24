<?php get_template_part('/includes/header'); ?>

<div id="menuButton" class="nav-icon-wrapper" style="opacity: 0;">
    <div class="icon nav-icon">
        <span></span>
        <span></span>
        <span></span>
    </div>
</div>
<div id="infoButton" class="nav-icon-wrapper infoButton" style="opacity: 0;">
    <div class="icon nav-icon">
        <h1 id="lookAt">I</h1>
        <img class="infoButton" src="<?php bloginfo('template_directory'); ?>/src/images/info.svg" width="300" alt="How to">
    </div>
</div>
<div id="howToWindow" class="howto welcome" style="display: none;">
    <p class="mb-4 h1">How to</p>
    <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur,</p>
    <button id="enterGallery">GOT IT</button>
    <button id="closeHowTo" style="display: none;">GOT IT</button>
</div>
<div id="menu" class="menu" style="display: none;">
    <div class="menu__inner">
        <div class="container">
            <div class="menu__innerTop blackBack">
                <div class="menu__innerTop__text">
                    <h2 class="text-white">Quick menu</h2>
                </div>
            </div>
            <div class="menu__innerBottom">
                <div class="row">
                    <ul id="menuItems">
                    </ul>
                    <div class="col-9 text-white">
                        BSL video <br>
                        color blind friendly
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<div id="welcomeScreen" class="welcomeScreen">
    <div id="welcomeScreenInner" class="welcomeScreen__inner">
        <div class="container">
            <div class="welcomeScreen__innerTop blackBack">
                <div class="welcomeScreen__innerTop__text">
                    <h4 class="text-white">Welcome</h4>
                    <h1 class="text-white display-1 pb-0 mb-0">Paralympic Heritage Virtual Exhibition</h1>
                </div>
            </div>
            <div class="welcomeScreen__innerBottom">
                <div class="row">
                    <div class="col-9 text-white">
                        BSL video <br>
                        color blind friendly
                    </div>
                    <div class="col-12 col-md-3 text-right mt-5 mt-md-0">
                        <button id="start" class="yellowBack" style="display: none;">Enter</button>
                        <button id="loading" class="yellowBack">Loading...</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div id="welcomeScreenFooter"  class="welcomeScreen__footer py-4">
        <div class="container">
            <img class="logo" src="<?php bloginfo('template_directory'); ?>/src/images/logo.svg" width="300" alt="National paralympic heritage trust logo">
        </div>
    </div>
</div>

<div id="infoWindow" class="infoWindow  text-black">
    <div class="pb-5 px-5" style="min-height: calc(100vh - 156px)">
        <div class="infoWindow__infoTitleBox">
            <button class="infoWindow__close" id="infoClose">x</button>
            <h1 id="infoTitle" class="pb-0 mb-0 text-capitalize"></h1>
        </div>
        <div class="infoWindow__content" id="infoDisc">
        </div>
    </div>
    <div id="infoWindow__footer" class="infoWindow__footer">
        <div class="infoWindow__footer__next blackBack py-4 px-5"">
            <p class=" text-muted mb-0">Jump to next story</p>
            <h4 id="nextStory" class="text-white"></h4>
            <span class="ring"></span>
        </div>
    </div>
</div>
<h1 id="testmode" style="display: none;">TEST MODE</h1>

<!-- three canvas -->
<canvas id="mainCanvas" class="webgl">
</canvas>


<!-- nav buttons -->
<span id="goback" style="display: none"></span>
<span id="lookAround" style="display: none"></span>
<span id="left" style="transform: scaleX(-1); display: none"></span>
<span id="right" style="display: none"></span>

<div id="controls" class="controls d-none"></div>
</body>
<?php get_template_part('/includes/footer'); ?>