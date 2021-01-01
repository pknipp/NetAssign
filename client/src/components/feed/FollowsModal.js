import React from "react";
import Modal from 'react-modal';
import Header from "./Header";

const FollowsModal = ({ show, handleClose, customStyles, handleClick, suggestions, follows }) => {
    return (
        <Modal
            isOpen={show}
            onRequestClose={handleClose}
            style={customStyles}
            contentLabel='Modal'
            handleClose={handleClose}
            suggestions={suggestions}
            ariaHideApp={false}
        >
            <>
                {(!follows.length) ? null :
                    <>
                        <div className="message">
                            <div className="message-header">
                                <p>Hello World</p>
                                <button onClick={handleClose} className="delete" aria-label="delete"></button>
                            </div>
                            <div className="message-body">
                                <h2>People that you are following</h2>
                                {follows.map((person, i) => {
                                    return (
                                        <div key={i}>
                                            {person.user_name}
                                            <button onClick={handleClick} id={person.id}>Follow</button>
                                        </div>)
                                })}
                            </div>
                        </div>
                    </>
                }
                {(!suggestions.length) ? null :
                    <>
                        <div className="message"
                            style={{
                                fontSize: `14px`
                            }}>
                            <div className="message-header"
                                style={{
                                    color: `#3273dd`,
                                    borderBottom: `solid 1px`,
                                    backgroundColor: `white`
                                }}>
                                <p style={{
                                    margin: `0 auto`, fontWeight: `700`,
                                    fontSize: `15px`
                                }}>Welcome To Petstagram!</p>
                                <button onClick={handleClose} className="delete" aria-label="delete" style={{
                                    position: `absolute`,
                                    right: `12px`
                                }}></button>
                            </div>
                            <div className="message-body"
                                style={{
                                    backgroundColor: `white`
                                }}>
                                <p style={{
                                    marginBottom: `20px`,
                                    fontWeight: `700`,
                                    fontSize: `15px`
                                }}
                                >Suggestions to Follow</p>
                                <div>
                                    {suggestions.map((person, i) => {
                                        // console.log(person);
                                        return (
                                            <div key={person.id + i}
                                                style={{
                                                    display: `flex`,
                                                    justifyContent: `space-between`,
                                                    alignItems: `center`,
                                                    margin: `-26px 0 0 -16px`
                                                }}
                                            >
                                                <Header username={person.user_name} />
                                                <button className="button is-info" onClick={handleClick} id={person.id}
                                                    style={{
                                                        // marginLeft: `20px`,
                                                        fontWeight: `600`,
                                                        padding: `12px`,
                                                        fontSize: `14px`,
                                                        height: `1.5em`
                                                    }}
                                                >Follow</button>
                                            </div>)
                                    })}
                                </div>
                                <button onClick={handleClose} className="button"
                                    style={{
                                        borderRadius: `.5em`,
                                        background: `none`,
                                        padding: `.5em`,
                                        display: `flex`,
                                        margin: `0px auto`,
                                    }}>
                                    <span style={{ fontWeight: `700` }}>
                                        Show Me The Pets!
                                        </span>
                                </button>
                            </div>
                        </div>
                    </>
                }
            </>
        </Modal>
    )
}

export default FollowsModal
