import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../../auth';

function AddComment({ commentRerender: rerender, post_id }) {
    const [content, setContent] = useState('')
    const { currentUserId } = useContext(AuthContext)

    const commentRerender = e => {
        rerender && rerender(e);

    };

    const sayHello = e => {
        setContent(e.target.value)
    }

    const onSubmit = async (e) => {
        e.preventDefault()
        if (content === '') return
        const data = {
            user_id: currentUserId,
            post_id,
            content,
        }

        try {
            const res = await fetch(`api/comments/${post_id}`, {
                method: "POST",
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            if (!res.ok) {
                // console.log(error)
            }
        } catch (e) {
            console.error(e)
        }
        setContent('')
        commentRerender();
    }
    return (
        <div className="add-comment-wrapper">
            <form style={{
                display: "grid",
                gridTemplateColumns: "500px 10px",
                justifyItems: "start"
            }} onSubmit={onSubmit}>
                <input style={{
                    border: "0px",
                    height: "45px",
                    right: "100px",
                    backgroundColor: "#ffff"


                }} className="add-name_input" type="text" placeholder="Add comment..." value={content} onChange={sayHello} />
                <button style={{
                    border: "0px",
                    color: "#489dcf",
                    backgroundColor: "#ffff",
                    fontSize: "15px",
                    fontWeight: "bold",
                    cursor: "pointer"
                }} className="add-comment_button" type="submit">Post</button>
            </form>
        </div>
    )
}

export default AddComment
