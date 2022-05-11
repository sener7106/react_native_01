import { StatusBar } from 'expo-status-bar'
import * as Location from 'expo-location'
import { Ionicons } from '@expo/vector-icons'
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from 'react-native'
import React, { useState, useEffect } from 'react'
import { Fontisto } from '@expo/vector-icons'
import { DrawerLayoutAndroid } from 'react-native-web'
const { width: SCREEN_WIDTH } = Dimensions.get('window')
const API_KEY = 'e3fda37f28575ccc297f5fd81464fc73'

const icons = {
  Clouds: 'cloudy',
  Clear: 'day-sunny',
  Atmosphere: 'cloudy-gusts',
  Snow: 'snow',
  Rain: 'rains',
  Drizzle: 'rain',
  Thunderstorm: 'lightning',
}

export default function App() {
  const [city, setCity] = useState('Loading...')
  const [days, setDays] = useState([])
  const [ok, setOk] = useState(true)
  const getWeather = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync()
    if (!granted) {
      setOk(false)
    }
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 5 })
    const location = await Location.reverseGeocodeAsync(
      { latitude, longitude },
      { useGoogleMaps: false },
    )
    setCity(location[0].name)
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`,
    )
    const json = await response.json()
    setDays(json.daily)
  }

  useEffect(() => {
    getWeather()
  }, [])
  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView
        pagingEnabled
        horizontal
        contentContainerstyle={styles.weather}
        showsHorizontalScrollIndicator={false}
      >
        {days.length === 0 ? (
          <View style={{ ...styles.day, alignItems: 'center' }}>
            <ActivityIndicator
              color="white"
              size="large"
              style={{ marginTop: 10 }}
            />
          </View>
        ) : (
          days.map((day, index) => (
            <View key={index} style={styles.day}>
              <Text style={styles.tinyText}>
                {new Date(day.dt * 1000).toString().substring(0, 10)}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                }}
              >
                <Text style={styles.temp}>
                  {parseFloat(day.temp.day).toFixed(1)}
                </Text>
                <Fontisto
                  name={icons[day.weather[0].main]}
                  size={68}
                  color="white"
                />
              </View>
              <Text style={styles.description}>{day.weather[0].main}</Text>
              <Text style={styles.tinyText}>{day.weather[0].description}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#55D030',
  },

  city: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  cityName: {
    fontSize: 48,
    fontWeight: '500',
    color: 'white',
  },
  weather: {},

  day: {
    width: SCREEN_WIDTH,
    alignItems: 'flex-start',
    paddingHorizontal: 20,
  },
  temp: {
    marginTop: 50,
    fontWeight: '600',
    fontSize: 100,
    color: 'white',
  },
  description: {
    marginTop: -10,
    fontSize: 30,
    color: 'white',
    fontWeight: '500',
  },
  tinyText: {
    marginTop: -5,
    fontSize: 25,
    color: 'white',
    fontWeight: '500',
  },
})
