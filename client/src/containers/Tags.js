const useTags = (initialTags = []) => {
  const [tags, setTags] = useState(initialTags);

  const addTag = (tagToAdd) => {
    if (tagToAdd !== "" && tags.indexOf(tagToAdd) === -1) {
      setTags([...tags, tagToAdd]);
    }
  };

  const removeTag = (tagToRemove) => {
    const updatedTags = tags.filter((tag) => tag !== tagToRemove);
    setTags(updatedTags);
  };

  return { tags, addTag, removeTag };
};

export { useTags }