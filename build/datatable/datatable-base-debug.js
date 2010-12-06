YUI.add('datatable-base', function(Y) {

var YLang = Y.Lang,
    YisValue = YLang.isValue,
    Ysubstitute = Y.Lang.substitute,
    YNode = Y.Node,
    Ycreate = YNode.create,
    YgetClassName = Y.ClassNameManager.getClassName,

    DATATABLE = "datatable",
    COLUMN = "column",
    
    FOCUS = "focus",
    KEYDOWN = "keydown",
    MOUSEENTER = "mouseenter",
    MOUSELEAVE = "mouseleave",
    MOUSEUP = "mouseup",
    MOUSEDOWN = "mousedown",
    CLICK = "click",
    DBLCLICK = "dblclick",

    CLASS_COLUMNS = YgetClassName(DATATABLE, "columns"),
    CLASS_DATA = YgetClassName(DATATABLE, "data"),
    CLASS_MSG = YgetClassName(DATATABLE, "msg"),
    CLASS_LINER = YgetClassName(DATATABLE, "liner"),
    CLASS_FIRST = YgetClassName(DATATABLE, "first"),
    CLASS_LAST = YgetClassName(DATATABLE, "last"),
    CLASS_EVEN = YgetClassName(DATATABLE, "even"),
    CLASS_ODD = YgetClassName(DATATABLE, "odd"),

    TEMPLATE_TABLE = '<table></table>',
    TEMPLATE_COL = '<col></col>',
    TEMPLATE_THEAD = '<thead class="'+CLASS_COLUMNS+'"></thead>',
    TEMPLATE_TBODY = '<tbody class="'+CLASS_DATA+'"></tbody>',
    TEMPLATE_TH = '<th id="{id}" rowspan="{rowspan}" colspan="{colspan}" class="{classnames}"><div class="'+CLASS_LINER+'">{value}</div></th>',
    TEMPLATE_TR = '<tr id="{id}"></tr>',
    TEMPLATE_TD = '<td headers="{headers}" class="{classnames}"><div class="'+CLASS_LINER+'">{value}</div></td>',
    TEMPLATE_VALUE = '{value}',
    TEMPLATE_MSG = '<tbody class="'+CLASS_MSG+'"></tbody>';
    



/**
 * The Column class defines and manages attributes of Columns for DataTable.
 *
 * @class Column
 * @extends Widget
 * @constructor
 */
function Column(config) {
    Column.superclass.constructor.apply(this, arguments);
}

/////////////////////////////////////////////////////////////////////////////
//
// STATIC PROPERTIES
//
/////////////////////////////////////////////////////////////////////////////
Y.mix(Column, {
    /**
     * Class name.
     *
     * @property NAME
     * @type String
     * @static
     * @final
     * @value "column"
     */
    NAME: "column",

/////////////////////////////////////////////////////////////////////////////
//
// ATTRIBUTES
//
/////////////////////////////////////////////////////////////////////////////
    ATTRS: {
        /**
        * @attribute id
        * @description Unique internal identifier, used to stamp ID on TH element.
        * @type String
        * @writeOnce
        */
        id: {
            valueFn: "_defaultId",
            writeOnce: true
        },
        
        /**
        * @attribute key
        * @description User-supplied identifier. Defaults to id.
        * @type String
        */
        key: {
            valueFn: "_defaultKey"
        },

        /**
        * @attribute field
        * @description Points to underlying data field (for sorting or formatting,
        * for example). Useful when column doesn't hold any data itself, but is
        * just a visual representation of data from another column or record field.
        * Defaults to key.
        * @type String
        */
        field: {
            valueFn: "_defaultField"
        },

        /**
        * @attribute label
        * @description Display label for column header. Defaults to key.
        * @type String
        */
        label: {
            valueFn: "_defaultLabel"
        },
        
        /**
        * @attribute children
        * @description Array of child column definitions (for nested headers).
        * @type String
        */
        children: {
            value: null
        },
        
        /**
        * @attribute abbr
        * @description TH abbr attribute.
        * @type String
        */
        abbr: {
            value: null
        },

        //TODO: support custom classnames
        // TH CSS classnames
        classnames: {
            readOnly: true,
            getter: "_getClassnames"
        },
        
        // Column formatter
        formatter: {},

        //requires datatable-sort
        sortable: {
            value: false
        },
        //sortOptions:defaultDir, sortFn, field

        //TODO: support editable columns
        // Column editor
        editor: {},

        //TODO: support resizeable columns
        //TODO: support setting widths
        // requires datatable-colresize
        width: {},
        resizeable: {},
        minimized: {},
        minWidth: {},
        maxAutoWidth: {}
    }
});

/////////////////////////////////////////////////////////////////////////////
//
// PROTOTYPE
//
/////////////////////////////////////////////////////////////////////////////
Y.extend(Column, Y.Widget, {
    /////////////////////////////////////////////////////////////////////////////
    //
    // ATTRIBUTE HELPERS
    //
    /////////////////////////////////////////////////////////////////////////////
    /**
    * @method _defaultId
    * @description Return ID for instance.
    * @returns String
    * @private
    */
    _defaultId: function() {
        return Y.guid();
    },

    /**
    * @method _defaultKey
    * @description Return key for instance. Defaults to ID if one was not
    * provided.
    * @returns String
    * @private
    */
    _defaultKey: function(key) {
        return key || Y.guid();
    },

    /**
    * @method _defaultField
    * @description Return field for instance. Defaults to key if one was not
    * provided.
    * @returns String
    * @private
    */
    _defaultField: function(field) {
        return field || this.get("key");
    },

    /**
    * @method _defaultLabel
    * @description Return label for instance. Defaults to key if one was not
    * provided.
    * @returns String
    * @private
    */
    _defaultLabel: function(label) {
        return label || this.get("key");
    },

    /**
     * Updates the UI if changes are made to abbr.
     *
     * @method _afterAbbrChange
     * @param e {Event} Custom event for the attribute change.
     * @private
     */
    _afterAbbrChange: function (e) {
        this._uiSetAbbr(e.newVal);
    },

    /////////////////////////////////////////////////////////////////////////////
    //
    // PROPERTIES
    //
    /////////////////////////////////////////////////////////////////////////////
    /**
     * Reference to Column's current position index within its Columnset's keys
     * array, if applicable. This property only applies to non-nested and bottom-
     * level child Columns. Value is set by Columnset code.
     *
     * @property keyIndex
     * @type Number
     */
    keyIndex: null,
    
    /**
    * @attribute headers
    * @description Array of TH IDs associated with this column, for TD "headers"
    * attribute. Value is set by Columnset code
    * @type String[]
    */
    headers: null,

    /**
     * Number of cells the header spans. Value is set by Columnset code.
     *
     * @property colSpan
     * @type Number
     * @default 1
     */
    colSpan: 1,
    
    /**
     * Number of rows the header spans. Value is set by Columnset code.
     *
     * @property rowSpan
     * @type Number
     * @default 1
     */
    rowSpan: 1,

    /**
     * Column's parent Column instance, if applicable. Value is set by Columnset
     * code.
     *
     * @property parent
     * @type Y.Column
     */
    parent: null,

    /**
     * The Node reference to the associated TH element.
     *
     * @property thNode
     * @type Y.Node
     */
     
    thNode: null,

    /*TODO
     * The Node reference to the associated liner element.
     *
     * @property thLinerNode
     * @type Y.Node
     
    thLinerNode: null,*/
    
    /////////////////////////////////////////////////////////////////////////////
    //
    // METHODS
    //
    /////////////////////////////////////////////////////////////////////////////
    /**
    * Initializer.
    *
    * @method initializer
    * @param config {Object} Config object.
    * @private
    */
    initializer: function(config) {
    },

    /**
    * Destructor.
    *
    * @method destructor
    * @private
    */
    destructor: function() {
    },

    /**
     * Returns classnames for Column.
     *
     * @method _getClassnames
     * @private
     */
    _getClassnames: function () {
        return Y.ClassNameManager.getClassName(COLUMN, this.get("id"));
        /*var allClasses;

        // Add CSS classes
        if(lang.isString(oColumn.className)) {
            // Single custom class
            allClasses = [oColumn.className];
        }
        else if(lang.isArray(oColumn.className)) {
            // Array of custom classes
            allClasses = oColumn.className;
        }
        else {
            // no custom classes
            allClasses = [];
        }

        // Hook for setting width with via dynamic style uses key since ID is too disposable
        allClasses[allClasses.length] = this.getId() + "-col-" +oColumn.getSanitizedKey();

        // Column key - minus any chars other than "A-Z", "a-z", "0-9", "_", "-", ".", or ":"
        allClasses[allClasses.length] = "yui-dt-col-" +oColumn.getSanitizedKey();

        var isSortedBy = this.get("sortedBy") || {};
        // Sorted
        if(oColumn.key === isSortedBy.key) {
            allClasses[allClasses.length] = isSortedBy.dir || '';
        }
        // Hidden
        if(oColumn.hidden) {
            allClasses[allClasses.length] = DT.CLASS_HIDDEN;
        }
        // Selected
        if(oColumn.selected) {
            allClasses[allClasses.length] = DT.CLASS_SELECTED;
        }
        // Sortable
        if(oColumn.sortable) {
            allClasses[allClasses.length] = DT.CLASS_SORTABLE;
        }
        // Resizeable
        if(oColumn.resizeable) {
            allClasses[allClasses.length] = DT.CLASS_RESIZEABLE;
        }
        // Editable
        if(oColumn.editor) {
            allClasses[allClasses.length] = DT.CLASS_EDITABLE;
        }

        // Addtnl classes, including First/Last
        if(aAddClasses) {
            allClasses = allClasses.concat(aAddClasses);
        }

        return allClasses.join(' ');*/
    },

    ////////////////////////////////////////////////////////////////////////////
    //
    // SYNC
    //
    ////////////////////////////////////////////////////////////////////////////
    /**
    * Syncs UI to intial state.
    *
    * @method syncUI
    * @private
    */
    syncUI: function() {
        this._uiSetAbbr(this.get("abbr"));
    },

    /**
     * Updates abbr.
     *
     * @method _uiSetAbbr
     * @param val {String} New abbr.
     * @protected
     */
    _uiSetAbbr: function(val) {
        this.thNode.set("abbr", val);
    }
});

Y.Column = Column;

/**
 * The Columnset class defines and manages a collection of Columns.
 *
 * @class Columnset
 * @extends Base
 * @constructor
 */
function Columnset(config) {
    Columnset.superclass.constructor.apply(this, arguments);
}

/////////////////////////////////////////////////////////////////////////////
//
// STATIC PROPERTIES
//
/////////////////////////////////////////////////////////////////////////////
Y.mix(Columnset, {
    /**
     * Class name.
     *
     * @property NAME
     * @type String
     * @static
     * @final
     * @value "columnset"
     */
    NAME: "columnset",

    /////////////////////////////////////////////////////////////////////////////
    //
    // ATTRIBUTES
    //
    /////////////////////////////////////////////////////////////////////////////
    ATTRS: {
        /**
        * @attribute definitions
        * @description Array of column definitions that will populate this Columnset.
        * @type Array
        */
        definitions: {
            setter: "_setDefinitions"
        }

    }
});

/////////////////////////////////////////////////////////////////////////////
//
// PROTOTYPE
//
/////////////////////////////////////////////////////////////////////////////
Y.extend(Columnset, Y.Base, {
    /////////////////////////////////////////////////////////////////////////////
    //
    // ATTRIBUTE HELPERS
    //
    /////////////////////////////////////////////////////////////////////////////
    /**
    * @method _setDefinitions
    * @description Clones definitions before setting.
    * @param definitions {Array} Array of column definitions.
    * @returns Array
    * @private
    */
    _setDefinitions: function(definitions) {
            return Y.clone(definitions);
    },
    
    /////////////////////////////////////////////////////////////////////////////
    //
    // PROPERTIES
    //
    /////////////////////////////////////////////////////////////////////////////
    /**
     * Top-down tree representation of Column hierarchy. Used to create DOM
     * elements.
     *
     * @property tree
     * @type Y.Column[]
     */
    tree: null,

    /**
     * Hash of all Columns by ID.
     *
     * @property idHash
     * @type Object
     */
    idHash: null,

    /**
     * Hash of all Columns by key.
     *
     * @property keyHash
     * @type Object
     */
    keyHash: null,

    /**
     * Array of only Columns that are meant to be displayed in DOM.
     *
     * @property keys
     * @type Y.Column[]
     */
    keys: null,

    /////////////////////////////////////////////////////////////////////////////
    //
    // METHODS
    //
    /////////////////////////////////////////////////////////////////////////////
    /**
    * Initializer. Generates all internal representations of the collection of
    * Columns.
    *
    * @method initializer
    * @param config {Object} Config object.
    * @private
    */
    initializer: function() {

        // DOM tree representation of all Columns
        var tree = [],
        // Hash of all Columns by ID
        idHash = {},
        // Hash of all Columns by key
        keyHash = {},
        // Flat representation of only Columns that are meant to display data
        keys = [],
        // Original definitions
        definitions = this.get("definitions"),

        self = this;

        // Internal recursive function to define Column instances
        function parseColumns(depth, currentDefinitions, parent) {
            var i=0,
                len = currentDefinitions.length,
                currentDefinition,
                column,
                currentChildren;

            // One level down
            depth++;

            // Create corresponding dom node if not already there for this depth
            if(!tree[depth]) {
                tree[depth] = [];
            }

            // Parse each node at this depth for attributes and any children
            for(; i<len; ++i) {
                currentDefinition = currentDefinitions[i];

                currentDefinition = YLang.isString(currentDefinition) ? {key:currentDefinition} : currentDefinition;

                // Instantiate a new Column for each node
                column = new Y.Column(currentDefinition);

                // Cross-reference Column ID back to the original object literal definition
                currentDefinition.yuiColumnId = column.get("id");

                // Add the new Column to the hash
                idHash[column.get("id")] = column;
                keyHash[column.get("key")] = column;

                // Assign its parent as an attribute, if applicable
                if(parent) {
                    column.parent = parent;
                }

                // The Column has descendants
                if(YLang.isArray(currentDefinition.children)) {
                    currentChildren = currentDefinition.children;
                    column._set("children", currentChildren);

                    self._setColSpans(column, currentDefinition);

                    self._cascadePropertiesToChildren(column, currentChildren);

                    // The children themselves must also be parsed for Column instances
                    if(!tree[depth+1]) {
                        tree[depth+1] = [];
                    }
                    parseColumns(depth, currentChildren, column);
                }
                // This Column does not have any children
                else {
                    column.keyIndex = keys.length;
                    // Default is already 1
                    //column.colSpan = 1;
                    keys.push(column);
                }

                // Add the Column to the top-down dom tree
                tree[depth].push(column);
            }
            depth--;
        }

        // Parse out Column instances from the array of object literals
        parseColumns(-1, definitions);


        // Save to the Columnset instance
        this.tree = tree;
        this.idHash = idHash;
        this.keyHash = keyHash;
        this.keys = keys;

        this._setRowSpans();
        this._setHeaders();
    },

    /**
    * Destructor.
    *
    * @method destructor
    * @private
    */
    destructor: function() {
    },

    /////////////////////////////////////////////////////////////////////////////
    //
    // COLUMN HELPERS
    //
    /////////////////////////////////////////////////////////////////////////////
    /**
    * Cascade certain properties to children if not defined on their own.
    *
    * @method _cascadePropertiesToChildren
    * @private
    */
    _cascadePropertiesToChildren: function(column, currentChildren) {
        //TODO: this is all a giant todo
        var i = 0,
            len = currentChildren.length,
            child;

        // Cascade certain properties to children if not defined on their own
        for(; i<len; ++i) {
            child = currentChildren[i];
            if(column.get("className") && (child.className === undefined)) {
                child.className = column.get("className");
            }
            if(column.get("editor") && (child.editor === undefined)) {
                child.editor = column.get("editor");
            }
            if(column.get("formatter") && (child.formatter === undefined)) {
                child.formatter = column.get("formatter");
            }
            if(column.get("resizeable") && (child.resizeable === undefined)) {
                child.resizeable = column.get("resizeable");
            }
            if(column.get("sortable") && (child.sortable === undefined)) {
                child.sortable = column.get("sortable");
            }
            if(column.get("hidden")) {
                child.hidden = true;
            }
            if(column.get("width") && (child.width === undefined)) {
                child.width = column.get("width");
            }
            if(column.get("minWidth") && (child.minWidth === undefined)) {
                child.minWidth = column.get("minWidth");
            }
            if(column.get("maxAutoWidth") && (child.maxAutoWidth === undefined)) {
                child.maxAutoWidth = column.get("maxAutoWidth");
            }
        }
    },

    /**
    * @method _setColSpans
    * @description Calculates and sets colSpan attribute on given Column.
    * @param column {Array} Column instance.
    * @param definition {Object} Column definition.
    * @private
    */
    _setColSpans: function(column, definition) {
        // Determine COLSPAN value for this Column
        var terminalChildNodes = 0;

        function countTerminalChildNodes(ancestor) {
            var descendants = ancestor.children,
                i = 0,
                len = descendants.length;

            // Drill down each branch and count terminal nodes
            for(; i<len; ++i) {
                // Keep drilling down
                if(YLang.isArray(descendants[i].children)) {
                    countTerminalChildNodes(descendants[i]);
                }
                // Reached branch terminus
                else {
                    terminalChildNodes++;
                }
            }
        }
        countTerminalChildNodes(definition);
        column.colSpan = terminalChildNodes;
    },

    /**
    * @method _setRowSpans
    * @description Calculates and sets rowSpan attribute on all Columns.
    * @private
    */
    _setRowSpans: function() {
        // Determine ROWSPAN value for each Column in the DOM tree
        function parseDomTreeForRowSpan(tree) {
            var maxRowDepth = 1,
                currentRow,
                currentColumn,
                m,p;

            // Calculate the max depth of descendants for this row
            function countMaxRowDepth(row, tmpRowDepth) {
                tmpRowDepth = tmpRowDepth || 1;

                var i = 0,
                    len = row.length,
                    col;

                for(; i<len; ++i) {
                    col = row[i];
                    // Column has children, so keep counting
                    if(YLang.isArray(col.children)) {
                        tmpRowDepth++;
                        countMaxRowDepth(col.children, tmpRowDepth);
                        tmpRowDepth--;
                    }
                    // Column has children, so keep counting
                    else if(col.get && YLang.isArray(col.get("children"))) {
                        tmpRowDepth++;
                        countMaxRowDepth(col.get("children"), tmpRowDepth);
                        tmpRowDepth--;
                    }
                    // No children, is it the max depth?
                    else {
                        if(tmpRowDepth > maxRowDepth) {
                            maxRowDepth = tmpRowDepth;
                        }
                    }
                }
            }

            // Count max row depth for each row
            for(m=0; m<tree.length; m++) {
                currentRow = tree[m];
                countMaxRowDepth(currentRow);

                // Assign the right ROWSPAN values to each Column in the row
                for(p=0; p<currentRow.length; p++) {
                    currentColumn = currentRow[p];
                    if(!YLang.isArray(currentColumn.get("children"))) {
                        currentColumn.rowSpan = maxRowDepth;
                    }
                    // Default is already 1
                    // else currentColumn.rowSpan =1;
                }

                // Reset counter for next row
                maxRowDepth = 1;
            }
        }
        parseDomTreeForRowSpan(this.tree);
    },

    /**
    * @method _setHeaders
    * @description Calculates and sets headers attribute on all Columns.
    * @private
    */
    _setHeaders: function() {
        var headers, column,
            allKeys = this.keys,
            i=0, len = allKeys.length;

        function recurseAncestorsForHeaders(headers, column) {
            headers.push(column.get("key"));
            //headers[i].push(column.getSanitizedKey());
            if(column.parent) {
                recurseAncestorsForHeaders(headers, column.parent);
            }
        }
        for(; i<len; ++i) {
            headers = [];
            column = allKeys[i];
            recurseAncestorsForHeaders(headers, column);
            column.headers = headers.reverse().join(" ");
        }
    },

    //TODO
    getColumn: function() {
    }
});

Y.Columnset = Columnset;

/**
 * The DataTable widget provides a progressively enhanced DHTML control for
 * displaying tabular data across A-grade browsers.
 *
 * @module datatable
 */

/**
 * Provides the base DataTable implementation, which can be extended to add
 * additional functionality, such as sorting or scrolling.
 *
 * @module datatable
 * @submodule datatable-base
 */

/**
 * Base class for the DataTable widget.
 * @class DataTable.Base
 * @extends Widget
 * @constructor
 */
function DTBase(config) {
    DTBase.superclass.constructor.apply(this, arguments);
}

/////////////////////////////////////////////////////////////////////////////
//
// STATIC PROPERTIES
//
/////////////////////////////////////////////////////////////////////////////
Y.mix(DTBase, {

    /**
     * Class name.
     *
     * @property NAME
     * @type String
     * @static
     * @final
     * @value "dataTable"
     */
    NAME:  "dataTable",

/////////////////////////////////////////////////////////////////////////////
//
// ATTRIBUTES
//
/////////////////////////////////////////////////////////////////////////////
    ATTRS: {
        /**
        * @attribute columnset
        * @description Pointer to Columnset instance.
        * @type Array | Y.Columnset
        */
        columnset: {
            setter: "_setColumnset"
        },

        /**
        * @attribute recordset
        * @description Pointer to Recordset instance.
        * @type Array | Y.Recordset
        */
        recordset: {
            value: new Y.Recordset({records:[]}),
            setter: "_setRecordset"
        },

        /*TODO
        * @attribute state
        * @description Internal state.
        * @readonly
        * @type
        */
        /*state: {
            value: new Y.State(),
            readOnly: true

        },*/

        /**
        * @attribute summary
        * @description Summary.
        * @type String
        */
        summary: {
        },

        /**
        * @attribute caption
        * @description Caption
        * @type String
        */
        caption: {
        },

        /**
        * @attribute thValueTemplate
        * @description Tokenized markup template for TH value.
        * @type String
        * @default '{value}'
        */
        thValueTemplate: {
            value: TEMPLATE_VALUE
        },

        /**
        * @attribute tdValueTemplate
        * @description Tokenized markup template for TD value.
        * @type String
        * @default '{value}'
        */
        tdValueTemplate: {
            value: TEMPLATE_VALUE
        },

        /**
        * @attribute trTemplate
        * @description Tokenized markup template for TR node creation.
        * @type String
        * @default '<tr id="{id}"></tr>'
        */
        trTemplate: {
            value: TEMPLATE_TR
        }
    },

/////////////////////////////////////////////////////////////////////////////
//
// TODO: HTML_PARSER
//
/////////////////////////////////////////////////////////////////////////////
    HTML_PARSER: {
        /*caption: function (srcNode) {
            
        }*/
    }
});

/////////////////////////////////////////////////////////////////////////////
//
// PROTOTYPE
//
/////////////////////////////////////////////////////////////////////////////
Y.extend(DTBase, Y.Widget, {
    /**
    * @property thTemplate
    * @description Tokenized markup template for TH node creation.
    * @type String
    * @default '<th id="{id}" rowspan="{rowspan}" colspan="{colspan}"><div class="'+CLASS_LINER+'">{value}</div></th>'
    */
    thTemplate: TEMPLATE_TH,

    /**
    * @property tdTemplate
    * @description Tokenized markup template for TD node creation.
    * @type String
    * @default '<td headers="{headers}"><div class="'+CLASS_LINER+'">{value}</div></td>'
    */
    tdTemplate: TEMPLATE_TD,
    
    /**
    * @property _theadNode
    * @description Pointer to THEAD node.
    * @type Y.Node
    * @private
    */
    _theadNode: null,
    
    /**
    * @property _tbodyNode
    * @description Pointer to TBODY node.
    * @type Y.Node
    * @private
    */
    _tbodyNode: null,
    
    /**
    * @property _msgNode
    * @description Pointer to message display node.
    * @type Y.Node
    * @private
    */
    _msgNode: null,

    /////////////////////////////////////////////////////////////////////////////
    //
    // ATTRIBUTE HELPERS
    //
    /////////////////////////////////////////////////////////////////////////////
    /**
    * @method _setColumnset
    * @description Converts Array to Y.Columnset.
    * @param columns {Array | Y.Columnset}
    * @returns Y.Columnset
    * @private
    */
    _setColumnset: function(columns) {
        return YLang.isArray(columns) ? new Y.Columnset({definitions:columns}) : columns;
    },

    /**
     * Updates the UI if Columnset is changed.
     *
     * @method _afterColumnsetChange
     * @param e {Event} Custom event for the attribute change.
     * @protected
     */
    _afterColumnsetChange: function (e) {
        if(this.get("rendered")) {
            this._uiSetColumnset(e.newVal);
        }
    },

    /**
    * @method _setRecordset
    * @description Converts Array to Y.Recordset.
    * @param records {Array | Y.Recordset}
    * @returns Y.Recordset
    * @private
    */
    _setRecordset: function(rs) {
        if(YLang.isArray(rs)) {
            rs = new Y.Recordset({records:rs});
        }

        rs.addTarget(this);
        return rs;
    },
    
    /**
    * Updates the UI if Recordset is changed.
    *
    * @method _afterRecordsetChange
    * @param e {Event} Custom event for the attribute change.
    * @protected
    */
    _afterRecordsetChange: function (e) {
        if(this.get("rendered")) {
            this._uiSetRecordset(e.newVal);
        }
    },

    /**
     * Updates the UI if summary is changed.
     *
     * @method _afterSummaryChange
     * @param e {Event} Custom event for the attribute change.
     * @protected
     */
    _afterSummaryChange: function (e) {
        if(this.get("rendered")) {
            this._uiSetSummary(e.newVal);
        }
    },

    /**
     * Updates the UI if caption is changed.
     *
     * @method _afterCaptionChange
     * @param e {Event} Custom event for the attribute change.
     * @protected
     */
    _afterCaptionChange: function (e) {
        if(this.get("rendered")) {
            this._uiSetCaption(e.newVal);
        }
    },

    /////////////////////////////////////////////////////////////////////////////
    //
    // METHODS
    //
    /////////////////////////////////////////////////////////////////////////////
    /**
    * Initializer.
    *
    * @method initializer
    * @param config {Object} Config object.
    * @private
    */
    initializer: function(config) {
        this.after("columnsetChange", this._afterColumnsetChange);
        this.after("recordsetChange", this._afterRecordsetChange);
        this.after("summaryChange", this._afterSummaryChange);
        this.after("captionChange", this._afterCaptionChange);
    },

    /**
    * Destructor.
    *
    * @method destructor
    * @private
    */
    destructor: function() {
         this.get("recordset").removeTarget(this);
    },
    
    ////////////////////////////////////////////////////////////////////////////
    //
    // RENDER
    //
    ////////////////////////////////////////////////////////////////////////////

    /**
    * Renders UI.
    *
    * @method renderUI
    * @private
    */
    renderUI: function() {
        // TABLE
        return (this._addTableNode(this.get("contentBox")) &&
        // COLGROUP
        this._addColgroupNode(this._tableNode) &&
        // THEAD
        this._addTheadNode(this._tableNode) &&
        // Primary TBODY
        this._addTbodyNode(this._tableNode) &&
        // Message TBODY
        this._addMessageNode(this._tableNode) &&
        // CAPTION
        this._addCaptionNode(this._tableNode));
   },

    /**
    * Creates and attaches TABLE element to given container.
    *
    * @method _addTableNode
    * @param containerNode {Y.Node} Parent node.
    * @protected
    * @returns Y.Node
    */
    _addTableNode: function(containerNode) {
        if (!this._tableNode) {
            this._tableNode = containerNode.appendChild(Ycreate(TEMPLATE_TABLE));
        }
        return this._tableNode;
    },

    /**
    * Creates and attaches COLGROUP element to given TABLE.
    *
    * @method _addColgroupNode
    * @param tableNode {Y.Node} Parent node.
    * @protected
    * @returns Y.Node
    */
    _addColgroupNode: function(tableNode) {
        // Add COLs to DOCUMENT FRAGMENT
        var len = this.get("columnset").keys.length,
            i = 0,
            allCols = ["<colgroup>"];

        for(; i<len; ++i) {
            allCols.push(TEMPLATE_COL);
        }

        allCols.push("</colgroup>");

        // Create COLGROUP
        this._colgroupNode = tableNode.insertBefore(Ycreate(allCols.join("")), tableNode.get("firstChild"));

        return this._colgroupNode;
    },

    /**
    * Creates and attaches THEAD element to given container.
    *
    * @method _addTheadNode
    * @param tableNode {Y.Node} Parent node.
    * @protected
    * @returns Y.Node
    */
    _addTheadNode: function(tableNode) {
        if(tableNode) {
            this._theadNode = tableNode.insertBefore(Ycreate(TEMPLATE_THEAD), this._colgroupNode.next());
            return this._theadNode;
        }
    },

    /**
    * Creates and attaches TBODY element to given container.
    *
    * @method _addTbodyNode
    * @param tableNode {Y.Node} Parent node.
    * @protected
    * @returns Y.Node
    */
    _addTbodyNode: function(tableNode) {
        this._tbodyNode = tableNode.appendChild(Ycreate(TEMPLATE_TBODY));
        return this._tbodyNode;
    },

    /**
    * Creates and attaches message display element to given container.
    *
    * @method _addMessageNode
    * @param tableNode {Y.Node} Parent node.
    * @protected
    * @returns Y.Node
    */
    _addMessageNode: function(tableNode) {
        this._msgNode = tableNode.insertBefore(Ycreate(TEMPLATE_MSG), this._tbodyNode);
        return this._msgNode;
    },

    /**
    * Creates and attaches CAPTION element to given container.
    *
    * @method _addCaptionNode
    * @param tableNode {Y.Node} Parent node.
    * @protected
    * @returns Y.Node
    */
    _addCaptionNode: function(tableNode) {
        this._captionNode = tableNode.createCaption();
        return this._captionNode;
    },

    ////////////////////////////////////////////////////////////////////////////
    //
    // BIND
    //
    ////////////////////////////////////////////////////////////////////////////

    /**
    * Binds events.
    *
    * @method bindUI
    * @private
    */
    bindUI: function() {
        var tableNode = this._tableNode,
            contentBox = this.get("contentBox"),
            theadFilter = "thead."+CLASS_COLUMNS+">tr>th",
            tbodyFilter ="tbody."+CLASS_DATA+">tr>td",
            msgFilter = "tbody."+CLASS_MSG+">tr>td";
            
        // Define custom events that wrap DOM events. Simply pass through DOM
        // event facades.
        //TODO: do we need queuable=true?
        //TODO: can i condense this?
        
        
        
        // FOCUS EVENTS
        /**
         * Fired when a TH element has a focus.
         *
         * @event theadCellFocus
         */
        this.publish("theadCellFocus", {defaultFn: this._defTheadCellFocusFn, emitFacade:false, queuable:true});
        /**
         * Fired when a THEAD>TR element has a focus.
         *
         * @event theadRowFocus
         */
        this.publish("theadRowFocus", {defaultFn: this._defTheadRowFocusFn, emitFacade:false, queuable:true});
        /**
         * Fired when the THEAD element has a focus.
         *
         * @event theadFocus
         */
        this.publish("theadFocus", {defaultFn: this._defTheadFocusFn, emitFacade:false, queuable:true});
        /**
         * Fired when a TBODY.data>TD element has a focus.
         *
         * @event tbodyCellFocus
         */
        this.publish("tbodyCellFocus", {defaultFn: this._defTbodyCellFocusFn, emitFacade:false, queuable:true});
        /**
         * Fired when a TBODY.data>TR element has a focus.
         *
         * @event tbodyRowFocus
         */
        this.publish("tbodyRowFocus", {defaultFn: this._defTbodyRowFocusFn, emitFacade:false, queuable:true});
        /**
         * Fired when the TBODY.data element has a focus.
         *
         * @event tbodyFocus
         */
        this.publish("tbodyFocus", {defaultFn: this._defTbodyFocusFn, emitFacade:false, queuable:true});
        /**
         * Fired when a TBODY.msg>TD element has a focus.
         *
         * @event msgCellFocus
         */
        this.publish("msgCellFocus", {defaultFn: this._defMsgCellFocusFn, emitFacade:false, queuable:true});
        /**
         * Fired when a TBODY.msg>TR element has a focus.
         *
         * @event msgRowFocus
         */
        this.publish("msgRowFocus", {defaultFn: this._defMsgRowFocusFn, emitFacade:false, queuable:true});
        /**
         * Fired when the TBODY.msg element has a focus.
         *
         * @event msgTbodyFocus
         */
        this.publish("msgTbodyFocus", {defaultFn: this._defMsgTbodyFocusFn, emitFacade:false, queuable:true});

        
        
        // KEYDOWN EVENTS
        /**
         * Fired when a TH element has a keydown.
         *
         * @event theadCellKeydown
         */
        this.publish("theadCellKeydown", {defaultFn: this._defTheadCellKeydownFn, emitFacade:false, queuable:true});
        /**
         * Fired when a THEAD>TR element has a keydown.
         *
         * @event theadRowKeydown
         */
        this.publish("theadRowKeydown", {defaultFn: this._defTheadRowKeydownFn, emitFacade:false, queuable:true});
        /**
         * Fired when the THEAD element has a keydown.
         *
         * @event theadKeydown
         */
        this.publish("theadKeydown", {defaultFn: this._defTheadKeydownFn, emitFacade:false, queuable:true});
        /**
         * Fired when a TBODY.data>TD element has a keydown.
         *
         * @event tbodyCellKeydown
         */
        this.publish("tbodyCellKeydown", {defaultFn: this._defTbodyCellKeydownFn, emitFacade:false, queuable:true});
        /**
         * Fired when a TBODY.data>TR element has a keydown.
         *
         * @event tbodyRowKeydown
         */
        this.publish("tbodyRowKeydown", {defaultFn: this._defTbodyRowKeydownFn, emitFacade:false, queuable:true});
        /**
         * Fired when the TBODY.data element has a keydown.
         *
         * @event tbodyKeydown
         */
        this.publish("tbodyKeydown", {defaultFn: this._defTbodyKeydownFn, emitFacade:false, queuable:true});
        /**
         * Fired when a TBODY.msg>TD element has a keydown.
         *
         * @event msgCellKeydown
         */
        this.publish("msgCellKeydown", {defaultFn: this._defMsgCellKeydownFn, emitFacade:false, queuable:true});
        /**
         * Fired when a TBODY.msg>TR element has a keydown.
         *
         * @event msgRowKeydown
         */
        this.publish("msgRowKeydown", {defaultFn: this._defMsgRowKeydownFn, emitFacade:false, queuable:true});
        /**
         * Fired when the TBODY.msg element has a keydown.
         *
         * @event msgTbodyKeydown
         */
        this.publish("msgTbodyKeydown", {defaultFn: this._defMsgTbodyKeydownFn, emitFacade:false, queuable:true});



        // FOCUS EVENTS
        /**
         * Fired when a TH element has a mouseenter.
         *
         * @event theadCellMouseenter
         */
        this.publish("theadCellMouseenter", {defaultFn: this._defTheadCellMouseenterFn, emitFacade:false, queuable:true});
        /**
         * Fired when a THEAD>TR element has a mouseenter.
         *
         * @event theadRowMouseenter
         */
        this.publish("theadRowMouseenter", {defaultFn: this._defTheadRowMouseenterFn, emitFacade:false, queuable:true});
        /**
         * Fired when the THEAD element has a mouseenter.
         *
         * @event theadMouseenter
         */
        this.publish("theadMouseenter", {defaultFn: this._defTheadMouseenterFn, emitFacade:false, queuable:true});
        /**
         * Fired when a TBODY.data>TD element has a mouseenter.
         *
         * @event tbodyCellMouseenter
         */
        this.publish("tbodyCellMouseenter", {defaultFn: this._defTbodyCellMouseenterFn, emitFacade:false, queuable:true});
        /**
         * Fired when a TBODY.data>TR element has a mouseenter.
         *
         * @event tbodyRowMouseenter
         */
        this.publish("tbodyRowMouseenter", {defaultFn: this._defTbodyRowMouseenterFn, emitFacade:false, queuable:true});
        /**
         * Fired when the TBODY.data element has a mouseenter.
         *
         * @event tbodyMouseenter
         */
        this.publish("tbodyMouseenter", {defaultFn: this._defTbodyMouseenterFn, emitFacade:false, queuable:true});
        /**
         * Fired when a TBODY.msg>TD element has a mouseenter.
         *
         * @event msgCellMouseenter
         */
        this.publish("msgCellMouseenter", {defaultFn: this._defMsgCellMouseenterFn, emitFacade:false, queuable:true});
        /**
         * Fired when a TBODY.msg>TR element has a mouseenter.
         *
         * @event msgRowMouseenter
         */
        this.publish("msgRowMouseenter", {defaultFn: this._defMsgRowMouseenterFn, emitFacade:false, queuable:true});
        /**
         * Fired when the TBODY.msg element has a mouseenter.
         *
         * @event msgTbodyMouseenter
         */
        this.publish("msgTbodyMouseenter", {defaultFn: this._defMsgTbodyMouseenterFn, emitFacade:false, queuable:true});



        // FOCUS EVENTS
        /**
         * Fired when a TH element has a mouseleave.
         *
         * @event theadCellMouseleave
         */
        this.publish("theadCellMouseleave", {defaultFn: this._defTheadCellMouseleaveFn, emitFacade:false, queuable:true});
        /**
         * Fired when a THEAD>TR element has a mouseleave.
         *
         * @event theadRowMouseleave
         */
        this.publish("theadRowMouseleave", {defaultFn: this._defTheadRowMouseleaveFn, emitFacade:false, queuable:true});
        /**
         * Fired when the THEAD element has a mouseleave.
         *
         * @event theadMouseleave
         */
        this.publish("theadMouseleave", {defaultFn: this._defTheadMouseleaveFn, emitFacade:false, queuable:true});
        /**
         * Fired when a TBODY.data>TD element has a mouseleave.
         *
         * @event tbodyCellMouseleave
         */
        this.publish("tbodyCellMouseleave", {defaultFn: this._defTbodyCellMouseleaveFn, emitFacade:false, queuable:true});
        /**
         * Fired when a TBODY.data>TR element has a mouseleave.
         *
         * @event tbodyRowMouseleave
         */
        this.publish("tbodyRowMouseleave", {defaultFn: this._defTbodyRowMouseleaveFn, emitFacade:false, queuable:true});
        /**
         * Fired when the TBODY.data element has a mouseleave.
         *
         * @event tbodyMouseleave
         */
        this.publish("tbodyMouseleave", {defaultFn: this._defTbodyMouseleaveFn, emitFacade:false, queuable:true});
        /**
         * Fired when a TBODY.msg>TD element has a mouseleave.
         *
         * @event msgCellMouseleave
         */
        this.publish("msgCellMouseleave", {defaultFn: this._defMsgCellMouseleaveFn, emitFacade:false, queuable:true});
        /**
         * Fired when a TBODY.msg>TR element has a mouseleave.
         *
         * @event msgRowMouseleave
         */
        this.publish("msgRowMouseleave", {defaultFn: this._defMsgRowMouseleaveFn, emitFacade:false, queuable:true});
        /**
         * Fired when the TBODY.msg element has a mouseleave.
         *
         * @event msgTbodyMouseleave
         */
        this.publish("msgTbodyMouseleave", {defaultFn: this._defMsgTbodyMouseleaveFn, emitFacade:false, queuable:true});



        // FOCUS EVENTS
        /**
         * Fired when a TH element has a mouseup.
         *
         * @event theadCellMouseup
         */
        this.publish("theadCellMouseup", {defaultFn: this._defTheadCellMouseupFn, emitFacade:false, queuable:true});
        /**
         * Fired when a THEAD>TR element has a mouseup.
         *
         * @event theadRowMouseup
         */
        this.publish("theadRowMouseup", {defaultFn: this._defTheadRowMouseupFn, emitFacade:false, queuable:true});
        /**
         * Fired when the THEAD element has a mouseup.
         *
         * @event theadMouseup
         */
        this.publish("theadMouseup", {defaultFn: this._defTheadMouseupFn, emitFacade:false, queuable:true});
        /**
         * Fired when a TBODY.data>TD element has a mouseup.
         *
         * @event tbodyCellMouseup
         */
        this.publish("tbodyCellMouseup", {defaultFn: this._defTbodyCellMouseupFn, emitFacade:false, queuable:true});
        /**
         * Fired when a TBODY.data>TR element has a mouseup.
         *
         * @event tbodyRowMouseup
         */
        this.publish("tbodyRowMouseup", {defaultFn: this._defTbodyRowMouseupFn, emitFacade:false, queuable:true});
        /**
         * Fired when the TBODY.data element has a mouseup.
         *
         * @event tbodyMouseup
         */
        this.publish("tbodyMouseup", {defaultFn: this._defTbodyMouseupFn, emitFacade:false, queuable:true});
        /**
         * Fired when a TBODY.msg>TD element has a mouseup.
         *
         * @event msgCellMouseup
         */
        this.publish("msgCellMouseup", {defaultFn: this._defMsgCellMouseupFn, emitFacade:false, queuable:true});
        /**
         * Fired when a TBODY.msg>TR element has a mouseup.
         *
         * @event msgRowMouseup
         */
        this.publish("msgRowMouseup", {defaultFn: this._defMsgRowMouseupFn, emitFacade:false, queuable:true});
        /**
         * Fired when the TBODY.msg element has a mouseup.
         *
         * @event msgTbodyMouseup
         */
        this.publish("msgTbodyMouseup", {defaultFn: this._defMsgTbodyMouseupFn, emitFacade:false, queuable:true});



        // FOCUS EVENTS
        /**
         * Fired when a TH element has a mousedown.
         *
         * @event theadCellMousedown
         */
        this.publish("theadCellMousedown", {defaultFn: this._defTheadCellMousedownFn, emitFacade:false, queuable:true});
        /**
         * Fired when a THEAD>TR element has a mousedown.
         *
         * @event theadRowMousedown
         */
        this.publish("theadRowMousedown", {defaultFn: this._defTheadRowMousedownFn, emitFacade:false, queuable:true});
        /**
         * Fired when the THEAD element has a mousedown.
         *
         * @event theadMousedown
         */
        this.publish("theadMousedown", {defaultFn: this._defTheadMousedownFn, emitFacade:false, queuable:true});
        /**
         * Fired when a TBODY.data>TD element has a mousedown.
         *
         * @event tbodyCellMousedown
         */
        this.publish("tbodyCellMousedown", {defaultFn: this._defTbodyCellMousedownFn, emitFacade:false, queuable:true});
        /**
         * Fired when a TBODY.data>TR element has a mousedown.
         *
         * @event tbodyRowMousedown
         */
        this.publish("tbodyRowMousedown", {defaultFn: this._defTbodyRowMousedownFn, emitFacade:false, queuable:true});
        /**
         * Fired when the TBODY.data element has a mousedown.
         *
         * @event tbodyMousedown
         */
        this.publish("tbodyMousedown", {defaultFn: this._defTbodyMousedownFn, emitFacade:false, queuable:true});
        /**
         * Fired when a TBODY.msg>TD element has a mousedown.
         *
         * @event msgCellMousedown
         */
        this.publish("msgCellMousedown", {defaultFn: this._defMsgCellMousedownFn, emitFacade:false, queuable:true});
        /**
         * Fired when a TBODY.msg>TR element has a mousedown.
         *
         * @event msgRowMousedown
         */
        this.publish("msgRowMousedown", {defaultFn: this._defMsgRowMousedownFn, emitFacade:false, queuable:true});
        /**
         * Fired when the TBODY.msg element has a mousedown.
         *
         * @event msgTbodyMousedown
         */
        this.publish("msgTbodyMousedown", {defaultFn: this._defMsgTbodyMousedownFn, emitFacade:false, queuable:true});



        // CLICK EVENTS
        /**
         * Fired when a TH element has a click.
         *
         * @event theadCellClick
         */
        this.publish("theadCellClick", {defaultFn: this._defTheadCellClickFn, emitFacade:false, queuable:true});
        /**
         * Fired when a THEAD>TR element has a click.
         *
         * @event theadRowClick
         */
        this.publish("theadRowClick", {defaultFn: this._defTheadRowClickFn, emitFacade:false, queuable:true});
        /**
         * Fired when the THEAD element has a click.
         *
         * @event theadClick
         */
        this.publish("theadClick", {defaultFn: this._defTheadClickFn, emitFacade:false, queuable:true});
        /**
         * Fired when a TBODY.data>TD element has a click.
         *
         * @event tbodyCellClick
         */
        this.publish("tbodyCellClick", {defaultFn: this._defTbodyCellClickFn, emitFacade:false, queuable:true});
        /**
         * Fired when a TBODY.data>TR element has a click.
         *
         * @event tbodyRowClick
         */
        this.publish("tbodyRowClick", {defaultFn: this._defTbodyRowClickFn, emitFacade:false, queuable:true});
        /**
         * Fired when the TBODY.data element has a click.
         *
         * @event tbodyClick
         */
        this.publish("tbodyClick", {defaultFn: this._defTbodyClickFn, emitFacade:false, queuable:true});
        /**
         * Fired when a TBODY.msg>TD element has a click.
         *
         * @event msgCellClick
         */
        this.publish("msgCellClick", {defaultFn: this._defMsgCellClickFn, emitFacade:false, queuable:true});
        /**
         * Fired when a TBODY.msg>TR element has a click.
         *
         * @event msgRowClick
         */
        this.publish("msgRowClick", {defaultFn: this._defMsgRowClickFn, emitFacade:false, queuable:true});
        /**
         * Fired when the TBODY.msg element has a click.
         *
         * @event msgTbodyClick
         */
        this.publish("msgTbodyClick", {defaultFn: this._defMsgTbodyClickFn, emitFacade:false, queuable:true});
        
        
        
        
        // DBLCLICK EVENTS
        /**
         * Fired when a TH element has a dblclick.
         *
         * @event theadCellDblclick
         */
        this.publish("theadCellDblclick", {defaultFn: this._defTheadCellDblclickFn, emitFacade:false, queuable:true});
        /**
         * Fired when a THEAD>TR element has a dblclick.
         *
         * @event theadRowDblclick
         */
        this.publish("theadRowDblclick", {defaultFn: this._defTheadRowDblclickFn, emitFacade:false, queuable:true});
        /**
         * Fired when the THEAD element has a dblclick.
         *
         * @event theadDblclick
         */
        this.publish("theadDblclick", {defaultFn: this._defTheadDblclickFn, emitFacade:false, queuable:true});
        /**
         * Fired when a TBODY.data>TD element has a dblclick.
         *
         * @event tbodyCellDblclick
         */
        this.publish("tbodyCellDblclick", {defaultFn: this._defTbodyCellDblclickFn, emitFacade:false, queuable:true});
        /**
         * Fired when a TBODY.data>TR element has a dblclick.
         *
         * @event tbodyRowDblclick
         */
        this.publish("tbodyRowDblclick", {defaultFn: this._defTbodyRowDblclickFn, emitFacade:false, queuable:true});
        /**
         * Fired when the TBODY.data element has a dblclick.
         *
         * @event tbodyDblclick
         */
        this.publish("tbodyDblclick", {defaultFn: this._defTbodyDblclickFn, emitFacade:false, queuable:true});
        /**
         * Fired when a TBODY.msg>TD element has a dblclick.
         *
         * @event msgCellDblclick
         */
        this.publish("msgCellDblclick", {defaultFn: this._defMsgCellDblclickFn, emitFacade:false, queuable:true});
        /**
         * Fired when a TBODY.msg>TR element has a dblclick.
         *
         * @event msgRowDblclick
         */
        this.publish("msgRowDblclick", {defaultFn: this._defMsgRowDblclickFn, emitFacade:false, queuable:true});
        /**
         * Fired when the TBODY.msg element has a dblclick.
         *
         * @event msgTbodyDblclick
         */
        this.publish("msgTbodyDblclick", {defaultFn: this._defMsgTbodyDblclickFn, emitFacade:false, queuable:true});



        // Bind to THEAD DOM events
        tableNode.delegate(FOCUS, this._onDomEvent, theadFilter, this, "theadCellFocus");
        tableNode.delegate(KEYDOWN, this._onDomEvent, theadFilter, this, "theadCellKeydown");
        tableNode.delegate(MOUSEENTER, this._onDomEvent, theadFilter, this, "theadCellMouseenter");
        tableNode.delegate(MOUSELEAVE, this._onDomEvent, theadFilter, this, "theadCellMouseleave");
        tableNode.delegate(MOUSEUP, this._onDomEvent, theadFilter, this, "theadCellMouseup");
        tableNode.delegate(MOUSEDOWN, this._onDomEvent, theadFilter, this, "theadCellMousedown");
        tableNode.delegate(CLICK, this._onDomEvent, theadFilter, this, "theadCellClick");
        // Since we can't listen for click and dblclick on the same element...
        contentBox.delegate(DBLCLICK, this._onDomEvent, theadFilter, this, "theadCellDblclick");

        // Bind to TBODY DOM events
        tableNode.delegate(FOCUS, this._onDomEvent, tbodyFilter, this, "tbodyCellFocus");
        tableNode.delegate(KEYDOWN, this._onDomEvent, tbodyFilter, this, "tbodyCellKeydown");
        tableNode.delegate(MOUSEENTER, this._onDomEvent, tbodyFilter, this, "tbodyCellMouseenter");
        tableNode.delegate(MOUSELEAVE, this._onDomEvent, tbodyFilter, this, "tbodyCellMouseleave");
        tableNode.delegate(MOUSEUP, this._onDomEvent, tbodyFilter, this, "tbodyCellMouseup");
        tableNode.delegate(MOUSEDOWN, this._onDomEvent, tbodyFilter, this, "tbodyCellMousedown");
        tableNode.delegate(CLICK, this._onDomEvent, tbodyFilter, this, "tbodyCellClick");
        // Since we can't listen for click and dblclick on the same element...
        contentBox.delegate(DBLCLICK, this._onDomEvent, tbodyFilter, this, "tbodyCellDblclick");

        // Bind to message TBODY DOM events
        tableNode.delegate(FOCUS, this._onDomEvent, msgFilter, this, "msgCellFocus");
        tableNode.delegate(KEYDOWN, this._onDomEvent, msgFilter, this, "msgCellKeydown");
        tableNode.delegate(MOUSEENTER, this._onDomEvent, msgFilter, this, "msgCellMouseenter");
        tableNode.delegate(MOUSELEAVE, this._onDomEvent, msgFilter, this, "msgCellMouseleave");
        tableNode.delegate(MOUSEUP, this._onDomEvent, msgFilter, this, "msgCellMouseup");
        tableNode.delegate(MOUSEDOWN, this._onDomEvent, msgFilter, this, "msgCellMousedown");
        tableNode.delegate(CLICK, this._onDomEvent, msgFilter, this, "msgCellClick");
        // Since we can't listen for click and dblclick on the same element...
        contentBox.delegate(DBLCLICK, this._onDomEvent, msgFilter, this, "msgCellDblclick");
    },
    
    /**
    * On DOM event, fires corresponding custom event.
    *
    * @method _onDomEvent
    * @param e {DOMEvent} The original DOM event facade.
    * @param type {String} Corresponding custom event to fire.
    * @private
    */
    _onDomEvent: function(e, type) {
        this.fire(type, e);
    },

    //TODO: abstract this out
    _defTheadCellClickFn: function(e) {
        this.fire("theadRowClick", e);
    },

    _defTheadRowClickFn: function(e) {
        this.fire("theadClick", e);
    },

    _defTheadClickFn: function(e) {
    },

    ////////////////////////////////////////////////////////////////////////////
    //
    // SYNC
    //
    ////////////////////////////////////////////////////////////////////////////

    /**
    * Syncs UI to intial state.
    *
    * @method syncUI
    * @private
    */
    syncUI: function() {
        // THEAD ROWS
        this._uiSetColumnset(this.get("columnset"));
        // DATA ROWS
        this._uiSetRecordset(this.get("recordset"));
        // SUMMARY
        this._uiSetSummary(this.get("summary"));
        // CAPTION
        this._uiSetCaption(this.get("caption"));
    },

    /**
     * Updates summary.
     *
     * @method _uiSetSummary
     * @param val {String} New summary.
     * @protected
     */
    _uiSetSummary: function(val) {
        val = YisValue(val) ? val : "";
        this._tableNode.set("summary", val);
    },

    /**
     * Updates caption.
     *
     * @method _uiSetCaption
     * @param val {String} New caption.
     * @protected
     */
    _uiSetCaption: function(val) {
        val = YisValue(val) ? val : "";
        this._captionNode.setContent(val);
    },


    ////////////////////////////////////////////////////////////////////////////
    //
    // THEAD/COLUMNSET FUNCTIONALITY
    //
    ////////////////////////////////////////////////////////////////////////////
    /**
     * Updates THEAD.
     *
     * @method _uiSetColumnset
     * @param cs {Y.Columnset} New Columnset.
     * @protected
     */
    _uiSetColumnset: function(cs) {
        var tree = cs.tree,
            thead = this._theadNode,
            i = 0,
            len = tree.length,
            parent = thead.get("parentNode"),
            nextSibling = thead.next();
            
        // Move THEAD off DOM
        thead.remove();
        
        thead.get("children").remove(true);

        // Iterate tree of columns to add THEAD rows
        for(; i<len; ++i) {
            this._addTheadTrNode({thead:thead, columns:tree[i]}, (i === 0), (i === len-1));
        }

        // Column helpers needs _theadNode to exist
        //this._createColumnHelpers();

        
        // Re-attach THEAD to DOM
        parent.insert(thead, nextSibling);

     },
     
    /**
    * Creates and attaches header row element.
    *
    * @method _addTheadTrNode
    * @param o {Object} {thead, columns}.
    * @param isFirst {Boolean} Is first row.
    * @param isFirst {Boolean} Is last row.
    * @protected
    */
     _addTheadTrNode: function(o, isFirst, isLast) {
        o.tr = this._createTheadTrNode(o, isFirst, isLast);
        this._attachTheadTrNode(o);
     },
     

    /**
    * Creates header row element.
    *
    * @method _createTheadTrNode
    * @param o {Object} {thead, columns}.
    * @param isFirst {Boolean} Is first row.
    * @param isLast {Boolean} Is last row.
    * @protected
    * @returns Y.Node
    */
    _createTheadTrNode: function(o, isFirst, isLast) {
        //TODO: custom classnames
        var tr = Ycreate(Ysubstitute(this.get("trTemplate"), o)),
            i = 0,
            columns = o.columns,
            len = columns.length,
            column;

         // Set FIRST/LAST class
        if(isFirst) {
            tr.addClass(CLASS_FIRST);
        }
        if(isLast) {
            tr.addClass(CLASS_LAST);
        }

        for(; i<len; ++i) {
            column = columns[i];
            this._addTheadThNode({value:column.get("label"), column: column, tr:tr});
        }

        return tr;
    },

    /**
    * Attaches header row element.
    *
    * @method _attachTheadTrNode
    * @param o {Object} {thead, columns, tr}.
    * @protected
    */
    _attachTheadTrNode: function(o) {
        o.thead.appendChild(o.tr);
    },

    /**
    * Creates and attaches header cell element.
    *
    * @method _addTheadThNode
    * @param o {Object} {value, column, tr}.
    * @protected
    */
    _addTheadThNode: function(o) {
        o.th = this._createTheadThNode(o);
        this._attachTheadThNode(o);
        //TODO: assign all node pointers: thNode, thLinerNode, thLabelNode
        o.column.thNode = o.th;
    },

    /**
    * Creates header cell element.
    *
    * @method _createTheadThNode
    * @param o {Object} {value, column, tr}.
    * @protected
    * @returns Y.Node
    */
    _createTheadThNode: function(o) {
        var column = o.column;
        
        // Populate template object
        o.id = column.get("id");//TODO: validate 1 column ID per document
        o.colspan = column.colSpan;
        o.rowspan = column.rowSpan;
        //TODO o.abbr = column.get("abbr");
        o.classnames = column.get("classnames");
        o.value = Ysubstitute(this.get("thValueTemplate"), o);

        /*TODO
        // Clear minWidth on hidden Columns
        if(column.get("hidden")) {
            //this._clearMinWidth(column);
        }
        */
        
        return Ycreate(Ysubstitute(this.thTemplate, o));
    },

    /**
    * Attaches header cell element.
    *
    * @method _attachTheadThNode
    * @param o {Object} {value, column, tr}.
    * @protected
    */
    _attachTheadThNode: function(o) {
        o.tr.appendChild(o.th);
    },

    ////////////////////////////////////////////////////////////////////////////
    //
    // TBODY/RECORDSET FUNCTIONALITY
    //
    ////////////////////////////////////////////////////////////////////////////
    /**
     * Updates TBODY.
     *
     * @method _uiSetRecordset
     * @param rs {Y.Recordset} New Recordset.
     * @protected
     */
    _uiSetRecordset: function(rs) {
        var i = 0,//TODOthis.get("state.offsetIndex")
            len = rs.getLength(), //TODOthis.get("state.pageLength")
            tbody = this._tbodyNode,
            parent = tbody.get("parentNode"),
            nextSibling = tbody.next(),
            o = {tbody:tbody}; //TODO: not sure best time to do this -- depends on sdt

        // Move TBODY off DOM
        tbody.remove();

        // Iterate Recordset to use existing TR when possible or add new TR
        for(; i<len; ++i) {
            o.record = rs.getRecord(i);
            o.rowindex = i;
            this._addTbodyTrNode(o); //TODO: sometimes rowindex != recordindex
        }
        
        // Re-attach TBODY to DOM
        parent.insert(tbody, nextSibling);
    },

    /**
    * Creates and attaches data row element.
    *
    * @method _addTbodyTrNode
    * @param o {Object} {tbody, record}
    * @protected
    */
    _addTbodyTrNode: function(o) {
        var tbody = o.tbody,
            record = o.record;
        o.tr = tbody.one("#"+record.get("id")) || this._createTbodyTrNode(o);
        this._attachTbodyTrNode(o);
    },

    /**
    * Creates data row element.
    *
    * @method _createTbodyTrNode
    * @param o {Object} {tbody, record}
    * @protected
    * @returns Y.Node
    */
    _createTbodyTrNode: function(o) {
        var tr = Ycreate(Ysubstitute(this.get("trTemplate"), {id:o.record.get("id")})),
            i = 0,
            allKeys = this.get("columnset").keys,
            len = allKeys.length;

        o.tr = tr;
        
        for(; i<len; ++i) {
            o.column = allKeys[i];
            this._addTbodyTdNode(o);
        }
        
        return tr;
    },

    /**
    * Attaches data row element.
    *
    * @method _attachTbodyTrNode
    * @param o {Object} {tbody, record, tr}.
    * @protected
    */
    _attachTbodyTrNode: function(o) {
        var tbody = o.tbody,
            tr = o.tr,
            index = o.rowindex,
            nextSibling = tbody.get("children").item(index) || null,
            isEven = (index%2===0);
            
        if(isEven) {
            tr.replaceClass(CLASS_ODD, CLASS_EVEN);
        }
        else {
            tr.replaceClass(CLASS_EVEN, CLASS_ODD);
        }
        
        tbody.insertBefore(tr, nextSibling);
    },

    /**
    * Creates and attaches data cell element.
    *
    * @method _addTbodyTdNode
    * @param o {Object} {record, column, tr}.
    * @protected
    */
    _addTbodyTdNode: function(o) {
        o.td = this._createTbodyTdNode(o);
        this._attachTbodyTdNode(o);
    },
    
    /**
    * Creates data cell element.
    *
    * @method _createTbodyTdNode
    * @param o {Object} {record, column, tr}.
    * @protected
    * @returns Y.Node
    */
    _createTbodyTdNode: function(o) {
        var column = o.column;
        //TODO: attributes? or methods?
        o.headers = column.get("headers");
        o.classnames = column.get("classnames");
        o.value = this.formatDataCell(o);
        return Ycreate(Ysubstitute(this.tdTemplate, o));
    },
    
    /**
    * Attaches data cell element.
    *
    * @method _attachTbodyTdNode
    * @param o {Object} {record, column, tr, headers, classnames, value}.
    * @protected
    */
    _attachTbodyTdNode: function(o) {
        o.tr.appendChild(o.td);
    },

    /**
     * Returns markup to insert into data cell element.
     *
     * @method formatDataCell
     * @param @param o {Object} {record, column, tr, headers, classnames}.
     */
    formatDataCell: function(o) {
        var record = o.record;
        o.data = record.get("data");
        o.value = record.getValue(o.column.get("field"));
        return Ysubstitute(this.get("tdValueTemplate"), o);
    }
});

Y.namespace("DataTable").Base = DTBase;



}, '@VERSION@' ,{requires:['substitute','widget','recordset-base']});
