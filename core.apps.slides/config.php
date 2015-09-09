<?php

$config["js_apps"]["core.apps.slides"] = array(

    'general' => array(
        'title' => 'Image & Text Slides',
        'name' => 'slides',//should be like 3th part of folder
        'version' => '1.0.0',
        'icon' => 'icon.png',
        'category' => CATEGORY_TABS_SLIDES,
        'description' => '',
        'depends' => [
            'texts_manager',
            'files_manager',
            'list_editor'
        ]
    ),


    "content" => array(
        USERTYPE_ADMIN => array(
            "code" => array(
                "slides.js",
                "slides.admin.js"
            )
        ),


        USERTYPE_CONTRIBUTOR => array(
            "code" => array("slides.js")
        ),


        USERTYPE_GUEST => array(
            "code" => array("slides.js")
        )
    )

);