<?php
	/* Send an SMS using Twilio. You can run this file 3 different ways:
	 *
	 * - Save it as sendnotifications.php and at the command line, run 
	 *        php sendnotifications.php
	 *
	 * - Upload it to a web host and load mywebhost.com/sendnotifications.php 
	 *   in a web browser.
	 * - Download a local server like WAMP, MAMP or XAMPP. Point the web root 
	 *   directory to the folder containing this file, and load 
	 *   localhost:8888/sendnotifications.php in a web browser.
	 */

	// Step 1: Download the Twilio-PHP library from twilio.com/docs/libraries, 
	// and move it into the folder containing this file.
	require "twilio/Services/Twilio.php";


	// Step 2: set our AccountSid and AuthToken from www.twilio.com/user/account
	$AccountSid = "ACa177f99c6e073feb7802ac948ae814e1";
	$AuthToken = "effeb650f28c6ec9b9c7e6fce998b468";

	// Step 3: instantiate a new Twilio Rest Client
	$client = new Services_Twilio($AccountSid, $AuthToken);

	// Step 4: make an array of people we know, to send them a message. 
	// Feel free to change/add your own phone number and name here.
	$friends = $_POST['friends'];
	$numbers = $_POST['numbers'];
	$venue_name = $_POST['venue_name'];
	$venue_url = $_POST['venue_url'];

	// $people = array('+16467251124' => 'Stephan');
	// $venue_name = 'The Biergarten at The Standard';
	
	// Step 5: Loop over all our friends. $number is a phone number above, and 
	// $name is the name next to it
	foreach ($friends as $key => $name) {

		if(substr($numbers[$key], 0, 2) != '+1') {
			$numbers[$key] = '+1'.$numbers[$key];
		}

		$sms = $client->account->sms_messages->create(

		// Step 6: Change the 'From' number below to be a valid Twilio number 
		// that you've purchased, or the (deprecated) Sandbox number
			"+13475235639", 

			// the number we are sending to - Any phone number
			$numbers[$key],

			// the sms body
			"Hey $name, let's meet at - ".$venue_name." at 6pm! Check out on Foursquare: " . $venue_url
		);

		// Display a confirmation message on the screen
		echo "Sent message to $name";
	}