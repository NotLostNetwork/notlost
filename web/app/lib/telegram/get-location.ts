import WebApp from "@twa-dev/sdk"

export const getLocation = () => {
  // Handle location data
  // console.log(window.Telegram.WebApp.LocationManager);

  WebApp.LocationManager.init(() => {
    if (WebApp.LocationManager.isInited) {
      console.log("LocationManager initialized successfully.")

      // Now you can use location-related features
      WebApp.LocationManager.openSettings()
    } else {
      console.log("Failed to initialize LocationManager.")
    }
  })
  WebApp.LocationManager.getLocation((locationData) => {
    if (locationData) {
      //setLocationData(locationData)
      // console.log("Location data received:", locationData);
      // console.log("Latitude:", locationData.latitude);
      // console.log("Longitude:", locationData.longitude);
      // console.log("Accuracy:", locationData.accuracy, "meters");
    } else {
      console.log("Access to location was not granted.")
    }
  })

  WebApp.LocationManager.getLocation((locationData) => {
    if (!locationData) {
      console.warn("User denied access to location data.")
      alert("Location access is required for this feature.")
    } else {
      console.log("Location data:", locationData)
    }
  })
}
