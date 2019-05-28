require.config({
    paths: {
        "jquery": "https://ajax.aspnetcdn.com/ajax/jQuery/jquery-3.4.1.min",
        "tgraph": "../../tgraph/dist/tgraph.bundle"
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
            $d.html(`<p><b>${node.name}</b></p><br><p>${node.label}</p><br><p>hover ${node.hoverColor}</p><br><p>normal ${node.color}</p>`);
            $d.show();
        }
        options.onNodeClickAction = function (node) {
            console.log(node.material);
        }
        let graphView = new tgraph.GraphView('.graph', options);
        graphView.draw(graph);
    });
});


