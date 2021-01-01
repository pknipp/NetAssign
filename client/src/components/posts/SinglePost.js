import React, { useEffect, useContext, useState } from 'react';
import PostContext from '../../PostContext'
import Photo from './Photo';
import RightSide from './RightSide';


function SinglePost(props) {
    const { postData, setPostData, updatedComments, setUpdatedComments } = useContext(PostContext)
    const [reRender, setRerender] = useState(false)
    // console.log(props)
    const showRerender = e => {
        setRerender(!reRender)
    }


    useEffect(() => {
        (async () => {
            try {
                const response = await fetch(`/api/posts/${props.postDataId}`)

                if (response.ok) {
                    const data = await response.json()
                    setPostData(data)
                }
            } catch (err) {
                console.error(err)
            }
        })()
    }, [props.postDataId, setPostData, updatedComments, reRender])
    setUpdatedComments(false);
    if (!postData) return null
    return (
        <div style={{
            // width: "500px",
            // margin: "0 auto",
            left: "20%",
            top: "15%",
            // position: "absolute",
            // display: "grid",
            gridTemplateColumns: "500px 100px",
            backgroundColor: "white",
            display: `flex`

        }} className='post-wrapper'>
            <button
                // className="toggle-button"
                onClick={props.handleClose}
                className="delete" aria-label="delete"
                style={{
                    position: `absolute`,
                    top: `15px`,
                    right: `15px`
                }}
            ></button>
            <Photo pic={postData.post.photo_url} />
            <RightSide postData={postData} showRerender={showRerender} />
        </div>
    )
}

export default SinglePost
