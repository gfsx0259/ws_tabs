<?

    $config["js_apps"]["core.apps.auto_gallery"] = array(

        "content" => array(
            USERTYPE_ADMIN => array(
                "code" => array(
                    "auto_gallery.js",
                    "auto_gallery.std.js",
                    "auto_gallery.admin.js"
                )
            ),


            USERTYPE_CONTRIBUTOR => array(
                "code" => array(
                    "auto_gallery.js",
                    "auto_gallery.std.js"
                 )
            ),


            USERTYPE_GUEST => array(
                "code" => array(
                    "auto_gallery.js",
                    "auto_gallery.std.js"
                )
            )
        )

    )


?>