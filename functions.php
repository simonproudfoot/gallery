<?php

if( function_exists('acf_add_options_page') ) {
	
	acf_add_options_page(array(
		'page_title' 	=> 'Gallery Items',
		'menu_title'	=> 'Gallery Items',
    'post_id' => 'acf-options-gallery',
		'menu_slug' 	=> 'gallery-items',
		'capability'	=> 'edit_posts',
		'redirect'		=> false
	));

  
  function my_myme_types($mime_types){
    $mime_types['glb'] = 'file/glb+xml'; //Adding glb extension
    return $mime_types;
}
add_filter('upload_mimes', 'my_myme_types', 1, 1);

//wp-json/acf/v3/options/acf-options-gallery
@ini_set( 'upload_max_size' , '64M' );
@ini_set( 'post_max_size', '64M');
@ini_set( 'max_execution_time', '300' );

function acf_to_rest_api($response, $post, $request) {
  if (!function_exists('get_fields')) return $response;

  if (isset($post)) {
      $acf = get_fields($post->id);
      $response->data['acf'] = $acf;
  }
  return $response;
}
add_filter('rest_prepare_post', 'acf_to_rest_api', 10, 3);



add_filter( 'ai1wm_exclude_themes_from_export',
function ( $exclude_filters ) {
  $exclude_filters[] = 'npht/node_modules';
  return $exclude_filters;
} );



/* ==========================================================================
    Required
  ========================================================================== */ 
  // allow the title tag in theme
  add_theme_support( 'title-tag' );

  // queue required assets
  function queue_theme_assets() {
    
    wp_enqueue_script( 'script-bundle', get_template_directory_uri() . '/dist/bundle.js', array(), rand(), true );
    wp_enqueue_style( 'style-bundle', get_template_directory_uri() . '/dist/main.css', array(), rand(), null );

    // wp_enqueue_style( 'bootstrap-cdn-css', 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css' );
  };
  add_action( 'wp_enqueue_scripts', 'queue_theme_assets' );



}