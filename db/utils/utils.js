exports.formatDates = list => {
  if (list.length === 0) return [];

  const copy = list.map(function(listItem) {
    const newItem = { ...listItem };
    const newDate = new Date(listItem.created_at);
    newItem.created_at = newDate;

    return newItem;
  });

  return copy;
};

exports.makeRefObj = list => {
  const refObj = {};
  if (list.length !== 0) {
    list.forEach(item => {
      refObj[item.title] = item.article_id;
    });
  }
  return refObj;
};

exports.formatComments = (comments, articleRef) => {
  if (comments.length === 0) return [];

  const copy = comments.map(function(comment) {
    const newComment = { ...comment };
    const newDate = new Date(comment.created_at);

    newComment.created_at = newDate;
    newComment.author = comment.created_by;
    newComment.article_id = articleRef[comment.belongs_to];

    delete newComment.belongs_to;
    delete newComment.created_by;

    return newComment;
  });

  return copy;
};
