(function() {
        // Crash variables
        crashCymbolAll = $('#Crash');
        crashCymbol = $('#Crash-Cymbol');
        crashAudio = $('#Crash-Audio');
    
        // Crash timeline
        var crashtl = new TimelineMax({
            paused: true
        });
        crashtl.to(crashCymbol, 0.1, {rotation: 8, transformOrigin: "50% 50%"})
               .to(crashCymbol,1.5, {rotation: 0, transformOrigin: "50% 50%", ease: Elastic.easeOut.config(2.5, 0.3)});
    
        // Crash play
        window.crash = function() {
            crashtl.restart();
            crashtl.play();
            var crashAudioEl = crashAudio.get(0);
            crashAudioEl.currentTime = 0;
            crashAudioEl.play();
        }
    
        // Do the crash stuff when clicked/touched
        var clickTouchCrashDone = false;
        crashCymbolAll.on("touchstart click", function() {
            if(!clickTouchCrashDone) {
                clickTouchCrashDone = true;
                setTimeout(function() {
                    clickTouchCrashDone = false;
                }, 100);
                crash();
                return false;
            }
        });
    
        // Right tom drum variables
        rightTomDrumAll = $('#Tom-Right-All');
        rightTomDrum = $('#Tom-Right-Drum');
        smallTomAudio = $('#Small-Rack-Tom-Audio');
    
        // Right tom drum timeline
        var rightTomtl = new TimelineMax({
            paused: true
        });
        rightTomtl.to(rightTomDrum, 0.1, {scaleX: 1.04, transformOrigin: "50% 50%", ease: Expo.easeOut})
                  .to(rightTomDrum, 0.1, {scaleY: 0.95, transformOrigin: "50% 50%", ease: Expo.easeOut}, '0')
                  .to(rightTomDrumAll, 0.1, {rotation: 2.5, transformOrigin: "0 50%", ease: Elastic.easeOut}, '0')
                  .to(rightTomDrum, 0.4, {scale: 1, transformOrigin: "50% 50%", ease: Elastic.easeOut})
                  .to(rightTomDrumAll, 0.6, {rotation: 0, transformOrigin: "0 50%", ease: Elastic.easeOut}, '-=0.4');
    
        // Right tom play
        window.rightTom = function() {
            rightTomtl.restart();
            rightTomtl.play();
            var smallTomAudioEl = smallTomAudio.get(0);
            smallTomAudioEl.currentTime = 0;
            smallTomAudioEl.play();
        }
    
        // Do the right tom stuff when clicked/touched
        var clickTouchRTDrumDone = false;
        rightTomDrumAll.on("touchstart click", function() {
            if(!clickTouchRTDrumDone) {
                clickTouchRTDrumDone = true;
                setTimeout(function() {
                    clickTouchRTDrumDone = false;
                }, 100);
                rightTom();
                return false;
            }
        });
    
    // Show/hide sequencer variables
    sequencerVisible = false;

    // Show/hide sequencer
    $('#sequencer-visible-btn').click(function () {
        // Changes the flex-grow value
        $("#container-sequencer").toggleClass("collapse");
        if (sequencerVisible === false) {
            sequencerVisible = true;
        }  else {
            sequencerVisible = false;
        }
        // This class hides the drums on smaller screens
        $("#container-drums").toggleClass("screen-sm-hidden");
    });

    // Sequencer varibles
    rows = $('.row');
    rowLength = rows.first().children().length;
    labels = $('label');
    // Beat starts at 1 because 0 is the img for each row
    beat = 1;
    // Sequencer varibles
    rows = $('.row');
    rowLength = rows.first().children().length;
    labels = $('label');
    // Beat starts at 1 because 0 is the img for each row
    beat = 1;

    // Sequencer
    function sequencer () {
    labels.removeClass('active');
        // Do this function for each .row
    $(rows).each(function() {
        // Select the child element at the "beat" index
        current = $(this).children().eq(beat);
        current.addClass('active');
        // If the current input is checked do some stuff!
        if (current.find('input').is(":checked")) {
        targetDrum = (current.parent().attr('data-target-drum'));
                // If there a function that shares the same name as the data attribue, do it!
                fn = window[targetDrum];
                if (typeof fn === "function") {
                    fn();
                }
        }
    });
        // If we get to the last child, start over
    if ( beat < (rowLength - 1) ) {
        ++beat;
    } else {
        beat = 1;
    }
    }

    // Start/Stop Sequencer varibles
    sequencerOn = false;

    // Start/Stop Sequencer
    $('#sequencer-active-btn').click(function () {
        $(this).find('i').toggleClass('fa-pause');
        if (sequencerOn === false) {
            intervalId = window.setInterval(sequencer, interval);
            sequencerOn = true;
        } else {
            window.clearInterval(intervalId);
            sequencerOn = false;
        }
    });

    // Tempo varibles
    bpm = 150;
    interval = 60000 / bpm;

    // Set tempo
    function setTempo() {
        window.clearInterval(intervalId);
        intervalId = window.setInterval(sequencer, interval);
    }

    // Increase tempo
    $('#bpm-increase-btn').click(function() {
        if ( bpm < 300 ) {
            bpm = parseInt($('#bpm-indicator').val());
            bpm += 10;
            interval = 60000 / bpm;
            $('#bpm-indicator').val(bpm);
            if(sequencerOn === true) {
                setTempo();
            }
        }
    });

    //Decrease tempo
    $('#bpm-decrease-btn').click(function() {
        if ( bpm > 100 ) {
            bpm = parseInt($('#bpm-indicator').val());
            bpm -= 10;
            interval = 60000 / bpm;
            $('#bpm-indicator').val(bpm);
            if(sequencerOn === true) {
                setTempo();
            }
        }
    });

    // Trigger drum on input check
    $('input').click(function() {
        if (sequencerOn === false) {
            if ($(this).is(":checked")) {
                targetDrum = $(this).parents(".row").attr('data-target-drum');
                fn = window[targetDrum];
                if (typeof fn === "function") {
                    fn();
                }
            }
        }
    });

    // Load audio on iOS devices on the first user interaction, because...
    $('#sequencer-visible-btn').one('click', function() {
        $("audio").each(function(i) {
            this.play();
            this.pause();
        });
    });

});
