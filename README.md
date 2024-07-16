# DVT-Interview-Weather-App

## Overview

The **DVT-Interview-Weather-App** is a React Native weather application designed to provide users with the current weather conditions of their location along with a 5-day weather forecast. Developed using Expo for accelerated development, this app leverages the OpenWeatherAPI to fetch real-time weather data and the Google Maps API to display maps of favorited locations.

## Features

- **Current Location Weather**: Displays the current weather of the user's location.
- **5-Day Forecast**: Provides weather forecasts for the next 5 days.
- **Favorite Locations**: Users can add new locations and save them as favorites.
- **Weather Details**: Shows additional information such as minimum and maximum temperature, humidity, wind speed, sunrise, and sunset times.
- **Map Integration**: Utilizes the Google Maps API to display maps of favorited locations.

## Technologies Used

- **React Native**: For building the mobile application.
- **Expo**: To streamline the development process.
- **OpenWeatherAPI**: For fetching weather data.
- **Google Maps API**: For displaying maps of favorited locations.
- **React Navigation**: For navigation (Stack and Drawer).
- **React Native Dotenv**: To store environment variables.
- **React Native Maps**: To render maps.
- **Axios**: For geocoding.

## Setup Instructions

To run the project locally, follow these steps:

1. **Clone the Repository**:
   ```sh
   git clone https://github.com/your-username/DVT-interview-weather-app.git
   cd DVT-interview-weather-app
   ```

2. **Install Dependencies**:
   ```sh
   npm install
   ```

3. **Create a `.env` File**:
   Create a `.env` file in the root folder of the project and provide the necessary API keys:
   ```sh
   GOOGLE_API_KEY='YOUR_KEY'
   OPEN_WEATHER_API_KEY='YOUR_KEY'
   ```

4. **Get API Keys**:
   - **OpenWeatherAPI Key**: Follow the official documentation to get your API key [here](https://openweathermap.org/appid).
   - **Google API Key**: Follow the official documentation to get your API key [here](https://developers.google.com/maps/documentation/android-sdk/overview).

5. **Run the Project**:
   ```sh
   npx expo start
   ```

## Usage

Once the project is up and running, users can:
- View the current weather of their location.
- See a detailed 5-day weather forecast.
- Add new locations and save them as favorites.
- View detailed weather information including temperature, humidity, wind speed, sunrise, and sunset times.
- Display favorited locations on a map.

## Third-Party Libraries

- **React Navigation**: For handling navigation between screens (Stack and Drawer).
- **React Native Dotenv**: To manage environment variables.
- **React Native Maps**: For rendering maps within the application.
- **Axios**: For making HTTP requests, including geocoding requests.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Contributing

Contributions are welcome! Please read the [CONTRIBUTING](CONTRIBUTING.md) file for guidelines on contributing to this project.

## Acknowledgements

- [OpenWeatherAPI](https://openweathermap.org/)
- [Google Maps API](https://developers.google.com/maps/)
- [React Navigation](https://reactnavigation.org/)
- [React Native Dotenv](https://github.com/goatandsheep/react-native-dotenv)
- [React Native Maps](https://github.com/react-native-maps/react-native-maps)
- [Axios](https://github.com/axios/axios)

Feel free to open an issue or submit a pull request for any improvements or bug fixes. Happy coding!
