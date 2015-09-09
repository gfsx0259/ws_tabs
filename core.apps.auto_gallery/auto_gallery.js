core.apps.auto_gallery = function(args) {

    this.defaultProfile = {
        title: "",
        app_style: "",
        keywords: "",
        popup: false,
        cols: 2,
        spacing: 1,
        image_height: 100,
        variable_content: false,
        hide_if_empty: true
    };


//    this.theme_style_key = "image_gallery";

};


core.apps.auto_gallery.prototype = {


    onOpen: function() {
        this.setTitle(this.profile["title"]);
        this.$["window"].style.overflow = "hidden";
        this.refresh();
    },


    refresh: function() {
        if(this.profile["variable_content"]) {
            this.images = [];
            if(core.data.variable_content.images) {
                for(var i=0; i<core.data.variable_content.images.length; i++) {
                    this.images.push(core.data.variable_content.images[i].file);
                }
                this.callFunction("renderGallery");
            } else if(core.usertype < USERTYPE_ADMIN && this.profile["hide_if_empty"]) {
                this.hideElement("window");
            }
        } else if(this.profile["keywords"] == "") {
            this.images = [];
            this.callFunction("renderGallery");
        } else {
            var p = {
                dialog: "files",
                act: "search_images",
                q: this.profile["keywords"]
            };
            core.transport.send("/controller.php", p, this.onSearchImagesResponce.bind(this));
        }
    },



    onSearchImagesResponce: function(r) {
        if(!r || r.status != "search_images_result") {
            return false;
        }
        this.images = r.data;
        this.callFunction("renderGallery");
    }


};
core.apps.auto_gallery.extendPrototype(core.components.html_component);
core.apps.auto_gallery.extendPrototype(core.components.desktop_app);