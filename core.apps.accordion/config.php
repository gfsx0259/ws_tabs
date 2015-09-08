<?

    $config["js_apps"]["core.apps.accordion"] = array(

        "content" => array(
            USERTYPE_ADMIN => array(
                "code" => array(
                    "accordion.js",
                    "accordion.admin.js"
                )
            ),


            USERTYPE_CONTRIBUTOR => array(
                "code" => array("accordion.js")
            ),


            USERTYPE_GUEST => array(
                "code" => array("accordion.js")
            )

        )

    )


?>