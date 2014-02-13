function stateChange(newState) {
    setTimeout(function () {
        if (newState == -1) {
            alert('SOUND HAS STOPPED');
        }
    }, 5000);
}
