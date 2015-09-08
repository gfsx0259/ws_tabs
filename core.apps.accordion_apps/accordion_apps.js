core.apps.accordion_apps = function(args) {

    this.defaultProfile = {
        title: "",
        app_style: "",
        list: [],
        event: "onclick" 
    }

    this.states = [];
    this.steps = 10;
    
    this.blocks_count = 0;
    
//    this.theme_style_key = "accordion";

}


core.apps.accordion_apps.prototype = {


    buildContent: function(el) {
        this.callFunction("addTextListenters");
        this.buildModel(this.$["content"], { tag: "div", id: "accordion", className: "accordion" });
    },


    onOpen: function() {
        this.setTitle(this.profile["title"]);
        this.refresh();
        this.callFunction("initAdmin");
    },

    

    refresh: function() {
        clearTimeout(this.tm);

        if(this.profile.list.length > this.blocks_count) {
            // add blocks
            var m = [];
            for(var i=this.blocks_count; i<this.profile.list.length; i++) {
                m.push(                
                    { tag: "a", className: "block_label",
                      id: "block_label" + i,
                      events: {
                        onmouseover: [(core.usertype >= USERTYPE_ADMIN ? "onBlockLabelMouseoverAdmin" : "onBlockLabelMouseover"), i],
                        onclick: ["onBlockLabelClick", i]
                      }}
                );

                m.push(
                    { tag: "div", style: { overflow: "hidden" },
                      childs: [
                        { tag: "div", className: "block_content",
                          wid: "cell",
                          is_row: true,
                          id: "block_content" + i }
                      ]}
                );
            }
            this.buildModel(this.$["accordion"], m);
        } else {
            // remove blocks
            for(var i=this.profile.list.length; i<this.blocks_count; i++) {
                core.browser.element.remove(this.$["block_label" + i]);
                core.browser.element.remove(this.$["block_content" + i].parentNode);
            }
        }
        this.blocks_count = this.profile.list.length;

        for(var i=0; i<this.profile.list.length; i++) {
            var b = this.profile.list[i];
            this.$["block_label" + i].innerHTML = 
                "<span>" + 
                (b.icon ? "<img src='" + core.common.getUserFile(b.icon) + "'/>" : "") + 
                b.title + 
                "</span>";

            this.$["block_content" + i].parentNode.style.height = 0;
            this.states[i] = 0;
        }

        if(this.profile.list.length > 0) {
            this.showBlock(0);
        }
    },




    onBlockLabelMouseover: function(e, idx) {
        if(this.profile.event == "onmouseover" && !this.app_drop_allowable) {
            this.showBlock(idx);
        }
    },


    onBlockLabelClick: function(e, idx) {
        if(this.profile.event == "onclick") {
            this.showBlock(idx);
        }
    },



    showBlock: function(idx) {
        if(this.active_block_idx != null) {
            this.$["block_label" + this.active_block_idx].className = "block_label";
        }
        this.$["block_label" + idx].className = "block_label block_label_active";
        this.active_block_idx = idx;
        this.animation();
    },


    animation: function() {
        clearTimeout(this.tm);
        if(!this.updateStates()) return;
        this.tm = setTimeout(this.animation.bind(this), 20);
    },


    updateStates: function() {
        var fl = false;
        for(var i=0; i<this.profile.list.length; i++) {
            if(i == this.active_block_idx) {
                if(this.states[i] < this.steps) {
                    this.states[i]++;
                    this.setBlockState(i, this.states[i]);
                    fl = true;
                }
            } else {
                if(this.states[i] > 0) {
                    this.states[i]--;
                    this.setBlockState(i, this.states[i]);
                    fl = true;
                }
            }
        }
        return fl;
    },


    setBlockState: function(idx, v) {
        if(v == this.steps) {
            var h = "";
        } else {
            var h = Math.round(this.$["block_content" + idx].offsetHeight * v / this.steps) + "px";
        }
        this.$["block_content" + idx].parentNode.style.height = h;
    },




    getContentElement: function(idx) {
        return this.$["block_content" + idx];
    }


}
core.apps.accordion_apps.extendPrototype(core.components.html_component);
core.apps.accordion_apps.extendPrototype(core.components.desktop_app);