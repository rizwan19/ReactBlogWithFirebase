import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TextInput,
} from "react-native";
import {
  Card,
  Button,
  Text,
  Avatar,
  Input,
  Header,
} from "react-native-elements";
import PostCard from "./../components/PostCard";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { AuthContext } from "../providers/AuthProvider";
import { getPosts } from "./../requests/Posts";
import {getUsers} from "./../requests/Users";  

import {storeDataJSON} from "../functions/AsyncStorageFunctions";
import {getDataJSON} from "../functions/AsyncStorageFunctions";
import { apps } from "firebase";

import * as firebase from "firebase";
import "firebase/firestore";



const HomeScreen = (props) => {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [abc, setabc] = useState(0);

  const [data, setData] = useState("");
  const [input, setInput] = useState("");

  const loadPosts = async () => {
    setLoading(true);
    firebase.firestore().collection("posts").orderBy("created_at","desc").onSnapshot((querySnapshot)=>{
      let temp_posts=[];
      querySnapshot.forEach((doc)=>{
        temp_posts.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setPosts(temp_posts);
      setLoading(false);
    }).catch((error)=>{
      setLoading(false);
      alert(error);
    });
  };

  const loadUsers = async () => {
    const response = await getUsers();
    if (response.ok) {
      setUsers(response.data);
    }
    setLoading(false);
  };
  const getName = (id) => {
    let Name = "";
    users.forEach((element) => {
      if (element.id == id) Name = element.name;
    });
    return Name;
  };

  useEffect(() => {
    loadPosts();
    loadUsers();
  }, []);

  if (!loading) {
    return (
      <AuthContext.Consumer>
        {(auth) => (
          <View style={styles.viewStyle}>
            <Header
              leftComponent={{
                icon: "menu",
                color: "#fff",
                onPress: function () {
                  props.navigation.toggleDrawer();
                },
              }}
              centerComponent={{ text: "The Office", style: { color: "#fff" } }}
              rightComponent={{
                icon: "lock-outline",
                color: "#fff",
                onPress: function () {
                  firebase.auth().signOut()
                  .then(()=>{
                    auth.setIsLoggedIn(false);
                    auth.setCurrentUser({});
                  })
                  .catch((error)=>{
                    alert(error);
                  });
                },
              }}
            />
            <Card>
            
              <Input
                multiline
                placeholder="What's On Your Mind?"
                onChangeText={
                  function(currentInput){
                      setInput(currentInput);
  
                  }
              }
                leftIcon={<Entypo name="pencil" size={24} color="black" />}
              />
              <Button title="Post" type="outline" onPress={function () {
                    setLoading(true);
                    
                    
                    firebase.firestore().collection("posts").add({
                      userId: auth.CurrentUser.uid,
                      body: input,
                      author: auth.CurrentUser.displayName,
                      created_at: firebase.firestore.Timestamp.now(),
                      likes: [],
                      comments: [],
                    }).then(()=>{
                      setLoading(false);
                      
                      alert("Post created successfully!");
                    }).catch((error)=>{
                      setLoading(false);
                      alert(error);
                    });
                    alert(firebase.firestore().collection("posts").doc().id);
                    /*setData({posts});
                    //auth.CurrentUser.post=posts;
                    auth.CurrentUser.post=posts;
                    storeDataJSON(auth.CurrentUser.Email, auth.CurrentUser);
                    console.log(auth.CurrentUser);
                    setabc(1);
                    const showPost = ()=>{
                      console.log("Inside showPost");
                      return( 
                       
                        <Card>
                          <PostCard
                          author={auth.CurrentUser.name}
                          //title={item.title} 
                          shouldpost={abc}
                          body={auth.CurrentUser.post}
                          
                          />
                        </Card>
                        
                      );
                    }
                    //console.log(showPost());
                    showPost();*/
                    
              }} />
            </Card>
            
            <FlatList
              data = {posts}
              renderItem={function({ item }){
                return(
                  <PostCard
                    author={item.data.author}
                    title={item.id}
                    body={item.data.body}
                  />
                );
              }}
            />
            
            
            

            
          </View>
        )}
      </AuthContext.Consumer>
    );
  } else {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#338AFF" animating={true} />
      </View>
    );
  }
};

const styles = StyleSheet.create({
  textStyle: {
    fontSize: 30,
    color: "blue",
  },
  viewStyle: {
    flex: 1,
  },
});

export default HomeScreen;