core.apps.accordion_apps.extendPrototype({


    apps_container: true,


    compatible_apps: [
        "tabbed_apps"
    ],


    onFirstRun: function() {
        this.showSettings();
        this.openBlocksManager();
    },


    initAdmin: function() {
        if(core.usertype < USERTYPE_ADMIN) return;
        this.$["window"].is_container_app = true;
    },


    // settings
    settingsBlocks: [
        { title: "Show block on:",
          controls: [
            { tag: "wsc_select", id: "inp_block_event", 
              options: [
                { text: "click", value: "onclick" },
                { text: "mouse over", value: "onmouseover" }
              ]}
          ]},

        { title: "Blocks:",
          controls: [
            { tag: "a", events: { onclick: "openBlocksManager" },
              html: "Manage blocks" }
          ]}
    ],


    fillSettingsForm: function() {
        this.$["inp_block_event"].setValue(this.profile["event"]);
    },


    processSettingsForm: function() {
        this.profile["event"] = this.$["inp_block_event"].value;
    },


    onSettingsUpdated: function() {
        this.refresh();
    },
    
    

    // manage blocks

    openBlocksManager: function() {
        core.values.list_editor = {
            popup_title: "Blocks manager",
            list: this.getItemsList(),
            callback: this.setItemsList.bind(this),
            list_item_title_key: "title",
            default_item: {
                title: "Block",
                file: ""
            },
            labels: {
                title: "Title:",
                file: "Icon:"
            }
        }
        desktop.showPopupApp("list_editor");
    },





    // data

    getItemsList: function() {
        return this.profile.list;
    },


    setItemsList: function(list) {
        this.profile.list = list;
    },





    getContentElements: function() {
        var res = [];
        for(var i=0; i<this.profile.list.length; i++) {
            res.push(this.$["block_content" + i]);
        }
        return res;
    },


    onContentChanged: function() {},


    // drag&drop
    enableDrop: function() {
        if(this.profile.list.length == 0) return;

        desktop.layout.app_drag.showPlaceholder(false);
        this.app_drop_allowable = true;
        this.hideAdminOverlay();


        var el = this.$["block_content" + this.active_block_idx];
        if(el.childNodes.length == 0) {
            el.style.minHeight = desktop.layout.app_drag.placeholder_size + "px";
        }
        if(el.childNodes.length == 0) {
            desktop.layout.app_drag.showPlaceholder({ parent_el: el });
        } else if(el.firstChild && el.firstChild.firstChild && el.firstChild.firstChild.childNodes.length == 0) {
            desktop.layout.app_drag.showPlaceholder({ parent_el: el.firstChild.firstChild });
        }

        this.showOuterOverlay();
    },


    disableDrop: function() {
        if(this.app_drop_allowable) {
            desktop.layout.app_drag.showPlaceholder(false);
            this.app_drop_allowable = false;
            this.hideOuterOverlay();
            this.$["block_content" + this.active_block_idx].style.minHeight = "";
        }
    },



    showDropOverlay: function() {
        if(this.drop_overlay_visible) return;

        this.drop_overlay_visible = true;
        if(!this.$.drop_overlay) {
            this.buildModel(this.$.window,
                { tag: "div",
                  id: "drop_overlay",
                  className: "container_drop_overlay" }
            );
        } else {
            this.showElement("drop_overlay");
        }
    },


    hideDropOverlay: function() {
        this.drop_overlay_visible = false;
        this.hideElement("drop_overlay");
    },




// sys
    getCompatibleData: function() {
        var data = {
            title: this.profile.title,
            list: this.profile.list,
            content_elements: this.getContentElements()
        }
        return data;
    },


    setCompatibleData: function(data) {
        this.profile.title = data.title;
        this.profile.list = data.list;

        this.refresh();

        for(var i=0; i<data.content_elements.length; i++) {
            var src_el = data.content_elements[i];
            var dst_el = this.getContentElement(i);
            while(src_el.childNodes.length) {
                dst_el.appendChild(src_el.firstChild);
            }
        }
    },



    onClose: function() {
        clearTimeout(this.tm);
    }


});