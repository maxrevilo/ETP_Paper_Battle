define(['underscore'], function(_) {
    var Utils = {
        clone: function(item) {
            if (!item) { return item; } // null, undefined values check

            var types = [ Number, String, Boolean ], result;

            // normalizing primitives if someone did new String('aaa'), or new Number('444');
            types.forEach(function(type) { if (item instanceof type)  result = type( item ); });

            if (typeof result == "undefined") {
                if (Object.prototype.toString.call( item ) === "[object Array]") {
                    result = [];
                    item.forEach(function(child, index) {
                        result[index] = Utils.clone( child );
                    });
                } else if (typeof item == "object") {
                    // testign that this is DOM
                    if (item.nodeType && typeof item.cloneNode == "function") {
                        result = item.cloneNode( true );
                    } else if (!item.prototype) { // check that this is a literal
                        // it is an object literal
                        result = {};
                        for (var i in item) {
                            result[i] = Utils.clone( item[i] );
                        }
                    } else {
                        // depending what you would like here,
                        // just keep the reference, or create new object
                        if (false && item.constructor) {
                            // would not advice to do that, reason? Read below
                            result = new item.constructor();
                        } else {
                            result = item;
                        }
                    }
                } else {
                    result = item;
                }
            }

            return result;
        },

        setIfHas: function(object_dest, object_src, attr) {
            var value = object_src[attr];
            if(value !== undefined && value !== null) object_dest[attr] = value;
        }


    };
    return Utils;
});