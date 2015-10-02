<?php

$config["js_apps"]["core.apps.thumbnails"] = array(

    'general' => array(
        'title' => 'Thumbnails',
        'name' => 'thumbnails',//should be like 3th part of folder
        'version' => '1.0.0',
        'category' => CATEGORY_TABS_SLIDES,
        'description' => '',
        'depends'=>[
            'ecommerce/ecommerce_category',
            'ecommerce/ecommerce',
            'core/list_editor'
        ]
    ),

    "content" => array(
        USERTYPE_ADMIN => array(
            "code" => array(
                "thumbnails.js",
                "thumbnails.admin.js"
            ),
            "templates" => array("thumbnails.xml")
        ),


        USERTYPE_CONTRIBUTOR => array(
            "code" => array("thumbnails.js"),
            "templates" => array("thumbnails.xml")
        ),


        USERTYPE_GUEST => array(
            "code" => array("thumbnails.js"),
            "templates" => array("thumbnails.xml")
        )
    )

);