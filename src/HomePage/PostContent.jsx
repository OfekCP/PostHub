import React from 'react';

const PostContent = ({ userContent }) => {
  return <div className="post-content" dangerouslySetInnerHTML={{ __html: userContent }} />;
};

export default PostContent;
