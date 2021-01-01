import React, { useState, useContext } from 'react';
import PostContext from "../PostContext";
import Modal from "react-modal"
import SinglePost from "./posts/SinglePost"


const customStyles = {

    content: {
        border: '0',
        borderRadius: "15px",
        bottom: 'auto',
        minHeight: '10rem',
        left: '50%',
        position: 'fixed',
        right: 'auto',
        transform: 'translate(-50%,-50%)',
        minWidth: '20rem',
        width: '60%',
        padding: `0`,
        top: `55%`,
        background: `rgb(255, 255, 255)`,
        width: `90%`,
        height: `85%`,
        display: `flex`
    },
    overlay: {
        backgroundColor: `rgb(46 42 42 / 0.66)`
    }
};

const GridFeed = ({ currentProfile }) => {
    const { setUpdatedPosts } = useContext(PostContext);
    const [show, setShow] = useState(false)
    const [postDataId, setPostDataId] = useState("")
    setUpdatedPosts(false);

    const handleClose = () => {
        setShow(false)
    }

    const handleClick = (e) => {
        e.preventDefault();
        // console.log(e.target.id)
        setPostDataId(e.target.id)
        setShow(true)
    }

    return (
        <div className="container" >
            <div className="row">
                {currentProfile.posts.map((post, i) =>
                    <div className='col' key={i}>
                        <div className="ratio-square">
                            <button id={post.id} onClick={handleClick}
                                style={{
                                    border: "none",
                                    height: `fit-content`,
                                    padding: `0`,
                                    lineHeight: `0`,
                                    cursor: `pointer`
                                }}>
                                <img src={post.photo_url} id={post.id} key={post.id} />
                            </button>
                        </div>
                    </div>)}
            </div>
            <Modal
                isOpen={show}
                onRequestClose={handleClose}
                style={customStyles}
                contentLabel='Modal'
            >
                <SinglePost handleClose={handleClose} postDataId={postDataId} />
            </Modal>
        </div>
    );
}
export default GridFeed;
