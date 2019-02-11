var missionsController = {
    getURLParams: function() {
        var url = decodeURIComponent(window.location.search.substring(1, window.location.search.length));
        var tokens = url.split('&');
        var properties = {};

        tokens.forEach(function(curr) {
            var elem = curr.split('=');
            properties[elem[0]] = elem[1];

        });
        return properties;
    }
};