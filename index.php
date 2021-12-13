<?php get_template_part('/includes/header'); ?>

<div id="howto" class="text-white text-center py-5 px-4 position-fixed w-100 bottom-0 " style="background-color: rgba(0, 0, 0, 0.4); opacity: 0">
        <h3>Welcome</h3>
        <p>Click on the artifact name to take a closer look. Then, for more information click on the info point beside it.</p>
    </div>
    <div id="infoWindow" class="py-5 px-5 text-white">
        <button id="infoClose">x</button>
        <h1 id="infoTitle" class="PB-5"></h1>
        <hr>
        <p id="infoDisc"></p>
    </div>
    <h1 id="testmode" style="display: none;">TEST MODE</h1>
    <canvas class="webgl">
      
    </canvas>

    <button id="start" type="button" class="btn btn-light btn-lg" style="display: none;">Enter</button>
    <button id="loading" class="btn btn-light btn-lg">LOADING</button>
    <img id="goback" src="<?php bloginfo('template_directory'); ?>/src/images/turn.svg" width="100" height="100" style="display:none;">
    <div id="controls" class="controls d-none"> 
       
        <button id="pos" type="button" class="btn btn-primary btn-lg">Get pos</button>
    </div>
    <?php get_template_part('/includes/footer'); ?>