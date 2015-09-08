core.apps.tabbed_apps.extendPrototype({



    compatible_apps: [
        "accordion_apps"
    ],


    apps_container: true,


    blank_img: "/static/blank.gif",
    

    onFirstRun: function() {
        this.showSettings();
        this.openTabsManager();
    },



    // settings
    settingsBlocks: [
        { title: "Scroll speed:", 
          controls: [
            { tag: "wsc_slider", id: "inp_speed", 
              options: [
                { text: "Slow", value: 2 },
                { text: "Medium", value: 1 },
                { text: "Fast", value: 0 }

              ]}
          ]},

        { title: "Tabs:",
          controls: [
            { tag: "a", events: { onclick: "openTabsManager" },
              html: "Manage tabs" }
          ]}
    ],



    fillSettingsForm: function() {
        this.$["inp_speed"].setValue(this.profile["speed"]);
    },


    processSettingsForm: function() {
        this.profile["speed"] = this.$["inp_speed"].value;
    },


    onSettingsUpdated: function() {
        this.applyTabbedStyle();
        this.refreshTabs();
    },



    // manage tabs
    openTabsManager: function() {
        core.values.list_editor = {
            popup_title: "Tabs manager",
            list: this.getItemsList(),
            callback: this.setItemsList.bind(this),
            list_item_title_key: "title",
            default_item: {
                title: "Tab",
                file: ""
            },
            labels: {
                title: "Title:",
                file: "Icon:"
            },
            files_filter: "pictures"
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
            res.push(this.$["tab_content" + i]);
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
        this.showOuterOverlay();
        this.expandTabsContent();

        var el = this.$["tab_content" + this.active_tab_idx];
        if(el.childNodes.length == 0) {
            desktop.layout.app_drag.showPlaceholder({ parent_el: el });
        } else if(el.firstChild && el.firstChild.firstChild && el.firstChild.firstChild.childNodes.length == 0) {
            desktop.layout.app_drag.showPlaceholder({ parent_el: el.firstChild.firstChild });
        }
    },


    disableDrop: function() {
        if(this.app_drop_allowable) {
            desktop.layout.app_drag.showPlaceholder(false);
            this.app_drop_allowable = false;
            this.hideOuterOverlay();
            this.collapseTabsContent();
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



    expandTabsContent: function() {
        for(var i=0; i<this.profile.list.length; i++) {
            if(this.$["tab_content" + i].childNodes.length == 0) {
                this.$["tab_content" + i].style.minHeight = desktop.layout.app_drag.placeholder_size + "px";
            }
        }
    },

    collapseTabsContent: function() {
        for(var i=0; i<this.profile.list.length; i++) {
            this.$["tab_content" + i].style.minHeight = "";
        }
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

        this.refreshTabs();

        for(var i=0; i<data.content_elements.length; i++) {
            var src_el = data.content_elements[i];
            var dst_el = this.getContentElement(i);
            while(src_el.childNodes.length) {
                dst_el.appendChild(src_el.firstChild);
            }
        }
    },

    onClose: function() {
        clearInterval(this.content_timer);
    }

});