import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Modal from 'react-modal';
import ModalWindow from './ModalWindow';


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
        width: `85%`,
        height: `85%`,
        display: `flex`,
        flexDirection: "column",
        maxWidth: `500px`
    },
    overlay: {
        backgroundColor: `rgb(46 42 42 / 0.66)`
    }
};


const Navbar = ({ currentUserId, currentUser }) => {
    const [show, setShow] = useState(false);


    const showModal = e => {
        setShow(true)
    }

    const handleClose = () => {
        setShow(false)
    }

    return (
        <nav className="navbar is-fixed-top" style={{ border: `1px solid #efefef` }}>
            <div className="navbar-brand" style={{ alignItems: `center` }}>
                <NavLink to="/" activeClassName="active"><h1 style={{ alignItems: `center`, fontSize: `24px` }}>Petstagram</h1></NavLink>
            </div>
            <div className="navbar-end" style={{
                display: `flex`,
                alignItems: `center`
            }}>
                <>
                    {currentUserId && currentUser &&
                        <>
                            {/* <ModalWindow onClose={showModal} show={show} /> */}
                            <Modal
                                isOpen={show}
                                onRequestClose={handleClose}
                                style={customStyles}
                                contentLabel='Modal'
                            >
                                <ModalWindow handleClose={handleClose} />
                            </Modal>
                            {show ? "" : <button className="navbar-item" id="upload" onClick={showModal} >
                                <i className="fas fa-cloud-upload-alt"></i>
                                {/* Create Post */}
                            </button>}
                            <div className="navbar-item" >
                                <a href={`/${currentUser.user_name}`}>
                                    {currentUser.user_name}
                                </a>
                            </div>
                            <div className="navbar-item" >
                                <a href="/edituser">
                                    <span >Account Details</span>
                                </a>
                            </div>
                            <div className="navbar-item" >
                                <a href="/logout">
                                    <span >Log Out</span>
                                </a>
                            </div>
                        </>
                    }
                    {!currentUserId &&
                        <>
                            <div className="navbar-item">
                                <a className="button has-background-link has-text-white" href="/login" style={{
                                    height: `2rem`,
                                    paddingLeft: `.5em`,
                                    paddingRight: `.5em`
                                }}>
                                    <span>Log In</span>
                                </a>
                            </div>
                            <div className="navbar-item" >
                                <a href="/signup">
                                    <span >Sign Up</span>
                                </a>
                            </div>
                        </>
                    }
                </>
            </div>
            {/* </div> */}
        </nav>
    )
}
export default Navbar;
