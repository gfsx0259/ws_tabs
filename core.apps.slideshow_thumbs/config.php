<?php

$config["js_apps"]["core.apps.slideshow_thumbs"] = array(

    'general' => array(
        'title' => 'Slideshow thumbs',
        'name' => 'slideshow_thumbs',//should be like 3th part of folder
        'version' => '1.0.0',
        'icon' => 'icon.png',
        'category' => CATEGORY_TABS_SLIDES,
        'depends' => [
            'files_manager',
            'list_editor'
        ]
    ),

    "content" => array(
        USERTYPE_ADMIN => array(
            "code" => array(
                "slideshow_thumbs.js",
                "slideshow_thumbs.admin.js"
            ),
            "templates" => array(
                "template.xml"
            )
        ),


        USERTYPE_CONTRIBUTOR => array(
            "code" => array("slideshow_thumbs.js"),
            "templates" => array(
                "template.xml"
            )
        ),


        USERTYPE_GUEST => array(
            "code" => array("slideshow_thumbs.js"),
            "templates" => array(
                "template.xml"
            )
        )
    )

);