import React from 'react'

function Photo({ pic, id }) {
    return (
        <div>

            <img alt='NOT FOUND' src={pic} id={id} style={{
                // width: "600px",
                maxWidth: "600px",
            }} />
        </div>
    )
}

export default Photo
