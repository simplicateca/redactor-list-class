# redactor-list-styles

This redactor plugin adds a new menu item to the `lists` dropdown which provides modal interface to choose from a configurable drop down of class names that you can use to style the list differently.

![redactor list class plugin screenshot](https://simplicate.nyc3.digitaloceanspaces.com/simplicate/assets/site/images/list-class-plugin.png)

This is an early draft of the plugin and any bug reports would be appreciated.

## Installation

If you're using Craft CMS, copy the file `src/listclass.js` from this repository into your `cms/config/redactor/plugins` directory.

## Caveats

* This plugin piggy backs on the same Redactor selection code that lets you toggle a list  between ordered/unordered, and as such it similarly ignores any nested / indented lists and only applies the class name to the highest level parent list that currently selected.

* Class names are lost when toggling list type between `<ol>` and `<ul>`. I may be able to change that in the future, but it doesn't look like it's going to be easy, and I'm not sure how big a need there is for that functionality.

* It's not currently possible to configure two sets of available classes, one for `<ul>` and another set for `<ol>`. Very possible for the future, but not yet implemented.


## Configuration

You can configure the available list styles within your redactor JSON config file:

*Sample Redactor-Config.json*

```
  ...
  "plugins": ["listclass"],
  "listClasses" : [
    { "label": "Two Column",        "class": "two-column" },
    { "label": "Checkmark Bullets", "class": "checkmarks" }
  ]
  ...
```

## Styling lists inside Redactor

If you want your list class names to appear differently within the redactor editor, you'll need to inject some css into your admin panel.

*Sample control-panel.css*

```
    .input .redactor-styles ul.two-column {
        column-count: 2;
    }

    .input .redactor-styles ul.checkmarks li::marker {
        color: green;
        content: '✓  ';
        font-weight: bold;
    }
```

If you're using Craft CMS you could either use a plugin to inject this code into your admin panel, or you can create a module and load your own CSS file.

Here are some resources that might be of assistance:

 - https://plugins.craftcms.com/cp-css
 - https://craftquest.io/livestreams/building-a-craft-module
 - https://craftcms.com/docs/3.x/extend/module-guide.html
 - https://pluginfactory.io/

If you're using Redactor in some other tool, you'll have to do your own digging to figure out how to add CSS in your editor.