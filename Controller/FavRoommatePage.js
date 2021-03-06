
import React, { Component } from 'react';
import { StyleSheet, View, Image, Text, StatusBar, Button, Alert, FlatList, TouchableHighlight, TouchableOpacity } from 'react-native';
import { Icon, Card, Badge, SearchBar } from 'react-native-elements';
import { SafeAreaView } from 'react-navigation';
import firebase from 'firebase';
import User from '../Model/User';
import RF from "react-native-responsive-fontsize";
import RoommateFavButton from '../View/RoommateFavButton';

export default class FavRoommatePage extends React.Component{
	state = {
		roommateItems: [],
		isFetchingRoommateData: true
	}

	constructor() {
		super();
	}

	// Get roommate data and set state with the new data. 
	// Can be used on first launch and on refresh request. 
	getRoommateData = async () => {

		this.setState({
            isFetchingRoommateData: true
        })


		this.unsubscribe = firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).onSnapshot(snapshot => {
			user = new User(snapshot.data(), snapshot.id);
			this.setState({
				curUser: user
			})
			if (user.roommate_favorite.length == 0) {
                this.setState({isFetchingRoommateData: false, roommateItems: []});
            } else {
                this.state.roommateItems = []
                var loadedCount = 0;
			    user.roommate_favorite.forEach((roommate) => {
                    roommate.get().then((snapshot) => {
                        this.state.roommateItems.push(new User(snapshot.data(), snapshot.id));
                        this.state.isFetchingRoommateData = false;
                        loadedCount++;
                        if (loadedCount == user.roommate_favorite.length) {
                            this.forceUpdate();
                        }
                    })
                })
            }
		});
	}

	openRoommate = async (roommate) => {
		this.props.navigation.push("ProfilePage", {
			userId: roommate.id,
		});
	}

	componentWillMount = async () => {
		this.getRoommateData();
	}

	componentWillUnmount = async () => {
		this.unsubscribe();
	}

	render = () => {
		var noFavView;
		if (!this.state.roommateItems || this.state.roommateItems.length == 0) {
			noFavView = (
				<Text style={{
					color: '#dddddd',
					fontSize: RF(6)
				}}>You have no favorited roommates. </Text>
			)
		}
        
		return (
			<SafeAreaView style={{flex: 1, backgorundColor: '#2EA9DF'}}>
                {noFavView}
				<FlatList 
					keyExtractor={(item, index) => index.toString()}
                    data={this.state.roommateItems}
                    refreshing={this.state.isFetchingRoommateData}
                    renderItem={({item}) => (
                        <View style={styles.container}>
                            <TouchableOpacity style={styles.roommateContainer} onPress={() => this.openRoommate(item)}>
                                
                                <View style={styles.roommateIcon}>

                                    <TouchableOpacity>
                                    <View style={{ flexDirection:"row", justifyContent:"flex-end", }}>
                                        <RoommateFavButton roommate={item}/>
                                    </View>
                                    </TouchableOpacity>

                                    <View style = {{flexDirection: 'row' , justifyContent: "center"}}> 
                                        <Image style={styles.profilePic}
                                            source={{uri: item.profileimage, cache: 'force-cache'}} />
                                    </View>
                                    
                                </View>

                                <View style={{flex:.4 ,alignItems: "center"}}>
                                    <Text>{item.first_name} {item.last_name}</Text>
                                    <Text>{item.graduation} | {item.major}</Text>
                                </View>

                            </TouchableOpacity>
                        </View>
                    )}
                    numColumns={2}
                    style={{// The flex is needed to actually display the FlatList. Otherwise, things won't work. 
                        flex: 1
                    }}
                />
            </SafeAreaView>
		);
	}

}


const styles = StyleSheet.create({
    container:{
        flex: 1,
        flexDirection: 'column',
        padding: 10,
        marginLeft: 16,
        marginRight:16,
        justifyContent: 'space-between',
        marginTop:8,
        marginBottom:8,
        borderRadius:5,
        backgroundColor: '#FFF',
        elevation:2,
        alignItems: "center",
    },
	
    header:{
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#2ea9df',
		paddingTop: RF(2),
		paddingBottom: RF(1),
	},

	titleContainer:{
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		paddingTop: RF(4),
	},

	title:{
		color: "white",
		fontSize: RF(4),
	},

    profilePic:{
        width: 120,
        height: 120,
        alignItems: "center",
        borderRadius:120/2,
        margin:5,

    },
    roommateIcon:{
        flex:.6,
        flexDirection:'column',
    },
    roommateText:{
        flexDirection: 'column',
    },
    roommateContainer:{
        flex:.45,
        flexDirection:'column', 
        justifyContent: "center"
    },
})