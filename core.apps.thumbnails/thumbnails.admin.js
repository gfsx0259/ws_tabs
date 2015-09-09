core.apps.thumbnails.extendPrototype({

    compatible_apps: [
        "slideshow",
        "image_gallery",
        "slideshow_thumbs"
    ],


    onFirstRun: function() {
        this.showSettings();
        this.openThumbnailsManager(true);
    },

    // settings

    settingsBlocks: [
        { title: "Misc:",
          controls: [
            { tag: "wsc_checkbox", title: "Open links in new page", id: "inp_new_page" },
              { tag: "wsc_checkbox", title: "Enable scrolling", id:"inp_enable_scrolling"},
              { tag: "wsc_checkbox", title: "Enable automatically scrolling", id:"inp_enable_auto_scroll"},
              { tag: "wsc_checkbox", title: "Use list of featured products", id:"inp_use_featured_list"},
              { tag: "wsc_checkbox", title: "Stop on hover", id:"inp_stop_hover"},

                      { tag: "wsc_slider", id: "inp_speed",
                          options: [
                              { text: "1 sec", value: "1" },
                              { text: "2 sec", value: "2" },
                              { text: "3 sec", value: "3" },
                              { text: "5 sec", value: "5" },
                              { text: "10 sec", value: "10" },
                              { text: "15 sec", value: "15" },
                              { text: "20 sec", value: "20" },
                              { text: "30 sec", value: "30" },
                              { text: "45 sec", value: "45" },
                              { text: "1 min", value: "60" }
                          ]}

          ]},

        { title: "Thumbnails:",
            controls: [
                { tag: "a", events: { onclick: "openThumbnailsManager" },
                    html: "Manage thumbnails" }
            ]}
    ],


    fillSettingsForm: function() {
        this.$["inp_new_page"].setChecked(this.profile["new_page"] == 1);
        this.$["inp_enable_scrolling"].setChecked(this.profile["enable_scrolling"] == 1);
        this.$["inp_enable_auto_scroll"].setChecked(this.profile["enable_auto_scroll"] == 1);
        this.$["inp_use_featured_list"].setChecked(this.profile["use_featured_list"] == 1);
        this.$["inp_stop_hover"].setChecked(this.profile["stop_hover"] == 1);
        this.$["inp_speed"].setValue(this.profile["speed"]);
    },


    processSettingsForm: function() {
        this.profile["new_page"] = this.$["inp_new_page"].checked ? 1 : 0;
        this.profile["enable_scrolling"] = this.$["inp_enable_scrolling"].checked ? 1 : 0;
        this.profile["enable_auto_scroll"] = this.$["inp_enable_auto_scroll"].checked ? 1 : 0;
        this.profile["use_featured_list"] = this.$["inp_use_featured_list"].checked ? 1 : 0;
        this.profile["stop_hover"] = this.$["inp_stop_hover"].checked ? 1 : 0;
        this.profile["speed"] = this.$["inp_speed"].value;
    },


    onSettingsUpdated: function() {
        if(this.profile["use_featured_list"] == 1){
            this.getFeaturedList();
        }else{
            this.refresh();
        }

    },



    // thumbnails list 
    openThumbnailsManager: function(flag) {

        core.values.list_editor = {
            popup_title: "Thumbnails manager",
            list: this.getItemsList(),
            callback: this.setItemsList.bind(this),
            add_action: "select_file",
            auto_add: flag === true,
            default_item: {
                title: "Thumb",
                file: "",
                alt: "",
                url: ""
            },
            labels: {
                title: "Title:",
                file: "Picture:",
                alt: "Alt attribute",
                url: "URL:"
            },
            add_action: "select_file",
            files_filter: "pictures",
        };
        desktop.showPopupApp("list_editor");
    },




    // sys

    getUsedImages: function() {
        var res = [];
        for(var i=0; i<this.profile.items.length; i++) {
            var img = this.profile.items[i];
            if(img) {
                res.push({ file: img.pic, title: img.alt || "" });
            }
        }
        return res;
    },



    // data

    getItemsList: function() {
        var p = this.profile;
        var list = [];

        for(var i=0; i<p.items.length; i++) {
            list.push({
                title: p.items[i].title,
                file: p.items[i].pic,
                url: p.items[i].url,
                alt: p.items[i].alt || ""
            });
        }
        return list;
    },


    setItemsList: function(list) {
        var p = this.profile;
        p.items = [];
        for(var i=0; i<list.length; i++) {
            var l = list[i];
            p.items[i] = {
                title: l.title,
                url: l.url,
                pic: l.file,
                alt: l.alt
            }
        }
    },




    getCompatibleData: function() {
        var p = this.profile;
        var res = {
            title: p.title,
            list: this.getItemsList()
        };
        return res;
    },


    setCompatibleData: function(data) {
        for(var k in data) {
            if(k == "list") {
                this.setItemsList(data[k]);
            } else {
                this.profile[k] = data[k];
            }
        }
    }

});