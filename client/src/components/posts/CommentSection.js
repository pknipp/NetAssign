import React, { useState, useContext, useEffect } from 'react';
import PostContext from '../../PostContext';


const CommentSection = ({ caption, likes, like_count, lat_like }) => {
    const post = useContext(PostContext)
    const comments = post.postData.post.comments
    const names = post.postData.post.names
    const { updatedComments, setUpdatedComments } = useContext(PostContext);

    // useEffect(() => {}, [updatedComments]);
    // setUpdatedComments(false);

    return (
        <>
            {like_count === 0 ? <div>
                <button style={{
                    backgroundColor: `#fff`,
                    border: `none`,
                    fontWeight: `800`,
                    fontSize: `1em`,
                    padding: `16px 0`
                }}>
                    Be the first to like this!
                </button>
            </div> :
                <div style={{
                    textAlign: "left",
                    marginLeft: "20px",
                    width: 'auto'
                    // width: '100%'
                }}>
                    <div style={{
                        backgroundColor: `#fff`,
                        border: `none`,
                        fontWeight: `800`,
                        fontSize: `1em`,
                        padding: `8px 0`,
                        // width: '342px'
                        maxWidth: '342px'
                    
                    }}>{caption}</div>
                    <button style={{
                        backgroundColor: `#fff`,
                        border: `none`,
                        fontWeight: `800`,
                        fontSize: `1em`,
                        padding: `8px 0`,
                        color: "#489dcf",
                        maxWidth: "342px",
                        textAlign: "left"
                    
                    }}>
                        {/* replace with likes from post  and latest like*/}
                
                        {lat_like} and {like_count} others liked this
                    </button>
                </div>
            }
            <div style={{
                // width: "400px",
                maxWidth: "400px",
                height: "240px",
                padding: `0 16px`
            }}>
                {comments.map((comment, idx) =>
                    <div style={{
                        marginBottom: "5px",
                    }} key={idx}>
                        {/* <strong style={{
                        color: "#489dcf"
                    }}>{names[idx]}</strong>  */}
                        <a href={`/${names[idx]}`}>
                            <strong style={{
                                color: "#489dcf"
                            }}>{names[idx]}</strong> </a>
                        {comment.content}</div>
                )}
            </div>
    </>);
}

export default CommentSection
