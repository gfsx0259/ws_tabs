<?

    $config["js_apps"]["core.apps.accordion_apps"] = array(

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