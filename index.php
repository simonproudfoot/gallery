<?php get_template_part('/includes/header'); ?>
<div id="menuButton" class="nav-icon-wrapper">
    <div class="icon nav-icon">
        <span></span>
        <span></span>
        <span></span>
    </div>
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
    <div class="welcomeScreen__inner">
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
                    <div class="col-md-3 col-12 text-right mt-5 mt-md-0">
                        <button id="start" class="yellowBack">Enter</button>
                        <button id="loading" class="yellowBack">Loading...</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="welcomeScreen__footer py-4 mt-5">
        <div class="container">
            <img class="logo" src="/images/logo.svg" width="300" alt="National paralympic heritage trust logo">
        </div>
    </div>
</div>
<div id="infoWindow" class="infoWindow pb-5 px-5 text-black">
    <div class="infoWindow__infoTitleBox">
        <button class="infoWindow__close" id="infoClose">x</button>
        <h1 id="infoTitle" class="pb-0 mb-0 text-capitalize"></h1>
    </div>
    <div class="infoWindow__content" id="infoDisc">
        <p></p>
    </div>
    <div id="infoWindow__footer" class="infoWindow__footer blackBack">
        <p class="text-light">Jump to next story</p>
        <h4 id="nextStory" class="text-white"></h4>
    </div>
</div>
<h1 id="testmode" style="display: none;">TEST MODE</h1>
<canvas class="webgl">
</canvas>
<img id="goback" src="<?php bloginfo('template_directory'); ?>/src/images/turn.svg" width="100" height="100" style="display:none;">
<button id="left" style="display: none;">L</button>
<button id="right" style="display: none;">R</button>
<div id="controls" class="controls d-none">
    {{# <button id="pos" type="button" class="btn btn-primary btn-lg">Get pos</button> #}}
</div>
</body>
<?php get_template_part('/includes/footer'); ?>