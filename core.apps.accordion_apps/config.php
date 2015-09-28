<?

$config["js_apps"]["core.apps.accordion_apps"] = array(

    'general' => array(
        'title' => 'Accordion widgets',
        'name' => 'accordion_apps',//should be like 3th part of folder
        'version' => '1.0.0',
        'category' => CATEGORY_TABS_SLIDES,
        'description' => 'Allow use any widgets inside the Accordion',
        'depends' => [
            'list_editor'
        ]
    ),

    "content" => array(
        USERTYPE_ADMIN => array(
            "code" => array(
                "accordion_apps.js",
                "accordion_apps.admin.js"
            )
        ),


        USERTYPE_CONTRIBUTOR => array(
            "code" => array("accordion_apps.js")
        ),


        USERTYPE_GUEST => array(
            "code" => array("accordion_apps.js")
        )
    )

)


?>