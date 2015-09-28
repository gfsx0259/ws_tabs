<?php

$config["js_apps"]["core.apps.carosel"] = array(
    'general' => array(
        'title' => 'Carousel',
        'name' => 'carosel',//should be like 3th part of folder
        'version' => '1.0.0',
        'category' => CATEGORY_TABS_SLIDES,
        'description' => '',
        'depends'=>[
            'list_editor',
            'texts_manager'
        ]
    ),
    "content" => array(
        USERTYPE_ADMIN => array(
            "code" => array(
                "carosel.js",
                "carosel.admin.js"
            ),
            "templates" => array("templates/carosel.xml")
        ),


        USERTYPE_CONTRIBUTOR => array(
            "code" => array("carosel.js"),
            "templates" => array("templates/carosel.xml")
        ),


        USERTYPE_GUEST => array(
            "code" => array("carosel.js"),
            "templates" => array("templates/carosel.xml")
        )
    )

);