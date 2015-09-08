core.apps.accordion.extendPrototype({


    compatible_apps: [
        "carosel",
        "tabbed_texts"
    ],


    blank_img: "/static/blank.gif",

    addTextListenters: function() {
        var texts = this.profile["texts"];
        for(var i=0; i<texts.length; i++) {
            if(texts[i] == null) continue;
            core.data.texts.addListener(texts[i], this.id, this.setBlockContent.bind(this));
        }
    },


    onFirstRun: function() {
        this.showSettings();
        this.openBlocksManager(true);
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

        var tids = this._profile["texts"];
        if(tids) {
            for(var i=0; i<tids.length; i++) {
                if(tids[i] == null) continue;
                core.data.texts.removeListener(tids[i], this.id);
            }
        }
        this.addTextListenters();
    },
    
    

    // manage blocks

    openBlocksManager: function(flag) {
        core.values.list_editor = {
            popup_title: "Blocks manager",
            list: this.getItemsList(),
            callback: this.setItemsList.bind(this),
            add_action: "select_doc",
            auto_add: flag === true,
            list_item_title_key: "title",
            default_item: {
                title: "Block",
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



    // edit doc by click

    onTextClick: function(e, doc_id) {
        if(!doc_id) return;
        this.edit_doc_id = doc_id;
        core.data.texts.get(doc_id, this.editDoc.bind(this));
    },


    editDoc: function(doc) {
        desktop.openTextEditor(doc, this.updateDoc.bind(this));
    },


    updateDoc: function(doc) {
        desktop.setState("loading");
        doc.id = this.edit_doc_id;
        core.data.texts.updateContent(doc);

        doc.dialog = "texts";
        doc.act = "update";
        core.transport.send("/controller.php", doc, this.onDocUpdated.bind(this), "POST");
    },


    onDocUpdated: function(d) {
        desktop.setState("normal");
        this.refresh();
    },


    // common

    getUsedTexts: function() {
        var texts = this.profile["texts"];
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
                doc: { id: p.texts[i], content: p.texts_content[p.texts[i]] || "content" }
            });
        }
        return list;
    },


    setItemsList: function(list) {
        var p = this.profile;
        p.labels = [];
        p.icons = [];
        p.texts = [];
        p.texts_content = {};
        for(var i=0; i<list.length; i++) {
            p.labels[i] = list[i].title;
            p.icons[i] = list[i].file;
            p.texts[i] = list[i].doc.id;
            p.texts_content[list[i].doc.id] = list[i].doc.content;
        }
    },




    getCompatibleData: function() {
        var res = {
            title: this.profile.title,
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
    },


    onClose: function() {
        clearTimeout(this.tm);
    }


});