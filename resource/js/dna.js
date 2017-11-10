var DNAContainer = function(config) {
    this.x = config.x || 0;
    this.y = config.y || 0;
    this.capacity = 3;
    this.DNAs = 0;
    this.DNAsColor = '';
};

DNAContainer.prototype = {

    addDNA : function(color) {

        this.DNAsColor = color;
        if (this.DNAs >= this.capacity) {
            this.explode();
            return this.infectedContainers();
        }

        ++this.DNAs;

        return true;
    },

    explode : function() {
        this.DNAs = 0;
    },

    infectedContainers : function() {
        // return coordinates of infected containers
        var infected = [];

        infected.push({x: this.x + 1, y: this.y, color: this.DNAsColor});
        infected.push({x: this.x - 1, y: this.y, color: this.DNAsColor});
        infected.push({x: this.x, y: this.y + 1, color: this.DNAsColor});
        infected.push({x: this.x, y: this.y - 1, color: this.DNAsColor});

        return infected;
    }
};

var Board = function(config) {
    this.dimension = config.dimension || {};
    this.DNAContainers = [];
};

Board.prototype = {
    create : function(DNAContainer) {
        var rows = [];
        for (var x=0; x<this.dimension.x; x++) {
            var columns=[];
            for (var y=0; y<this.dimension.y; y++) {
                columns.push(new DNAContainer({
                    x: x,
                    y: y
                }));
            }
            rows.push(columns);
        }

        this.DNAContainers = rows;
    },

    addDNAToContainer : function(color, x, y) {

        var infected = this.DNAContainers[x][y].addDNA(color);

        if (typeof infected === 'boolean') return true;

        for (var count=0; count<infected.length; count++) {
            try {
                this.infectContainers(infected[count]);
            } catch (error) {
                console.log('boundery exceeded.');
            }
        }

    },

    infectContainers : function(infection) {
        this.addDNAToContainer(infection.color, infection.x, infection.y);
    }
};

var GameRenderer = function($) {
    this.boardElement = $('.board');
};

GameRenderer.prototype = {
    render : function(board) {
        var ul = $('<ul></ul>');
        for (var count=0; count<board.DNAContainers.length; count++) {
            var row = $('<li></li>', {class:'board-row'});

            row.append(this.createContainer(board.DNAContainers[count]));

            ul.append(row);
        }
        this.boardElement
            .html('')
            .append(ul);
    },

    createContainer : function(container) {
        var ul = $('<ul></ul>');

        for (var count=0; count<container.length; count++) {

            var dnaContainer = $('<li></li>', {
                class:'dna-container',
                'data-x':container[count].x,
                'data-y':container[count].y,
                'data-color':container[count].DNAsColor,
            });
            for (var x=0; x<container[count].DNAs; x++) {
                dnaContainer.append(this.createDNA());
            }
            ul.append(dnaContainer);
        }

        return ul;
    },

    createDNA : function() {
        var dna = $('<span></span>', {class:'dna'});
        return dna;
    },
};

var board = new Board({
    dimension: {
        x: 3,
        y: 3
    },
});

board.create(DNAContainer);

console.log(board);
$(function() {
    var gameRenderer = new GameRenderer($);
    gameRenderer.render(board);
    var color = 'red';
    $('.board').on('click', '.board-row .dna-container', function() {
        var _this = $(this);

        color = color === 'red' ? 'yellow' : 'red';
        _this.data('color', color);
        console.log(color);
        board.addDNAToContainer(color, _this.data('x'), _this.data('y'));
        gameRenderer.render(board);
    });

});
