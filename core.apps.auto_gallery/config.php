<?php

$config["js_apps"]["core.apps.auto_gallery"] = array(

    'general' => array(
        'title' => 'Autogallery',
        'name' => 'auto_gallery',//should be like 3th part of folder
        'version' => '1.0.0',
        'category' => CATEGORY_TABS_SLIDES,
        'depends' => ['files_manager']
    ),

    "content" => array(
        USERTYPE_ADMIN => array(
            "code" => array(
                "auto_gallery.js",
                "auto_gallery.std.js",
                "auto_gallery.admin.js"
            )
        ),


        USERTYPE_CONTRIBUTOR => array(
            "code" => array(
                "auto_gallery.js",
                "auto_gallery.std.js"
            )
        ),


        USERTYPE_GUEST => array(
            "code" => array(
                "auto_gallery.js",
                "auto_gallery.std.js"
            )
        )
    )

);