<?

$config["js_apps"]["core.apps.tabbed_widgets"] = array(


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