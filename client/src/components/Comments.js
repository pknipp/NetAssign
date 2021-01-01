import React, { useEffect } from 'react';

const Comments = () => {
    const [comments, setComments] = useEffect(null)
    const placeholder_comments = [
        "Omg so cute!",
        "Can't believe you're in town ... let's catch up",
        "Killing it!"
    ]
    return (
        <div className="comments">
            {placeholder_comments.map(comment =>

                <div className="comment" key="" style={{
                    paddingBottom: `16px`,
                    display: `-webkit-box`
                }}>
                    <div>
                        <img style={{
                            width: "32px",
                            height: `32px`,
                            verticaAlign: `middle`,
                            borderRadius: `50%`,
                            margin: `0 18px 0 0`
                        }} src={comment.profilepic} />
                    </div>
                    <div style={{ width: `90%` }}>
                        <strong><a href={comment.user}>{comment.user}</a> </strong>
                        {comment.comment}
                        <div style={{
                            marginTop: `8px`,
                            marginBottom: `4px`,
                            color: `#8e8e8e`,
                            fontSize: `12px`,
                            lineHeight: `14px`
                        }}>{comment.createdAt}</div>
                    </div>
                </div>
            )
            }

        </div >
    );
};

export default Comments;
