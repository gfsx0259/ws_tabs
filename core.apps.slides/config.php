<?

    $config["js_apps"]["core.apps.slides"] = array(

        "content" => array(
            USERTYPE_ADMIN => array(
                "code" => array(
                    "slides.js",
                    "slides.admin.js"
                )
            ),


            USERTYPE_CONTRIBUTOR => array(
                "code" => array("slides.js")
            ),


            USERTYPE_GUEST => array(
                "code" => array("slides.js")
            )
        )

    )


?>