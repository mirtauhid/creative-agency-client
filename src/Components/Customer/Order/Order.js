import React, { useContext } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useParams } from 'react-router';
import { UserContext } from '../../../App';
import '../../Style/Style.css';


const Order = () => {
    const [order, setOrder] = useState({});
    const [orderDetail, setOrderDetail] = useState({});
    const [loggedInUser, setLoggedInUser] = useContext(UserContext);
    const [signedInUser, setSignedInUser] = useState({});
    const { id } = useParams();
    const [files, setFiles] = useState(null);


    useEffect(() => {
        fetch(`https://fierce-forest-06981.herokuapp.com/services/${id}`)
            .then(res => res.json())
            .then(data => {
                console.log(data)
                data.map(singleData => {
                    const { title, description, image } = singleData;
                    setOrder({
                        title: title,
                        description: description,
                        image: image
                    })
                })
                setSignedInUser({
                    name: loggedInUser.name,
                    email: loggedInUser.email,
                    photo: loggedInUser.photoURL,
                })
            })
    }, [])




    const serviceTitle = document.getElementById("serviceTitle");
    const orderForm = document.getElementById("orderForm");
    const fullName = document.getElementById("fullName");
    const email = document.getElementById("email");
    if (orderForm && serviceTitle) {
        serviceTitle.value = order.title;
        if (loggedInUser.name && loggedInUser.email) {
            fullName.value = loggedInUser.name;
            email.value = loggedInUser.email;
            serviceTitle.value = order.title;
        }
    }




    const handleChange = (e) => {
        const newDetails = {
            details: e.target.value
        }
        setOrderDetail(newDetails);
    }




    const handleSubmit = (e) => {
        const newOrder = { ...signedInUser, ...order, ...orderDetail };
        const formData = new FormData()
        formData.append('file', files)
        formData.append('newOrder', newOrder)
        fetch('https://fierce-forest-06981.herokuapp.com/users', {
            method: 'POST',
            body: formData
        })
            .then(res => res.json())
            .then(data => {
                alert("Order successfully submitted");
                document.getElementById("fullName").value = "";
                document.getElementById("email").value = "";
                document.getElementById("serviceTitle").value = "";
                document.getElementById("textarea").value = "";

            })
        e.preventDefault();
    }



    return (
        <div>
            <Form id="orderForm"  style={{ width: '50%', border: 'none' }}>
                <Form.Group controlId="exampleForm.ControlInput1">

                    <Form.Control type="text" id="fullName" placeholder="Your name / company’s name" />
                </Form.Group>
                <Form.Group controlId="exampleForm.ControlInput1">

                    <Form.Control type="email" id="email" placeholder="Your email address" />
                </Form.Group>
                <Form.Group controlId="exampleForm.ControlInput1">

                    <Form.Control type="text" id="serviceTitle" placeholder="Service type" />
                </Form.Group>
                <Form.Group controlId="exampleForm.ControlTextarea1">

                    <Form.Control as="textarea" rows={4} onChange={(e) => handleChange(e)} id="textarea" placeholder="Project Details" />
                </Form.Group>
                <Form.Group controlId="exampleForm.ControlInput1" className="d-flex">
                    <Form.Control type="text" placeholder="Price" />
                    <Form.File style={{ color: 'transparent' }} id="exampleFormControlFile1" />
                </Form.Group>
                <Button onClick={(e) => handleSubmit(e)} className="blackButton" type="submit" variant="primary" >Send</Button>
            </Form>
        </div>
    );
};

export default Order;