$('#drum-kit').click(function(){
    location.href = "../index.html";
});
function deleteEntryFromLocalStorage(audioName) {
    const sequencerConfigurationsString = localStorage.getItem('sequencerConfigurations');
    if (sequencerConfigurationsString) {
        let sequencerConfigurations = JSON.parse(sequencerConfigurationsString);

        // Find the index of the entry to delete
        const indexToDelete = sequencerConfigurations.findIndex(config => config.audioName === audioName);

        if (indexToDelete !== -1) {
            // Remove the entry from the array
            sequencerConfigurations.splice(indexToDelete, 1);

            // Update the local storage
            localStorage.setItem('sequencerConfigurations', JSON.stringify(sequencerConfigurations));
        }
    }
}

function updateEntryInLocalStorage(sequencerConfig) {
    const sequencerConfigurationsString = localStorage.getItem('sequencerConfigurations');
    if (sequencerConfigurationsString) {
        let sequencerConfigurations = JSON.parse(sequencerConfigurationsString);

        // Find the index of the entry to update
        const indexToUpdate = sequencerConfigurations.findIndex(config => config.audioName === sequencerConfig.audioName);

        if (indexToUpdate !== -1) {
            // Update the entry in the array
            sequencerConfigurations[indexToUpdate] = sequencerConfig;

            // Update the local storage
            localStorage.setItem('sequencerConfigurations', JSON.stringify(sequencerConfigurations));
        }
    }
}

function editEntry(sequencerConfig, audioNameElement, composerNameElement) {
    // Prompt the user to edit the audio name
    const editedAudioName = prompt('Edit the audio name:', sequencerConfig.audioName);
    if (editedAudioName !== null) {
        sequencerConfig.audioName = editedAudioName;

        // Prompt the user to edit the composer name
        const editedComposerName = prompt('Edit the composer name:', sequencerConfig.composerName);
        if (editedComposerName !== null) {
            sequencerConfig.composerName = editedComposerName;

            // Update the displayed names
            audioNameElement.textContent = sequencerConfig.audioName;
            composerNameElement.textContent = sequencerConfig.composerName;

            // Update the entry in local storage
            updateEntryInLocalStorage(sequencerConfig);
        }
    }
}


// Load sequencer configurations, audio name, and user name from local storage
document.addEventListener('DOMContentLoaded', function () {
    const sequencerConfigurationsString = localStorage.getItem('sequencerConfigurations');
    if (sequencerConfigurationsString) {
        const sequencerConfigurations = JSON.parse(sequencerConfigurationsString);

        // Get the table element where you want to display the configurations
        const audioList = document.getElementById('audioList');

        // Iterate through each stored configuration
        sequencerConfigurations.forEach((sequencerConfig) => {
            // Create elements for the audio name and user name
            const audioNameElement = document.createElement('td');
            audioNameElement.classList.add('p-3');
            audioNameElement.textContent = sequencerConfig.audioName;

            const composerNameElement = document.createElement('td');
            composerNameElement.classList.add('p-3');
            composerNameElement.textContent = sequencerConfig.composerName;

            // Create a button element to play the audio (you might need to add audio data here)
            const playButton = document.createElement('button');
            playButton.classList.add('p-3');
            playButton.classList.add('fa');
            playButton.classList.add('fa-play');
            playButton.addEventListener('click', function () {
                 // Get the index of the current configuration
                const configIndex = sequencerConfigurations.indexOf(sequencerConfig);

                // Create a URL with a query parameter for the configuration index
                const playerPageURL = `../index.html?configIndex=${configIndex}`;

                // Redirect to the main page (sequencer.html) with the configuration index
                window.location.href = playerPageURL;
            });
            const editButton = document.createElement('button');
            editButton.classList.add('p-3');
            editButton.classList.add('fa');
            editButton.classList.add('fa-pen-to-square');
            editButton.addEventListener('click', function () {
                editEntry(sequencerConfig, audioNameElement, composerNameElement);
            });
            const deleteButton = document.createElement('button');
            deleteButton.classList.add('p-3');
            deleteButton.classList.add('fa');
            deleteButton.classList.add('fa-trash');
            deleteButton.addEventListener('click', function () {
                deleteEntryFromLocalStorage(sequencerConfig.audioName);
                audioList.removeChild(audioEntry);
            });

            // Create an action element and append the play button
            const actionElement = document.createElement('td');
            actionElement.classList.add('p-3');
            actionElement.appendChild(playButton);
            actionElement.appendChild(editButton);
            actionElement.appendChild(deleteButton);

            // Create a table row and append the elements
            const audioEntry = document.createElement('tr');
            audioEntry.classList.add('bg-gray-800'); 
            audioEntry.appendChild(audioNameElement);
            audioEntry.appendChild(composerNameElement);
            audioEntry.appendChild(actionElement);

            // Append the audio entry to the table
            audioList.appendChild(audioEntry);
        });
    }
});
