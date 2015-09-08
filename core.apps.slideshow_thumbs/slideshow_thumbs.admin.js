core.apps.slideshow_thumbs.extendPrototype({

    compatible_apps: [
        "slideshow",
        "image_gallery",
        "thumbnails"
    ],


    resize_params: {
        min_height: 50,
        callback_name: "onHeightChange"
    },


    settingsBlocks: [
        { title: "Content:",
          primary: true,
          controls: [
            { tag: "wsc_checkbox", title: "Variable content", id: "inp_variable_content" },
            { tag: "wsc_checkbox", title: "Hide if empty", id: "inp_hide_if_empty" }
          ]},

        { title: "Images:",
          controls: [
            { tag: "a", events: { onclick: "openListManager" },
              html: "Manage images" }
          ]}
    ],



    fillSettingsForm: function() {
        this.$["inp_variable_content"].setChecked(this.profile["variable_content"]);
        this.$["inp_hide_if_empty"].setChecked(this.profile["hide_if_empty"]);
    },



    processSettingsForm: function() {
        this.profile["variable_content"] = this.$["inp_variable_content"].checked;
        this.profile["hide_if_empty"] = this.$["inp_hide_if_empty"].checked;
    },


    onSettingsUpdated: function() {
        this.refresh();
    },


    
    // slides list

    openListManager: function() {
        core.values.list_editor = {
            popup_title: "Images",
            list: clone(this.profile["items"]),
            callback: this.onListChanged.bind(this),
            default_item: {
                file: "",
                alt: ""
            },
            labels: {
                file: "Image:",
                alt: "Alt attribute:"
            },
            add_action: "select_file",
            files_filter: "pictures"
        }
        desktop.showPopupApp("list_editor");
    },


    onListChanged: function(list) {
        this.profile["items"] = list;
    },




    // sys

    getUsedImages: function() {
        var l = this.profile["items"];
        var res = [];
        for(var i=0; i<l.length; i++) {
            if(l[i]) {
                res.push({ file: l[i].file, title: l[i].alt || "" });
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
                title: p.items[i].alt || "",
                file: p.items[i].file,
                url: "",
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
                file: l.file,
                alt: l.alt
            }
        }
    },




    getCompatibleData: function() {
        var p = this.profile;
        var res = {
            title: p.title,
            list: this.getItemsList()
        }
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