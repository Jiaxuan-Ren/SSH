// HousePreviewView will display a preview of a house. It is intended to be used with Flatlist. 
// When the preview is touched, it will call the onTouch props. 
// Usage: <HousePreviewView house={ahouse} onTouch={this.onHouseTouch} />
// The HousePreviewView will display the information about ahouse and will call this.onHouseTouch when touched. 

import React, { Component } from 'react';
import { StyleSheet, View, Image, Text, Button, Alert, FlatList, TouchableOpacity } from 'react-native';
import { Icon, Card, Badge, SearchBar } from 'react-native-elements';
import User from '../Model/User';
import firebase from 'firebase';

export default class HouseFavButton extends React.Component {
	state = {
		isHouseFav: false
	}

	componentWillMount() {
		User.getUserWithUID(firebase.auth().currentUser.uid, (user) => {
			this.setState({
				isHouseFav: user.house_favorite.includes(this.props.house.id),
				curUser: user
			})
		})
	}

	favHouse = (house) => {
		let failedFavHouseAlert = () => {
			Alert.alert(
				'Favorite Failed',
				'Please try agian later',
				[{text: 'Okay'}],
				{cancelable: false},
			)
		}
		if (house.id == "" || !this.state.curUser || !this.state.curUser.dbRef) {
			failedFavHouseAlert();
			return;
		}

		this.state.curUser.dbRef.update({
			house_favorite: firebase.firestore.FieldValue.arrayUnion(house.id)
		}).then(() => {
			this.setState({
				isHouseFav: true
			})
		}).catch(() => {
			failedFavHouseAlert();
			return;
		});
	}

	unfavHouse = (house) => {
		let failedFavHouseAlert = () => {
			Alert.alert(
				'Unfavorite Failed',
				'Please try agian later',
				[{text: 'Okay'}],
				{cancelable: false},
			)
		}
		if (house.id == "" || !this.state.curUser || !this.state.curUser.dbRef) {
			failedFavHouseAlert();
			return;
		}

		this.state.curUser.dbRef.update({
			house_favorite: firebase.firestore.FieldValue.arrayRemove(house.id)
		}).then(() => {
			this.setState({
				isHouseFav: false
			})
		}).catch(() => {
			failedFavHouseAlert();
			return;
		});
	}

	render() {
		let item = this.props.house;

		if (!item) {
			return (<View></View>);
		}

		if (this.state.isHouseFav) {
			return (
				<TouchableOpacity onPress={() => this.unfavHouse(item)}>
						<Icon name="star" type="font-awesome" color='orange' />
				</TouchableOpacity>
			);
		} else {
			return (
				<TouchableOpacity onPress={() => this.favHouse(item)}>
						<Icon name="star-o" type="font-awesome" color='orange' />
				</TouchableOpacity>
			)
		}
	}
}