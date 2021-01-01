import React from 'react'
import AddComment from './AddComment'
import CommentSection from './CommentSection'
import Header from './Header'
// import Icons from './Icons'
import Icons from '../feed/Icons'

function rightSide({ postData, showRerender }) {
    // console.log(postData);
    return (
        <div>
            <Header />
            {/* caption={postData.post.caption} vvvvv */}
            <CommentSection
                caption={postData.post.caption}
                likes={postData.post.likes}
                like_count={postData.post.like_count}
                lat_like={postData.post.latest_like}
            />
            <AddComment />
            <Icons postId={postData.post.id} willRerender={showRerender} caption={postData.post.caption} likes={postData.post.likes} like_count={postData.post.like_count} lat_like={postData.post.latest_like} />
        </div>
    )
}

export default rightSide
