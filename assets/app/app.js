

var config = {
    apiKey: "AIzaSyBZ-B6sgfxqmqWib2gms9THUWCCHeUdpMc",
    authDomain: "train-schedule-21820.firebaseapp.com",
    databaseURL: "https://train-schedule-21820.firebaseio.com",
    projectId: "train-schedule-21820",
    storageBucket: "train-schedule-21820.appspot.com",
    messagingSenderId: "769214079849"
  };
  firebase.initializeApp(config);

// Create a variable to reference the database
var database = firebase.database();


$('#submit').on('click', function(e){

	e.preventDefault();

	var trainName = $('#train-name').val().trim();
	var trainDestination = $('#destination').val().trim();
	var trainArrival = $('#start-train').val().trim();
	var trainFrequency = $('#frequency').val().trim();
	var firstTimeConverted = moment(trainArrival,"HH:mm").subtract(1,"years");
	console.log(firstTimeConverted);
	$('#train-name').val("");
	$('#destination').val("");
	$('#start-train').val("");
	$('#frequency').val("");

	database.ref().push({
		trainName: trainName,
		trainDestination: trainDestination,
		trainFrequency: trainFrequency,
		trainArrival: firstTimeConverted.format('MM DD YYYY, HH:mm'),
		dateAdded: firebase.database.ServerValue.TIMESTAMP
	});
});



// Retrieve new posts as they are added to our database
//it is going to be called on every child.
database.ref().on("child_added", function(snapshot, prevChildKey) {
  var trains = snapshot.val();

	var currentTime = moment();
	console.log("CURRENT TIME: " + moment(currentTime).format("HH:mm"));

	var diffTime = currentTime.diff(moment(trains.trainArrival),"minutes");
	console.log("DIFFERENCE IN TIME: " + diffTime);
	console.log("train arrival " + trains.trainArrival);
	
	var tRemainder = diffTime % trains.trainFrequency;
	console.log(tRemainder);

	var tMinutesTillTrain = trains.trainFrequency - tRemainder;
	console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

	var nextTrain = currentTime.add(tMinutesTillTrain, "minutes").format("HH:mm");
	console.log("ARRIVAL TIME: " + nextTrain);



  $('#train-schedule').append(
  	'<tr>' + 
  		'<td>' + '<span id="trainName">' + trains.trainName + '</span></td>' + 
  		'<td>' + '<span id="trainDestination">' + trains.trainDestination + '</span></td>' +
  		'<td>' + '<span id="trainFrequency">' + trains.trainFrequency + '</span></td>' +
  		'<td>' + '<span id="trainArrival">' + nextTrain + '</span></td>' +
  		'<td>' + '<span id="trainAway">' + tMinutesTillTrain + '</span></td>' +
  	'</tr>'
  )

  /*console.log(moment(users.userStartDate).format("MM/DD/YYYY"));*/

 // Create Error Handling
}, function(errorObject) {
	console.log("The read is failed: " + errorObject.code);
});



