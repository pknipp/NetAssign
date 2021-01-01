
import React, { useState, useContext } from 'react';
import { Link, Redirect, Route } from 'react-router-dom';
import AuthContext from "../auth"
import PostContext from "../PostContext";




const ModalWindow = props => {

    const [preview, setPreview] = useState('')
    const { currentUserId } = useContext(AuthContext)
    const [file, setFileName] = useState("");
    const [caption, setCaption] = useState("");
    const [errors, setErrors] = useState([]);
    const { setUpdatedPosts } = useContext(PostContext);

    // const onClose = e => {
    //     props.onClose && props.onClose(e);
    //     setFileName('')
    // };

    const handleSubmit = (e) => {
        e.preventDefault();

        async function submitForm() {
            let formData = new FormData();
            formData.append('file', file);
            let captionURI = encodeURIComponent(caption)
            //console.log(captionURI)
            const response = await fetch(`/api/posts/${currentUserId}/${captionURI}`, {
                method: 'POST',


                body: formData
            });
            const responseData = await response.json();
            if (!response.ok) {
                setErrors(responseData.errors);
            } else {
                // console.log(responseData)

                // onClose()
                setFileName('')
                setCaption('')
                setUpdatedPosts(true);
                props.handleClose()
            }
        }
        submitForm();
    }

    const handleImage = e => {
        setFileName(e.target.files[0])
        setPreview(URL.createObjectURL(e.target.files[0]))

    }

    // if (props.show === false) {
    //     return null;
    // }
    return (
        <div  >
            <div className="button-container">
                <button className="toggle-button" onClick={props.handleClose}
                    className="delete" aria-label="delete"
                    style={{
                        top: `12px`,
                        right: `12px`
                    }}
                ></button>
            </div>
            <div className="post-form-container">
                {errors.length ? errors.map((err) => <li key={err} >{err}</li>) : ''}
                <h2 className="create-post-headline">Create Post</h2>

                <form id="post-create-form" onSubmit={handleSubmit} encType="multipart/form-data">

                    {file ? <img src={preview} id="img-post" /> : <input type="file" name="file" onChange={handleImage} className="input" />}

                    {file ? <textarea id="caption-field" onChange={(e) => setCaption(e.target.value)}
                        className="input"
                        name="caption" wrap="hard" rows="5" cols="33" placeholder="Write a Caption..." /> : ''}

                    {caption ? <button id="create-post-button" type='submit'
                        className="button has-background-link has-text-white"
                        style={{
                            height: `2rem`,
                            paddingLeft: `.5em`,
                            paddingRight: `.5em`,
                            margin: `8px 40px`,
                            fontWeight: `600`
                        }}
                    >Share</button> : ''}

                </form>
            </div>
        </div >
    );
}
export default ModalWindow
