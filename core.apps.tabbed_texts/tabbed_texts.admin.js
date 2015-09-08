core.apps.tabbed_texts.extendPrototype({

    compatible_apps: [
        "accordion",
        "carosel"
    ],


    blank_img: "/static/blank.gif",
    

    addTextListenters: function() {
        var texts = this.profile["text_ids"];
        for(var i=0; i<texts.length; i++) {
            if(texts[i] == null) continue;
            core.data.texts.addListener(texts[i], this.id, this.setTabContent.bind(this));
        }
    },



    onFirstRun: function() {
        this.showSettings();
        this.openTabsManager(true);
    },



    // settings

    settingsBlocks: [
        { title: "Content:",
          primary: true,
          controls: [
            { tag: "wsc_checkbox", title: "Variable content", id: "inp_variable_content" },
            { tag: "wsc_checkbox", title: "Hide if empty", id: "inp_hide_if_empty" }
          ]},

        { title: "Behavior:", 
          controls: [
            { tag: "wsc_checkbox", title: "Auto resize tabs height", id: "inp_auto_height" }
          ]},

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
        this.$["inp_variable_content"].setChecked(this.profile["variable_content"]);
        this.$["inp_hide_if_empty"].setChecked(this.profile["hide_if_empty"]);
        this.$["inp_speed"].setValue(this.profile["speed"]);
        this.$["inp_auto_height"].setChecked(this.profile["auto_height"]);
    },


    processSettingsForm: function() {
        this.profile["variable_content"] = this.$["inp_variable_content"].checked;
        this.profile["hide_if_empty"] = this.$["inp_hide_if_empty"].checked;
        this.profile["speed"] = this.$["inp_speed"].value;
        this.profile["auto_height"] = this.$["inp_auto_height"].checked;

        if(this.profile.variable_content) {
            this.profile.labels = [];
            this.profile.text_ids = [];
            this.profile.texts_content = [];
            this.profile.icons = [];
        }
    },


    onSettingsUpdated: function() {
        this.applyTabbedStyle();
        this.refreshTabs();

        var tids = this._profile["text_ids"];
        if(tids) {
            for(var i=0; i<tids.length; i++) {
                if(tids[i] == null) continue;
                core.data.texts.removeListener(tids[i], this.id);
            }
        }
        this.addTextListenters();
    },



    // manage tabs

    openTabsManager: function(flag) {
        core.values.list_editor = {
            popup_title: "Tabs manager",
            list: this.getItemsList(),
            callback: this.setItemsList.bind(this),
            add_action: "select_doc",
            auto_add: flag === true,
            default_item: {
                title: "Tab",
                file: "",
                doc: { id: null, content: "content" }
            },
            labels: {
                title: "Title:",
                file: "Icon:",
                doc: "Content:"
            },
            files_filter: "pictures"
        }
        desktop.showPopupApp("list_editor");
    },




    // tabs texts

    onTabContentClick: function(e) {
        var tid = this.data_source.text_ids[this.active_tab];
        if(tid == null) {
            desktop.openTextsManager(this.onFileSelectedDirectly.bind(this));
        } else {
            this.activeTextId = tid;
            core.data.texts.get(tid, this.openTextEditor.bind(this));
        }
    },

    openTextEditor: function(text){
        desktop.openTextEditor(text, this.updateDoc.bind(this));
    },


    updateDoc: function(doc) {
        desktop.setState("loading");

        core.data.texts.setData(this.activeTextId, doc);
        doc.id = this.activeTextId;
        doc.dialog = "texts";
        doc.act = "update";
        core.transport.send("/controller.php", doc, this.onTextUpdated.bind(this), "POST");
    },


    onTextUpdated: function(text_id) {
        this.activeTextId = null;
        desktop.setState("normal");
        this.refreshTabs();
    },


    onFileSelectedDirectly: function(text) {
        var oldId = this.profile["text_ids"][this.active_tab];
        if(oldId == text.id) return;
        if(oldId != null) {
            core.data.texts.removeListener(oldId, this.id);
        }
        core.data.texts.addListener(text.id, this.id, this.setTabContent.bind(this));
        this.profile["text_ids"][this.active_tab] = text.id;
        if(!this.profile.texts_content[text.id]) {
            this.profile.texts_content[text.id] = "content";
        }

        desktop.layout.savePage();
        this.refreshTabs();
    },


    onClose: function() {
        clearInterval(this.content_timer);
    },


    // common

    getUsedTexts: function() {
        var texts = this.profile["text_ids"];
        var res = [];
        for(var i=0; i<texts.length; i++) {
            if(texts[i] != null) {
                res.push(texts[i]);
            }
        }
        return res.length ? res : null;
    },




    // data

    getItemsList: function() {
        var p = this.profile;
        var list = [];
        for(var i=0; i<p.labels.length; i++) {
            list.push({
                title: p.labels[i],
                file: p.icons[i],
                doc: { id: p.text_ids[i], content: p.texts_content[p.texts_content[i]] || "content" }
            });
        }
        return list;
    },


    setItemsList: function(list) {
        var p = this.profile;
        p.labels = [];
        p.icons = [];
        p.text_ids = [];
        p.texts_content = {};
        for(var i=0; i<list.length; i++) {
            p.labels[i] = list[i].title;
            p.icons[i] = list[i].file;
            p.text_ids[i] = list[i].doc.id;
            p.texts_content[list[i].doc.id] = list[i].doc.content;
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