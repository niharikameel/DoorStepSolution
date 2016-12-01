
!function() {
    websocket = new Websocket("ws://echo.websocket.org/");
    websocket.onopen = function (evt) {
        console.log("OPEN");
        for (var i = 1, i<=
        10, i++
        )
        {
            console.log("outgoing:" +i);
            websocket.send(i);
        }
    };
    websocket.onclose = function (evt) {
        console.log("CLOSED")
    };
    websocket.onmessage = function (evt) {
        console.log("INCOMING:" + evt.data);

    };
    websocket.onerror = function (evt) {
        console.log("Error", evt);
    };

};