import React, { useState } from 'react';
import '../styling/projects.css';
import Modal from 'react-modal';

const customStyles = {
    content : {
      top                   : '50%',
      left                  : '50%',
      right                 : 'auto',
      bottom                : 'auto',
      marginRight           : '-50%',
      transform             : 'translate(-50%, -50%)',
        width: '610px',
        height: '90vh',
        borderRadius: "30px",
        display: "flex",
        justifyContent: "center"
    }
};


function Card({ desc }) {
    const { description, url, id, name, pics, links, tech, details} = desc
    const [isModal, setIsModal] = useState(false)
    const [show, setShow] = useState(false)

    const handleClick = e => {
        e.preventDefault()
        setShow(true)
        // console.log(e.target.id)
    }

    const handleClose = () => {
        setShow(false)
    }
    return (
        <div>
            <h3>{name}</h3>
            <div id={id} onClick={handleClick} className='cards'>
                <img id={id} className='card_img' src={url} />
            </div>
            <div className='desc'>
                {description}
            </div>
            <Modal
                isOpen={show}
                onRequestClose={handleClose}
                style={customStyles}
                contentLabel='Modal'
            >
                <div className='modal'>
                    <h1>
                        {name}
                    </h1>
                    <div id='links'>
                        <a href={links.github}>Github</a>
                        <a href={links.live}>Live</a>
                    </div>
                    <div className='modal_images'>
                        {pics.map((pic, idx) => (
                            <img
                                className='modal_img'
                                alt='Not Found'
                                src={pic}
                                key={idx}
                                />
                        ))}
                    </div>
                    <div id='details'>
                        {details}
                    </div>
                    <div id='tech'>
                        <h4>Tech Used</h4>
                        <div id='tech-items'>
                            {tech.map((i, idx) => (
                                <span className='item' key={idx}>{i}</span>
                            ))}
                        </div>
                    </div>
                </div>

            </Modal>
        </div>
    )
}

export default Card
