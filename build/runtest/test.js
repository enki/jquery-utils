// Init
load("build/runtest/env.js");

window.location = "tests/index.html";

window.onload = function(){
    // Load the test runner
    load("dist/jquery-utils.js","build/runtest/testrunner.js");
    
    // Load the tests
    load(
        "tests/tests.anchorHandler.js",
        "tests/tests.cookie.js",
        "tests/tests.countdown.js"
    );
    
    // Display the results
    results();
};
