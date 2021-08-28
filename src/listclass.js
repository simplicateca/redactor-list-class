(function(t) {
    t.add('plugin', 'listclass', {
        translations: {
            en: {
                listClass: 'List Formatting',
            },
        },

        modals: {
            // this is variable with modal HTML body
            'listclass': '<form action=""></form>'
        },
    
        ondropdown: {
            list: {
                observe: function (dd) {
                    this._observeList(dd)
                },
            },
        },

        // messages
        onmodal: {
            listclass: {
                open: function (modal, form) {
                    if( this.opts.listClasses ) {
                        this.$modal = modal;
                        this.$form = form;
                        this._setup();
                        this._startingClass()
                    }
                },

                save: function(modal, form) {
                    this.$modal = modal;
                    this.$form = form;
                    this._save();
                }
            }
        },


        init: function(app) {
            this.app = app;
            this.lang = app.lang;
            this.toolbar = app.toolbar;
            this.editor = app.editor;
            this.selection = app.selection;
            this.opts = app.opts;
            this.selectedClass = '';
        },


        // public
        start: function(app) {

            var button   = this.app.toolbar.getButton('lists'),
                dropdown = button.getDropdown(),
                items    = dropdown.items,
                newList  = {
                    liststyle: {
                        title: this.lang.get('listClass'),
                        api: 'plugin.listclass.showModal'
                    }
                };

            button.setDropdown($.extend(items, newList));
        },


        showModal: function () {
            if( this.opts.listClasses ) {
                // open the modal with API
                this.app.api('module.modal.build', {
                    title: 'Choose ' + this.lang.get('listClass'), // the modal title
                    name: 'listclass',         // the modal variable in modals object
                    commands: {
                        cancel: { title: 'Cancel' }, // the cancel button in the modal
                        save:   { title: 'Save' },   // the save button in the modal
                    }
                });
            }
        },


        _setup: function () {

            if (0 === (e = this.$modal.find("#redactor-list-styles")).length) {
                
                var n = this.$modal.getBody();
                fi = t.dom('<div class="form-item" />');
                lb = t.dom('<label for="redactor-list-styles">' + this.lang.get('listClass') + '</label>');
                se = t.dom('<select id="redactor-list-styles" name="class"></select></div>');
                opt = t.dom("<option value=''></option>");
                se.append(opt);

                se.on("change", this._select.bind(this));

                this.opts.listClasses.forEach(function(element) {
                    opt = t.dom(`<option value='${element.class}'>${element.label}</option>`);
                    se.append(opt);
                })
                
                fi.append(lb).append(se);
                n.children().first().append(fi);
            }
        },


        /**
         * set the class that the <select> should load with when the modal opens
         */
         _startingClass: function() {
            this.selectedClass = '';
            
            var currentList = this._getSelectedList()

            if( currentList && currentList.nodes[0].className ) {
                var className = currentList.nodes[0].className
                console.log( className )
                    className = className.replaceAll( /redactor[\w\-]*/ig, '' ).trim()

                // create an array of possible class name string
                var possibleClassNames = this.opts.listClasses
                                            .map(a => a.class)
                                            .sort(function(a, b){
                                                return a.length - b.length;
                                            });

                // try to find a matching class name
                var foundClass = ''
                possibleClassNames.forEach(function(name) {
                    if( className.includes(name) ) {
                        foundClass = name
                    }
                });

                this.$form.find('select[name=class]').val(foundClass);
                this.selectedClass = foundClass;
            }
        },


        /**
         * when the class name <select> changes, store its value
         */
         _select: function(i) {
            var data = this.$form.getData();
            this.selectedClass = data.class ?? '';
        },


        _save: function($modal, $form) {
            this.app.api("module.modal.close")

            var list = this._getSelectedList()
            this._removeClasses( list )
            this.selectedClass.split(" ").forEach( function(className) {
                list.addClass(className)
            });
        },


        _getSelectedList: function() {
            var block  = this.selection.getBlock(),
                parent = $R.dom(block).parents("ul, ol", this.editor.getElement()).last()

            return parent.length ? parent.first() : null
        },


        _observeList: function (dd) {
            var list = this._getSelectedList()
            var button = dd.getItem("liststyle")
            list ? button.enable() : button.disable()
        },


        /**
         * removes all classes from DOM element
         */
         _removeClasses: function(e) {
            if( this.opts.listClasses ) {
                this.opts.listClasses.forEach(function(styleOption) {
                    styleOption.class.split(" ").forEach( function(className) {
                        e.removeClass( className )
                    });
                });
            }
            return e;
        },


    });
})(Redactor);