import React, { useState } from "react";

const RichTextPostCreator = ({
  value,
  onChange,
  handleSubmit,
}) => {
  const handleStyleInsert = (tag) => {
    const selectedText = window.getSelection().toString();
    if (!selectedText) return;

    const styledText = `<${tag}>${selectedText}</${tag}>`;
    setContent(content.replace(selectedText, styledText));
    addPost()
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="create-post">
        <div className="text-editor">
          <button onClick={() => handleStyleInsert("b")}>Bold</button>
          <button onClick={() => handleStyleInsert("i")}>Italic</button>
          <button onClick={() => handleStyleInsert("u")}>Underline</button>
          <button onClick={() => handleStyleInsert("s")}>Strikethrough</button>
        </div>
        <textarea
          value={value}
          onChange={onChange}
          placeholder="What's happening?"
        ></textarea>
        <button type="submit">Post</button>
      </div>
    </form>
  );
};

export default RichTextPostCreator;
