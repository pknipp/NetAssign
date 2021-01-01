import React, { useState } from 'react'

function Header({ username, userId }) {
    // const [postInfo, setPostInfo] = useState('')
    //refers to post owner
    //    const {user} = props
    //    setPostInfo(post.user)

    return (
        <div style={{ display: "flex", padding: `16px` }}>
            <img style={{ width: "32px", height: `32px`, verticaAlign: `middle`, borderRadius: `50%`, marginRight: `10px` }} src='https://images.unsplash.com/photo-1526660690293-bcd32dc3b123?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80' />
            <div style={{ alignSelf: `center`, fontWeight: `600` }}>
                <a href={`/${username}`}>{username}</a></div>
        </div>
    )
}


export default Header
