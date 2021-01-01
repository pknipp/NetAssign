import React, { useContext } from 'react';
import PostContext from '../../PostContext';

function Header() {
    const data = useContext(PostContext)
    const userName = data.postData.post.user
    return (
        <div style={{ display: "flex", padding: `16px` }}>
            <img style={{ width: "32px", height: `32px`, verticaAlign: `middle`, borderRadius: `50%`, marginRight: `10px` }} src='https://images.unsplash.com/photo-1526660690293-bcd32dc3b123?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80' />
            <div style={{ alignSelf: `center`, fontWeight: `600` }}>
                <a href={`/${userName}`}>{userName}</a></div>
        </div>
    )
}

export default Header
