import React from 'react';

const PostContent = ({ userContent }) => {
  // You can directly render the user's content as HTML
  return <div className="post-content" dangerouslySetInnerHTML={{ __html: userContent }} />;
};

export default PostContent;
