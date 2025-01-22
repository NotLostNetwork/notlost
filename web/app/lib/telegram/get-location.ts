import WebApp from "@twa-dev/sdk"

export const getLocation = () => {
  // Handle location data
  // console.log(window.Telegram.WebApp.LocationManager);

  WebApp.LocationManager.init()
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
