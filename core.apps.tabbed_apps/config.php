<?

    $config["js_apps"]["core.apps.tabbed_apps"] = array(

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