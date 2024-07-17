import React from 'react';
import {
  View,
  Text,
  Alert,
  Platform,
  PermissionsAndroid,
  TouchableOpacity,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
export default class AddPresent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      curtime: '',
      lat: '',
      lang: '',
      add: '',
      dis: '',
      dis1: '',
      slat: 26.95192,
      slang: 75.77819,
    };
  }
  componentDidMount = async () => {
    await this.checkPermission();

    setInterval(async () => {
      this.setState({
        curtime: new Date().toLocaleString(),
        dis:
          (await this.distance(
            this.state.slat,
            this.state.slang,
            this.state.lat,
            this.state.lang,
            'K',
          )) * 1000,
      });

      await this.calcCrow(
        this.state.slat,
        this.state.slang,
        this.state.lat,
        this.state.lang,
      ).toFixed(1);
    }, 1000);
  };
  checkPermission = async () => {
    Geolocation.getCurrentPosition(
      position => {
        console.log(position.coords.latitude);
        this.setState(
          {
            lat: position.coords.latitude,
            lang: position.coords.longitude,
          },
          () =>
            this.getAddressFromCoordinates(
              position.coords.latitude,
              position.coords.longitude,
            ),
        );
      },
      error => {
        // See error code charts below.
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
    this.getAddressFromCoordinates();
  };

  getAddressFromCoordinates = (latitude, longitude) => {
    console.log(latitude);
    console.log(longitude);
    return new Promise((resolve, reject) => {
      fetch(
        'https://maps.googleapis.com/maps/api/geocode/json?address=' +
          latitude +
          ',' +
          longitude +
          '&key=' +
          'AIzaSyBb3j8Aiv60CadZ_wJS_5wg2KBO6081a_k',
      )
        .then(response => response.json())
        .then(responseJson => {
          if (responseJson.status === 'OK') {
            console.log(responseJson?.results);
            this.setState({add: responseJson?.results?.[0]?.formatted_address});
            resolve(responseJson?.results?.[0]?.formatted_address);
          } else {
            reject('not found');
          }
        })
        .catch(error => {
          reject(error);
        });
    });
  };

  addmap = () => {
    console.log('addmap');
    this.props.navigation.navigate('addmap');
    /*  console.log(
      this.distance(
        this.state.slat,
        this.state.slang,
        this.state.lat,
        this.state.lang,
        'K',
      ) * 1000,
    ); */
    this.setState({
      dis:
        this.distance(
          this.state.slat,
          this.state.slang,
          this.state.lat,
          this.state.lang,
          'K',
        ) * 1000,
    });
  };
  calcCrow = async (lat1, lon1, lat2, lon2) => {
    var R = 6371; // km
    var dLat = this.toRad(lat2 - lat1);
    var dLon = this.toRad(lon2 - lon1);
    var lat1 = this.toRad(lat1);
    var lat2 = this.toRad(lat2);

    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    console.log(d * 1000);
    this.setState({dis1: d});
    return d;
  };

  // Converts numeric degrees to radians
  toRad = Value => {
    return (Value * Math.PI) / 180;
  };

  distance = (lat1, lon1, lat2, lon2, unit) => {
    if (lat1 === lat2 && lon1 === lon2) {
      return 0;
    } else {
      var radlat1 = (Math.PI * lat1) / 180;
      var radlat2 = (Math.PI * lat2) / 180;
      var theta = lon1 - lon2;
      var radtheta = (Math.PI * theta) / 180;
      var dist =
        Math.sin(radlat1) * Math.sin(radlat2) +
        Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = (dist * 180) / Math.PI;
      dist = dist * 60 * 1.1515;
      if (unit === 'K') {
        dist = dist * 1.609344;
        console.log('kkkkkkk', dist);
      }
      if (unit === 'N') {
        console.log('NNNNNNN');
        dist = dist * 0.8684;
      }
      return dist;
    }
  };

  render() {
    const {curtime, add, lat, lang, slat, slang} = this.state;

    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <TouchableOpacity style={{flex: 1, padding: 20}} onPress={this.addmap}>
          <Text>Add mAp</Text>
          <Text style={{marginTop: 30, color: 'red'}}>
            dis={this.state.dis}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={{flex: 1, padding: 20}}>
          <Text>Add mAp</Text>
          <Text style={{marginTop: 30, color: 'red'}}>
            dis={this.state.dis1}
          </Text>
        </TouchableOpacity>

        <Text>Add Present:</Text>
        <View
          style={{
            width: 200,
            height: 50,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text>Address</Text>

          <Text>{add}</Text>
        </View>
        <View
          style={{
            width: 200,
            height: 100,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text>lat:{lat}</Text>

          <Text>lang:{lang}</Text>
        </View>
        <View
          style={{
            width: 200,
            height: 100,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text>slat:{slat}</Text>

          <Text>slang:{slang}</Text>
        </View>
        <View
          style={{
            width: 100,
            height: 70,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 50,
          }}>
          <Text>{curtime}</Text>
        </View>
        <View
          style={{
            width: 100,
            height: 100,
            backgroundColor: 'tan',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 50,
          }}>
          <Text>Punch In</Text>
        </View>
      </View>
    );
  }
}
