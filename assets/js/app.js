$(document).ready(function() {

  var trainData = new Firebase("https://ljj-train-scheduler.firebaseio.com/");

  $("#submit").on('click', function() {

    trainDest = $("#trainDest").val();
    trainTrck = $("#trainTrck").val();
    trainInit = $("#trainInit").val();
    trainFreq = $("#trainFreq").val();

    // Convert initial time
    // Subtract 1 year to make sure it comes before current time
    trainInit = moment(moment(trainInit,"hh:mm A").subtract(1, "years"),"hh:mm").format("hh:mm A");

    trainData.push({
      trainDest: trainDest,
      trainTrck: trainTrck,
      trainInit: trainInit,
      trainFreq: trainFreq
    });

    $("#trainDest").val("");
    $("#trainTrck").val("");
    $("#trainInit").val("");
    $("#trainFreq").val("");

    return false;
  });

  trainData.on('child_added', function(childSnapshot) {

    var dest = childSnapshot.val().trainDest;
    var trck = childSnapshot.val().trainTrck;
    var init = childSnapshot.val().trainInit;
    var freq = childSnapshot.val().trainFreq;

    
    // Calculate minutes away
    var timeDifference = moment().diff(moment(init,"hh:mm A"),'m');
    var timeRemaining = timeDifference % freq;
    var timeMinsAway = freq - timeRemaining;

    // Calculate next arrival
    var timeNext = moment().add(timeMinsAway,'m');

    // Set variables
    var next = moment(timeNext).format("hh:mm A");
    var away = timeMinsAway;
    
    var row = $('<tr>');
    var cellDest = $('<td>').text(dest);
    var cellTrck = $('<td>').text(trck);
    var cellFreq = $('<td>').text(freq);
    var cellNext = $('<td>').text(next);
    var cellMins = $('<td>').text(away);

    row .append(cellNext)
        .append(cellTrck)
        .append(cellDest)
        .append(cellMins);

    $('#currentTrains').append(row);

  });

  function displayTime() {

    var currentDay = moment().format("dddd, MMMM D YYYY,");

    var currentTime = new Date();
    var hours = currentTime.getHours();
    var minutes = currentTime.getMinutes();
    var seconds = currentTime.getSeconds();

    setInterval(displayTime, 1000);
               
    if (seconds < 10) {
      seconds = "0" + seconds;
    }

    if (minutes < 10) {
      minutes = "0" + minutes;
    }

    var meridiem = "AM";

    if (hours > 12) {
        hours = hours - 12;
        meridiem = "PM";
    }

    if (hours === 0) {
        hours = 12;    
    }

    $('#currentTime').text(
      currentDay + " " + 
      hours + ":" + minutes + ":" + seconds + " " + meridiem);
  }

  displayTime();

}); // Ready wrap