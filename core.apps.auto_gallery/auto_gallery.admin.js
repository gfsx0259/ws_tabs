core.apps.auto_gallery.extendPrototype({

    onFirstRun: function() {
        this.showSettings();
    },

    settingsBlocks: [
        { title: "Content:",
          primary: true,
          controls: [
            { tag: "wsc_checkbox", title: "Variable content", id: "inp_variable_content" },
            { tag: "wsc_checkbox", title: "Hide if empty", id: "inp_hide_if_empty" }
          ]},

        { title: "Search:",
          controls: [
            { tag: "wsc_text", id: "inp_keywords" }
          ]},

        { title: "Popup:", 
          controls: [
            { tag: "wsc_checkbox", title: "Enable picture popup on click", id: "inp_popup" }
          ]},

        { title: "Columns:",
          controls: [
            { tag: "wsc_slider", id: "inp_cols",
              range: { min: 1, max: 20 } }
          ]},

        { title: "Image height:",
          controls: [
            { tag: "wsc_size", hide: "w", id: "inp_image_height" }
          ]}
    ],


    fillSettingsForm: function() {
        this.$["inp_variable_content"].setChecked(this.profile["variable_content"]);
        this.$["inp_hide_if_empty"].setChecked(this.profile["hide_if_empty"]);

        this.$["inp_popup"].setChecked(this.profile["popup"]);
        this.$["inp_image_height"].setValue({height: this.profile["image_height"]});
        this.$["inp_cols"].setValue(this.profile["cols"]);
        this.$["inp_keywords"].value = this.profile["keywords"];
    },

    processSettingsForm: function() {
        this.profile["variable_content"] = this.$["inp_variable_content"].checked;
        this.profile["hide_if_empty"] = this.$["inp_hide_if_empty"].checked;

        this.profile["popup"] = this.$["inp_popup"].checked;
        this.profile["image_height"] = this.$["inp_image_height"].value.height || this.defaultProfile["image_height"];
        this.profile["cols"] = this.$["inp_cols"].value;
        this.profile["keywords"] = this.$["inp_keywords"].value.trim();
    },


    onSettingsUpdated: function() {
        this.refresh();
    }

});