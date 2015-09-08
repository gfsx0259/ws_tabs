<?

    $config["js_apps"]["core.apps.carosel"] = array(

        "content" => array(
            USERTYPE_ADMIN => array(
                "code" => array(
                    "carosel.js",
                    "carosel.admin.js"
                ),
                "templates" => array("templates/carosel.xml")
            ),


            USERTYPE_CONTRIBUTOR => array(
                "code" => array("carosel.js"),
                "templates" => array("templates/carosel.xml")
            ),


            USERTYPE_GUEST => array(
                "code" => array("carosel.js"),
                "templates" => array("templates/carosel.xml")
            )
        )

    )


?>