define(['class'],
function(Class) {

var Rectangle = Class.extend({
    x: 0.0,
    y: 0.0,
    width: 0.0,
    height: 0.0,

    init: function(x, y, width, height) {
        this.set(x, y, width, height);
    },

    set: function(x, y, width, height) {
        if(typeof x === 'number') this.x = x;
        if(typeof y === 'number') this.y = y;
        if(typeof width === 'number') this.width = width;
        if(typeof height === 'number') this.height = height;
    },

    /*intersect: function(rectangle) {
        var x, y, height, width;
        y = Math.max(this.y, rectangle.y);
        height = Math.min(this.y + this.height, rectangle.y + rectangle.height) - y;

        if(height < 0) return new Rectangle();
        
        x = Math.max(this.x, rectangle.x);
        width = Math.min(this.x, rectangle.x) - x;

        if(width < 0) return new Rectangle();

        return new Rectangle(x, y, width, height);
    },*/

    top: function() { return this.y; },

    bottom: function() { return this.y + this.height; },

    left: function() { return this.x; },

    right: function() { return this.x + this.width; },

    getLocation: function() { return {x: this.x, y: this.y}; },

    /**
     * vector2 like {x: Number, y: Number};
     */
    containsV2: function(vector2) {
        return (
            vector2.x >= this.x &&
            vector2.x <= this.x + this.width &&
            vector2.y >= this.y &&
            vector2.y <= this.y + this.height
        );
    },

    intersects: function(rectangle) {
        return  this.x < rectangle.x + rectangle.width &&
                this.x + this.width > rectangle.x &&
                this.y < rectangle.y + rectangle.height &&
                this.y + this.height > rectangle.y;
    },

    /**
     * vector2 like {x: Number, y: Number};
     */
    offset: function(vector2) {
        this.x = vector2.x;
        this.y = vector2.y;
    },

    /**
     * vector2 like {x: Number, y: Number};
     */
    setCenter: function(vector2) {
        this.x = vector2.x - this.width/2;
        this.y = vector2.y - this.height/2;
    },

    /**
     * returns an object like {x: Number, y: Number};
     */
    center: function() {
        return {x: this.x - this.width/2, y: this.y - this.height/2};
    },

    clone: function(rectangle) {
        if(typeof rectangle !== 'undefined') {
            rectangle.x = this.x;
            rectangle.y = this.y;
            rectangle.width = this.width;
            rectangle.height = this.height;
        } else {
            rectangle = new Rectangle(this.x, this.y, this.width, this.height);
        }
        return rectangle;
    },

    toString: function() {
        return "<Rectangle>";
    }
});

Rectangle.intersects = function(rec1, rec2) {
    return  rec1.x < rec2.x + rec2.width &&
            rec1.x + rec1.width > rec2.x &&
            rec1.y < rec2.y + rec2.height &&
            rec1.y + rec1.height > rec2.y;
};

return Rectangle;

});