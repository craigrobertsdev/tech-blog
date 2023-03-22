module.exports = {
  format_date: (input) => {
    const date = new Date(input);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  },
};
