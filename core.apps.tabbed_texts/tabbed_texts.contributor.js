core.apps.tabbed_texts.extendPrototype({


    initContributor: function() {
        if(!this.profile["text_id"] || core.data.c_permissions["manage_docs"] != 1) return;
        var texts = this.profile["text_ids"];
        for(var i=0; i<texts.length; i++) {
            if(texts[i] == null) continue;
            core.data.texts.addListener(texts[i], this.id, this.setTabContent.bind(this));
        }
    },


    onTabContentClick: function(e) {
        if(core.data.c_permissions["manage_docs"] != 1) return;
        var tid = this.profile["text_ids"][this.activeTab];
        if(tid != null) {
            this.activeTextId = tid;
            desktop.openTextEditor(this.$["text" + tid].innerHTML, this.updateText.bind(this));
        }
    },


    updateText: function(html) {
        desktop.setState("loading");
        var p = {
            dialog: "texts",
            act: "update",
            id: this.activeTextId,
            content: html
        };
        this.tmpHTML = html;
        core.transport.send("/controller.php", p, this.onTextUpdated.bind(this), "POST");
    },


    onTextUpdated: function(text_id) {
        core.data.texts.setContent(this.activeTextId, this.tmpHTML);
        this.setTabContent({ id: this.activeTextId, content: this.tmpHTML});
        this.tmpHTML = "";
        this.activeTextId = null;
        desktop.setState("normal");
    }

});