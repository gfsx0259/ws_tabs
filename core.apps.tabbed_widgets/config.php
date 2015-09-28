<?php

$config["js_apps"]["core.apps.tabbed_widgets"] = array(

    'general' => array(
        'title' => 'Tabbed widgets',
        'name' => 'tabbed_widgets',//should be like 3th part of folder
        'version' => '1.0.0',
        'category' => CATEGORY_HIDDEN,
        'description' => '',
    ),


    "content" => array(
        USERTYPE_ADMIN => array(
            "code" => array(
                "tabbed_widgets.js",
                "tabbed_widgets.admin.js"
            ),
            "templates" => array("templates/tabbed.xml")
        ),


        USERTYPE_CONTRIBUTOR => array(
            "code" => array("tabbed_widgets.js"),
            "templates" => array("templates/tabbed.xml")
        ),


        USERTYPE_GUEST => array(
            "code" => array("tabbed_widgets.js"),
            "templates" => array("templates/tabbed.xml")
        )
    )

)


?>