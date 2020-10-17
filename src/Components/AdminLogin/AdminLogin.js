import React, { useContext } from 'react';
import { Button, Container } from 'react-bootstrap';
import mainLogo from '../../images/logos/logo.png';
import Google from '../../images/G.png';
import '../Style/Style.css';
import { UserContext } from '../../App';
import { useState } from 'react';
import * as firebase from "firebase/app";
import "firebase/auth";
import { useHistory, useParams } from 'react-router';
import firebaseConfig from '../Login/firebase.config';



const AdminLogin = () => {
    const [loggedInUser, setLoggedInUser] = useContext(UserContext);
    const [user, setUser] = useState({
        isSignedIn: false,
        name: '',
        email: '',
        photo: ''
    })
    const {id} = useParams();
    const history = useHistory(); 



    if (firebase.apps.length === 0) {
        firebase.initializeApp(firebaseConfig);
    }



    const handleSignIn = (e) => {
        const googleProvider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(googleProvider)
            .then(res => {
                console.log(res.user);
                const { displayName, email, photoURL } = res.user;
                const newUser = {
                    isSignedIn: true,
                    name: displayName,
                    email: email,
                    photo: photoURL
                }
                setUser(newUser);
                setLoggedInUser(newUser);
                storeAuthToken()
                pageRedirect(id)
            })
            .catch(err => {
                console.log(err);
                console.log(err.message);
            });
        e.preventDefault();
    }

    const storeAuthToken = () => {
        firebase.auth().currentUser.getIdToken(/* forceRefresh */ true)
        .then(idToken => {
            sessionStorage.setItem('token', idToken);
        })
        .catch(err => {
            console.log(err);
        })
    }

    const pageRedirect = (id) => {
        history.push(`/admin`);
    }




    return (
        <Container className="login-container text-center">
            <img className="logo" src={mainLogo} alt="" />
            <div className="login-box">
                <h3 style={{color: 'red'}}>Login with admin credentials</h3>
                <br />
                <Button onClick={(e) => handleSignIn(e)} className="loginBtn mb-1" variant="light"><span><img className="gIcon" src={Google} alt="" /></span> Continue with Google</Button>
            </div>
        </Container>
    );
};

export default AdminLogin;