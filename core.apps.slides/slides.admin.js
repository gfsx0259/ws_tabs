core.apps.slides.extendPrototype({


    resize_params: {
        target_element: "boxes",
    },


    onFirstRun: function() {
        this.showSettings();
        this.openSlidesManager(true);
    },


    settingsBlocks: [
        { title: "Interval:", 
          controls: [
            { tag: "wsc_slider", id: "inp_interval",
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


        { title: "Text effect:", 
          controls: [
            { tag: "wsc_select", id: "inp_text_effect", 
              options: [
                { text: "Fade", value: "fade" },
                { text: "Scroll vertical", value: "scroll_vertical" },
                { text: "Scroll horizontal", value: "scroll_horizontal" },
                { text: "None", value: "none" }
              ]}
          ]},


        { title: "Image effect:", 
          controls: [
            { tag: "wsc_select", id: "inp_image_effect", 
              options: [
                { text: "Fade", value: "fade" },
                { text: "Scroll vertical", value: "scroll_vertical" },
                { text: "Scroll horizontal", value: "scroll_horizontal" },
                { text: "None", value: "none" }
              ]}
          ]},


        { title: "Slides:",
          controls: [
            { tag: "a", events: { onclick: "openSlidesManager" },
              html: "Manage slides" }
          ]},


        { title: "Misc:", 
          controls: [
            { tag: "wsc_checkbox", title: "Show navigation", id: "inp_navigation" }
          ]}
    ],



    fillSettingsForm: function() {
        this.$["inp_interval"].setValue(this.profile["interval"]);
        this.$["inp_text_effect"].setValue(this.profile["text_effect"]);
        this.$["inp_image_effect"].setValue(this.profile["image_effect"]);
        this.$["inp_navigation"].setChecked(this.profile["navigation"]);
    },



    processSettingsForm: function() {
        this.profile["interval"] = this.$["inp_interval"].value;
        this.profile["text_effect"] = this.$["inp_text_effect"].value;
        this.profile["image_effect"] = this.$["inp_image_effect"].value;
        this.profile["navigation"] = this.$["inp_navigation"].checked;
    },


    onSettingsUpdated: function() {
        this.is_scroll = false;
        this.is_show_started = false;
        this.refresh();
    },


    
    // slides list

    openSlidesManager: function(flag) {
        core.values.list_editor = {
            popup_title: "Slides",
            list: clone(this.profile.slides),
            callback: this.onSlidesListChanged.bind(this),
            add_action: "select_file&doc",
            auto_add: flag === true,
            default_item: {
                file: "",
                alt: "",
                doc: { id: null, content: "content" }
            },
            labels: {
                file: "Image:",
                alt: "Alt attribute:",
                doc: "Content:"
            },
            files_filter: "pictures"
        };
        desktop.showPopupApp("list_editor");
    },


    onSlidesListChanged: function(list) {
        this.profile.slides = list;
    },




    // sys

    getUsedImages: function() {
        var l = this.profile.slides;
        var res = [];
        for(var i=0; i<l.length; i++) {
            if(l[i]) {
                res.push({ file: l[i].file, title: l[i].alt || "" });
            }
        }
        return res;
    }


});