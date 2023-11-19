import React, { useState, useEffect } from 'react';
import { WithContext as ReactTags } from 'react-tag-input';

const KeyCodes = {
  comma: 188,
  enter: 13,
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];

const classNames = {
    "tagInputField": "form-control"
};

export function Tagging(props) {

    var newPlaceHolder = 'Press enter to add new ' + props.name;

    var inputs = props.tags.map((val, index) => {
        return {
            "id": index.toString(),
            "text": val
        }
    });
    const [tags, setTags] = React.useState(inputs);

    const handleDelete = (i) => {
        setTags(tags.filter((tag, index) => index !== i));
    };

    const handleAddition = (tag) => {
        setTags([...tags, tag]);
    };

    const handleDrag = (tag, currPos, newPos) => {
        const newTags = tags.slice();
    
        newTags.splice(currPos, 1);
        newTags.splice(newPos, 0, tag);
    
        // re-render
        setTags(newTags);
    };

    const handleTagClick = index => {
        return false;
    };

    useEffect(() => {
        props.setTags(tags.map(val => val.text));
    }, [tags]);

    return (
        <ReactTags
            name={props.name}
            id={props.name}
            placeholder={newPlaceHolder}
            classNames={classNames}
            tags={tags}
            delimiters={delimiters}
            inputFieldPosition="top"
            handleDelete={handleDelete}
            handleAddition={handleAddition}
            handleDrag={handleDrag}
            handleTagClick={handleTagClick}
        />
    );
}
