YUI.add('editor-para', function(Y) {



    /**
     * Plugin for Editor to paragraph auto wrapping and correction.
     * @module editor
     * @submodule editor-para
     */     
    /**
     * Plugin for Editor to paragraph auto wrapping and correction.
     * @class Plugin.EditorPara
     * @extends Base
     * @constructor
     */


    var EditorPara = function() {
        EditorPara.superclass.constructor.apply(this, arguments);
    }, HOST = 'host', BODY = 'body', NODE_CHANGE = 'nodeChange',
    FIRST_P = BODY + ' > p';

    Y.extend(EditorPara, Y.Base, {
        /**
        * Utility method to create an empty paragraph when the document is empty.
        * @private
        * @method _fixFirstPara
        */
        _fixFirstPara: function() {
            var host = this.get(HOST), inst = host.getInstance(), sel;
            inst.one('body').setContent('<p>' + inst.Selection.CURSOR + '</p>');
            sel = new inst.Selection();
            sel.focusCursor(true, false);
        },
        /**
        * nodeChange handler to handle fixing an empty document.
        * @private
        * @method _onNodeChange
        */
        _onNodeChange: function(e) {
            var host = this.get(HOST), inst = host.getInstance();

            switch (e.changedType) {
                case 'keydown':
                    if (inst.config.doc.childNodes.length < 2) {
                        var cont = inst.config.doc.body.innerHTML;
                        if (cont && cont.length < 5 && cont.toLowerCase() == '<br>') {
                            this._fixFirstPara();
                        }
                    }
                    break;
                case 'backspace-up':
                case 'backspace-down':
                case 'delete-up':
                    if (!Y.UA.ie) {
                        var ps = inst.all(FIRST_P), br, item, html;
                        item = inst.one(BODY);
                        if (ps.item(0)) {
                            item = ps.item(0);
                        }
                        br = item.one('br');
                        if (br) {
                            br.removeAttribute('id');
                            br.removeAttribute('class');
                        }
                        html = item.get('innerHTML');
                        if (inst.Selection.getText(item) === '' && !item.test('p')) {
                            this._fixFirstPara();
                        } else if (item.test('p') && (html.length === 0) || (html == '<span><br></span>')) {
                            e.changedEvent.frameEvent.halt();
                        }
                    }
                    break;
            }
            
        },
        /**
        * Performs a block element filter when the Editor is first ready
        * @private
        * @method _afterEditorReady
        */
        _afterEditorReady: function() {
            var host = this.get(HOST), inst = host.getInstance();
            if (inst) {
                inst.Selection.filterBlocks();
            }
        },
        /**
        * Performs a block element filter when the Editor after an content change
        * @private
        * @method _afterContentChange
        */
        _afterContentChange: function() {
            var host = this.get(HOST), inst = host.getInstance();
            if (inst && inst.Selection) {
                inst.Selection.filterBlocks();
            }
        },
        /**
        * Performs block/paste filtering after paste.
        * @private
        * @method _afterPaste
        */
        _afterPaste: function() {
            var host = this.get(HOST), inst = host.getInstance(),
                sel = new inst.Selection();

            Y.later(50, host, function() {
                inst.Selection.filterBlocks();
            });
            
        },
        initializer: function() {
            var host = this.get(HOST);

            host.on(NODE_CHANGE, Y.bind(this._onNodeChange, this));
            host.after('ready', Y.bind(this._afterEditorReady, this));
            host.after('contentChange', Y.bind(this._afterContentChange, this));
            if (Y.Env.webkit) {
                host.after('dom:paste', Y.bind(this._afterPaste, this));
            }
        }
    }, {
        /**
        * editorPara
        * @static
        * @property NAME
        */
        NAME: 'editorPara',
        /**
        * editorPara
        * @static
        * @property NS
        */
        NS: 'editorPara',
        ATTRS: {
            host: {
                value: false
            }
        }
    });
    
    Y.namespace('Plugin');
    
    Y.Plugin.EditorPara = EditorPara;



}, '@VERSION@' ,{skinnable:false, requires:['editor-base', 'selection']});
