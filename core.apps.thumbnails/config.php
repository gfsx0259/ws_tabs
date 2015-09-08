<?

    $config["js_apps"]["core.apps.thumbnails"] = array(

        "content" => array(
            USERTYPE_ADMIN => array(
                "code" => array(
                    "thumbnails.js",
                    "thumbnails.admin.js"
                ),
                "templates" => array("thumbnails.xml")
            ),


            USERTYPE_CONTRIBUTOR => array(
                "code" => array("thumbnails.js"),
                "templates" => array("thumbnails.xml")
            ),


            USERTYPE_GUEST => array(
                "code" => array("thumbnails.js"),
                "templates" => array("thumbnails.xml")
            )
        )

    )


?>