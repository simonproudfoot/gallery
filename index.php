<?php get_template_part('/includes/header'); ?>
<div id="infoWindow" class="py-5 px-5 text-white">
    <h1 id="infoTitle" class="PB-5"></h1>
    <hr>
    <p id="infoDisc"></p>
</div>
<h1 id="testmode" style="display: none;">TEST MODE</h1>
<canvas class="webgl">
    <h1 id="loading">Loading...</h1>
</canvas>
<div id="controls" class="controls">
    <button id="start" type="button" class="btn btn-primary btn-lg" style="display: none;">Enter</button>
    <button id="goback" type="button" class="btn btn-primary btn-lg" style="display: none;">Go Back</button>
    <button id="pos" type="button" class="btn btn-primary btn-lg">Get pos</button>
</div>
<?php get_template_part('/includes/footer'); ?>