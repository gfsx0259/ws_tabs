core.apps.carosel.extendPrototype({


    compatible_apps: [
        "accordion",
        "tabbed_texts"
    ],


    addTextListenters: function () {
        var texts = this.profile["texts"];
        for (var i = 0; i < texts.length; i++) {
            if (texts[i] == null) continue;
            core.data.texts.addListener(texts[i], this.id, this.setBlockContent.bind(this));
        }
    },


    onFirstRun: function () {
        this.showSettings();
        this.openBlocksManager(true);
    },


    // settings

    settingsBlocks: [
        {
            title: "Direction:",
            controls: [
                {
                    tag: "wsc_select", id: "inp_layout_dir",
                    options: [
                        {text: "Vertcal", value: "0"},
                        {text: "Horizontal", value: "1"}
                    ]
                }
            ]
        },

        {
            title: "Show block:",
            controls: [
                {
                    tag: "wsc_select", id: "inp_block_event",
                    options: [
                        {text: "On click", value: "onclick"},
                        {text: "On mouse over", value: "onmouseover"}
                    ]
                }
            ]
        },


        {
            title: "Scroll speed:",
            controls: [
                {
                    tag: "wsc_slider", id: "inp_speed",
                    options: [
                        {text: "Slow", value: "10"},
                        {text: "Medium", value: "20"},
                        {text: "Fast", value: "30"}
                    ]
                },
                {tag: "div", className: "divider"},
                {tag: "wsc_checkbox", id: "inp_auto_scroll", title: "Auto scroll"},
                {tag: "div", className: "divider"},
                {
                    tag: "wsc_slider", id: "inp_auto_scroll_time_interval",
                    options: [
                        {text: "1 sec", value: "1"},
                        {text: "5 sec", value: "5"},
                        {text: "10 sec", value: "10"},
                        {text: "15 sec", value: "15"},
                        {text: "20 sec", value: "20"},
                        {text: "30 sec", value: "30"},
                        {text: "1 min", value: "60"},
                        {text: "2 min", value: "120"},
                        {text: "3 min", value: "180"},
                        {text: "5 min", value: "300"}
                    ]
                }
            ]
        },


        {
            title: "Misc:",
            controls: [
                {tag: "wsc_checkbox", id: "inp_opacity", title: "Opacity"},
                {tag: "div", className: "divider"},
                {tag: "wsc_checkbox", id: "inp_pause", title: "Pause on mouseover"}
            ]
        },

        {
            title: "Blocks:",
            controls: [
                {
                    tag: "a", events: {onclick: "openBlocksManager"},
                    html: "Manage blocks"
                }
            ]
        }
    ],


    fillSettingsForm: function () {
        this.$["inp_block_event"].setValue(this.profile["event"]);
        this.$["inp_layout_dir"].setValue(this.profile["layout_dir"]);
        this.$["inp_speed"].setValue(this.profile["speed"]);
        this.$["inp_auto_scroll"].setChecked(this.profile["auto_scroll"]);
        this.$["inp_pause"].setChecked(this.profile["pause"]);
        this.$["inp_opacity"].setChecked(this.profile["opacity"]);
        this.$["inp_auto_scroll_time_interval"].setValue(this.profile["auto_scroll_time_interval"]);
    },


    processSettingsForm: function () {
        this.profile["event"] = this.$["inp_block_event"].value;
        this.profile["layout_dir"] = this.$["inp_layout_dir"].value;
        this.profile["opacity"] = this.$["inp_opacity"].checked;
        this.profile["speed"] = this.$["inp_speed"].value;
        this.profile["auto_scroll"] = this.$["inp_auto_scroll"].checked;
        this.profile["pause"] = this.$["inp_pause"].checked;
        this.profile["auto_scroll_time_interval"] = this.$["inp_auto_scroll_time_interval"].value;
    },

    onSettingsUpdated: function () {
        this.refresh();

        var tids = this._profile["texts"];
        if (tids) {
            for (var i = 0; i < tids.length; i++) {
                if (tids[i] == null) continue;
                core.data.texts.removeListener(tids[i], this.id);
            }
        }
        this.addTextListenters();
    },


    // manage tabs

    openBlocksManager: function (flag) {
        core.values.list_editor = {
            popup_title: "Blocks manager",
            list: this.getItemsList(),
            callback: this.setItemsList.bind(this),
            add_action: "select_doc",
            auto_add: flag === true,
            default_item: {
                title: "Block",
                doc: {id: null, content: "content"}
            },
            labels: {
                title: "Title:",
                doc: "Content:"
            }
        };
        desktop.showPopupApp("list_editor");
    },


    onTextClick: function (e) {
        this.modify_text_id = this.active_text_id;
        if (this.active_text_id != null) {
            this.onShowEditorClick(e);
        }
    },

    onShowEditorClick: function () {
        if (this.active_text_id != null) {
            core.data.texts.get(this.active_text_id, this.editText.bind(this));
        }
    },

    editText: function (text) {
        desktop.openTextEditor(text, this.updateText.bind(this));
    },


    updateText: function (doc) {
        doc.id = this.modify_text_id;
        core.data.texts.updateContent(doc);

        desktop.setState("loading");
        doc.dialog = "texts";
        doc.act = "update";
        this.tmpHTML = doc.html;
        core.transport.send("/controller.php", doc, this.onTextUpdated.bind(this), "POST");
    },


    onTextUpdated: function (text) {
        this.refresh();
        desktop.setState("normal");
    },


    // common

    getUsedTexts: function () {
        var texts = this.profile["texts"];
        var res = [];
        for (var i = 0; i < texts.length; i++) {
            if (texts[i] != null) {
                res.push(texts[i]);
            }
        }
        return res.length ? res : null;
    },


    // data
    getItemsList: function () {
        var p = this.profile;
        var list = [];
        for (var i = 0; i < p.labels.length; i++) {
            list.push({
                title: p.labels[i],
                doc: {id: p.texts[i], content: p.texts_content[p.texts[i]] || "content"},
                file: ""
            });
        }
        return list;
    },


    setItemsList: function (list) {
        var p = this.profile;
        p.labels = [];
        p.texts = [];
        p.texts_content = {};
        for (var i = 0; i < list.length; i++) {
            p.labels[i] = list[i].title;
            p.texts[i] = list[i].doc.id;
            p.texts_content[list[i].doc.id] = list[i].doc.content;
        }
    },


    getCompatibleData: function () {
        var p = this.profile;
        var res = {
            title: p.title,
            list: this.getItemsList()
        };
        return res;
    },


    setCompatibleData: function (data) {
        for (var k in data) {
            if (k == "list") {
                this.setItemsList(data[k]);
            } else {
                this.profile[k] = data[k];
            }
        }
    }


});