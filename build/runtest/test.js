// Init
load("build/runtest/env.js");

window.location = "test/index.html";

window.onload = function(){
    // Load the test runner
    load("jquery-1.2.3.min.js", "dist/jquery-utils.js","build/runtest/testrunner.js");
    
    // Load the tests
    load(
        "test/unit/jquery.anchorHandler.js",
        "test/unit/jquery.cookie.js",
        "test/unit/jquery.countdown.js",
        "test/unit/jquery.valid.js",
        "test/unit/jquery.strings.js"

    );
    
    // Display the results
    results();
};
