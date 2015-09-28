<?php

$config["js_apps"]["core.apps.tabbed_texts"] = array(

    'general' => array(
    'title' => 'Tabbed texts',
    'name' => 'tabbed_texts',//should be like 3th part of folder
    'version' => '1.0.0',
    'category' => CATEGORY_TABS_SLIDES,
    'description' => '',
        'depends' => [
            'texts_manager',
            'list_editor'
        ]
    ),

    "content" => array(
        USERTYPE_ADMIN => array(
            "code" => array(
                "tabbed_texts.js",
                "tabbed_texts.admin.js"
            ),
            "templates" => array("templates/tabbed_texts.xml")
        ),


        USERTYPE_CONTRIBUTOR => array(
            "code" => array(
                "tabbed_texts.js",
                "tabbed_texts.contributor.js"
            ),
            "templates" => array("templates/tabbed_texts.xml")
        ),


        USERTYPE_GUEST => array(
            "code" => array("tabbed_texts.js"),
            "templates" => array("templates/tabbed_texts.xml")
        )
    )

);