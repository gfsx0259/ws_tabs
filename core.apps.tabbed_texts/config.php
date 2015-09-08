<?

    $config["js_apps"]["core.apps.tabbed_texts"] = array(

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

    )
?>