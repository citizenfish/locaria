function getLocation(successCallback,errorCallback) {
	if ("geolocation" in navigator) {
		console.log("geolocation available");
		navigator.geolocation.getCurrentPosition(function(position) {
			console.log("Latitude is :", position.coords.latitude);
			console.log("Longitude is :", position.coords.longitude);
			successCallback([position.coords.longitude,position.coords.latitude])
		},
			function (message) {
				console.log(message);
				errorCallback(message);

			});

	} else {
		console.log("Geolocation not Available");
		errorCallback("Geolocation not Available");
	}
}

export {getLocation}