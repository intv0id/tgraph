require.config({
    paths: {
        "jquery": "https://code.jquery.com/jquery-3.4.1.min",
        "tgraph": "../dist/tgraph.bundle"
    }
});

require(["jquery", "tgraph"], function (jquery, tgraph) {
    jquery.getJSON('./github.json', function (jsonGraph) {
        let graph = new tgraph.Graph();
        graph.deserialize(jsonGraph);
        let options = new tgraph.GraphOptions();
        options.shader = "lambert";
        options.onExitHover = function (node) {
            let $d = $('.label');
            $d.empty();
            $d.hide();
        }
        options.onEnterHover = function (node) {
            let $d = $('.label');
            $d.html(`<p><b>${node.name}</b></p><br><p>${node.label}</p>`);
            $d.show();
        }
        let graphView = new tgraph.GraphView('.graph', options);
        graphView.draw(graph);
    });
});


