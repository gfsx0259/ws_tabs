core.apps.accordion = function(args) {

    this.defaultProfile = {
        title: "",
        app_style: "",
        labels: [],
        icons: [],
        texts: [],
        texts_content: {},
        type: "content", 
        event: "onclick" 
    };

    this.steps = 10;

};


core.apps.accordion.prototype = {


    buildContent: function(el) {
        this.callFunction("addTextListenters");
        this.buildModel(this.$["content"], { tag: "div", id: "accordion", className: "accordion" });
    },


    onOpen: function() {
        this.setTitle(this.profile["title"]);
        this.refresh();
//this.openBlocksManager();
    },

    
    setBlockContent: function(text) {
        var key = "block_content" + text.id;
        if(!this.$[key]) return;

        this.showElement(key);
        this.$[key].style.height = "";
        this.$[key].innerHTML = text[this.profile.texts_content[text.id] || this.profile.type];
        this.heights[text.id] = this.$[key].offsetHeight + 20;
        if(key != this.active_block) {
            this.$[key].style.height = 0;
        }
    },


    refresh: function() {
        this.$["accordion"].innerHTML = "";

        this.states = [];
        this.heights = [];
        this.active_block = null;

        var first_text_id = -1;
        var labels = this.profile["labels"];
        var icons = this.profile["icons"];

        var is_admin = core.usertype >= USERTYPE_ADMIN;

        for(var i=0; i<labels.length; i++) {

            var text_id = this.profile.texts[i];
            var label = (icons[i] ? "<img src='" + core.common.getUserFile(icons[i]) + "'/>" : "") + labels[i];

            var m = [
                { tag: "a", className: "block_label",
                  id: "block_label" + text_id,
                  events: {},
                  innerHTML: "<span>" + label + "</span>" }
            ];
            


            if(text_id != null) {
                this.states[text_id] = 0;

                if(first_text_id == -1) {
                    first_text_id = text_id;
                }
                m[0].events[this.profile["event"]] = [ "onLabelEvent", text_id ];
                var mc = 
                    { tag: "div", className: "block_content",
                      id: "block_content" + text_id };
                if(is_admin) mc.events = { onclick: [ "onTextClick", text_id ] };
                m.push(mc);
            }

            this.buildModel(this.$["accordion"], m);
            core.data.texts.get(text_id, this.setBlockContent.bind(this));
        }
        if(first_text_id != -1) {
            this.showBlock(first_text_id);
        }
    },



    onLabelEvent: function(e, text_id) {
        e = core.browser.event.fix(e);
        e.target.blur();
        this.showBlock(text_id);
    },


    showBlock: function(text_id) {
        if(this.active_block != null) {
            this.$["block_label" + this.active_block].className = "block_label";
        }
        this.active_block = text_id;
        this.$["block_label" + this.active_block].className = "block_label block_label_active";
        this.animation();
    },


    animation: function() {
        clearTimeout(this.tm);
        if(!this.updateStates()) return;
        this.tm = setTimeout(this.animation.bind(this), 20);
    },


    updateStates: function() {
        var fl = false;
        for(var tid in this.states) {
            if(tid == this.active_block) {
                if(this.states[tid] < this.steps) {
                    this.states[tid] ++;
                    this.setBlockState(tid, this.states[tid]);
                    fl = true;
                }
            } else {
                if(this.states[tid] > 0) {
                    this.states[tid] --;
                    this.setBlockState(tid, this.states[tid]);
                    fl = true;
                }
            }
        }
        return fl;
    },


    setBlockState: function(tid, v) {
        if(v == this.steps) {
            var h = "";
        } else {
            var h = Math.round(this.heights[tid] * v / this.steps) + "px";
        }
        this.$["block_content" + tid].style.height = h;
    }



};
core.apps.accordion.extendPrototype(core.components.html_component);
core.apps.accordion.extendPrototype(core.components.desktop_app);