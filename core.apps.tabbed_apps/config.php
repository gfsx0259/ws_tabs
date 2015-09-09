<?

$config["js_apps"]["core.apps.tabbed_apps"] = array(

    'general' => array(
        'title' => 'Tabbed widgets',
        'name' => 'tabbed_apps',//should be like 3th part of folder
        'version' => '1.0.0',
        'icon' => 'icon.png',
        'category' => CATEGORY_TABS_SLIDES,
        'description' => '',
        'depends' => [
            'files_manager',
            'list_editor'
        ]
    ),


    "content" => array(
        USERTYPE_ADMIN => array(
            "code" => array(
                "tabbed_apps.js",
                "tabbed_apps.admin.js"
            ),
            "templates" => array(
                "templates/tabbed_apps.xml"
            )
        ),

        USERTYPE_GUEST => array(
            "code" => array(
                "tabbed_apps.js"
            ),
            "templates" => array(
                "templates/tabbed_apps.xml"
            )
        )
    )

)
?>