<?

    $config["js_apps"]["core.apps.slideshow_thumbs"] = array(

        "content" => array(
            USERTYPE_ADMIN => array(
                "code" => array(
                    "slideshow_thumbs.js",
                    "slideshow_thumbs.admin.js"
                ),
                "templates" => array(
                    "template.xml"
                )
            ),


            USERTYPE_CONTRIBUTOR => array(
                "code" => array("slideshow_thumbs.js"),
                "templates" => array(
                    "template.xml"
                )
            ),


            USERTYPE_GUEST => array(
                "code" => array("slideshow_thumbs.js"),
                "templates" => array(
                    "template.xml"
                )
            )
        )

    )


?>