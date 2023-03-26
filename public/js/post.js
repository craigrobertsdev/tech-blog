// called when form submit is clicked on create post page
const createPost = async (event) => {
  event.preventDefault();

  const title = document.getElementById("post-title").value;
  const content = document.getElementById("post-content").value;

  const response = await fetch("/api/dashboard/post", {
    method: "POST",
    body: JSON.stringify({ title, content }),

    headers: { "Content-Type": "application/json" },
  });

  // go back to dashboard when post is created
  if (response.ok) {
    document.location.replace("/dashboard");
  }
};

const deletePost = async () => {
  // get post id from the URL
  const postId = location.href.split("/").reverse()[0];
  const response = await fetch(`/api/dashboard/post/${postId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

  if (response.ok) {
    document.location.replace("/dashboard");
  }
};

const updatePost = async (event) => {
  event.preventDefault();
  const postId = location.href.split("/").reverse()[0];

  // get current values of the update post form
  const title = document.querySelector(".post-title").value;
  const content = document.querySelector(".post-content").value;

  const response = await fetch(`/api/dashboard/post/${postId}`, {
    method: "PUT",
    body: JSON.stringify({ title, content }),

    headers: { "Content-Type": "application/json" },
  });

  if (response.ok) {
    document.location.replace("/dashboard");
  }
};

const addComment = async (event) => {
  // get the text from the comment input
  const content = document.getElementById("comment-content").value;
  const postId = location.href.split("/").reverse()[0];

  const response = await fetch("/api/dashboard/comment", {
    method: "POST",
    body: JSON.stringify({ content, postId }),
    headers: { "Content-Type": "application/json" },
  });

  // refresh page after comment submitted to display all comments on the post
  if (response.ok) {
    document.location.reload();
  }
};

// as this js file is used in a number of views, each event listener is guarded by an if statement to prevent error if the element doesn't exist in that page
if (document.querySelector("#create-post")) {
  document.querySelector("#create-post").addEventListener("submit", createPost);
}

if (document.querySelector("#create-comment")) {
  document
    .querySelector("#create-comment")
    .addEventListener("submit", addComment);
}

if (document.querySelector(".toggle-comment")) {
  document
    .querySelector(".toggle-comment")
    .addEventListener("click", toggleAddComment);
}

if (document.querySelector(".update-button")) {
  document
    .querySelector(".update-button")
    .addEventListener("click", updatePost);
}

if (document.querySelector(".delete-button")) {
  document
    .querySelector(".delete-button")
    .addEventListener("click", deletePost);
}
