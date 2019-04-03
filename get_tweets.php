<?php

	require_once('TwitterAPIExchange.php');
	 
	// Set access tokens: https://dev.twitter.com/apps/
	$settings = array(
	    'oauth_access_token' => "69072210-VuXfka9AgFCYzehVSTI1P0gBAQCPn8YK43aNQjc77",
	    'oauth_access_token_secret' => "j9AKqTzexMGmx71Z2BWsscZntnzcXUohDNT0DiuUIjR6z",
	    'consumer_key' => "MRldW5bC92XmHUKUYI3kGyPV3",
	    'consumer_secret' => "RGKZvC8wl0ucg3dUDTFcgXBQATLzK8XXCTJqtnogmagL3dS1dC"
	);

    $q = $_REQUEST["q"];
	// Choose URL and Request Method
	$url = "https://api.twitter.com/1.1/search/tweets.json";
	$getfield = '?q=#'. $q .'+%3A%29+filter:safe&lang=en'; // queries start with ? and are strung together with &
	$requestMethod = "GET";
	
	//Perform the request!
	$twitter = new TwitterAPIExchange($settings);
	echo $twitter->setGetfield($getfield)
	             ->buildOauth($url, $requestMethod)
	             ->performRequest();

?>
