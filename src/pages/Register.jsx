import React, { useEffect, useState } from 'react';
import addAvatar from "../img/addAvatar.png"
import Login from './Login';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db, storage } from '../firebase';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { Link, useNavigate } from 'react-router-dom';


const Register = () => {
    // const [countryData, setCountryData] = useState([])
    // fetch(`https://restcountries.com/v3.1/all`)
    //     .then(res => res.json())
    //     .then(data => setCountryData(data))
    //     .catch(err => console.log(`We faces an error: ${err}`))
    // console.log(countryData)
    // console.log("Hello")
    const [err, setErr] = useState(false)
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault()
        const displayName = e.target[0].value;
        const userEmail = e.target[1].value;
        const userPassword = e.target[2].value;
        const userFile = e.target[3].files[0];
        console.log(displayName);

        // Creating user 
        try {
            const res = await createUserWithEmailAndPassword(auth, userEmail, userPassword)

            // Uploading files
            const storageRef = ref(storage, displayName);
            const uploadTask = uploadBytesResumable(storageRef, userFile)
                .then(async () => {
                    getDownloadURL(storageRef).then(async (downloadURL) => {
                        try {
                            // Update profile by adding name and photoURL
                            await updateProfile(res.user, {
                                displayName,
                                photoURL: downloadURL
                            });
                            // create user on firestore
                            await setDoc(doc(db, "users", res.user.uid), {
                                uid: res.user.uid,
                                displayName,
                                userEmail,
                                photoURL: downloadURL
                            });
                            // Create empty user chats on firestore
                            await setDoc(doc(db, "userChats", res.user.uid), {})
                        } catch (error) {
                            console.log(error)
                            setErr(true);
                        }

                    });
                })
        } catch (error) {
            setErr(true);
        }
    }

    if (err) {
        console.log("this is the error", err)
        let submitMsg = document.getElementById('submitMsg')
        submitMsg.innerHTML = "Something went wrong! Please try again";
        submitMsg.style.color = "red"
        submitMsg.style.display = "unset";
        submitMsg.style.transition = "0.3s"
        setTimeout(() => {
            submitMsg.innerHTML = "";
            submitMsg.style.display = "none";
        }, 5000);
    }
    // if (!err) {
    //     let submitMsg = document.getElementById('submitMsg');
    //     submitMsg.innerHTML = "Successfully registered, please login to continue";
    //     submitMsg.style.color = "green";
    //     submitMsg.style.display = "unset";
    //     submitMsg.style.transition = "0.3s"
    //     setTimeout(() => {
    //         submitMsg.innerHTML = "";
    //         submitMsg.style.display = "none";
    //     }, 10000);
    // }

    // After successfully registering automatically navigating the user to the home page
    navigate("/");


    return (
        <div className='formContainer'>
            <div className="formWrapper">
                <span className="logo">Stay Close</span>
                <span className="title">Register</span>
                <form onSubmit={handleSubmit}>
                    <input required type="text" placeholder='Name' />
                    <input required type="email" placeholder='Email' />
                    <input required type="password" placeholder='Password' minLength="6" />
                    <input required type="file" id="file" name='file-input' accept='.png, .jpeg, .webp, .jpg' />
                    <label htmlFor="file">
                        <img src={addAvatar} alt="" />
                        <span>Choose your avatar</span>
                    </label>
                    <button >Sign up</button>
                </form>
                <p>You do have an account?
                    <Link to="/login"> Login</Link>
                </p>
                <span id='submitMsg' style={{ fontSize: "12px", display: "none", transition: "0.3s" }} ></span>
            </div>
        </div>
    )
}

export default Register